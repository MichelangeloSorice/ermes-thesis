import json
import shutil
import sys
from os import makedirs
from os.path import exists

import matplotlib.pyplot as pyplot


def plotData(outfolder, curves):
    legend = []
    for curve in curves:
        legend.append('PDE = ' + str(curve['PDE']))

    print('Plotting accuracy when varying NN0 with different PDEs...')
    pyplot.ylabel('Accuracy')
    pyplot.xlabel('NN0 threshold values')
    for curve in curves:
        pyplot.plot(curve['NN0'], curve['ACCURACY'])

    pyplot.legend(legend, loc='best')
    pyplot.savefig(outfolder + 'accuracy.png')
    pyplot.clf()

    print('Plotting precision when varying NN0 with different PDEs...')
    pyplot.ylabel('Precision')
    pyplot.xlabel('NN0 threshold values')
    for curve in curves:
        pyplot.plot(curve['NN0'], curve['PRECISION'])

    pyplot.legend(legend, loc='best')
    pyplot.savefig(outfolder + 'precision.png')
    pyplot.clf()

    print('Plotting false discovery rate when varying NN0 with different PDEs...')
    pyplot.ylabel('FDR')
    pyplot.xlabel('NN0 threshold values')
    for curve in curves:
        pyplot.plot(curve['NN0'], curve['FDR'])

    pyplot.legend(legend, loc='best')
    pyplot.savefig(outfolder + 'falseDiscoveryRate.png')
    pyplot.clf()

    print('Plotting recall when varying NN0 with different PDEs...')
    pyplot.ylabel('Recall')
    pyplot.xlabel('NN0 threshold values')
    for curve in curves:
        pyplot.plot(curve['NN0'], curve['TPR'])

    pyplot.legend(legend, loc='best')
    pyplot.savefig(outfolder + 'recall.png')
    pyplot.clf()

    print('Plotting roc curves when varying NN0 with different PDEs...')
    pyplot.ylabel('TPR')
    pyplot.xlabel('FPR')
    for curve in curves:
        pyplot.plot(curve['FPR'], curve['TPR'])

    pyplot.legend(legend, loc='best')
    pyplot.savefig(outfolder + 'roc.png')
    pyplot.clf()

    return


def main():
    workdir = sys.argv[1]
    configurationIndex = int(sys.argv[2])

    # Loading results of dynamic section analysis and pageConfiguration data (truth)
    with open(workdir + '/input/thresholdTestData_config_' + str(configurationIndex) + '.json') as rocDataFile:
        rocCurves = json.load(rocDataFile)
    with open(workdir + '/input/pageSummary.json') as inputFile:
        pageConfiguration = json.load(inputFile)
        dynamicBlocksSummary = pageConfiguration['dynamicBlocksSummary']

    # Counting total amount of Positive and Negative values
    P, N = 0, 0
    for value in dynamicBlocksSummary:
        if value is True:
            P += 1
        else:
            N += 1
    # Total population
    T = P + N

    curves = []
    for curve in rocCurves:
        pde = curve['PDE']
        testData = curve['rocCurveData']
        nn0_values, tpr_values, fpr_values, precision, accuracy, fdr = [], [], [], [], [], []

        for test in testData:
            test_dynamicBlocksSummary = test['isDynamicArray']
            # Counting down True Positives, False Positive, True Negative and total Predicted Positive
            countTP, countFP, countTN, countPP = 0, 0, 0, 0

            if len(test_dynamicBlocksSummary) != N + P:
                print('Huston we have got a problem!')

            for blockIndex in range(0, len(test_dynamicBlocksSummary)):
                if test_dynamicBlocksSummary[blockIndex] is True:
                    countPP += 1
                    if dynamicBlocksSummary[blockIndex] is True:
                        countTP += 1
                    else:
                        countFP += 1
                else:
                    if dynamicBlocksSummary[blockIndex] is False:
                        countTN += 1

            nn0_values.append(test['NN0'])
            tpr_values.append(countTP / P)
            fpr_values.append(countFP / N)
            precision.append(countTP / countPP)
            fdr.append(countFP / countPP)
            accuracy.append((countTP + countTN) / T)

        curves.append({
            "PDE": pde,
            "NN0": nn0_values,
            "TPR": tpr_values,
            "FPR": fpr_values,
            "FDR": fdr,
            "PRECISION": precision,
            "ACCURACY": accuracy
        })

    plotOutFolder = workdir + '/output/classification_metrics/'
    if not exists(plotOutFolder):
        makedirs(plotOutFolder)
    else:
        shutil.rmtree(plotOutFolder)
        makedirs(plotOutFolder)
    plotData(plotOutFolder, curves)

    with open(workdir + '/output/classificationTestData.json', 'w+') as outfile:
        json.dump(curves, outfile, indent=None)


# +++++ Script Entrypoint
main()
