# This script exploits the results of the dynamicAectionDetectionTool
# Results are evaluated wrt to a range of thresholds of NN0 and PDE and the array representing the final decison
# about each bloc k is stored with a reference to the NN0 and PDE threshold values on which it was computed

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

    with open('./sectionDetectionParams.json') as inputFile:
        sectionDetectionParams = json.load(inputFile)
    with open(workdir + '/input/sectionDetectionResults.json') as inputFile:
        sectionDetectionResults = json.load(inputFile)

    blockHeightPx, blockWidthPx = sectionDetectionParams['BLOCK']['BLOCK_HEIGHT'], sectionDetectionParams['BLOCK'][
        'BLOCK_WIDTH']
    config = sectionDetectionParams['THRESHOLDS_ROC_CURVE'][configuration_index]
    nn0Range, nn0Step = config['NN0']['range'], config['NN0']['step']
    pdeRange, pdeStep = config['PDE']['range'], config['PDE']['step']

    # Utility function to evaluate if blocks are static
    evaluateBlockNn0Counts = np.vectorize(isDynamic)

    rocCurves = []
    for PDE in np.arange(pdeRange[0], pdeRange[1], pdeStep):
        # Defining a roc curve for a certain value of PDE when varying NN0
        rocCurveData = []
        for NN0 in np.arange(nn0Range[0], nn0Range[1], nn0Step):
            print('Computing data for : NN0 - ' + str(NN0) + '  PDE - ' + str(PDE))
            isDynamicArray = []
            for blockRes in sectionDetectionResults['perBlockResult']:
                # Evaluate each nn0Count value with the current NN0 threshold
                blockEvaluations = evaluateBlockNn0Counts(blockRes['nonZeroCounts'], NN0, blockHeightPx, blockWidthPx)
                # Counting down amount of dynamic evaluations
                dynamicEvaluations = 0
                for isBlockDynamic in blockEvaluations:
                    if isBlockDynamic:
                        dynamicEvaluations += 1
                # Taking a decision for this block based on current NN0 and PDE
                if dynamicEvaluations / len(blockEvaluations) > PDE:
                    isDynamicArray.append(True)
                else:
                    isDynamicArray.append(False)
            rocCurveData.append({
                "NN0": NN0,
                "isDynamicArray": isDynamicArray
            })
        rocCurves.append({
            "PDE": PDE,
            "rocCurveData": rocCurveData
        })


    with open(workdir + '/input/rocData_config_' + str(configuration_index) + '.json', 'w+') as f:
        json.dump(rocCurves, f, indent=None)


# +++++ Script Entrypoint
main()
