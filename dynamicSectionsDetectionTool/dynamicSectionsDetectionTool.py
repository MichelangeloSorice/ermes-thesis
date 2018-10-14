# Script for splitting an image into multiple parts with the same size
# @input numRow, numCol of the grid splitting the image
# @input inputImage path to the image to be splitted


import json
import sys
from os import listdir
from os.path import isfile, join

import cv2
import numpy as np


def splitImage(img, numRow, numCol):
    # Computing block size
    imHeight, imWidth, nChannels = img.shape
    blockHeight = imHeight // numRow
    blockWidth = imWidth // numCol

    blocksArray = []
    for x in range(0, imHeight, blockHeight):
        if imHeight - x < blockHeight:
            break
        for y in range(0, imWidth, blockWidth):
            if imWidth - y < blockWidth:
                break
            blocksArray.append(img[x: x + blockHeight, y: y + blockWidth])

    return blocksArray


def subtractBlocks(imgArrayA, imgArrayB):
    if len(imgArrayA) != len(imgArrayB):
        print('Impossible to compare image blocks, input images of different sizes...')
        return -1

    perBlockResult = []
    index = 0
    for blockFromA in imgArrayA:
        perBlockResult.append(cv2.subtract(blockFromA, imgArrayB[index]))
        index += 1

    return perBlockResult


def computeIsStaticArray(perBlockDifference, threshol):
    isBlockStatic = []
    blockWidth, blockHeight, nChannels = perBlockDifference[0].shape

    # We consider a block static if less than X% (currently 0.5%) of his pixel have not been erased by subtraction
    threshold = (blockWidth * blockHeight) // 200

    for block in perBlockDifference:
        b, g, r = cv2.split(block)
        if cv2.countNonZero(b) < threshold and cv2.countNonZero(g) < threshold and cv2.countNonZero(r) < threshold:
            isBlockStatic.append(True)
        else:
            isBlockStatic.append(False)
    return isBlockStatic


# Code for recreating the image for test sake
def restoreImage(blocksArray, numRow, numCol):
    restoredImg = []
    for x in range(numRow):
        rowImage = []
        for y in range(numCol - 1):
            if y == 0:
                rowImage = np.concatenate((blocksArray[x * numCol], blocksArray[x * numCol + 1]), 1)
            else:
                rowImage = np.concatenate((rowImage, blocksArray[x * numCol + y + 1]), 1)
        if x == 0:
            restoredImg = rowImage
        else:
            restoredImg = np.concatenate((restoredImg, rowImage), 0)

    cv2.namedWindow('image', cv2.WINDOW_NORMAL)
    cv2.imshow('image', restoredImg)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    return restoredImg


def computeJsonSerializableResult(isStaticArray, previousResult, numRow, numCol):
    if previousResult is None:
        staticBlocksMap = []
        for x in range(numRow):
            staticBlocksMap.append([])
            for y in range(numCol):
                staticBlocksMap[x].append(isStaticArray[x * numCol + y])
    else:
        # Update the previous result
        staticBlocksMap = previousResult['staticBlocksMap']
        for x in range(numRow):
            for y in range(numCol):
                staticBlocksMap[x][y] = isStaticArray[x * numCol + y] and staticBlocksMap[x][y]

    result = {
        'gridParams': [numRow, numCol],
        'staticBlocksMap': staticBlocksMap
    }

    return result


def computeVisualResult(result, baseImg):
    # Computing block size
    imHeight, imWidth, nChannels = baseImg.shape
    blockHeight = imHeight // result['gridParams'][0]  # imHeight / numRows
    blockWidth = imWidth // result['gridParams'][1]  # imWidth / numCol

    blackBlock = np.zeros((blockHeight, blockWidth, nChannels))
    whiteBlock = np.ones((blockHeight, blockWidth, nChannels))

    visualResultBlocksArray = []
    for x in range(result['gridParams'][0]):
        for y in range(result['gridParams'][1]):
            if result['staticBlocksMap'][x][y] is True:
                visualResultBlocksArray.append(whiteBlock)
            else:
                visualResultBlocksArray.append(blackBlock)

    return restoreImage(visualResultBlocksArray, result['gridParams'][0], result['gridParams'][1])


def main():
    numRow = int(sys.argv[1])
    numCol = int(sys.argv[2])
    inputFolder = sys.argv[3]
    # outputFolder = sys.argv[4]

    # Retrieving the list of paths to screenshot files in the input directory
    fileList = [join(inputFolder, f) for f in listdir(inputFolder) if isfile(join(inputFolder, f))]

    if len(fileList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    # We will every screenshot with the one from the last iteration
    baseImg = cv2.imread(fileList.pop(), cv2.IMREAD_UNCHANGED)
    baseImg_splitted = splitImage(baseImg, numRow, numCol)

    tmpResult = None

    for imgFile in fileList:
        # Splitting the image in numRow*numCol blocks of the same size
        imgSplitted = splitImage(cv2.imread(imgFile, cv2.IMREAD_UNCHANGED), numRow, numCol)

        # Subtracting each block of the base image with the corresponding one of the current image
        perBlockDifference = subtractBlocks(baseImg_splitted, imgSplitted)

        # Applies simple metrics to determine if a block is static or not
        isStaticArray = computeIsStaticArray(perBlockDifference)

        # Computes a json Serializable object containg a matrix mapping static blocks
        # If tmpResult is not None updates the matrix starting from previous infos
        tmpResult = computeJsonSerializableResult(isStaticArray, tmpResult, numRow, numCol)

    visualResult = computeVisualResult(tmpResult, baseImg)
    print(json.dumps(tmpResult, indent=2))

    # if not os.path.exists(outputFolder):
    #     print("The provided output folder does not exists, the default output folder will be used...")
    #     outputFolder = './' + imageAFileName + '_results/'
    #     if not os.path.exists(outputFolder):
    #         os.makedirs(outputFolder)


# +++++ Script Entrypoint
main()
