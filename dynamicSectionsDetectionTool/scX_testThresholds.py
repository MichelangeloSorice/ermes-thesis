import json
import sys
from os import mkdir, listdir
from os.path import exists, join
from shutil import rmtree
from numpy import arange

import copy
import threading as th
import subprocess
import logging as log

testDirectoriesArray = [
    ('./testIOFolder/TestSuite1_repubblica/','repubblica'),
    ('./testIOFolder/TestSuite2_externalBands/','externalBands'),
    ('./testIOFolder/TestSuite3_isolatedBanners/', 'isolatedBanners'),
    ('./testIOFolder/TestSuite4_asymmetricBanners/','asymmetricBanners'),
    ('./testIOFolder/TestSuite5_mainlyDynamic/', 'mainlyDynamic'),
]

testDirectoriesArray1 = [
    ('./testIOFolder/TestSuite6_wildMeteo/', 'meteo')
]


class ClassificationThread(th.Thread):
    def __init__(self, workdir, cfgFilesArray, name, semaphore):
        th.Thread.__init__(self)
        self.workdir = workdir
        self.cfgFilesArray = cfgFilesArray
        self.name = name
        self.results = []
        self.semaphore = semaphore

    def run(self):
        with self.semaphore:
            log.info(' Starting execution!')
            # Perform classification task for all configurations
            for cfgFile in self.cfgFilesArray:
                cfgName = cfgFile.split('/')[-1].split('.json')[0]
                log.info(' Started detection task with ' + cfgName)
                subprocess.call(['python3', 'sc1_computeDynamicSections.py', self.workdir, cfgFile], stdout=subprocess.DEVNULL)
                log.info(' Completed classification task with ' + cfgName)

            # Evaluate comprehensive results
            subprocess.call(['python3', 'scX_evaluteSecDetectionResults.py', self.workdir], stdout=subprocess.DEVNULL)
            log.info(' Completed results evaluation!')
            # Cleaning workdir results
            resDir = join(self.workdir, 'output', 'results')
            rmtree(resDir)

            resFile = join(self.workdir, 'output', 'secDetection_perCfgResults.json')
            with open(resFile, 'r') as resFileData:
                evaluation = json.load(resFileData)
                resFileData.close()

            for cfgFile in self.cfgFilesArray:
                cfgName = cfgFile.split('/')[-1].split('.json')[0]
                self.results.append((cfgName, evaluation[cfgName]))

            log.info(' Completed execution!')


def generateConfigs(testDataDir):
    cfgFilesArray = []
    # We have to generate the configuration files
    with open(testDataDir + '/testArguments.json', 'r') as testArgFile:
        testData = json.load(testArgFile)
        testArgFile.close()
    with open('./parametersFiles/default_sectionDetectionParams.json', 'r') as defaultParamsFile:
        defaultParams = json.load(defaultParamsFile)
        defaultParamsFile.close()

    paramConfigObjects = None
    for paramSetKey, paramSetValue in testData.items():
        for paramKey, paramValue in paramSetValue.items():
            if type(paramValue) is list and len(paramValue) == 3:
                newParamConfigObjects = []
                print('Producing configs for parameter -- '+str(paramKey) + ' ' + paramSetKey)

                for value in arange(paramValue[0], paramValue[1], paramValue[2]):
                    if paramConfigObjects is None:
                        newConfigObj = copy.deepcopy(defaultParams)
                        newConfigObj[paramSetKey][paramKey] = round(value, 3)
                        newParamConfigObjects.append(newConfigObj)
                    else:
                        for configObj in paramConfigObjects:
                            newConfigObj = copy.deepcopy(configObj)
                            newConfigObj[paramSetKey][paramKey] = round(value, 3)
                            newParamConfigObjects.append(newConfigObj)

                print('Produced ' + str(len(newParamConfigObjects)) + ' for param ' + str(paramKey))
                paramConfigObjects = newParamConfigObjects
                # print('Current length of configObjs '+str(len(paramConfigObjects)))

    cfgFilesDir = testDataDir + '/cfgFiles/'
    if exists(cfgFilesDir):
        rmtree(cfgFilesDir)
    mkdir(cfgFilesDir)

    if paramConfigObjects is None:
        print('Evaluating performances for default configuration!')
        paramConfigObjects = [copy.deepcopy(defaultParams)]
    else:
        print('There are ' + str(len(paramConfigObjects)) + ' configurations in this test suite!')

    for cfgIndex, configObj in enumerate(paramConfigObjects):
        cfgFileName = cfgFilesDir + 'cfg' + format(cfgIndex, '03d') + '.json'
        cfgFilesArray.append(cfgFileName)
        with open(cfgFileName, 'w+') as cfgFile:
            json.dump(configObj, cfgFile, indent=2)
            cfgFile.close()

    return cfgFilesArray


