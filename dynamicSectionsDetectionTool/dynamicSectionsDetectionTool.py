# Script for splitting an image into multiple parts with the same size
# @input numRow, numCol of the grid splitting the image
# @input inputImage path to the image to be splitted


import json
import shutil
import sys
from os import listdir, makedirs
from os.path import isfile, join, exists

import cv2
import matplotlib
import numpy as np
import scipy.interpolate as scyinterp


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


def computePerBlockResult(perBlockDifference, shape):
    isBlockStatic = []
    nonZeroPerBlock = []
    blockWidth, blockHeight, nChannels = shape

    # We consider a block static if less than X% (currently 0.5%) of his pixel have not been erased by subtraction
    threshold = (blockWidth * blockHeight) * 3 // 200

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


def computeVisualResult(result, outputFolder, index):
    # Generating black and white blocks with correct shape
    blockHeight, blockWidth = result['blockDimensions']
    blackBlock = np.zeros((blockHeight, blockWidth, 3), dtype=np.uint8)
    whiteBlock = np.ones((blockHeight, blockWidth, 3), dtype=np.uint8)
    whiteBlock[:, :, :] = 255

    visualResultBlocksArray = []
    for block in result['perBlockResult']:
        isStaticConfidence = block['timesEvaluatedDynamic'] / block['evaluations']
        if isStaticConfidence > 0.1:
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
        perBlockDifference = subtractBlocksAndCountZeros(baseImg_splitted, imgSplitted)

        # Applies simple metrics to determine if a block is static or not
        isStaticArray, nonZeroCount = computePerBlockResult(perBlockDifference, imgSplitted[0].shape)

        # Computes a json Serializable object containg a matrix mapping static blocks
        # If tmpResult is not None updates the matrix starting from previous infos
        tmpResult = computeJsonSerializableResult(isStaticArray, nonZeroCount, tmpResult)

    return tmpResult


