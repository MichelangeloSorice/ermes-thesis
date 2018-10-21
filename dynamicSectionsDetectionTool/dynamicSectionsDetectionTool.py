# Script for splitting an image into multiple parts with the same size
# @input numRow, numCol of the grid splitting the image
# @input inputImage path to the image to be splitted


import shutil
import sys
from os import listdir, makedirs
from os.path import isfile, join, exists

import cv2
import numpy as np


def splitImage(img, numRow, numCol):
    # Computing block size
    imHeight, imWidth, nChannels = img.shape
    blockHeight = imHeight // numRow
    blockWidth = imWidth // numCol

    # resizing original image
    img = img[0: blockHeight * numRow, 0: blockWidth * numCol]
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


def countZerosPerBlock(blockArray):
    blockHeight, blockWidth, nChannels = blockArray[0].shape
    pixelPerBlock = blockHeight * blockWidth

    zerosCountPerBlock = []
    for block in blockArray:
        b, g, r = cv2.split(block)
        zerosCountPerBlock.append({
            "b": pixelPerBlock - cv2.countNonZero(b),
            "g": pixelPerBlock - cv2.countNonZero(g),
            "r": pixelPerBlock - cv2.countNonZero(r)
        })

    return zerosCountPerBlock


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


def computeIsStaticArray(perBlockDifference):
    isBlockStatic = []
    blockWidth, blockHeight, nChannels = perBlockDifference[0].shape

    # We consider a block static if less than X% (currently 0.5%) of his pixel have not been erased by subtraction
    threshold = (blockWidth * blockHeight) // 200

    for block in perBlockDifference:
        b, g, r = cv2.split(block)
        if cv2.countNonZero(b) > threshold and cv2.countNonZero(g) > threshold and cv2.countNonZero(r) > threshold:
            isBlockStatic.append(False)
        else:
            isBlockStatic.append(True)
    return isBlockStatic


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
                if isStaticArray[x * numCol + y] is False:
                    staticBlocksMap[x].append({
                        "count": 1,
                        "dynamicRankCount": 1
                    })
                else:
                    staticBlocksMap[x].append({
                        "count": 1,
                        "dynamicRankCount": 0
                    })
    else:
        # Update the previous result
        staticBlocksMap = previousResult['staticBlocksMap']
        for x in range(numRow):
            for y in range(numCol):
                if isStaticArray[x * numCol + y] is False:
                    staticBlocksMap[x][y]["dynamicRankCount"] += 1
                staticBlocksMap[x][y]["count"] += 1

    result = {
        'gridParams': [numRow, numCol],
        'staticBlocksMap': staticBlocksMap
    }

    return result


def computeVisualResult(result, baseImg, outputFolder, index):
    # Computing block size
    imHeight, imWidth, nChannels = baseImg.shape
    blockHeight = imHeight // result['gridParams'][0]  # imHeight / numRows
    blockWidth = imWidth // result['gridParams'][1]  # imWidth / numCol

    blackBlock = np.zeros((blockHeight, blockWidth, nChannels), dtype=np.uint8)
    whiteBlock = np.ones((blockHeight, blockWidth, nChannels), dtype=np.uint8)
    whiteBlock[:, :, :] = 255

    visualResultBlocksArray = []
    for x in range(result['gridParams'][0]):
        for y in range(result['gridParams'][1]):
            isStaticConfidence = result['staticBlocksMap'][x][y]['dynamicRankCount'] / result['staticBlocksMap'][x][y][
                'count']
            if isStaticConfidence > 0:
                visualResultBlocksArray.append(blackBlock)
            else:
                visualResultBlocksArray.append(whiteBlock)

    res = restoreImage(visualResultBlocksArray, result['gridParams'][0], result['gridParams'][1])
    cv2.imwrite(join(outputFolder, str(index) + '.jpg'), res)
    return res


def performComparisons(baseImg, tmpResult, fileList, numRow, numCol):
    baseImg_splitted = splitImage(baseImg, numRow, numCol)

    for imgFile in fileList:
        img = cv2.imread(imgFile, cv2.IMREAD_UNCHANGED)

        # Splitting the image in numRow*numCol blocks of the same size
        imgSplitted = splitImage(img, numRow, numCol)

        # Subtracting each block of the base image with the corresponding one of the current image
        perBlockDifference = subtractBlocks(baseImg_splitted, imgSplitted)

        # Applies simple metrics to determine if a block is static or not
        isStaticArrayStraight = computeIsStaticArray(perBlockDifference["straightDiffs"])
        isStaticArrayReverse = computeIsStaticArray(perBlockDifference["reverseDiffs"])

        # Computes a json Serializable object containg a matrix mapping static blocks
        # If tmpResult is not None updates the matrix starting from previous infos
        tmpResult = computeJsonSerializableResult(isStaticArrayStraight, tmpResult, numRow, numCol)
        tmpResult = computeJsonSerializableResult(isStaticArrayReverse, tmpResult, numRow, numCol)

    return tmpResult


def main():
    numRow = int(sys.argv[1])
    numCol = int(sys.argv[2])
    inputFolder = sys.argv[3]

    outputFolder = './outputFor_' + inputFolder.split('/').pop() + '/'
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

    tmpResult = None
    index = 0
    while len(fileList) > 1:
        # We will compare every screenshot with the one from the last iteration
        baseImgTest = cv2.imread(fileList.pop(), cv2.IMREAD_UNCHANGED)
        tmpResult = performComparisons(baseImgTest, tmpResult, fileList, numRow, numCol)
        visualResult = computeVisualResult(tmpResult, baseImgTest, outputFolder, index)
        index += 1

    # TODO system to exclude images completly different from others
    # TODO improve visual result computation -- binding to number of images

    # print(json.dumps(tmpResult, indent=2))


# +++++ Script Entrypoint
main()
