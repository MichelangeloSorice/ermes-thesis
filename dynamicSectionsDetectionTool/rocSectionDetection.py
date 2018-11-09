# Script for splitting an image into multiple parts with the same size
# @input numRow, numCol of the grid splitting the image
# @input inputImage path to the image to be splitted


import json
import sys

import numpy as np


def isDynamic(countNonZero, NN0, blockHeight, blockWidth):
    threshold = blockHeight * blockWidth * 3 * NN0
    if countNonZero > threshold:
        return True
    return False


def main():
    workdir = sys.argv[1]
    configuration_index = int(sys.argv[2])

    with open('./runParams.json') as inputFile:
        runParams = json.load(inputFile)
    with open(workdir + '/input/sectionDetectionResults.json') as inputFile:
        sectionDetectionResults = json.load(inputFile)

    blockHeightPx, blockWidthPx = runParams['BLOCK']['BLOCK_HEIGHT'], runParams['BLOCK']['BLOCK_WIDTH']
    config = runParams['THRESHOLDS_ROC_CURVE'][configuration_index]
    nn0Range, nn0Step = config['NN0']['range'], config['NN0']['step']
    pdeRange, pdeStep = config['PDE']['range'], config['PDE']['step']

    # Utility function to evaluate if blocks are static
    evaluateBlockNn0Counts = np.vectorize(isDynamic)

    rocData = []
    for PDE in np.arange(pdeRange[0], pdeRange[1], pdeStep):
        for NN0 in np.arange(nn0Range[0], nn0Range[1], nn0Step):
            print('Computing data for : NN0 - ' + str(NN0) + '  PDE - ' + str(PDE))

            isDynamicArray = []
            for blockRes in sectionDetectionResults['perBlockResult']:
                # For test each nn0Count value with the current NN0 threshold
                blockEvaluations = evaluateBlockNn0Counts(blockRes['nonZeroCounts'], NN0, blockHeightPx, blockWidthPx)
                # Counting down amount of dynamic evaluations
                dynamicEvaluations = 0
                for isBlockDynamic in blockEvaluations:
                    if isBlockDynamic:
                        dynamicEvaluations += 1
                # Taking a decision for this block base on current NN0 and PDE
                if dynamicEvaluations / len(blockEvaluations) > PDE:
                    isDynamicArray.append(True)
                else:
                    isDynamicArray.append(False)

            rocData.append({
                "NN0": NN0,
                "PDE": PDE,
                "isDynamicArray": isDynamicArray
            })

    with open(workdir + '/input/rocData_config_' + str(configuration_index) + '.json', 'w+') as f:
        json.dump(rocData, f, indent=2)


# +++++ Script Entrypoint
main()
