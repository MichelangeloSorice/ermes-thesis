# This script performs the actual classification about dynamic and static blocks
# The decision is taken applying the defined thresholds on the results of the capture analysis produced in sc0

import json
import sys
from os.path import join

import cv2
import numpy as np


def countNN0OverThreshold(countNonZero, threshold):
    if countNonZero > threshold:
        return 1
    return 0


def computeFinalDecision(captureAnalysisData, thresholds):
    NN0, PDE, perBlockNN0Counts = thresholds['NN0'], thresholds['PDE'], captureAnalysisData['perBlockNN0Counts']
    evaluateBlockNn0Counts = np.vectorize(countNN0OverThreshold, otypes=[np.int])

    isBlockDynamic = []
    perBlockPde = []
    for blockCounts in perBlockNN0Counts:
        # We get an array containing a 0 for each static evaluation and a 1 for each dynamic one
        blockEvaluations = evaluateBlockNn0Counts(blockCounts, NN0)
        # Counting down amount of dynamic evaluations
        dynamicEvaluations = np.count_nonzero(blockEvaluations)
        # Computing block PDE
        blockPde = float(dynamicEvaluations / len(blockEvaluations))
        perBlockPde.append(blockPde)
        if blockPde > PDE:
            isBlockDynamic.append(True)
        else:
            isBlockDynamic.append(False)

    return isBlockDynamic, perBlockPde


def computeVisualResult(isBlockDynamic, captureAnalysisData, outputFolder):
    # Generating black and white blocks with correct shape
    blockHeight, blockWidth = captureAnalysisData['blockDimensions']
    numRow, numCol = captureAnalysisData['gridParams']
    blackBlock = np.zeros((blockHeight, blockWidth, 3), dtype=np.uint8)
    whiteBlock = np.ones((blockHeight, blockWidth, 3), dtype=np.uint8)
    whiteBlock[:, :, :] = 255

    visualResultBlocksArray = [];
    for decision in isBlockDynamic:
        if decision is True:
            visualResultBlocksArray.append(blackBlock)
        else:
            visualResultBlocksArray.append(whiteBlock)

    res = restoreImage(visualResultBlocksArray, numRow, numCol)
    cv2.imwrite(join(outputFolder, 'visualResult.jpg'), res)
    return res


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


def main():
    # The only input is the working directory which must contain an input subfolder and  a captureAnalysis file
    # as produced by script sc0
    workdir = sys.argv[1]

    with open('./sectionDetectionParams.json') as inputFile:
        sectionDetectionParams = json.load(inputFile)
        inputFile.close()
    with open(workdir + '/input/captureAnalysis.json', 'r+') as captureAnalysisDataFile:
        captureAnalysisData = json.load(captureAnalysisDataFile)
        captureAnalysisDataFile.close()

    thresholds = sectionDetectionParams['THRESHOLDS']

    isBlockDynamic, perBlockPde = computeFinalDecision(captureAnalysisData, thresholds)
    with open(workdir + '/output/finalDecision.json', 'w+') as resultFile:
        finalResult = {
            'thresholds': thresholds,
            'perBlockPde': perBlockPde,
            'isBlockDynamic': isBlockDynamic
        }
        json.dump(finalResult, resultFile, indent=None)
        resultFile.close()

    # Compute and store a visual representation of the result showing dynamic area as Black blocks on a blank img
    visualResultsOutputFolder = workdir + '/output/'
    res = computeVisualResult(isBlockDynamic, captureAnalysisData, visualResultsOutputFolder)

    cv2.namedWindow('image', cv2.WINDOW_NORMAL)
    cv2.imshow('image', res)
    cv2.waitKey(5000)
    cv2.destroyAllWindows()


main()
