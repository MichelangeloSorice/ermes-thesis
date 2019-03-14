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
    ('./testIOFolder/TestSuite6_wildMeteo/', 'meteo'),
    ('./testIOFolder/TestSuite7_wildSole24/', 'sole24'),
    ('./testIOFolder/TestSuite8_wildRepubblica/', 'repubblica'),
    ('./testIOFolder/TestSuite9_wildCorriere/', 'corriere'),
    ('./testIOFolder/TestSuite11_wildAndroidWorld/', 'androidWorld'),
    ('./testIOFolder/TestSuite12_wildHwUpgrade/','hwUpgrade'),
    ('./testIOFolder/TestSuite13_wildAranzulla/','aranzulla'),
    ('./testIOFolder/TestSuite14_wildVirginRadio/','virginRadio'),
    ('./testIOFolder/TestSuite15_wildGazzetta/','gazzetta'),
    ('./testIOFolder/TestSuite16_wildFattoQuotidiano/','fattoQuotidiano')
]

testDirectoriesArray1 = [
    ('./testIOFolder/TestSuite6_wildMeteo/', 'meteo')
]


class ClassificationThread(th.Thread):
    def __init__(self, workdir, cfgFilesArray, name):
        th.Thread.__init__(self)
        self.workdir = workdir
        self.cfgFilesArray = cfgFilesArray
        self.name = name
        self.results = []

    def run(self):
        for cfgFile in self.cfgFilesArray:
            cfgName = cfgFile.split('/')[-1].split('.json')[0]
            log.info(' Started classification task with ' + cfgName)
            classifierProc = subprocess.call(['python3', 'clsf2_searchTplsAndClassifyScreens.py', self.workdir, cfgFile],
                                              stdout=subprocess.DEVNULL)
            log.info(' Completed classification task with ' + cfgName)

            evaluationProc = subprocess.call(
                ['python3', 'clsfX_evaluateClassificationResults.py', self.workdir, 'optimal'],
                stdout=subprocess.DEVNULL)
            log.info(' Completed results evaluation for ' + cfgName)

            resFile = join(self.workdir, 'output', 'clsf_algorithmEvaluation.json')
            with open(resFile, 'r') as resFileData:
                evaluation = json.load(resFileData)
                resFileData.close()

            self.results.append((cfgName, evaluation[cfgName]["overallComparison"]))
            log.info(' Completed execution!')


def main():
    # The working directory which must contain a testArguments.json
    testDataDir = sys.argv[1]
    # Command to disable automatic generation of files
    provided = False
    if len(sys.argv) > 2:
        if sys.argv[2] == 'provided':
            provided = True

    cfgFilesArray = []

    if not provided:
        # We have to generate the configuration files
        with open(testDataDir + '/testArguments.json', 'r') as testArgFile:
            testData = json.load(testArgFile)
            testArgFile.close()
        with open('./parametersFiles/default_clsfParams.json', 'r') as defaultParamsFile:
            defaultParams = json.load(defaultParamsFile)
            defaultParamsFile.close()

        paramConfigObjects = None
        for paramSetKey, paramSetValue in testData.items():
            for paramKey, paramValue in paramSetValue.items():
                if type(paramValue) is list and len(paramValue) == 3:
                    newParamConfigObjects = []
                    # print('Producing configs for parameter -- '+str(paramKey))
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
    else:
        cfgDir = join(testDataDir, 'cfgFiles/')
        if not exists(cfgDir):
            print('Provided mode cannot be enabled as no cfgFiles directory is present!')
            return
        cfgFilesArray = [join(cfgDir, cfgName) for cfgName in listdir(cfgDir)]
        print(cfgFilesArray)



    log.basicConfig(level=log.INFO, format='+++ %(threadName)s +++ %(message)s')
    thArray = []
    for i in range(0, len(testDirectoriesArray), 4):
        currentTh = []
        currentTesting = testDirectoriesArray[i: min(i+4, len(testDirectoriesArray))]
        for workdir in currentTesting:
            classificationTh = ClassificationThread(workdir[0], cfgFilesArray, workdir[1])
            log.info(' Starting thread ' + workdir[1])
            classificationTh.start()
            thArray.append(classificationTh)
            currentTh.append(classificationTh)
        for current_th in currentTh:
            current_th.join()

    results = {
        "summary": {}
    }
    for classificationTh in thArray:
        for resTuple in sorted(classificationTh.results, key=lambda tuple: tuple[0]):
            if not resTuple[0] in results:
                results[resTuple[0]] = {}
            results[resTuple[0]][classificationTh.name] = resTuple[1]

    print(results)

    for cfg, cfgRes in results.items():
        if cfg == "summary":
            continue
        avgCorrectlyClassifiedImg = round(
            sum(res["correctlyClassifiedImgs"] for res in cfgRes.values()) / len(cfgRes.keys()), 3)
        avgCorrectlyClassifiedTpls = round(
            sum(res["correctlyClassifiedTpls"] for res in cfgRes.values()) / len(cfgRes.keys()), 3)
        avgelapsedTime = round(
            sum(res["elapsedTime"] for res in cfgRes.values()) / len(cfgRes.keys()), 3)
        results["summary"][cfg] = {
            "avgCorrectlyClassifiedImgs": avgCorrectlyClassifiedImg,
            "avgCorrectlyClassifiedTpls": avgCorrectlyClassifiedTpls,
            "avgElapsedTime": avgelapsedTime
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
