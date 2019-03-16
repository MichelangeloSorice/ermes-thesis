import json
import shutil
import sys
from os import makedirs
from os.path import exists

import fastplot
import numpy as np


def evaluateResults(perBlockNN0Counts, perBlockPde, dynamicBlockSummary):
    # NN0 values for dynamic, static and all blocks
    nonZeroCountsForDynamicBlocks, nonZeroCountsForStaticBlocks, overallNonZeroCounts = [], [], []
    # PDE values for dynamic, static and all blocks
    pdeForDynamicBlocks, pdeForStaticBlocks, overallPde = [], [], []

    # Use computations results and the TRUTH map of dynamic blocks derived by the page generator
    # to compute the declared indicators
    for index, blockNN0Counts in enumerate(perBlockNN0Counts):
        isBlockDynamic = dynamicBlockSummary[index]
        # Update overall data
        overallNonZeroCounts.extend(blockNN0Counts)
        overallPde.append(perBlockPde[index])
        if isBlockDynamic:
            nonZeroCountsForDynamicBlocks.extend(blockNN0Counts)
            pdeForDynamicBlocks.append(perBlockPde[index])
        else:
            nonZeroCountsForStaticBlocks.extend(blockNN0Counts)
            pdeForStaticBlocks.append(perBlockPde[index])

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

    # Loading results of dynamic section analisys, pde computed during final decision and array of truth
    with open(workdir + '/input/captureAnalysis.json') as inputFile:
        perBlockNN0Counts = (json.load(inputFile))['perBlockNN0Counts']
        inputFile.close()
    with open(workdir + '/output/finalDecision.json') as inputFile:
        perBlockPde = (json.load(inputFile))['perBlockPde']
        inputFile.close()
    with open(workdir + '/input/pageSummary.json') as inputFile:
        dynamicBlocksSummary = (json.load(inputFile))['dynamicBlocksSummary']
        inputFile.close()

    distributionData = evaluateResults(perBlockNN0Counts, perBlockPde, dynamicBlocksSummary)

    plotOutFolder = workdir + '/output/data_distributions/'
    if not exists(plotOutFolder):
        makedirs(plotOutFolder)
    else:
        shutil.rmtree(plotOutFolder)
        makedirs(plotOutFolder)

    plotData(plotOutFolder, distributionData)


# +++++ Script Entrypoint
main()
