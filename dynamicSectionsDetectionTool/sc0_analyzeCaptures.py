# This script performs comparisons among captures, splitting each capture into basic blocks
# and subtracting corresponding block. The output is a file containing for each subBlock
# the count of non zero valued pixels found for each comparison

import json
import sys
from os import listdir
from os.path import isfile, join

import cv2
import numpy as np


# Splits an image into an array of sub-images with shape blockHeight x blockWidth
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


# Subtracts corresponding subBlocks of two different images, and counts the amount of non-null pixels
def subtractBlocksAndCountZeros(imgArrayA, imgArrayB):
    if len(imgArrayA) != len(imgArrayB):
        print('Impossible to compare image blocks, input images of different sizes...')
        return -1

    perBlockResult = []

    for index, blockFromA in enumerate(imgArrayA):
        absoluteDiff = np.absolute(blockFromA - imgArrayB[index])
        # The total count of non zero valued pixels over the 3 channels
        zeroCount = np.count_nonzero(absoluteDiff)
        perBlockResult.append(zeroCount)

    return perBlockResult



def updateResult(nonZeroCounts, previousResult):
    if previousResult['perBlockNN0Counts'] is None:
        # Per block result initialization:
        # it is an array of arrays keeping for each block the non zero count of a subtraction
        previousResult['perBlockNN0Counts'] = []
        for index in range(len(nonZeroCounts)):
            previousResult['perBlockNN0Counts'].append([nonZeroCounts[index]])
    else:
        # Update the previous result
        for index, nn0array in enumerate(previousResult['perBlockNN0Counts']):
            nn0array.append(nonZeroCounts[index])

    return previousResult


def performComparisons(baseImgSplitted, listImgSplitted, tmpResult):
    for imgSplitted in listImgSplitted:
        perBlockNN0Count = subtractBlocksAndCountZeros(baseImgSplitted, imgSplitted)
        tmpResult = updateResult(perBlockNN0Count, tmpResult)

    return tmpResult


def main():
    # The only required input is the working directory which must containt an input
    # folder with a screenshots subdirectory
    workdir = sys.argv[1]

    with open('./sectionDetectionParams.json') as inputFile:
        sectionDetectionParams = json.load(inputFile)
        inputFile.close()

    blockHeightPx = sectionDetectionParams['BLOCK']['BLOCK_HEIGHT']
    blockWidthPx = sectionDetectionParams['BLOCK']['BLOCK_WIDTH']

    # Retrieving the list of paths to screenshot files in the input directory
    screenshotInputFolder = workdir + '/input/screenshots/'
    fileList = [join(screenshotInputFolder, f) for f in listdir(screenshotInputFolder) if
                isfile(join(screenshotInputFolder, f))]

    if len(fileList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    baseImgTest = cv2.imread(fileList.pop(), cv2.IMREAD_UNCHANGED)
    imHeight, imWidth, nChannels = baseImgTest.shape

    # Getting a splitted version of all images
    baseImgSplitted = splitImage(baseImgTest, blockHeightPx, blockWidthPx)
    splittedImgList = [splitImage(cv2.imread(imgFileName, cv2.IMREAD_UNCHANGED), blockHeightPx, blockWidthPx)
                       for imgFileName in fileList]

    # Setting up results container with some basic informations
    tmpResult = {
        'blockDimensions': [blockHeightPx, blockWidthPx],
        'gridParams': [imHeight // blockHeightPx, imWidth // blockWidthPx],
        'perBlockNN0Counts': None,
    }

    while len(splittedImgList) >= 1:
        print('There are ' + str(len(splittedImgList)) + ' iterations remaining')
        # We will compare every screenshot with the one from the last iteration
        tmpResult = performComparisons(baseImgSplitted, splittedImgList, tmpResult)
        # Update the base image for a new round of comparisons
        baseImgSplitted = splittedImgList.pop()

    # Now finalResult contains for each block:
    # an array of integers representing the NN0 count for that block in different comparisons
    finalResult = tmpResult
    with open(workdir + '/input/captureAnalysis.json', 'w+') as f:
        json.dump(finalResult, f, indent=None)
        f.close()

    # TODO system to exclude images completely different from others
    # TODO improve visual result computation -- binding to number of images


# +++++ Script Entrypoint
main()
