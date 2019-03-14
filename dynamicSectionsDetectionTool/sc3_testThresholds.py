# This script exploits the results of the capture analysis (sc0)
# Results are evaluated wrt to a range of thresholds of NN0 and PDE and the array representing the final decison
# about each block is stored with a reference to the NN0 and PDE threshold values on which it was computed

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
    # The working directory which must contain a testArguments.json
    testDataDir = sys.argv[1]
    # Command to disable automatic generation of files
    provided = False
    if len(sys.argv) > 2:
        if sys.argv[2] == 'provided':
            provided = True

    testConfig = int(sys.argv[2])

    with open('./sectionDetectionParams.json') as inputFile:
        sectionDetectionParams = json.load(inputFile)
        inputFile.close()
    with open(workdir + '/input/captureAnalysis.json') as inputFile:
        captureAnalysis = json.load(inputFile)
        inputFile.close()

    blockHeightPx, blockWidthPx = sectionDetectionParams['BLOCK']['BLOCK_HEIGHT'], \
                                  sectionDetectionParams['BLOCK']['BLOCK_WIDTH']
    config = sectionDetectionParams['THRESHOLDS_TESTS'][testConfig]
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
        for blockCounts in captureAnalysis['perBlockNN0Counts']:
            blockEvaluations = evaluateBlockNn0Counts(blockCounts, threshold)
            # Counting down amount of dynamic evaluations
            dynamicEvaluations = np.count_nonzero(blockEvaluations)
            # Computing percentage of dynamic evaluations
            pdes.append(dynamicEvaluations / len(blockEvaluations))

        blockPDEsForNN0.append({
            "NN0": NN0,
            "perBlockPDE": pdes
        })

    # Object keeping the dynamicBlocks summary for each NN0 value for different PDEs
    pdeTestData = []
    for PDE in np.arange(pdeRange[0], pdeRange[1], pdeStep):
        # Defining a roc curve for a certain value of PDE when varying NN0
        nn0TestData = []
        for NN0data in blockPDEsForNN0:
            print('Computing final data for : NN0 - ' + str(NN0data['NN0']) + '  PDE - ' + str(PDE))
            isDynamicArray = evaluateBlockIsDynamic(NN0data['perBlockPDE'], PDE)

            nn0TestData.append({
                "NN0": NN0data['NN0'],
                "isDynamicArray": isDynamicArray.tolist()
            })
        pdeTestData.append({
            "PDE": PDE,
            "nn0TestData": nn0TestData
        })

    with open(workdir + '/input/thresholdTestData_cfg' + str(testConfig) + '.json', 'w+') as f:
        json.dump(pdeTestData, f, indent=None)
        f.close()


# +++++ Script Entrypoint
main()
