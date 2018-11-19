# This script exploits the results of the dynamicAectionDetectionTool
# Results are evaluated wrt to a range of thresholds of NN0 and PDE and the array representing the final decison
# about each bloc k is stored with a reference to the NN0 and PDE threshold values on which it was computed

import json
import sys

import numpy as np


def countNN0OverThreshold(countNonZero, threshold):
    if countNonZero > threshold:
        return 1
    return 0


def pdeOverThreshold(pde, threshold):
    if pde > threshold:
        return True
    return False


def main():
    workdir = sys.argv[1]
    configuration_index = int(sys.argv[2])

    with open('./sectionDetectionParams.json') as inputFile:
        sectionDetectionParams = json.load(inputFile)
        inputFile.close()
    with open(workdir + '/input/sectionDetectionResults.json') as inputFile:
        sectionDetectionResults = json.load(inputFile)
        inputFile.close()

    blockHeightPx, blockWidthPx = sectionDetectionParams['BLOCK']['BLOCK_HEIGHT'], sectionDetectionParams['BLOCK'][
        'BLOCK_WIDTH']
    config = sectionDetectionParams['THRESHOLDS_ROC_CURVE'][configuration_index]
    nn0Range, nn0Step = config['NN0']['range'], config['NN0']['step']
    pdeRange, pdeStep = config['PDE']['range'], config['PDE']['step']

    # Utility functions to efficiently evaluate thresholds over the arrays
    evaluateBlockNn0Counts = np.vectorize(countNN0OverThreshold, otypes=[np.int])
    evaluateBlockIsDynamic = np.vectorize(pdeOverThreshold, otypes=[np.bool])

    # Array keeping the percentage of dynamic evaluations of each block for different NN0 values
    blockPDEsForNN0 = []
    for NN0 in np.arange(nn0Range[0], nn0Range[1], nn0Step):
        print('Computing data for : NN0 - ' + str(NN0))
        # Evaluate each nn0Count value with the current NN0 threshold
        threshold = NN0 * 3 * blockHeightPx * blockWidthPx
        pdes = []
        for blockRes in sectionDetectionResults['perBlockResult']:
            blockEvaluations = evaluateBlockNn0Counts(blockRes['nonZeroCounts'], threshold)
            # Counting down amount of dynamic evaluations
            dynamicEvaluations = np.count_nonzero(blockEvaluations)
            # Computing percentage of dynamic evaluations
            pdes.append(dynamicEvaluations / len(blockEvaluations))

        blockPDEsForNN0.append({
            "NN0": NN0,
            "perBlockPDE": pdes
        })

    # Object keeping the dynamicBlocks summary for each NN0 value for different PDEs
    rocCurves = []
    for PDE in np.arange(pdeRange[0], pdeRange[1], pdeStep):
        # Defining a roc curve for a certain value of PDE when varying NN0
        rocCurveData = []
        for NN0data in blockPDEsForNN0:
            print('Computing final data for : NN0 - ' + str(NN0data['NN0']) + '  PDE - ' + str(PDE))
            isDynamicArray = evaluateBlockIsDynamic(NN0data['perBlockPDE'], PDE)

            rocCurveData.append({
                "NN0": NN0data['NN0'],
                "isDynamicArray": isDynamicArray.tolist()
            })
        rocCurves.append({
            "PDE": PDE,
            "rocCurveData": rocCurveData
        })

    with open(workdir + '/input/thresholdTestData_config_' + str(configuration_index) + '.json', 'w+') as f:
        json.dump(rocCurves, f, indent=None)


# +++++ Script Entrypoint
main()
