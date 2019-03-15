# This script performs comparisons among captures, splitting each capture into basic blocks
# and subtracting corresponding block. The output is a file containing for each subBlock
# the count of non zero valued pixels found for each comparison

import json
import sys
from os import listdir
from os.path import join
from shutil import copy, rmtree

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
        for testTplName, testTpl in tested["tplCollection"].items():
            tplScore = sum(1 for elem in baseTpl if elem in testTpl)
            if bestScore[0] < tplScore:
                bestScore = (tplScore, testTpl, testTplName)

        correctlyClassifiedImgs += bestScore[0]
        if bestScore[0] == len(baseTpl):
            correctlyClassifiedTpl += 1
        if bestScore[1] is None:
            matcher = 'No matcher found'
        else:
            matcher = bestScore[1]

        result[baseTplName] = {
            'optimalTpl': baseTpl,
            'bestMatcher': matcher,
            'matchScore': round(bestScore[0] / len(baseTpl), 3)
        }
        # Deleting the entry associated to the best matcher
        if not bestScore[2] is None:
            del tested["tplCollection"][bestScore[2]]

    result['overallComparison'] = {
        'correctlyClassifiedImgs': round(correctlyClassifiedImgs / totalImgs, 3),
        'correctlyClassifiedTpls': round(correctlyClassifiedTpl / len(base.keys()), 3),
        'elapsedTime': tested["elapsedTime"]
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
        with open(workdir + '/input/optimalClassification.json', 'r') as f:
            optimalClusters = json.load(f)
            f.close()

        clsfResFolder = workdir + '/output/layoutDetectionRes/'
        perAlgtorithmResult = {}
        for fileName in listdir(clsfResFolder):
            if fileName.startswith('cfg') and fileName.endswith('tplSummary.json'):
                with open(join(clsfResFolder, fileName), 'r') as resFile:
                    cfgName = fileName.split('_')[0]
                    perAlgtorithmResult[cfgName] = json.load(resFile)
                    resFile.close()

        evaluationResults = {}
        with open(workdir + '/output/clsf_algorithmEvaluation.json', 'w+') as evaluationResultsFile:
            for cfgName, res in perAlgtorithmResult.items():
                evaluationResults[cfgName] = compareSummaries(optimalClusters, res)
                print(evaluationResults)
            json.dump(evaluationResults, evaluationResultsFile, indent=2)

        # Cleanup
        rmtree



# +++++ Script Entrypoint
main()
