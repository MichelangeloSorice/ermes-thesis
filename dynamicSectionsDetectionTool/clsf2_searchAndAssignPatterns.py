# This script performs comparisons among captures, splitting each capture into basic blocks
# and subtracting corresponding block. The output is a file containing for each subBlock
# the count of non zero valued pixels found for each comparison

import json
import sys
import time
from os import listdir, mkdir
from os.path import isfile, join, exists
from shutil import copy, rmtree

import cv2
import numpy as np
from random import shuffle


def showImageAndLock(name, img, numRow=54, numCol=96):
    cv2.imshow(name, restoreImage(img, numRow, numCol))
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


def computeVisualResult(isBlockDynamic, numRow=54, numCol=96):
    # Generating black and white blocks with correct shape
    blockHeight, blockWidth = 20, 20
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


def getReducedWindow(comparisonsArray, width, height, maxWidth):
    reducedWindow = []
    # Getting reduced view of things
    ## width 26-70, height 0-32 --- x ranges from 26 to 26 + 32x96 +1
    verticalStep, limit, horizontalStep = maxWidth, width[0] + maxWidth * (height[1] - height[0]), width[1] - width[0]
    for x in range(width[0], limit, verticalStep):
        reducedWindow.extend(comparisonsArray[x: x + horizontalStep])
    return reducedWindow


def getMatchingRateo(reducedWindow1, reducedWindow2):
    matchingBlocks = sum(1 for i in range(len(reducedWindow1)) if reducedWindow1[i] == reducedWindow2[i])
    return round(matchingBlocks / len(reducedWindow1), 3)


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


def searchPatterns(blockComparisons, width, height, maxWidth):
    # Searching for pattern
    patternCounter = 0
    limit = maxWidth * (height[1] - height[0])
    for x in range(width[0], width[1]):
        previousBlock = blockComparisons[x]
        if previousBlock is True:
            verticalCountStatic = 0
            verticalCountDynamic = 1
            state = 0  # Dynamic Block Found
        else:
            verticalCountStatic = 1
            verticalCountDynamic = 0
            state = 1  # Static Block Found
        for i in range(x + maxWidth, limit, maxWidth):
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
        if state == 2 and verticalCountStatic >= 8 and verticalCountDynamic > 4:
            patternCounter += 1
            if patternCounter == 6:
                return True
        else:
            patternCounter = 0

    return False


def showClustersResults(templateCollection, dumpFile=None):
    for tplName in templateCollection.keys():
        print('Template ' + tplName)
        print(sorted([tuple[1] for tuple in templateCollection[tplName]["images"]]))

    if not dumpFile is None:
        jsonObj = {}
        for key, value in templateCollection.items():
            jsonObj[key] = sorted([tuple[1] for tuple in value["images"]])
        with open(dumpFile, 'w+') as f:
            json.dump(jsonObj, f, indent=4)
            f.close()


def searchBannerPattern(comparison, maxWidth, maxHeight):
    possibleBannerHeight = 0
    beginOfLastRow = maxWidth * (maxHeight - 1)
    for x in range(beginOfLastRow, 0, -maxWidth):
        isWholeRowDynamic = True
        for i in range(x, x + maxWidth, 1):
            if comparison[i] is False:
                isWholeRowDynamic = False
                break
        if isWholeRowDynamic:
            possibleBannerHeight += 1
        else:
            break

    if possibleBannerHeight >= 3:
        return True, possibleBannerHeight
    return False, 0


