# Script for splitting an image into multiple parts with the same size
# @input numRow, numCol of the grid splitting the image
# @input inputImage path to the image to be splitted


import shutil
import sys
from os import listdir, makedirs
from os.path import isfile, join, exists

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


def subtractBlocks(imgArrayA, imgArrayB):
    if len(imgArrayA) != len(imgArrayB):
        print('Impossible to compare image blocks, input images of different sizes...')
        return -1

    perBlockResult = {
        "straightDiffs": [],
        "reverseDiffs": []
    }

    for index, blockFromA in enumerate(imgArrayA):
        perBlockResult["straightDiffs"].append(cv2.subtract(blockFromA, imgArrayB[index]))
        perBlockResult["reverseDiffs"].append(cv2.subtract(imgArrayB[index], blockFromA))

    return perBlockResult


def computePerBlockResult(perBlockDifference):
    isBlockStatic = []
    nonZeroPerBlock = []
    blockWidth, blockHeight, nChannels = perBlockDifference[0].shape

    # We consider a block static if less than X% (currently 0.5%) of his pixel have not been erased by subtraction
    threshold = (blockWidth * blockHeight) * 3 // 200

    for block in perBlockDifference:
        b, g, r = cv2.split(block)
        nonZeroCount = cv2.countNonZero(b) + cv2.countNonZero(g) + cv2.countNonZero(r)
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
                "nonZeroOverallCount": nonZeroCount[x]
            })
        previousResult['perBlockResult'] = perBlockResult
    else:
        # Update the previous result
        for index, block in enumerate(previousResult['perBlockResult']):
            block['evaluations'] += 1
            block['nonZeroOverallCount'] += nonZeroCount[index]
            if isStaticArray[index] is False:
                block['timesEvaluatedDynamic'] += 1

    return previousResult


def computeVisualResult(result, outputFolder, index):
    # Generating black and white blocks with correct shape
    blockHeight, blockWidth = result['blockDimensions']
    blackBlock = np.zeros((blockHeight, blockWidth, 3), dtype=np.uint8)
    whiteBlock = np.ones((blockHeight, blockWidth, 3), dtype=np.uint8)
    whiteBlock[:, :, :] = 255

    visualResultBlocksArray = []
    for block in result['perBlockResult']:
        isStaticConfidence = block['timesEvaluatedDynamic'] / block['evaluations']
        if isStaticConfidence > 0:
            visualResultBlocksArray.append(blackBlock)
        else:
            visualResultBlocksArray.append(whiteBlock)

    numRow, numCol = result['gridParams']
    res = restoreImage(visualResultBlocksArray, numRow, numCol)
    cv2.imwrite(join(outputFolder, str(index) + '.jpg'), res)
    return res


def performComparisons(baseImg, tmpResult, fileList):
    blockHeight, blockWidth = tmpResult['blockDimensions']
    baseImg_splitted = splitImage(baseImg, blockHeight, blockWidth)

    for imgFile in fileList:
        img = cv2.imread(imgFile, cv2.IMREAD_UNCHANGED)

        # Splitting the image in numRow*numCol blocks of the same size
        imgSplitted = splitImage(img, blockHeight, blockWidth)

        # Subtracting each block of the base image from the corresponding one of the current image and vice versa
        perBlockDifference = subtractBlocks(baseImg_splitted, imgSplitted)

        # Applies simple metrics to determine if a block is static or not
        isStaticArrayStraight, nonZeroCountStraight = computePerBlockResult(perBlockDifference["straightDiffs"])
        isStaticArrayReverse, nonZeroCountReverse = computePerBlockResult(perBlockDifference["reverseDiffs"])

        # Computes a json Serializable object containg a matrix mapping static blocks
        # If tmpResult is not None updates the matrix starting from previous infos
        tmpResult = computeJsonSerializableResult(isStaticArrayStraight, nonZeroCountStraight, tmpResult)
        tmpResult = computeJsonSerializableResult(isStaticArrayReverse, nonZeroCountReverse, tmpResult)

    return tmpResult


def main():
    blockHeightPx = int(sys.argv[1])
    blockWidthPx = int(sys.argv[2])
    inputFolder = sys.argv[3]

    outputFolder = './testIOFolder/outputFor_' + inputFolder.split('/').pop() + '/'
    if not exists(outputFolder):
        makedirs(outputFolder)
    else:
        shutil.rmtree(outputFolder)
        makedirs(outputFolder)

    # Retrieving the list of paths to screenshot files in the input directory
    fileList = [join(inputFolder, f) for f in listdir(inputFolder) if isfile(join(inputFolder, f))]

    if len(fileList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    baseImgTest = cv2.imread(fileList.pop(), cv2.IMREAD_UNCHANGED)
    imHeight, imWidth, nChannels = baseImgTest.shape

    # Setting up results container with some basic infos
    tmpResult = {
        'blockDimensions': [blockHeightPx, blockWidthPx],
        'gridParams': [imHeight // blockHeightPx, imWidth // blockWidthPx],
        'perBlockResult': None,
    }

    index = 0
    while len(fileList) >= 1:
        # We will compare every screenshot with the one from the last iteration
        tmpResult = performComparisons(baseImgTest, tmpResult, fileList)
        res = computeVisualResult(tmpResult, outputFolder, index)
        # Update the base image for a new round of comparisons
        baseImgTest = cv2.imread(fileList.pop(), cv2.IMREAD_UNCHANGED)
        index += 1

    cv2.namedWindow('image', cv2.WINDOW_NORMAL)
    cv2.imshow('image', res)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    # TODO system to exclude images completely different from others
    # TODO improve visual result computation -- binding to number of images

    # print(json.dumps(tmpResult, indent=2))


# +++++ Script Entrypoint
main()
