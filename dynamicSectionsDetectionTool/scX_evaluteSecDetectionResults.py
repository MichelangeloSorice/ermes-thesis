# This script performs comparisons among captures, splitting each capture into basic blocks
# and subtracting corresponding block. The output is a file containing for each subBlock
# the count of non zero valued pixels found for each comparison

import json
import sys
from os import listdir
from os.path import join

import cv2
import numpy as np


def main():
    # The working directory which must contain an output folder folder
    workdir = sys.argv[1]
    # Could require evaluation for a specific configuration
    try:
        cfgName = sys.argv[2]
        print('Evaluating results for configuration: '+cfgName)
    except:
        print('Evaluating results for all configurations')
        cfgName = None

    with open(workdir + '/input/pageSummary.json', 'r') as f:
        optimalChangesMap = json.load(f)
        optimalChangesMap = optimalChangesMap['dynamicBlocksSummary']
        f.close()

    # Counting total amount of Positive and Negative values
    P, N = 0, 0
    for value in optimalChangesMap:
        if value is True:
            P += 1
        else:
            N += 1
    # Total population
    T = P + N

    resultsDir = join(workdir, 'output', 'results')
    if cfgName is None:
        cfgDirsList = listdir(resultsDir)
        perCfgResults = {}

        for cfgName in cfgDirsList:
            testedChangesMap = np.load(join(resultsDir, cfgName, cfgName+'_changesMap.npy')).tolist()[0]
            with open(join(resultsDir, cfgName, cfgName+'_info.json'), 'r') as f:
                infoData = json.load(f)
                timeElapsedAnalysis = infoData['execTimeCaptureAnalysis']
                timeElapsedDecision = infoData['execTimeDecision']

            # Counting down True Positives, False Positive, True Negative, False Negative
            # and total Predicted Positive and Negative
            countTP, countFP, countTN, countFN, countPP, countPN = 0, 0, 0, 0, 0, 0
            if len(testedChangesMap) != T:
                print('Huston we have got a problem!')

            for blockIndex in range(0, len(testedChangesMap)):
                if testedChangesMap[blockIndex] is True:
                    countPP += 1
                    if optimalChangesMap[blockIndex] is True:
                        countTP += 1
                    else:
                        countFP += 1
                else:
                    countPN += 1
                    if optimalChangesMap[blockIndex] is False:
                        countTN += 1
                    else:
                        countFN += 1

            perCfgResults[cfgName] = {
                "countTP": countTP,
                "countTN": countTN,
                "countFP": countFP,
                "countFN": countFN,
                "countPP": countPP,
                "countPN": countPN,
                "totalP": P,
                "totalN": N,
                "timeCaptureAnalysis": timeElapsedAnalysis,
                "timeDecision": timeElapsedDecision
            }

        with open(workdir + '/output/secDetection_perCfgResults.json', 'w+') as evaluationResultsFile:
            json.dump(perCfgResults, evaluationResultsFile, indent=2)


# +++++ Script Entrypoint
main()
