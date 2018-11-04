import json
import sys

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
        overallNonZeroCounts.append(blockResult['nonZeroCounts'])
        if isBlockDynamic:
            nonZeroCountsForDynamicBlocks.append(blockResult['nonZeroCounts'])
        else:
            nonZeroCountsForStaticBlocks.append(blockResult['nonZeroCounts'])

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
    overallNn0Values, overallPdeValues = data['nn0Counts']['overall'], data['pdeValues']['overall']
    staticBlocksNn0Values, staticBlocksPdeValues = data['nn0Counts']['static'], data['pdeValues']['static']
    dynamicBlocksNn0Values, dynamicBlocksPdeValues = data['nn0Counts']['dynamic'], data['pdeValues']['dynamic']

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

    print('Here we go')
    print(np.array(staticBlocksNn0Values))
    # Plotting histograms of dynamic and static blocks distributions among NN0 values bins
    pyplot.hist(np.array(dynamicBlocksNn0Values), bins=100, density=True)
    pyplot.savefig(outFolder + 'pdfStaticNN0.png')

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
    plotData(workdir + '/output/plot', distributionData)

    with open(workdir + '/output/probabilityDistributionData.json', 'a+') as outfile:
        json.dump(distributionData, outfile, indent=2)


# +++++ Script Entrypoint
main()