def main():
    # The working directory which must contain a testArguments.json
    testDataDir = sys.argv[1]
    # Command to disable automatic generation of files
    provided = False
    if len(sys.argv) > 2:
        if sys.argv[2] == 'provided':
            provided = True

    if not provided:
        # We have to generate the configuration files
        cfgFilesArray = generateConfigs(testDataDir)
    else:
        cfgDir = join(testDataDir, 'cfgFiles')
        if not exists(cfgDir):
            print('Provided mode cannot be enabled as no cfgFiles directory is present!')
            return
        cfgFilesArray = [join(cfgDir, cfgName) for cfgName in listdir(cfgDir)]
        print(cfgFilesArray)

    log.basicConfig(level=log.INFO, format='+++ %(threadName)s +++ %(message)s')
    thArray = []
    threadSemaphore = th.Semaphore(3)
    for workdir in testDirectoriesArray:
        classificationTh = ClassificationThread(workdir[0], cfgFilesArray, workdir[1], threadSemaphore)
        classificationTh.start()
        thArray.append(classificationTh)

    # Wait for thread termination
    for thread in thArray:
        thread.join()

    results = {
        "summary": {}
    }
    for classificationTh in thArray:
        for resTuple in sorted(classificationTh.results, key=lambda tuple: tuple[0]):
            if not resTuple[0] in results:
                results[resTuple[0]] = {}
            results[resTuple[0]][classificationTh.name] = resTuple[1]

    #print(results)

    for cfg, cfgRes in results.items():
        if cfg == "summary":
            continue
        truePositiveRate = round(
            sum(res["countTP"] for res in cfgRes.values()) / sum(res["totalP"] for res in cfgRes.values()), 3)
        falsePositiveRate = round(
            sum(res["countFP"] for res in cfgRes.values()) / sum(res["totalN"] for res in cfgRes.values()), 3)
        falseDiscoveryRate = round(
            sum(res["countFP"] for res in cfgRes.values()) / sum(res["countPP"] for res in cfgRes.values()), 3)
        precision = round(
            sum(res["countTP"] for res in cfgRes.values()) / sum(res["countPP"] for res in cfgRes.values()), 3)
        accuracy = round(
            sum(res["countTP"]+res["countTN"] for res in cfgRes.values()) / sum(res["totalP"]+res["totalN"] for res in cfgRes.values()), 3)
        results["summary"][cfg] = {
            "truePositiveRate": truePositiveRate,
            "falsePositiveRate": falsePositiveRate,
            "falseDiscoveryRate": falseDiscoveryRate,
            "precision": precision,
            "accuracy": accuracy,
        }

    print(results)
    with open(testDataDir + '/resultsSummary.json', 'w+') as resSummary:
        json.dump(results["summary"], resSummary, sort_keys=True, indent=2)
        resSummary.close()
    with open(testDataDir + '/resultsFull.json', 'w+') as resFull:
        json.dump(results, resFull, sort_keys=True, indent=2)
        resFull.close()

# +++++ Script Entrypoint
main()