def preprocessing(imgList):
    listCopy = imgList.copy()
    votesDictionary = dict()
    comparisonsCount = 0
    while len(listCopy) > 1:
        testImg = (listCopy.pop())[0]
        print('PREPROC - There are ' + str(len(listCopy)) + ' screens remaining!')
        for img in listCopy:
            comparisonsCount += 1
            comparison = performComparisons(testImg, img[0])
            possibleBanner, possibleBannerHeight = searchBannerPattern(comparison, 96, 54)
            if possibleBanner:
                if not (possibleBannerHeight in votesDictionary):
                    votesDictionary[possibleBannerHeight] = 1
                else:
                    votesDictionary[possibleBannerHeight] += 1

    mostVoted = (None, 0)
    print('PREPROC - Total comparisons: ' + str(comparisonsCount))
    for height, votes in votesDictionary.items():
        print('PREPROC - Height ' + str(height) + ' has been voted: ' + str(votes))
        if mostVoted[1] < votes:
            mostVoted = ([height], votes)
        elif mostVoted[1] == votes:
            mostVoted[0].append(height)
            mostVoted[1] += votes

    if mostVoted[1] > 0.35 * comparisonsCount:
        print('PREPROC - Hey hey hey! We have got a winner!')
        print(mostVoted)
        supposedHeight = round(sum(height for height in mostVoted[0]), 1)
        return True, supposedHeight

    return False, 0


def performClustering(imgList, templateCollection, lastTplIndex, test=False):
    # First we attempt to assign the image for similarity,
    # in this way bigger and thus more robust templates are computed
    nextIterationImgList = []
    while len(imgList) >= 1:
        print('STEP 0 - There are ' + str(len(imgList)) + ' screen to be assigned remaining')
        testImgTuple = imgList.pop()
        testImg, testImgName = testImgTuple[0], testImgTuple[1]
        tplFound = False

        if test:
            showImageAndLock('testimg', testImg)

        unmatchableTplCount = 0
        for tplKey, tplValue in templateCollection.items():
            if not tplValue["flagChanged"]:
                continue
            tplConfidencePoints = 0
            for imgIndex in range(tplValue["lastAddedIndex"], len(tplValue["images"])):
                img = tplValue["images"][imgIndex][0]
                blockComparisonsResults = performComparisons(img, testImg)

                if test:
                    showImageAndLock('img', img)
                    computeVisualResult(blockComparisonsResults)

                distance = round(np.count_nonzero(blockComparisonsResults) / len(blockComparisonsResults), 3)

                if distance < 0.1:
                    # Images are soo similar they must belong to the same template
                    tplFound = True
                    print('STEP 0 - Tpl found for high level similarity with ' + str(tplValue["images"][imgIndex][1]))
                    break
                if distance > 0.8:
                    # Images are too different to belong to same template
                    unmatchableTplCount += 1
                    break

                comparisonReduced = getReducedWindow(blockComparisonsResults, [26, 66], [3, 54], 96)

                if test:
                    computeVisualResult(comparisonReduced, 51, 40)

                distanceForReducedWindow = round(np.count_nonzero(comparisonReduced) / len(comparisonReduced), 3)
                if distanceForReducedWindow < 0.2:
                    # Images are soo similar they must belong to the same template
                    tplFound = True
                    print('STEP 2 - Tpl found for similarity in core ' + str(tplValue["images"][imgIndex][1]))
                    break
                if distanceForReducedWindow > 0.7:
                    # Images are too different to belong to same template
                    unmatchableTplCount += 1
                    break

                tplPatternFound = searchPatterns(blockComparisonsResults, [26, 70], [0, 40], 96)
                if tplPatternFound:
                    tplConfidencePoints += 1
                    if tplConfidencePoints / len(tplValue["images"]) >= 0.5 or tplConfidencePoints > 6:
                        tplFound = True
                        # computeVisualResult(comparisonReduced, 40, 44)
                        print('STEP 3 - Tpl found for pattern ' + str(tplValue["images"][imgIndex][1]))
                        print(tplConfidencePoints)
                        break

            if tplFound:
                print('+++ Assigning screen: ' + str(testImgName) + ' to ' + str(tplKey))
                tplValue["images"].append(testImgTuple)
                tplValue["flagChanged"] = True
                break

        if not tplFound:
            if unmatchableTplCount == len(templateCollection.keys()):
                # If we found the image to be unmatchable with all currently known templates we create a new tpl for it
                print('STEP 0 - Unmatchable screen found, creating new template!')
                lastTplIndex += 1
                templateCollection["tpl" + str(lastTplIndex)] = {
                    "images": [testImgTuple],
                    "flagChanged": False,
                    "previousIterationLength": 0
                }
            else:
                nextIterationImgList.append(testImgTuple)

    return nextIterationImgList, lastTplIndex


