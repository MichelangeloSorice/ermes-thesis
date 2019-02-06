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

# Global Variables
blockHeightPx, blockWidthPx, blocksPerRow, blocksPerColumn = 0, 0, 0, 0,


def setBlockGlobalVariables(paramsList):
    global blockHeightPx, blockWidthPx, blocksPerRow, blocksPerColumn
    blockHeightPx, blockWidthPx, blocksPerRow, blocksPerColumn = paramsList.values()


def showImageAndLock(name, img, numRow=None, numCol=None):
    if numRow is None:
        numRow = blocksPerColumn
    if numCol is None:
        numCol = blocksPerRow
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


def computeVisualResult(isBlockDynamic, numRow=None, numCol=None):
    # Generating black and white blocks with correct shape
    blackBlock = np.zeros((blockHeightPx, blockWidthPx, 3), dtype=np.uint8)
    whiteBlock = np.ones((blockHeightPx, blockWidthPx, 3), dtype=np.uint8)
    whiteBlock[:, :, :] = 255

    if numRow is None:
        numRow = blocksPerColumn
    if numCol is None:
        numCol = blocksPerRow

    visualResultBlocksArray = []
    for decision in isBlockDynamic:
        if decision is True:
            visualResultBlocksArray.append(blackBlock)
        else:
            visualResultBlocksArray.append(whiteBlock)

    res = restoreImage(visualResultBlocksArray, numRow, numCol)
    cv2.imshow('fig', res)
    cv2.waitKey(0)
    return res


def getReducedWindow(comparisonsArray, width, height, maxWidth=None):
    reducedWindow = []
    if maxWidth is None:
        maxWidth = blocksPerRow
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
def performComparisons(imgArrayA, imgArrayB, blockHasChangedThreshold):
    if len(imgArrayA) != len(imgArrayB):
        print('Impossible to compare image blocks, input images of different sizes...')
        return -1

    # The threshold is the number of pixels per block * the percentage of the block that must change to
    # consider the whole block as changed
    threshold = (blockHeightPx * blockWidthPx) * blockHasChangedThreshold
    hasBlockChanged = []

    for index, blockFromA in enumerate(imgArrayA):
        absoluteDiff = np.absolute(blockFromA - imgArrayB[index])
        # The total count of non zero valued pixels over the 3 channels
        nonZeroCount = np.count_nonzero(absoluteDiff)
        if nonZeroCount > threshold:
            hasBlockChanged.append(True)
        else:
            hasBlockChanged.append(False)

    return hasBlockChanged


def searchPatterns(blockComparisons, patternParams, maxWidth=None):
    if maxWidth is None:
        maxWidth = blocksPerRow
    consecutiveSubPatternsThreshold, consecutiveStaticBlocksInSubPattern, consecutiveDynamicBlocksInSubPattern, \
    searchWindow = patternParams.values()
    # Searching for pattern
    patternCounter = 0
    windowXStart, windowXEnd, windowdYStart, windowYEnd = searchWindow.values()
    limit = maxWidth * (windowYEnd - windowdYStart)
    for x in range(windowXStart, windowXEnd):
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
        if state == 2 \
                and verticalCountStatic >= consecutiveStaticBlocksInSubPattern \
                and verticalCountDynamic > consecutiveDynamicBlocksInSubPattern:
            patternCounter += 1
            if patternCounter == consecutiveSubPatternsThreshold:
                return True
        else:
            patternCounter = 0

    return False


def showClustersResults(templateCollection, dumpFile=None, elapsedTime=None):
    for tplName in templateCollection.keys():
        print('Template ' + tplName)
        print(sorted([imgTuple[1] for imgTuple in templateCollection[tplName]["images"]]))

    if dumpFile is not None:
        jsonObj = {}
        for key, value in templateCollection.items():
            jsonObj[key] = sorted([tuple[1] for tuple in value["images"]])
        with open(dumpFile, 'w+') as f:
            res = {
                "tplCollection": jsonObj,
                "elapsedTime": elapsedTime
            }
            json.dump(res, f, indent=4)
            f.close()


