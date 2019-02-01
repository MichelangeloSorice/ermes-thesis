# This script performs comparisons among captures, splitting each capture into basic blocks
# and subtracting corresponding block. The output is a file containing for each subBlock
# the count of non zero valued pixels found for each comparison

import json
import sys
from os import listdir
from os.path import join

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


def showClustersResults(templateCollection, dumpFile=None):
    for tplName in templateCollection.keys():
        print('Template ' + tplName)
        print(sorted([imgName for imgName in templateCollection[tplName]["imgNames"]]))

    if not dumpFile is None:
        jsonObj = {}
        for key, value in templateCollection.items():
            jsonObj[key] = sorted([imgName for imgName in value["imgNames"]])
        with open(dumpFile, 'w+') as f:
            json.dump(jsonObj, f, indent=4)
            f.close()


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


def compareSummaries(base, tested):
    result = {}
    correctlyClassifiedImgs = 0
    totalImgs = 0
    correctlyClassifiedTpl = 0

    for baseTplName, baseTpl in base.items():
        totalImgs += len(baseTpl)
        bestScore = (0, None, None)
        for testTplName, testTpl in tested.items():
            tplScore = sum(1 for elem in baseTpl if elem in testTpl)
            if bestScore[0] < tplScore:
                bestScore = (tplScore, testTpl, testTplName)

        correctlyClassifiedImgs += bestScore[0]
        if bestScore[0] == len(baseTpl):
            correctlyClassifiedTpl += 1

        result[baseTplName] = {
            'optimalTpl': baseTpl,
            'bestMatcher': bestScore[1],
            'matchScore': round(bestScore[0] / len(baseTpl), 3)
        }
        # Deleting the entry associated to the best matcher
        del tested[bestScore[2]]

    result['overallComparison'] = {
        'correctlyClassifiedImgs': round(correctlyClassifiedImgs / totalImgs, 3),
        'correctlyClassifiedTpls': round(correctlyClassifiedTpl / len(base.keys()), 3)
    }

    return result


def main():
    # The working directory which must containt an input folder
    workdir = sys.argv[1]
    # keyWord indicating which comparison we should made
    # optimal - compare all clsf<x>_tplSummary.json with the optimal classification
    # compare - compare results of two algorithms
    mode = sys.argv[2]

    if mode == 'optimal':
        print('Here we go')
        with open(workdir + '/input/optimalClassification.json', 'r') as f:
            optimalClusters = json.load(f)
            f.close()

        clsfResFolder = workdir + '/output/'
        perAlgtorithmResult = {}
        for fileName in listdir(clsfResFolder):
            if fileName.startswith('clsf') and fileName.endswith('tplSummary.json'):
                with open(join(clsfResFolder, fileName), 'r') as resFile:
                    algName = fileName.split('_')[0]
                    perAlgtorithmResult[algName] = json.load(resFile)
                    resFile.close()

        evaluationResults = {}
        with open(workdir + '/output/clsf_algorithmEvaluation.json', 'w+') as evaluationResultsFile:
            for algName, res in perAlgtorithmResult.items():
                evaluationResults[algName] = compareSummaries(optimalClusters, res)
                print(evaluationResults)
            json.dump(evaluationResults, evaluationResultsFile, indent=2)

    if mode is 'compare':
        res1, res2 = sys.argv[3], sys.argv[4]


# +++++ Script Entrypoint
main()
