# This script performs comparisons among captures, splitting each capture into basic blocks
# and subtracting corresponding block. The output is a file containing for each subBlock
# the count of non zero valued pixels found for each comparison

import sys
import time
from os import listdir, mkdir
from os.path import isfile, join, exists
from shutil import copy, rmtree

import cv2
import numpy as np


def showImageAndLock(name, img):
    cv2.imshow(name, restoreImage(img, 54, 96))
    cv2.waitKey(0)
    cv2.destroyAllWindows()

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


def computeVisualResult(isBlockDynamic):
    # Generating black and white blocks with correct shape
    blockHeight, blockWidth = 20, 20
    numRow, numCol = 54, 96
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
    cv2.imshow('fig', res)
    cv2.waitKey(0)
    return res


# Subtracts corresponding subBlocks of two different images, and counts the amount of non-null pixels
def performComparisons(imgArrayA, imgArrayB):
    if len(imgArrayA) != len(imgArrayB):
        print('Impossible to compare image blocks, input images of different sizes...')
        return -1

    limit = 20 * 8  # 50% del blocco cambiata
    hasBlockChanged = []

    for index, blockFromA in enumerate(imgArrayA):
        absoluteDiff = np.absolute(blockFromA - imgArrayB[index])
        # The total count of non zero valued pixels over the 3 channels
        nonZeroCount = np.count_nonzero(absoluteDiff)
        if nonZeroCount > limit:
            hasBlockChanged.append(True)
        else:
            hasBlockChanged.append(False)

    return hasBlockChanged


def searchPatterns(blockComparisons):
    # Searching for pattern
    patternCounter = 0
    for x in range(26, 70):
        previousBlock = blockComparisons[x]
        if previousBlock is True:
            verticalCountStatic = 0
            verticalCountDynamic = 1
            state = 0  # Dynamic Block Found
        else:
            verticalCountStatic = 1
            verticalCountDynamic = 0
            state = 1  # Static Block Found
        for i in range(x + 96, 5184, 96):
            if blockComparisons[i] is True and state == 0:
                verticalCountDynamic += 1
                verticalCountStatic = 0
                state = 0
            if blockComparisons[i] is True and state == 1:
                verticalCountStatic = 0
                verticalCountDynamic = 1
                state = 0
            if blockComparisons[i] is True and state == 2:
                verticalCountDynamic = 1
                verticalCountStatic = 0
                state = 0
            if blockComparisons[i] is False and state == 0:
                verticalCountStatic = 1
                state = 2
            if blockComparisons[i] is False and state == 1:
                state = 1
            if blockComparisons[i] is False and state == 2:
                verticalCountStatic += 1
                state = 2
        if state == 2 and verticalCountStatic >= 10 and verticalCountDynamic > 3:
            patternCounter += 1
            if patternCounter == 4:
                return True
        else:

            patternCounter = 0

    return False


def main():
    # The only required input is the working directory which must containt an input
    # folder with a screenshots subdirectory
    workdir = sys.argv[1]

    blockHeightPx = 20
    blockWidthPx = 20
    numberOfBlocksPerRow = 96  # 1920 = 48x40
    numberOfBlocksPerColumn = 54  # 1080 = 27x40

    # Retrieving the list of paths to screenshot files in the input directory
    screenshotInputFolder = workdir + '/input/screenshots/'
    fileList = [join(screenshotInputFolder, f) for f in listdir(screenshotInputFolder) if
                isfile(join(screenshotInputFolder, f))]

    if len(fileList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    start = time.time()
    print('++++ Starting execution at ' + str(start))
    baseImgName = fileList.pop()
    baseImgTest = cv2.imread(baseImgName, cv2.IMREAD_UNCHANGED)

    # Getting a splitted version of all images
    baseImgSplitted = splitImage(baseImgTest, blockHeightPx, blockWidthPx)
    splittedImgList = [splitImage(cv2.imread(imgFileName, cv2.IMREAD_UNCHANGED), blockHeightPx, blockWidthPx)
                       for imgFileName in fileList]

    templateCollection = {
        "tpl0": {
            "images": [baseImgSplitted],
            "imgNames": [int(baseImgName.split('screenshots/')[1].split('.')[0])]
        }
    }

    lastTplIndex = 0
    while len(splittedImgList) >= 1:
        print('There are ' + str(len(splittedImgList)) + ' screen to be assigned remaining')
        testImg = splittedImgList.pop()
        testImgName = int(fileList.pop().split('screenshots/')[1].split('.')[0])
        tplFound = False
        tplConfidenceArray = []
        # showImageAndLock('testing', testImg)
        for tplKey, tplValue in templateCollection.items():
            tplConfidencePoints =0
            for img in tplValue["images"]:
                blockComparisonsResults = performComparisons(img, testImg)
                #showImageAndLock('compared', img)
                #computeVisualResult(blockComparisonsResults)
                distance = round(np.count_nonzero(blockComparisonsResults) / 5184, 3)
                print("Distance :" + str(distance))
                if distance < 0.1:
                    # Images are soo similar they must belong to the same template
                    tplConfidencePoints +=1
                    print('Tpl found for similarity')
                elif distance > 0.8:
                    # Images are too different to belong to same template
                    break
                else:
                    tplPatternFound = searchPatterns(blockComparisonsResults)
                    if tplPatternFound:
                        tplConfidencePoints += 1
                        print('Tpl found for pattern')
                # If we have a match with the gretest part of the template representers
                # we are pretty sure about our screen to belong to this template
                if tplConfidencePoints / len(tplValue["images"]) >= 0.5 or tplConfidencePoints > 5:
                    tplFound = True
                    break
            if tplFound:
                tplValue["images"].append(testImg)
                tplValue["imgNames"].append(testImgName)
                break
            else:
                tplConfidenceArray.append((tplConfidencePoints / len(tplValue["images"]), tplKey))

        if not tplFound:
            tplConfidenceArray = [conf for conf in tplConfidenceArray if conf[0] > 0.3]
            tplConfidenceArray = sorted(tplConfidenceArray, key=lambda conftuple: conftuple[0], reverse=True)
            if len(tplConfidenceArray) > 0:
                # Selecting name of template with highest confidence
                choosenTpl = tplConfidenceArray[0][1]
                print('Screen assigned to ' + choosenTpl + ' with confidence' + str(tplConfidenceArray[0][0]))
                templateCollection[choosenTpl]["images"].append(testImg)
                templateCollection[choosenTpl]["imgNames"].append(testImgName)
            else:
                print('Template not found! creating a new one')
                lastTplIndex += 1
                templateCollection["tpl" + str(lastTplIndex)] = {
                    "images": [testImg],
                    "imgNames": [testImgName]
                }

    if exists(workdir + '/output/templates'):
        rmtree(workdir + '/output/templates')
    mkdir(workdir + '/output/templates')
    for tplName in templateCollection.keys():
        print('Template ' + tplName)
        print(sorted(templateCollection[tplName]["imgNames"]))
        tplDir = workdir + '/output/templates/' + tplName + '/'
        if exists(tplDir):
            rmtree(tplDir)
        mkdir(tplDir)
        for name in sorted(templateCollection[tplName]["imgNames"]):
            copy(workdir + '/input/screenshots/' + str(name) + '.jpg', tplDir + '/' + str(name) + '.jpg')

    end = time.time()
    print('++++ Execution completed at ' + str(end) + ' - elapsed time: ' + str(end - start))



# +++++ Script Entrypoint
main()