def evaluateResults(results, configurationData, nn0BinStep, pdeBinStep):
    perBlockResult = results['perBlockResult']
    dynamicBlockSummary = configurationData['dynamicBlocksSummary']

    # Initializing indicators for PDE
    # The number of non zero valued pixels is equal to nPixelsPerBlock*nChannels
    nn0Range = configurationData['baseBlockHeight'] * configurationData['baseBlockWidth'] * 3
    # NN0 values for dynamic, static and all blocks
    nonZeroCountsForDynamicBlocks = []
    nonZeroCountsForStaticBlocks = []
    overallNonZeroCounts = []
    # Array of objects representing our bins, counting number of dynamic and static blocks in it
    nn0Bins = []
    for x in range(0, nn0Range + nn0BinStep, nn0BinStep):
        superiorEdge = min(x + nn0BinStep, nn0Range)
        nn0Bins.append({
            "range": [x, superiorEdge],
            "totalBlocks": 0,
            "staticBlocks": 0,
            "dynamicBlocks": 0
        })
        if superiorEdge == nn0Range:
            break

    # Initializing indicators for PDE
    # PDE is a percentage thus its range is always [0, 100]
    pdeRange = 100
    # PDE values for dynamic, static and all blocks
    pdeForDynamicBlocks = []
    pdeForStaticBlocks = []
    overallPde = []
    # Array of objects representing our bins, counting number of dynamic and static blocks in it
    pdeBins = []
    for x in range(0, pdeRange + pdeBinStep, pdeBinStep):
        superiorEdge = min(x + pdeBinStep, pdeRange)
        pdeBins.append({
            "range": [x, superiorEdge],
            "totalBlocks": 0,
            "staticBlocks": 0,
            "dynamicBlocks": 0
        })
        if superiorEdge == pdeRange:
            break

    # Use computations results and the TRUTH map of dynamic blocks derived by the page generator
    # to compute the declared indicators
    for index, blockResult in enumerate(perBlockResult):
        isBlockDynamic = dynamicBlockSummary[index]
        overallNonZeroCounts.append(blockResult['nonZeroCounts'])
        if isBlockDynamic:
            nonZeroCountsForDynamicBlocks.append(blockResult['nonZeroCounts'])
        else:
            nonZeroCountsForStaticBlocks.append(blockResult['nonZeroCounts'])

        for countNonZero in blockResult['nonZeroCounts']:
            nn0BinIndex = countNonZero // nn0BinStep
            nn0Bins[nn0BinIndex]['totalBlocks'] += 1
            if isBlockDynamic:
                nn0Bins[nn0BinIndex]['dynamicBlocks'] += 1
            else:
                nn0Bins[nn0BinIndex]['staticBlocks'] += 1

        blockPde = 100 * (blockResult['timesEvaluatedDynamic'] / blockResult['evaluations'])
        pdeBinIndex = int(blockPde // pdeBinStep)

        overallPde.append(blockPde)
        pdeBins[pdeBinIndex]['totalBlocks'] += 1

        if isBlockDynamic:
            pdeForDynamicBlocks.append(blockPde)
            pdeBins[pdeBinIndex]['dynamicBlocks'] += 1
        else:
            pdeForStaticBlocks.append(blockPde)
            pdeBins[pdeBinIndex]['staticBlocks'] += 1



    probabilityDistributionData = {
        "nn0": nn0Bins,
        "nn0Counts": {
            "overall": overallNonZeroCounts,
            "dynamic": nonZeroCountsForDynamicBlocks,
            "static": nonZeroCountsForStaticBlocks
        },
        "pde": pdeBins,
        "pdeValues": {
            "overall": overallPde,
            "dynamic": pdeForDynamicBlocks,
            "static": pdeForStaticBlocks
        },
    }

    return probabilityDistributionData


def plotData(outFolder, data):
    nn0Bins, pdeBins = data['nn0'], data['pde']
    overallNn0Values, overallPdeValues = data['nn0Counts']['overall'], data['pdeValues']['overall']
    staticBlocksNn0Values, staticBlocksPdeValues = data['nn0Counts']['static'], data['pdeValues']['static']
    dynamicBlocksNn0Values, dynamicBlocksPdeValues = data['nn0Counts']['dynamic'], data['pdeValues']['dynamic']

    # Plotting probability or a block to be dynamic given a certain value of NN0
    nn0X = range(0, len(nn0Bins)),
    nn0Y = []
    for block in nn0Bins:
        if block['totalBlocks'] is not 0:
            nn0Y.append(block['dynamicBlocks'] / block['totalBlocks'])
        else:
            nn0Y.append(0)

    fnn0 = scyinterp.interp1d(nn0X, nn0Y, kind='cubic')
    matplotlib.pyplot.plot(nn0X, fnn0(nn0X), '-')
    matplotlib.pyplot.legend(['nn0'], loc='best')
    matplotlib.pyplot.savefig(outFolder + 'dynamicProbForNn0Values.png')

    # Plotting probability for a block to be dynamic given a certain value of PDE
    pdeX = range(0, len(pdeBins))
    pdeY = []
    for block in pdeBins:
        if block['totalBlocks'] is not 0:
            pdeY.append(block['dynamicBlocks'] / block['totalBlocks'])
        else:
            pdeY.append(0)
    fpde = scyinterp.interp1d(pdeX, pdeY, kind='cubic')

    # fastplot.plot((nn0X, nn0Y), outFolder + 'nn0Plot.png', xlabel='bins', ylabel='DynamicBlockProbability')
    # fastplot.plot((pdeX, pdeY), outFolder + 'pdePlot.png', xlabel='bins', ylabel='DynamicBlockProbability')

    return


def main():
    blockHeightPx = int(sys.argv[1])
    blockWidthPx = int(sys.argv[2])
    inputFolder = sys.argv[3]

    outputFolder = inputFolder + '/output'
    if not exists(outputFolder):
        makedirs(outputFolder)
    else:
        shutil.rmtree(outputFolder)
        makedirs(outputFolder)

    # Retrieving the list of paths to screenshot files in the input directory
    input = inputFolder + '/input'
    fileList = [join(input, f) for f in listdir(input) if isfile(join(input, f))]

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

    print(tmpResult)

    index = 0
    while len(fileList) >= 1:
        # We will compare every screenshot with the one from the last iteration
        tmpResult = performComparisons(baseImgTest, tmpResult, fileList)
        res = computeVisualResult(tmpResult, outputFolder, index)
        # Update the base image for a new round of comparisons
        baseImgTest = cv2.imread(fileList.pop(), cv2.IMREAD_UNCHANGED)
        index += 1

    finalResult = tmpResult

    # Now finalResult contains for each block:
    # - nTimes it was evaluated,
    # - nTimes it was evaluated Dynamic,
    # - nonZeroPixelCount for each evaluation
    # we use these data probability distribution functions

    with open(inputFolder + '/configuration.json', 'r') as f:
        configurationData = json.load(f)

    distributionData = evaluateResults(finalResult, configurationData, 3, 1)

    with open(inputFolder + '/output/probabilityDistributionData.json', 'a+') as outfile:
        json.dump(distributionData, outfile, indent=2)

    plotData(inputFolder + '/output/', distributionData)

    cv2.namedWindow('image', cv2.WINDOW_NORMAL)
    cv2.imshow('image', res)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    # TODO system to exclude images completely different from others
    # TODO improve visual result computation -- binding to number of images

    # print(json.dumps(tmpResult, indent=2))


# +++++ Script Entrypoint
main()
