# Script for splitting an image into multiple parts with the same size
# @input numRow, numCol of the grid splitting the image
# @input inputImage path to the image to be splitted


import json
import sys
from os import listdir
from os.path import isfile, join

import cv2
import numpy as np


def splitImage(img, blockHeight, blockWidth):
    imHeight, imWidth, nChannels = img.shape
    blocksArray = []

    for x in range(0, imHeight, blockHeight):
        if imHeight - x < blockHeight:
            break
        for y in range(0, imWidth, blockWidth):
            if imWidth - y < blockWidth:
                break
            block = img[x: x + blockHeight, y: y + blockWidth]
            blocksArray.append(block)

    return blocksArray


def subtractBlocksAndCountZeros(imgArrayA, imgArrayB):
    if len(imgArrayA) != len(imgArrayB):
        print('Impossible to compare image blocks, input images of different sizes...')
        return -1

    perBlockResult = []

    for index, blockFromA in enumerate(imgArrayA):
        straightDiff = cv2.subtract(blockFromA, imgArrayB[index])
        reverseDiff = cv2.subtract(imgArrayB[index], blockFromA)
        bs, gs, rs = cv2.split(straightDiff)
        br, gr, rr = cv2.split(reverseDiff)
        # The total count of zeros is given by the sum of max values over the 3 channels
        # In this way we take into accounto both straight and reverse difference
        zeroCount = max(cv2.countNonZero(bs), cv2.countNonZero(br)) \
                    + max(cv2.countNonZero(gs), cv2.countNonZero(gr)) \
                    + max(cv2.countNonZero(rs), cv2.countNonZero(rr))
        perBlockResult.append(zeroCount)

    return perBlockResult


def computePerBlockResult(perBlockDifference, shape, NN0):
    isBlockStatic = []
    nonZeroPerBlock = []
    blockWidth, blockHeight, nChannels = shape

    # We consider a block static if less than X% (currently 0.5%) of his pixel have not been erased by subtraction
    threshold = (blockWidth * blockHeight) * 3 * NN0

    for nonZeroCount in perBlockDifference:
        if nonZeroCount > threshold:
            isBlockStatic.append(False)
        else:
            isBlockStatic.append(True)
        nonZeroPerBlock.append(nonZeroCount)
    return isBlockStatic, nonZeroPerBlock


# Code for recreating the image for test sake
def restoreImage(blocksArray, numRow, numCol):
    restoredImg = []

    for x in range(numRow):
        rowImage = blocksArray[x * numCol]
        base = x * numCol
        for y in range(1, numCol):
            rowImage = np.concatenate((rowImage, blocksArray[base + y]), 1)
        if x == 0:
            restoredImg = rowImage
        else:
            restoredImg = np.concatenate((restoredImg, rowImage), 0)

    return restoredImg


def computeJsonSerializableResult(isStaticArray, nonZeroCount, previousResult):
    if previousResult['perBlockResult'] is None:
        perBlockResult = []
        for x in range(len(isStaticArray)):
            dynamicRankCount = 0
            if isStaticArray[x] is False:
                dynamicRankCount = 1
            perBlockResult.append({
                "evaluations": 1,
                "timesEvaluatedDynamic": dynamicRankCount,
                "nonZeroCounts": [nonZeroCount[x]]
            })
        previousResult['perBlockResult'] = perBlockResult
    else:
        # Update the previous result
        for index, block in enumerate(previousResult['perBlockResult']):
            block['evaluations'] += 1
            block['nonZeroCounts'].append(nonZeroCount[index])
            if isStaticArray[index] is False:
                block['timesEvaluatedDynamic'] += 1

    return previousResult


def computeRocResult(result, NN0, PDE):
    isDynamicArray = []
    for block in result['perBlockResult']:
        isDynamicConfidence = block['timesEvaluatedDynamic'] / block['evaluations']
        if isDynamicConfidence > PDE:
            isDynamicArray.append(True)
        else:
            isDynamicArray.append(False)

    rocResultObj = {
        "NN0": NN0,
        "PDE": PDE,
        "isDynamicArray": isDynamicArray
    }

    return rocResultObj


def performComparisons(baseImg, tmpResult, fileList, NN0):
    blockHeight, blockWidth = tmpResult['blockDimensions']
    baseImg_splitted = splitImage(baseImg, blockHeight, blockWidth)

    for imgFile in fileList:
        img = cv2.imread(imgFile, cv2.IMREAD_UNCHANGED)

        # Splitting the image in numRow*numCol blocks of the same size
        imgSplitted = splitImage(img, blockHeight, blockWidth)

        # Subtracting each block of the base image from the corresponding one of the current image and vice versa
        perBlockDifference = subtractBlocksAndCountZeros(baseImg_splitted, imgSplitted)

        # Applies simple metrics to determine if a block is static or not
        isStaticArray, nonZeroCount = computePerBlockResult(perBlockDifference, imgSplitted[0].shape, NN0)

        # Computes a json Serializable object containg a matrix mapping static blocks
        # If tmpResult is not None updates the matrix starting from previous infos
        tmpResult = computeJsonSerializableResult(isStaticArray, nonZeroCount, tmpResult)

    return tmpResult


def main():
    workdir = sys.argv[1]
    configuration_index = int(sys.argv[2])

    with open('./runParams.json') as inputFile:
        runParams = json.load(inputFile)

    blockHeightPx = runParams['BLOCK']['BLOCK_HEIGHT']
    blockWidthPx = runParams['BLOCK']['BLOCK_WIDTH']
    config = runParams['THRESHOLDS_ROC_CURVE'][configuration_index]
    nn0Range = config['NN0']['range']
    nn0Step = config['NN0']['step']
    pdeRange = config['PDE']['range']
    pdeStep = config['PDE']['step']

    # Retrieving the list of paths to screenshot files in the input directory
    screenshotInputFolder = workdir + '/input/screenshots/'
    fileList = [join(screenshotInputFolder, f) for f in listdir(screenshotInputFolder) if
                isfile(join(screenshotInputFolder, f))]

    if len(fileList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    rocData = []
    for PDE in np.arange(pdeRange[0], pdeRange[1], pdeStep):
        for NN0 in np.arange(nn0Range[0], nn0Range[1], nn0Step):
            fileList_copy = fileList.copy()
            baseImgTest = cv2.imread(fileList_copy.pop(), cv2.IMREAD_UNCHANGED)

            tmpResult = {
                'blockDimensions': [blockHeightPx, blockWidthPx],
                'perBlockResult': None,
            }

            while len(fileList_copy) >= 1:
                # We will compare every screenshot with the one from the last iteration
                tmpResult = performComparisons(baseImgTest, tmpResult, fileList_copy, NN0)
                # Update the base image for a new round of comparisons
                baseImgTest = cv2.imread(fileList_copy.pop(), cv2.IMREAD_UNCHANGED)

            print('Computing data for : NN0 - ' + str(NN0) + '  PDE - ' + str(PDE))
            rocData.append(computeRocResult(tmpResult, NN0, PDE))

    with open(workdir + '/input/rocData_config_' + str(configuration_index) + '.json', 'w+') as f:
        json.dump(rocData, f, indent=2)


# +++++ Script Entrypoint
main()
