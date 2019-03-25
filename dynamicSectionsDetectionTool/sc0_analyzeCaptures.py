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

# Global Variables
blockHeightPx, blockWidthPx, blocksPerRow, blocksPerColumn = 0, 0, 0, 0,


def setBlockGlobalVariables(paramsList):
    global blockHeightPx, blockWidthPx, blocksPerRow, blocksPerColumn
    blockHeightPx, blockWidthPx, blocksPerRow, blocksPerColumn = paramsList.values()
    print('BlockWidthPx: ' + str(blockWidthPx) + ' - BlockHeightPx: ' + str(blockHeightPx))
    print('BlocksPerRow: ' + str(blocksPerRow) + ' - BlockPerColumn: ' + str(blocksPerColumn))


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


def performComparisons(listImgSplitted, workdir):
    tmpResult = []
    comparisonsCount = 0
    while len(listImgSplitted) > 1:
        # We will compare the remaining captures with this one
        baseImgSplitted = listImgSplitted.pop()
        print('There are ' + str(len(listImgSplitted)) + ' iterations remaining!')

        for imgSplitted in listImgSplitted:
            # Result of the comparison of two captures, is an array of nn0 values
            comparisonResult = subtractBlocksAndCountZeros(baseImgSplitted, imgSplitted)
            tmpResult.append(comparisonResult)
            comparisonsCount += 1

    resNdArray = np.asarray(tmpResult, np.uint16)
    np.save(join(workdir, 'resData'), resNdArray)
    return comparisonsCount


def main():
    # The only required input is the working directory which must containt an input
    # folder with a screenshots subdirectory
    workdir = sys.argv[1]

    try:
        # Optional configuration overriding default one
        paramsFile = sys.argv[2]
        print('+++++ Using custom block params file ' + sys.argv[2])
        cfgName = paramsFile.split('/')[-1].split('.json')[0]
    except:
        print('+++++ Using default block parameters')
        paramsFile = './parametersFiles/default_sectionDetectionBlocks.json'
        cfgName = 'default'
    with open(paramsFile, 'r') as ParamsFile:
        sectionDetectionParams = json.load(ParamsFile)
        ParamsFile.close()

    setBlockGlobalVariables(sectionDetectionParams['blockParams'])
    limitCaptures = sectionDetectionParams['limitCaptures']

    # Retrieving the list of paths to screenshot files in the input directory
    screenshotInputFolder = workdir + '/input/screenshots/'
    fileList = [join(screenshotInputFolder, f) for f in listdir(screenshotInputFolder) if
                isfile(join(screenshotInputFolder, f))]
    if limitCaptures != 0:
        fileList = fileList[0:limitCaptures]

    if len(fileList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    start = time.time()
    print('++++ Starting execution at ' + str(start))

    # Getting a splitted version of all images
    splittedImgList = [splitImage(cv2.imread(imgFileName, cv2.IMREAD_UNCHANGED), blockHeightPx, blockWidthPx)
                       for imgFileName in fileList]


    # Setting up the directory keeping the results of this specific analysis
    captureAnalysisDir = join(workdir, 'input', 'captureAnalysis')
    if not exists(captureAnalysisDir):
        mkdir(captureAnalysisDir)
    cfgSpecificDir = join(captureAnalysisDir, cfgName)
    if exists(cfgSpecificDir):
        rmtree(cfgSpecificDir)
    mkdir(cfgSpecificDir)

    # Number of comparisons data included in each file
    comparisonsCount = performComparisons(splittedImgList, cfgSpecificDir)

    end = time.time()
    print('++++ Execution completed at ' + str(end) + ' - elapsed time: ' + str(round(end - start, 3)))

    # Setting up some basic info about the analysis
    analysisData = {
        'blockParams': sectionDetectionParams['blockParams'],
        'comparisonsCount': comparisonsCount,
        'executionTime': round(end - start, 3),
        'blockConfig': cfgName
    }
    with open(join(cfgSpecificDir, 'analysisData.json'), 'w+') as f:
        json.dump(analysisData, f, indent=2)
        f.close()


# +++++ Script Entrypoint
main()
