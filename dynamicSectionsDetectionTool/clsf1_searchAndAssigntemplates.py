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


def compareTemplateSummary(comparisonsArray, templateArray):
    reducedWindow = getReducedWindow(comparisonsArray, [26, 70], [0, 45], 96)

    if templateArray is None:
        return 0, reducedWindow
    else:
        ## Comparing if static blocks match
        matchingRateo = getMatchingRateo(templateArray, reducedWindow)
        return matchingRateo, reducedWindow


def updateTemplateSummary(reducedWindow, templateCount, templateElements):
    if templateCount is None:
        return reducedWindow, [x for x in reducedWindow]
    else:
        newCount = [templateCount[i] + reducedWindow[i] for i in range(len(templateCount))]
        newTemplateArray = []
        threshold = int(templateElements / 2)
        for x in range(len(templateCount)):
            if newCount[x] > threshold:
                newTemplateArray.append(True)
            else:
                newTemplateArray.append(False)
        return newTemplateArray, newCount


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
        if state == 2 and verticalCountStatic >= 6 and verticalCountDynamic > 3:
            patternCounter += 1
            if patternCounter == 3:
                return True
        else:

            patternCounter = 0

    return False


def showClustersResults(templateCollection):
    for tplName in templateCollection.keys():
        print('Template ' + tplName)
        print(sorted([tuple[1] for tuple in templateCollection[tplName]["images"]]))


def performStep0Clustering(step0ImgList, templateCollection, lastTplIndex):
    # First we attempt to assign the image for similarity,
    # in this way bigger and thus more robust templates are computed
    step1ImgList = []
    while len(step0ImgList) >= 1:
        print('STEP 0 - There are ' + str(len(step0ImgList)) + ' screen to be assigned remaining')
        testImgTuple = step0ImgList.pop()
        testImg, testImgName = testImgTuple[0], testImgTuple[1]
        tplFound = False
        unmatchableTplCount = 0
        for tplKey, tplValue in templateCollection.items():
            if not tplValue["flagChanged"]:
                continue
            for imgIndex in range(tplValue["lastAddedIndex"], len(tplValue["images"])):
                img = tplValue["images"][imgIndex][0]
                blockComparisonsResults = performComparisons(img, testImg)
                distance = round(np.count_nonzero(blockComparisonsResults) / 5184, 3)
                if distance < 0.1:
                    # Images are soo similar they must belong to the same template
                    tplFound = True
                    print('STEP 0 - Tpl found for similarity')
                    tplMatchingRateo, newReducedWindowtemplate = compareTemplateSummary(blockComparisonsResults,
                                                                                        tplValue["tplSummary"])
                    break
                if distance > 0.8:
                    # Images are too different to belong to same template
                    unmatchableTplCount += 1
                    break
            if tplFound:
                print('STEP 0 - Assigning screen ' + str(testImgName) + ' to ' + str(tplKey))
                tplValue["images"].append(testImgTuple)
                tplValue["flagChanged"] = True
                tplValue["tplSummary"], tplValue["tplCountArray"] = updateTemplateSummary(newReducedWindowtemplate,
                                                                                          tplValue["tplCountArray"],
                                                                                          len(tplValue["images"]))
                break

        if not tplFound:
            if unmatchableTplCount == len(templateCollection.keys()):
                # If we found the image to be unmatchable with all currently known templates we create a new tpl for it
                print('STEP 0 - Unmatchable screen found, creating new template!')
                lastTplIndex += 1
                templateCollection["tpl" + str(lastTplIndex)] = {
                    "images": [testImgTuple],
                    "tplSummary": None,
                    "tplCountArray": None,
                    "flagChanged": False,
                    "previousIterationLength": 0
                }
            else:
                step1ImgList.append(testImgTuple)

    return step1ImgList, lastTplIndex


def performStep1Clustering(step1ImgList, templateCollection, lastTplIndex):
    step2ImgList = []
    while len(step1ImgList) >= 1:
        print('STEP 1 - There are ' + str(len(step1ImgList)) + ' screen to be assigned remaining')
        testImgTuple = step1ImgList.pop()
        testImg, testImgName = testImgTuple[0], testImgTuple[1]
        tplFound = False
        unmatchableTplCount = 0
        # As second step we attempt to assign images based on the previously computed
        # templateSummaries
        for tplKey, tplValue in templateCollection.items():
            if not tplValue["flagChanged"]:
                continue

            # Of course this is meaningful only for templates with 2 or more representers
            tplElements = len(tplValue["images"])
            if tplElements < 2:
                continue

            for imgIndex in range(tplValue["lastAddedIndex"], len(tplValue["images"])):
                img = tplValue["images"][imgIndex][0]
                blockComparisonsResults = performComparisons(img, testImg)
                tplMatchingRateo, newReducedWindowtemplate = compareTemplateSummary(blockComparisonsResults,
                                                                                    tplValue["tplSummary"])
                if tplMatchingRateo > 0.85:
                    tplFound = True
                    print('STEP 1 - Tpl found for matching tplSummaries')
                    break
                if tplMatchingRateo < 0.1:
                    unmatchableTplCount += 1
                    break
            if tplFound:
                print('STEP 1 - Assigning screen ' + str(testImgName) + ' to ' + str(tplKey))
                tplValue["images"].append(testImgTuple)
                tplValue["flagChanged"] = True
                tplValue["tplSummary"], tplValue["tplCountArray"] = updateTemplateSummary(newReducedWindowtemplate,
                                                                                          tplValue["tplCountArray"],
                                                                                          tplElements)
                break
        if not tplFound and unmatchableTplCount == len(templateCollection.keys()):
            # If we found the image to be unmatchable with all currently known templates we create a new tpl for it
            print('STEP 1 - Unmatchable screen found, creating new template!')
            lastTplIndex += 1
            templateCollection["tpl" + str(lastTplIndex)] = {
                "images": [testImgTuple],
                "tplSummary": None,
                "tplCountArray": None,
                "flagChanged": False,
                "previousIterationLength": 0
            }
        elif not tplFound:
            step2ImgList.append(testImgTuple)

    return step2ImgList, lastTplIndex


