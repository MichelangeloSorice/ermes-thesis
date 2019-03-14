# This script performs the actual classification about dynamic and static blocks
# The decision is taken applying the defined thresholds on the results of the capture analysis produced in sc0

import json
import sys
import time
from os import  mkdir
from os.path import join, exists
from shutil import  rmtree

import cv2
import numpy as np


# Global Variables
blockHeightPx, blockWidthPx, blocksPerRow, blocksPerColumn, nChannels = 0, 0, 0, 0, 3


def setBlockGlobalVariables(paramsList):
    global blockHeightPx, blockWidthPx, blocksPerRow, blocksPerColumn
    blockHeightPx, blockWidthPx, blocksPerRow, blocksPerColumn = paramsList.values()
    print('BlockWidthPx: ' + str(blockWidthPx) + ' - BlockHeightPx: ' + str(blockHeightPx))
    print('BlocksPerRow: ' + str(blocksPerRow) + ' - BlockPerColumn: ' + str(blocksPerColumn))


def countNN0OverThreshold(countNonZero, threshold):
    if countNonZero > threshold:
        return 1
    return 0


def evalPde(pde, threshold):
    if pde > threshold:
        return True
    return False


def computePerBlockDynamicEvaluations(captureData, thresholds, comparisonsCount):
    NN0, PDE = thresholds.values()
    evaluateBlockNn0Counts = np.vectorize(countNN0OverThreshold, otypes=[np.uint16])
    evaluateDynamicBlocks = np.vectorize(evalPde, otypes=[np.bool])

    # Array keeping the count for each blocks of how many times it has been evaluated dynamic
    perBlockTotalDynamicEvals = np.zeros((1, blocksPerColumn*blocksPerRow))
    # Computing nn0 as integer according to block dimensions
    nn0Threshold = (blockHeightPx*blockWidthPx*nChannels)*NN0
    # Splitting the raw analysis data into arrays corresponding to the NN= values of each comparison
    comparisonsResults = np.split(captureData, comparisonsCount)

    for comparison in comparisonsResults:
        # We get an array containing a 0 for each static evaluation and a 1 for each dynamic one
        blockEvaluations = evaluateBlockNn0Counts(comparison, nn0Threshold)
        np.add(perBlockTotalDynamicEvals, blockEvaluations, out=perBlockTotalDynamicEvals)

    # Getting the percentage of dynamic evaluations for each block
    perBlockPde = np.true_divide(perBlockTotalDynamicEvals, comparisonsCount)
    # Get an array of boolean with each dynamic block set to true
    isBlockDynamic = evaluateDynamicBlocks(perBlockPde, PDE)

    return isBlockDynamic


def computeVisualResult(isBlockDynamic,  filePath):
    # Generating black and white blocks with correct shape
    blackBlock = np.zeros((blockHeightPx, blockWidthPx, nChannels), dtype=np.uint8)
    whiteBlock = np.ones((blockHeightPx, blockWidthPx, nChannels), dtype=np.uint8)
    whiteBlock[:, :, :] = 255

    visualResultBlocksArray = []
    for decision in isBlockDynamic:
        if decision is True:
            visualResultBlocksArray.append(blackBlock)
        else:
            visualResultBlocksArray.append(whiteBlock)

    res = restoreImage(visualResultBlocksArray, blocksPerColumn, blocksPerRow)
    cv2.imwrite(filePath, res)
    return res


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
    # Input: <workdir> <configFilePath>
    # as produced by script sc0
    workdir = sys.argv[1]

    try:
        # Optional configuration overriding default one
        paramsFile = sys.argv[2]
        print('+++++ Using custom configuration ' + sys.argv[2])
        cfgName = paramsFile.split('/')[-1].split('.json')[0]
    except:
        print('+++++ Using default configuration')
        paramsFile = './parametersFiles/default_sectionDetectionParams.json'
        cfgName = 'default'
    with open(paramsFile, 'r') as ParamsFile:
        sectionDetectionParams = json.load(ParamsFile)
        ParamsFile.close()

    blockConfigName = sectionDetectionParams['blockConfig']
    analysisDataDir = join(workdir, 'input', 'captureAnalysis', blockConfigName)

    with open(join(analysisDataDir,'analysisData.json'), 'r+') as captureAnalysisInfoFile:
        captureAnalysisMetaInfo = json.load(captureAnalysisInfoFile)
        captureAnalysisInfoFile.close()

    start = time.time()
    print('++++ Starting execution at ' + str(start))

    # Retrieving block params of the adopted block configuration
    setBlockGlobalVariables(captureAnalysisMetaInfo['blockParams'])

    captureData = np.load(join(analysisDataDir, 'resData.npy'))
    isBlockDynamic = computePerBlockDynamicEvaluations(captureData, sectionDetectionParams['THRESHOLDS'], captureAnalysisMetaInfo['comparisonsCount'])

    end = time.time()
    print('++++ Execution completed at ' + str(end) + ' - elapsed time: ' + str(round(end - start, 3)))

    # Setting up the directory keeping the results of this specific analysis
    resultsDir = join(workdir, 'output', 'results')
    if not exists(resultsDir):
        mkdir(resultsDir)
    print(resultsDir)
    resultSpecificDir = join(resultsDir, cfgName)
    if exists(resultSpecificDir):
        rmtree(resultSpecificDir)
    print(resultSpecificDir)
    mkdir(resultSpecificDir)

    with open(join(resultSpecificDir, cfgName+'_info.json'), 'w+') as resultFile:
        finalResult = {
            'blockConfig': blockConfigName,
            'thConfig': cfgName,
            'execTimeCaptureAnalysis': captureAnalysisMetaInfo['executionTime'],
            'execTimeDecision': round(end - start, 3),
        }
        json.dump(finalResult, resultFile, indent=2)
        resultFile.close()

    np.save(join(resultSpecificDir, cfgName+'_changesMap'), isBlockDynamic)
    # Compute and store a visual representation of the result showing dynamic area as Black blocks on a blank img
    res = computeVisualResult((isBlockDynamic.tolist())[0],  join(resultSpecificDir, cfgName+'_visualResult.png'))

    cv2.namedWindow('image', cv2.WINDOW_NORMAL)
    cv2.imshow('image', res)
    cv2.waitKey(5000)
    cv2.destroyAllWindows()


main()
