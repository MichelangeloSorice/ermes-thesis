import json
import shutil
import sys
from os import makedirs
from os.path import exists

import fastplot
import numpy as np


def evaluateResults(results, configurationData):
    perBlockResult = results['perBlockResult']
    dynamicBlockSummary = configurationData['dynamicBlocksSummary']

    # NN0 values for dynamic, static and all blocks
    nonZeroCountsForDynamicBlocks, nonZeroCountsForStaticBlocks, overallNonZeroCounts = [], [], []
    # PDE values for dynamic, static and all blocks
    pdeForDynamicBlocks, pdeForStaticBlocks, overallPde = [], [], []

    # Use computations results and the TRUTH map of dynamic blocks derived by the page generator
    # to compute the declared indicators
    for index, blockResult in enumerate(perBlockResult):
        isBlockDynamic = dynamicBlockSummary[index]
        overallNonZeroCounts.extend(blockResult['nonZeroCounts'])
        if isBlockDynamic:
            nonZeroCountsForDynamicBlocks.extend(blockResult['nonZeroCounts'])
        else:
            nonZeroCountsForStaticBlocks.extend(blockResult['nonZeroCounts'])

        blockPde = 100 * (blockResult['timesEvaluatedDynamic'] / blockResult['evaluations'])
        overallPde.append(blockPde)

        if isBlockDynamic:
            pdeForDynamicBlocks.append(blockPde)
        else:
            pdeForStaticBlocks.append(blockPde)

    probabilityDistributionData = {
        "nn0Counts": {
            "overall": overallNonZeroCounts,
            "dynamic": nonZeroCountsForDynamicBlocks,
            "static": nonZeroCountsForStaticBlocks
        },
        "pdeValues": {
            "overall": overallPde,
            "dynamic": pdeForDynamicBlocks,
            "static": pdeForStaticBlocks
        },
    }

    return probabilityDistributionData


def plotData(outFolder, data):
    overallNn0Values, overallPdeValues = \
        np.array([data['nn0Counts']['overall'], data['pdeValues']['overall']])
    staticBlocksNn0Values, staticBlocksPdeValues = \
        np.array([data['nn0Counts']['static'], data['pdeValues']['static']])
    dynamicBlocksNn0Values, dynamicBlocksPdeValues = \
        np.array([data['nn0Counts']['dynamic'], data['pdeValues']['dynamic']])

    fastplot.plot(overallNn0Values, outFolder + 'nn0_allBlocks_cdf.png', mode='CDF', xlabel='NN0_value', ylabel='prob',
                  xlim=(-10, 310))
    fastplot.plot(staticBlocksNn0Values, outFolder + 'nn0_staticBlocks_cdf.png', mode='CDF', xlabel='NN0_value',
                  ylabel='prob', xlim=(-10, 310))
    fastplot.plot(dynamicBlocksNn0Values, outFolder + 'nn0_dynamicBlocks_cdf.png', mode='CDF', xlabel='NN0_value',
                  ylabel='prob', xlim=(-10, 310))

    fastplot.plot(overallPdeValues, outFolder + 'pde_allBlocks_cdf.png', mode='CDF', xlabel='PDE_value', ylabel='prob')
    fastplot.plot(staticBlocksPdeValues, outFolder + 'pde_staticBlocks_cdf.png', mode='CDF', xlabel='PDE_value',
                  ylabel='prob')
    fastplot.plot(dynamicBlocksPdeValues, outFolder + 'pde_dynamicBlocks_cdf.png', mode='CDF', xlabel='PDE_value',
                  ylabel='prob')

    return


def main():
    workdir = sys.argv[1]

    # Loading results of dynamic section analisys and pageConfiguration data (truth)
    with open(workdir + '/input/sectionDetectionResults.json') as inputFile:
        perBlockResults = json.load(inputFile)
        inputFile.close()
    with open(workdir + '/input/configuration.json') as inputFile:
        pageConfiguration = json.load(inputFile)
        inputFile.close()

    distributionData = evaluateResults(perBlockResults, pageConfiguration)

    plotOutFolder = workdir + '/output/data_distributions/'
    if not exists(plotOutFolder):
        makedirs(plotOutFolder)
    else:
        shutil.rmtree(plotOutFolder)
        makedirs(plotOutFolder)
    plotData(plotOutFolder, distributionData)

    with open(workdir + '/output/probabilityDistributionData.json', 'w+') as outfile:
        json.dump(distributionData, outfile, indent=None)


# +++++ Script Entrypoint
main()