def searchBannerPattern(comparison, maxWidth=None, maxHeight=None):
    if maxWidth is None:
        maxWidth = blocksPerRow
    if maxHeight is None:
        maxHeight = blocksPerColumn

    beginOfLastRow = maxWidth * (maxHeight - 1)
    possibleBannerHeight = 0
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


def preprocessing(imgList, blockHasChangedThreshold):
    listCopy = imgList.copy()
    votesDictionary = dict()
    comparisonsCount = 0
    while len(listCopy) > 1:
        testImg = (listCopy.pop())[0]
        print('PREPROC - There are ' + str(len(listCopy)) + ' screens remaining!')
        for img in listCopy:
            comparisonsCount += 1
            comparison = performComparisons(testImg, img[0], blockHasChangedThreshold)
            possibleBanner, possibleBannerHeight = searchBannerPattern(comparison)
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


def performClustering(imgList, templateCollection, lastTplIndex, clusteringThresholds, patternParams, test=False):
    nextIterationImgList = []
    # expanding thresholds parameters:
    blockHasChangedThreshold, \
    highLvl_minDistance, highLvl_maxDistance, \
    core_minDistance, core_maxDistance, core_window = clusteringThresholds.values()

    while len(imgList) >= 1:
        print('STEP 0 - There are ' + str(len(imgList)) + ' screens to be tested for this iteration')
        testImgTuple = imgList.pop()
        testImg, testImgName = testImgTuple[0], testImgTuple[1]
        tplFound = False

        if test:
            showImageAndLock('testImg', testImg)

        # Counts down how many tpls have been judged to be unmatchable with the tested img to decide wether
        # it is convinient or not to assign it to a new template
        unmatchableTplCount = 0

        # We test our image against all newly added elements of each template attempting to assign it
        for tplKey, tplValue in templateCollection.items():
            # If the tpl has not changed from last iteration there is no need to evalute it
            if not tplValue["flagChanged"]:
                continue

            tplConfidencePoints = 0
            for imgIndex in range(tplValue["lastAddedIndex"], len(tplValue["images"])):
                img = tplValue["images"][imgIndex][0]
                blockComparisonsResults = performComparisons(img, testImg, blockHasChangedThreshold)

                if test:
                    showImageAndLock('img', img)
                    computeVisualResult(blockComparisonsResults)

                distance = round(np.count_nonzero(blockComparisonsResults) / len(blockComparisonsResults), 3)

                if distance < highLvl_minDistance:
                    # Images are soo similar they must belong to the same template
                    tplFound = True
                    print('STEP 0 - Tpl found for high level similarity with ' + str(tplValue["images"][imgIndex][1]))
                    break
                if distance > highLvl_maxDistance:
                    # Images are too different to belong to same template
                    unmatchableTplCount += 1
                    break

                # core_window contains window horizontal and vertical start and end
                xStart, xEnd, yStart, yEnd = core_window.values()
                comparisonReduced = getReducedWindow(blockComparisonsResults, [xStart, xEnd], [yStart, yEnd])

                if test:
                    computeVisualResult(comparisonReduced, yEnd - yStart, xEnd - xStart)

                distanceForReducedWindow = round(np.count_nonzero(comparisonReduced) / len(comparisonReduced), 3)
                if distanceForReducedWindow < core_minDistance:
                    # Images are soo similar they must belong to the same template
                    tplFound = True
                    print('STEP 2 - Tpl found for similarity in core with ' + str(tplValue["images"][imgIndex][1]))
                    break
                if distanceForReducedWindow > core_maxDistance:
                    # Images are too different to belong to same template
                    unmatchableTplCount += 1
                    break

                tplPatternFound = searchPatterns(blockComparisonsResults, patternParams)
                if tplPatternFound:
                    tplConfidencePoints += 1
                    if tplConfidencePoints / len(tplValue["images"]) >= 0.5 or tplConfidencePoints > 6:
                        tplFound = True
                        print('STEP 3 - Tpl found for pattern with ' + str(tplValue["images"][imgIndex][1]))
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

    try:
        paramsFile = sys.argv[2]
        print('+++++ Using custom params file ' + sys.argv[2])
        cfgName = paramsFile.split('/')[-1].split('.json')[0]
    except:
        print('+++++ Using default parameters')
        paramsFile = './parametersFiles/default_clsfParams.json'
        cfgName = 'default'
    with open(paramsFile, 'r') as ParamsFile:
        parameters = json.load(ParamsFile)
        ParamsFile.close()

    # Setting up some global variable with blocks base information
    setBlockGlobalVariables(parameters["blockParams"])

    # Retrieving the list of paths to screenshot files in the input directory
    screenshotInputFolder = workdir + '/input/screenshots/'
    fileList = [join(screenshotInputFolder, f) for f in listdir(screenshotInputFolder) if
                isfile(join(screenshotInputFolder, f))]

    if len(fileList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    start = time.time()
    print('++++ Starting execution at ' + str(start))

    # Possible to use it to randomize examination order?
    # shuffle(fileList)

    baseImgName = fileList.pop()
    baseImgTest = cv2.imread(baseImgName, cv2.IMREAD_UNCHANGED)
    # Each img is stored as a tuple (splittedImg, imgName)
    baseImgTuple = (splitImage(baseImgTest, blockHeightPx, blockWidthPx),
                    int(baseImgName.split('screenshots/')[1].split('.')[0]))

    # Getting a splitted version of all images
    imgList = [(splitImage(cv2.imread(imgFileName, cv2.IMREAD_UNCHANGED), blockHeightPx, blockWidthPx),
                int(imgFileName.split('screenshots/')[1].split('.')[0])) for imgFileName in fileList]

    # use this if you need to get visualResult of comparisons on the fly
    #comparison = performComparisons(baseImgTuple[0], imgList[0][0], 0.4)
    #res = computeVisualResult(comparison)
    #cv2.imwrite(join(workdir, 'visualResult.jpg'), res)

    # Here is a mechanism to find out the presence of low level banners
    # Currently commented as too slow
    # TODO implement multithread solution for preprocessing
    # possibleBanner, supposedHeight = preprocessing(imgList, parameters["clusteringParameters"]["blockHasChangedThreshold"])

    templateCollection = {
        "tpl0": {
            "images": [baseImgTuple],
            # True if tpl has changed (new members added during last iteration)
            "flagChanged": False,
            "previousIterationLength": 0,
            # Keeps the index of the first addition of the previous iteration, used to identify
            # all new added members
            "lastAddedIndex": 0
        }
    }
    # Index of the most recently added tpl
    lastTplIndex = 0

    while len(imgList) > 0:
        # Updating changedFlag and lastAddedIndex for each tpl
        for tplValue in templateCollection.values():
            if len(tplValue["images"]) > tplValue["previousIterationLength"]:
                tplValue["flagChanged"] = True
                tplValue["lastAddedIndex"] = tplValue["previousIterationLength"]
                tplValue["previousIterationLength"] = len(tplValue["images"])
            else:
                tplValue["flagChanged"] = False

        # Show current classification
        showClustersResults(templateCollection)

        # Here we perform clustering operations
        startingLength = len(imgList)
        imgList, lastTplIndex = performClustering(imgList, templateCollection, lastTplIndex,
                                                  parameters["clusteringParams"], parameters["patternParams"])
        # Exit condition
        if len(imgList) == 0:
            break
        # In caso no image has been assigned to a teplate during the whole iteration we create a new tpl
        if len(imgList) != startingLength:
            continue
        else:
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

    end = time.time()
    showClustersResults(templateCollection, workdir + '/output/clsf2_'+cfgName+'_tplSummary.json', round(end - start,3))
    print('++++ Execution completed at ' + str(end) + ' - elapsed time: ' + str(round(end - start,3)))


# +++++ Script Entrypoint
main()
