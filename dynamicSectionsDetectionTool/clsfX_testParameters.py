import json
import sys
from os import mkdir
from os.path import exists
from shutil import rmtree
from numpy import arange

import copy
import threading as th
import subprocess
import logging as log

testDirectoriesArray = [
    ('./testIOFolder/TestSuite6_wildMeteo/', 'meteo'),
    ('./testIOFolder/TestSuite7_wildSole24/', 'sole24'),
    # ('./testIOFolder/TestSuite9_wildCorriere/', 'corriere'),
    # ('./testIOFolder/TestSuite11_wildAndroidWorld/', 'androidWorld'),
    # ('./testIOFolder/TestSuite12_wildHwUpgrade/','hwUpgrade'),
    # ('./testIOFolder/TestSuite13_wildAranzulla/','aranzulla'),
    # ('./testIOFolder/TestSuite14_wildVirginRadio/','virginRadio'),
    # ('./testIOFolder/TestSuite15_wildGazzetta/','gazzetta'),
    # ('./testIOFolder/TestSuite16_wildFattoQuotidiano/','fattoQuotidiano')
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
            log.info(' Started classification run with ' + cfgName)
            classifierProc = subprocess.Popen(['python3', 'clsf2_searchAndAssignPatterns.py', self.workdir, cfgFile],
                                              stdout=subprocess.DEVNULL)
            classifierProc.wait()
            log.info(' Completed classification with ' + cfgName)

            evaluationProc = subprocess.Popen(
                ['python3', 'clsfX_evaluateClassificationResults.py', self.workdir, 'optimal'],
                stdout=subprocess.PIPE)
            log.info(' Completed evaluation of ' + cfgName)
            res = evaluationProc.stdout.read().decode('utf-8')
            # Substituting single quotes with double ones
            res = res.replace("\'", "\"")
            evaluation = json.loads(res)
            self.results.append((cfgName, evaluation["clsf2"]["overallComparison"]))


def main():
    # The working directory which must contain a testArguments.json
    testDataDir = sys.argv[1]

    with open(testDataDir + '/testArguments.json', 'r') as testArgFile:
        testData = json.load(testArgFile)
        testArgFile.close()
    with open('./parametersFiles/default_clsfParams.json', 'r') as defaultParamsFile:
        defaultParams = json.load(defaultParamsFile)

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

    print('There are ' + str(len(paramConfigObjects)) + ' configurations in this test suite!')

    cfgFilesArray = []
    for cfgIndex, configObj in enumerate(paramConfigObjects):
        cfgFileName = cfgFilesDir + 'cfg' + str(cfgIndex) + '.json'
        cfgFilesArray.append(cfgFileName)
        print('Producing configFile ' + cfgFileName)
        with open(cfgFileName, 'w+') as cfgFile:
            json.dump(configObj, cfgFile, indent=None)
            cfgFile.close()

    thArray = []
    log.basicConfig(level=log.INFO, format='+++ %(threadName)s +++ %(message)s')
    for workdir in testDirectoriesArray:
        classificationTh = ClassificationThread(workdir[0], cfgFilesArray, workdir[1])
        log.info(' Starting thread ' + workdir[1])
        classificationTh.start()
        thArray.append(classificationTh)

    results = {
        "summary": {}
    }
    for classificationTh in thArray:
        classificationTh.join()
        for resTuple in classificationTh.results:
            if not resTuple[0] in results:
                results[resTuple[0]] = {}
            results[resTuple[0]][classificationTh.name] = resTuple[1]
        log.info(' Completed execution of a thread!')

    print(results)

    for cfg, cfgRes in results.items():
        if cfg == "summary":
            continue
        avgCorrectlyClassifiedImg = round(
            sum(res["correctlyClassifiedImgs"] for res in cfgRes.values()) / len(cfgRes.keys()), 3)
        avgCorrectlyClassifiedTpls = round(
            sum(res["correctlyClassifiedTpls"] for res in cfgRes.values()) / len(cfgRes.keys()), 3)
        results["summary"][cfg] = {
            "avgCorrectlyClassifiedImgs": avgCorrectlyClassifiedImg,
            "avgCorrectlyClassifiedTpls": avgCorrectlyClassifiedTpls
        }

    print(results)


# +++++ Script Entrypoint
main()