def searchForTemplateSummaries(imgList, templateCollection):
    for tplKey, tplValue in templateCollection.items():
        # TODO create hashset to track images for which no template can be found
        if len(tplValue["images"]) == 1 and tplValue["flagChanged"]:
            print('CORRECTION - Attempting to build tplSummary for single image ' + tplKey)
            testImgTuple = tplValue["images"][0]
            # Getting a reduced version of testImage
            testImgReduced = getReducedWindow(testImgTuple[0], [26, 70], [0, 45], 96)
            comparisonsArrays = []

            for imgTuple in imgList:
                imgReduced = getReducedWindow(imgTuple[0], [26, 70], [0, 45], 96)
                comparison = performComparisons(testImgReduced, imgReduced)
                percentageOfChangedBlocks = round(np.count_nonzero(comparison) / 1980, 3)
                comparisonsArrays.append((percentageOfChangedBlocks, comparison, imgTuple))

            if len(comparisonsArrays) < 1:
                print('CORRECTION - Unable to provide a tplSummary to ' + str(tplKey))
                continue

            comparisonsArrays = sorted(comparisonsArrays, key=lambda triple: triple[0])
            selected = comparisonsArrays[0]

            if selected[0] < 0.8:
                imgTuple, reducedWindow = selected[2], selected[1]

                # Updating tplSummary for tpl
                print('CORRECTION - Assigning screen ' + str(imgTuple[1]) + ' to ' + str(tplKey))
                tplValue["images"].append(imgTuple)
                tplValue["tplSummary"], tplValue["tplCountArray"] = updateTemplateSummary(reducedWindow,
                                                                                          tplValue["tplCountArray"],
                                                                                          len(tplValue["images"]))
                tplValue["flagChanged"] = True

                # Filtering from image list the new assigned images
                imgList = [img for img in imgList if img[1] != imgTuple[1]]
            else:
                print('CORRECTION - Unable to provide a tplSummary to ' + str(
                    tplKey) + ' as the most similar img has ' + str(selected[0]) + ' of blocks changed')

    return imgList


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
    baseImg = (
        splitImage(baseImgTest, blockHeightPx, blockWidthPx), int(baseImgName.split('screenshots/')[1].split('.')[0]))
    imgList = [(splitImage(cv2.imread(imgFileName, cv2.IMREAD_UNCHANGED), blockHeightPx, blockWidthPx),
                int(imgFileName.split('screenshots/')[1].split('.')[0]))
               for imgFileName in fileList]

    templateCollection = {
        "tpl0": {
            "images": [baseImg],
            "tplSummary": None,
            "tplCountArray": None,
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
        # First we attempt to assign the image for similarity,
        # in this way bigger and thus more robust templates are computed
        startingLenght = len(imgList)
        imgList, lastTplIndex = performStep0Clustering(imgList, templateCollection, lastTplIndex)

        if len(imgList) == 0:
            break

        # As second step we attempt to assign images based on the previously computed
        # templateSummaries
        imgList, lastTplIndex = performStep1Clustering(imgList, templateCollection, lastTplIndex)

        if len(imgList) == 0:
            break

        # Now we want to make sure that all templates have a summary, this does not happen
        # in those cases in which our template has a single element after step0
        imgList = searchForTemplateSummaries(imgList, templateCollection)

        if len(imgList) == 0:
            break
        if len(imgList) != startingLenght:
            continue

        randomImgTuple = imgList.pop()
        lastTplIndex += 1
        templateCollection["tpl" + str(lastTplIndex)] = {
            "images": [randomImgTuple],
            "tplSummary": None,
            "tplCountArray": None,
            "flagChanged": False,
            "previousIterationLength": 0,
            "lastAddedIndex": 0
        }

    # Organizing and emitting results
    showClustersResults(templateCollection)
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

    end = time.time()
    print('++++ Execution completed at ' + str(end) + ' - elapsed time: ' + str(end - start))


# +++++ Script Entrypoint
main()
