import json
import sys
from os.path import join

import cv2
import numpy as np


def computeVisualResult(result, outputFolder, PDE):
    # Generating black and white blocks with correct shape
    blockHeight, blockWidth = result['blockDimensions']
    blackBlock = np.zeros((blockHeight, blockWidth, 3), dtype=np.uint8)
    whiteBlock = np.ones((blockHeight, blockWidth, 3), dtype=np.uint8)
    whiteBlock[:, :, :] = 255

    visualResultBlocksArray = [];
    for block in result['perBlockResult']:
        isDynamicConfidence = block['timesEvaluatedDynamic'] / block['evaluations']
        if isDynamicConfidence > PDE:
            visualResultBlocksArray.append(blackBlock)
        else:
            visualResultBlocksArray.append(whiteBlock)

    numRow, numCol = result['gridParams']
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
    workdir = sys.argv[1]

    with open('./sectionDetectionParams.json') as inputFile:
        sectionDetectionParams = json.load(inputFile)

    thresholds = sectionDetectionParams['THRESHOLDS']

    with open(workdir + '/input/sectionDetectionResults.json', 'r+') as finalResult_file:
        finalResult = json.load(finalResult_file)

    # Compute and store a visual representation of the result showing dynamic area as Black blocks on a blank img
    visualResultsOutputFolder = workdir + '/output/'

    res = computeVisualResult(finalResult, visualResultsOutputFolder, thresholds['PDE'])

    cv2.namedWindow('image', cv2.WINDOW_NORMAL)
    cv2.imshow('image', res)
    cv2.waitKey(5000)
    cv2.destroyAllWindows()


main()
