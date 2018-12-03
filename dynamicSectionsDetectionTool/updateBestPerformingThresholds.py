import json
import sys
from os.path import exists

import numpy as np


def initBestThresholdsValues():
    maxInitializer = {
        'value': 0,
        'PDE': [],
        'NN0': []
    }
    minInitializer = {
        'value': 1,
        'PDE': [],
        'NN0': []
    }
    maxArrInitializer = [maxInitializer for x in range(0, 5)]
    minArrInitializer = [minInitializer for x in range(0, 5)]

    bestTprValues, bestPrecisionValues, bestAccuracyValues = maxArrInitializer.copy(), maxArrInitializer.copy(), maxArrInitializer.copy()
    bestFprValues, bestFdrValues = minArrInitializer.copy(), minArrInitializer.copy()

    bestPerMetricResult = {
        'TPR': bestTprValues,
        'FPR': bestFprValues,
        'FDR': bestFdrValues,
        'PRECISION': bestPrecisionValues,
        'ACCURACY': bestAccuracyValues
    }

    return bestPerMetricResult


# we are going to store the 10 best performing combinations for each metric
def updateBestThresholds(results, oldBestThresholds):
    bestTprValues, bestPrecisionValues, bestAccuracyValues = oldBestThresholds['TPR'], oldBestThresholds['PRECISION'], \
                                                             oldBestThresholds['ACCURACY']
    bestFprValues, bestFdrValues = oldBestThresholds['FPR'], oldBestThresholds['FDR']

    for result in results:
        pde, nn0Values = result['PDE'], result['NN0']
        tprValues, fprValues, fdrValues = np.array([result['TPR'], result['FPR'], result['FDR']])
        precisionValues, accuracyValues = np.array([result['PRECISION'], result['ACCURACY']])

        indxTpr = np.argmax(tprValues)
        localTprMax = tprValues[indxTpr]
        bestTprValues = updateBest(bestTprValues, localTprMax, pde, nn0Values[indxTpr], True)

        indxFpr = np.argmin(fprValues)
        localFprMin = fprValues[indxFpr]
        bestFprValues = updateBest(bestFprValues, localFprMin, pde, nn0Values[indxFpr], False)

        indxFdr = np.argmin(fdrValues)
        localFdrMin = fdrValues[indxFdr]
        bestFdrValues = updateBest(bestFdrValues, localFdrMin, pde, nn0Values[indxFdr], False)

        indxPrecision = np.argmax(precisionValues)
        localPrecisionMax = precisionValues[indxPrecision]
        bestPrecisionValues = updateBest(bestPrecisionValues, localPrecisionMax, pde, nn0Values[indxPrecision], True)

        indxAccuracy = np.argmax(accuracyValues)
        localAccuracyMax = accuracyValues[indxAccuracy]
        bestAccuracyValues = updateBest(bestAccuracyValues, localAccuracyMax, pde, nn0Values[indxAccuracy], True)

    bestPerMetricResult = {
        'TPR': bestTprValues,
        'FPR': bestFprValues,
        'FDR': bestFdrValues,
        'PRECISION': bestPrecisionValues,
        'ACCURACY': bestAccuracyValues
    }
    return bestPerMetricResult


def updateBest(bestValues, value, pde, nn0, maximize):
    for index, currentBest in enumerate(bestValues):
        if currentBest['value'] < value and maximize:
            bestValues[index] = {'value': value, 'PDE': [pde], 'NN0': [nn0]}
            break
        elif currentBest['value'] > value and not maximize:
            bestValues[index] = {'value': value, 'PDE': [pde], 'NN0': [nn0]}
            break
        elif currentBest['value'] == value:
            currentBest['PDE'].append(pde)
            currentBest['NN0'].append(nn0)
            bestValues[index] = currentBest
            break
    return bestValues


def main():
    workdir = sys.argv[1]
    configurationIndex = int(sys.argv[2])

    # Loading classification metrics results associated with the test configuration
    classificationMetricsResultsFile = workdir + '/output/classificationTestData_cfg' + str(
        configurationIndex) + '.json'
    if not exists(classificationMetricsResultsFile):
        print('There is no result file associated with the provided test configuration...')
        return 1
    with open(workdir + '/output/classificationTestData_cfg' + str(configurationIndex) + '.json', 'r') as testResults:
        testResults = json.load(testResults)

    # Loading or initializing data of best threshold combionations per metric
    bestPerformingThresholdsFileName = workdir + '/output/bestPerformingThresholds.json'
    if not exists(bestPerformingThresholdsFileName):
        oldBestValues = initBestThresholdsValues()
    else:
        with open(bestPerformingThresholdsFileName, 'r') as bestThresholdsFile:
            oldBestValues = json.load(bestThresholdsFile)

    # Compute and store on a file the best performing combinations of thresholds
    newBestValues = updateBestThresholds(testResults, oldBestValues)
    with open(bestPerformingThresholdsFileName, 'w+') as bestThresholdsFile:
        json.dump(newBestValues, bestThresholdsFile, indent=2)


# +++++ Script Entrypoint
main()