def main():
    # The only required input is the working directory which must containt an input
    # folder with a screenshots subdirectory
    workdir = sys.argv[1]

    blockHeightPx = 20
    blockWidthPx = 20


    # Retrieving the list of paths to screenshot files in the input directory
    screenshotInputFolder = workdir + '/input/screenshots/'
    fileList = [join(screenshotInputFolder, f) for f in listdir(screenshotInputFolder) if
                isfile(join(screenshotInputFolder, f))]

    if len(fileList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    start = time.time()
    print('++++ Starting execution at ' + str(start))

    #shuffle(fileList)
    baseImgName = fileList.pop()
    baseImgTest = cv2.imread(baseImgName, cv2.IMREAD_UNCHANGED)
    baseImg = (splitImage(baseImgTest, blockHeightPx, blockWidthPx),
               int(baseImgName.split('screenshots/')[1].split('.')[0]))

    # Getting a splitted version of all images
    imgList = [(splitImage(cv2.imread(imgFileName, cv2.IMREAD_UNCHANGED), blockHeightPx, blockWidthPx),
                int(imgFileName.split('screenshots/')[1].split('.')[0]))
               for imgFileName in fileList]

    # Here is a mechanism to find out the presence of low level banners
    # possibleBanner, supposedHeight = preprocessing(imgList)
    cv2.waitKey(0)

    templateCollection = {
        "tpl0": {
            "images": [baseImg],
            "flagChanged": False,
            "previousIterationLength": 0,
            "lastAddedIndex": 0
        }
    }
    lastTplIndex = 0

    while len(imgList) > 0:
        for tplKey, tplValue in templateCollection.items():
            if len(tplValue["images"]) > tplValue["previousIterationLength"]:
                tplValue["flagChanged"] = True
                tplValue["lastAddedIndex"] = tplValue["previousIterationLength"]
                tplValue["previousIterationLength"] = len(tplValue["images"])
            else:
                tplValue["flagChanged"] = False

        showClustersResults(templateCollection)
        startingLenght = len(imgList)

        # First we attempt to assign the image for similarity,
        # in this way bigger and thus more robust templates are computed
        imgList, lastTplIndex = performClustering(imgList, templateCollection, lastTplIndex)

        if len(imgList) == 0:
            break
        if len(imgList) != startingLenght:
            continue

        randomImgTuple = imgList.pop()
        lastTplIndex += 1
        templateCollection["tpl" + str(lastTplIndex)] = {
            "images": [randomImgTuple],
            "flagChanged": False,
            "previousIterationLength": 0,
            "lastAddedIndex": 0
        }

    # Organizing and emitting results
    if exists(workdir + '/output/templates'):
        rmtree(workdir + '/output/templates')
    mkdir(workdir + '/output/templates')
    for tplName in templateCollection.keys():
        sortedList = sorted(templateCollection[tplName]["images"], key=lambda imgTuple: imgTuple[1])
        tplDir = workdir + '/output/templates/' + tplName + '/'
        if exists(tplDir):
            rmtree(tplDir)
        mkdir(tplDir)
        for name in sortedList:
            copy(workdir + '/input/screenshots/' + str(name[1]) + '.jpg', tplDir + str(name[1]) + '.jpg')

    showClustersResults(templateCollection, workdir + '/output/clsf2_tplSummary.json')
    end = time.time()
    print('++++ Execution completed at ' + str(end) + ' - elapsed time: ' + str(end - start))


# +++++ Script Entrypoint
main()
