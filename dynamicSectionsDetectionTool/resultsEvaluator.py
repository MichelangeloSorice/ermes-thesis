import json
import shutil
import sys
from os import makedirs
from os.path import exists

import numpy as np
from matplotlib import pyplot


def evaluateResults(results, configurationData, nn0BinStep, pdeBinStep):
    perBlockResult = results['perBlockResult']
    dynamicBlockSummary = configurationData['dynamicBlocksSummary']

    # Initializing indicators for PDE
    # The number of non zero valued pixels is equal to nPixelsPerBlock*nChannels
    nn0Range = configurationData['baseBlockHeight'] * configurationData['baseBlockWidth'] * 3
    # NN0 values for dynamic, static and all blocks
    nonZeroCountsForDynamicBlocks = []
    nonZeroCountsForStaticBlocks = []
    overallNonZeroCounts = []
    # Array of objects representing our bins, counting number of dynamic and static blocks in it
    nn0Bins = []
    for x in range(0, nn0Range + nn0BinStep, nn0BinStep):
        superiorEdge = min(x + nn0BinStep, nn0Range)
        nn0Bins.append({
            "range": [x, superiorEdge],
            "totalBlocks": 0,
            "staticBlocks": 0,
            "dynamicBlocks": 0
        })

    # Initializing indicators for PDE
    # PDE is a percentage thus its range is always [0, 100]
    pdeRange = 100
    # PDE values for dynamic, static and all blocks
    pdeForDynamicBlocks = []
    pdeForStaticBlocks = []
    overallPde = []
    # Array of objects representing our bins, counting number of dynamic and static blocks in it
    pdeBins = []
    for x in range(0, pdeRange + pdeBinStep, pdeBinStep):
        superiorEdge = min(x + pdeBinStep, pdeRange)
        pdeBins.append({
            "range": [x, superiorEdge],
            "totalBlocks": 0,
            "staticBlocks": 0,
            "dynamicBlocks": 0
        })

    # Use computations results and the TRUTH map of dynamic blocks derived by the page generator
    # to compute the declared indicators
    for index, blockResult in enumerate(perBlockResult):
        isBlockDynamic = dynamicBlockSummary[index]
        overallNonZeroCounts.extend(blockResult['nonZeroCounts'])
        if isBlockDynamic:
            nonZeroCountsForDynamicBlocks.extend(blockResult['nonZeroCounts'])
        else:
            nonZeroCountsForStaticBlocks.extend(blockResult['nonZeroCounts'])

        for countNonZero in blockResult['nonZeroCounts']:
            nn0BinIndex = countNonZero // nn0BinStep
            nn0Bins[nn0BinIndex]['totalBlocks'] += 1
            if isBlockDynamic:
                nn0Bins[nn0BinIndex]['dynamicBlocks'] += 1
            else:
                nn0Bins[nn0BinIndex]['staticBlocks'] += 1

        blockPde = 100 * (blockResult['timesEvaluatedDynamic'] / blockResult['evaluations'])
        pdeBinIndex = int(blockPde // pdeBinStep)

        overallPde.append(blockPde)
        pdeBins[pdeBinIndex]['totalBlocks'] += 1

        if isBlockDynamic:
            pdeForDynamicBlocks.append(blockPde)
            pdeBins[pdeBinIndex]['dynamicBlocks'] += 1
        else:
            pdeForStaticBlocks.append(blockPde)
            pdeBins[pdeBinIndex]['staticBlocks'] += 1

    probabilityDistributionData = {
        "nn0": nn0Bins,
        "nn0Counts": {
            "overall": overallNonZeroCounts,
            "dynamic": nonZeroCountsForDynamicBlocks,
            "static": nonZeroCountsForStaticBlocks
        },
        "pde": pdeBins,
        "pdeValues": {
            "overall": overallPde,
            "dynamic": pdeForDynamicBlocks,
            "static": pdeForStaticBlocks
        },
    }

    return probabilityDistributionData


def plotData(outFolder, data):
    nn0Bins, pdeBins = data['nn0'], data['pde']
    overallNn0Values, overallPdeValues = np.array([data['nn0Counts']['overall'], data['pdeValues']['overall']])
    staticBlocksNn0Values, staticBlocksPdeValues = np.array([data['nn0Counts']['static'], data['pdeValues']['static']])
    dynamicBlocksNn0Values, dynamicBlocksPdeValues = np.array(
        [data['nn0Counts']['dynamic'], data['pdeValues']['dynamic']])

    # Plotting probability or a block to be dynamic given a certain value of NN0
    # nn0X = range(0, len(nn0Bins))
    # nn0Y = []
    # for block in nn0Bins:
    #     if block['totalBlocks'] is not 0:
    #         nn0Y.append(block['dynamicBlocks'] / block['totalBlocks'])
    #     else:
    #         nn0Y.append(0)
    #
    #
    # fnn0 = scyinterp.interp1d(nn0X, nn0Y, kind='cubic')
    # pyplot.plot(nn0X, fnn0(nn0X), '-')
    # pyplot.legend(['nn0'], loc='best')
    # pyplot.savefig(outFolder + 'dynamicProbForNn0Values.png')
    #
    # # Plotting probability for a block to be dynamic given a certain value of PDE
    # pdeX = range(0, len(pdeBins))
    # pdeY = []
    # for block in pdeBins:
    #     if block['totalBlocks'] is not 0:
    #         pdeY.append(block['dynamicBlocks'] / block['totalBlocks'])
    #     else:
    #         pdeY.append(0)
    #
    # fpde = scyinterp.interp1d(pdeX, pdeY, kind='cubic')
    # pyplot.plot(pdeX, fpde(pdeX), '-')
    # pyplot.legend(['nn0'], loc='best')
    # pyplot.savefig(outFolder + 'dynamicProbForPdeValues.png')


    # Plotting histograms of binned NN0 values distributions for dynamic and static blocks
    n, bins, patches = pyplot.hist(dynamicBlocksNn0Values, density=True, cumulative=True, histtype='step')
    pyplot.savefig(outFolder + 'cdf_NN0_dynamicBlocks.png')
    pyplot.clf()

    pyplot.hist(staticBlocksNn0Values, density=True, cumulative=True, histtype='step')
    pyplot.savefig(outFolder + 'cdf_NN0_staticBlocks.png')
    pyplot.clf()

    pyplot.hist(overallNn0Values, density=True, cumulative=True, histtype='step')
    pyplot.savefig(outFolder + 'cdf_NN0_allBlocks.png')
    pyplot.clf()

    pyplot.hist(np.array([overallNn0Values, staticBlocksNn0Values, dynamicBlocksNn0Values]), bins=50,
                color=['red', 'blue', 'green'], )
    pyplot.legend(['All blocks', 'Static', 'Dynamic'], loc=1)
    pyplot.savefig(outFolder + 'hist_NN0_summaryNotNormalized.png')
    pyplot.clf()

    # Plotting histograms of PDE values distributions for dynamic and static blocks
    pyplot.hist(dynamicBlocksPdeValues, density=True, cumulative=True, histtype='step')
    pyplot.savefig(outFolder + 'cdf_PDE_dynamicBlocks.png')
    pyplot.clf()

    pyplot.hist(staticBlocksPdeValues, density=True, cumulative=True, histtype='step')
    pyplot.savefig(outFolder + 'cdf_PDE_staticBlocks.png')
    pyplot.clf()

    pyplot.hist(overallPdeValues, density=True, cumulative=True, histtype='step')
    pyplot.savefig(outFolder + 'cdf_PDE_allBlocks.png')
    pyplot.clf()

    pyplot.hist(np.array([overallPdeValues, staticBlocksPdeValues, dynamicBlocksPdeValues]),
                color=['red', 'blue', 'green'], )
    pyplot.legend(['All blocks', 'Static', 'Dynamic'], loc=1)
    pyplot.savefig(outFolder + 'hist_PDE_summaryNotNormalized.png')
    pyplot.clf()

    # Plotting probability density function
    # # test values for the bw_method option ('None' is the default value)
    # bw_values = [None,  0.1]
    #
    # # generate a list of kde estimators for each bw
    # kde = [scipyStats.kde.gaussian_kde(dynamicBlocksNn0Values, bw_method=bw) for bw in bw_values]
    #
    # # plot density estimates
    # t_range = np.linspace(0, 300, 200)
    # for i, bw in enumerate(bw_values):
    #     pyplot.plot(t_range, kde[i].evaluate(t_range), label='bw = 0.2')
    #
    # pyplot.clf()

    # fastplot.plot((nn0X, nn0Y), outFolder + 'nn0Plot.png', xlabel='bins', ylabel='DynamicBlockProbability')
    # fastplot.plot((pdeX, pdeY), outFolder + 'pdePlot.png', xlabel='bins', ylabel='DynamicBlockProbability')

    return


def main():
    workdir = sys.argv[1]

    # Loading results of dynamic section analisys and pageConfiguration data (truth)
    with open(workdir + '/input/sectionDetectionResults.json') as inputFile:
        perBlockResults = json.load(inputFile)
    with open(workdir + '/input/configuration.json') as inputFile:
        pageConfiguration = json.load(inputFile)

    distributionData = evaluateResults(perBlockResults, pageConfiguration, 3, 1)

    plotOutFolder = workdir + '/output/plots/'
    if not exists(plotOutFolder):
        makedirs(plotOutFolder)
    else:
        shutil.rmtree(plotOutFolder)
        makedirs(plotOutFolder)
    plotData(plotOutFolder, distributionData)

    with open(workdir + '/output/probabilityDistributionData.json', 'a+') as outfile:
        json.dump(distributionData, outfile, indent=2)


# +++++ Script Entrypoint
main()
