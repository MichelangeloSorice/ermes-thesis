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
    ('./testIOFolder/TestSuite16_wildFattoQuotidiano/','fattoQuotidiano'),
    ('./testIOFolder/TestSuite12_wildHwUpgrade/','hwUpgrade'),
    ('./testIOFolder/TestSuite9_wildCorriere/', 'corriere'),
    ('./testIOFolder/TestSuite15_wildGazzetta/','gazzetta'),
    ('./testIOFolder/TestSuite7_wildSole24/', 'sole24'),
    ('./testIOFolder/TestSuite8_wildRepubblica/', 'repubblica'),
    ('./testIOFolder/TestSuite6_wildMeteo/', 'meteo'),
    ('./testIOFolder/TestSuite11_wildAndroidWorld/', 'androidWorld'),
    ('./testIOFolder/TestSuite13_wildAranzulla/','aranzulla'),
    ('./testIOFolder/TestSuite14_wildVirginRadio/','virginRadio'),
]

testDirectoriesArray1 = [
    ('./testIOFolder/TestSuite6_wildMeteo/', 'meteo')
]


class ClassificationThread(th.Thread):
    def __init__(self, workdir, cfgFilesArray, name, lock):
        th.Thread.__init__(self)
        self.workdir = workdir
        self.cfgFilesArray = cfgFilesArray
        self.name = name
        self.results = []
        self.lock = lock

    def run(self):
        with self.lock:
            log.info(' Starting thread!')
            # Perform classification task for all configurations
            for cfgFile in self.cfgFilesArray:
                cfgName = cfgFile.split('/')[-1].split('.json')[0]
                log.info(' Started classification task with ' + cfgName)
                subprocess.call(['python3', 'clsf2_searchTplsAndClassifyScreens.py', self.workdir, cfgFile], stdout=subprocess.DEVNULL)
                log.info(' Completed classification task with ' + cfgName)

            # Evaluate comprehensive results
            subprocess.call(['python3', 'clsfX_evaluateClassificationResults.py', self.workdir, 'optimal'],stdout=subprocess.DEVNULL)
            log.info(' Completed results evaluation!')
            # Cleaning workdir results
            resDir = join(self.workdir, 'output', 'layoutDetectionRes')
            rmtree(resDir)

            resFile = join(self.workdir, 'output', 'clsf_algorithmEvaluation.json')
            with open(resFile, 'r') as resFileData:
                evaluation = json.load(resFileData)
                resFileData.close()

            for cfgFile in self.cfgFilesArray:
                cfgName = cfgFile.split('/')[-1].split('.json')[0]
                self.results.append((cfgName, evaluation[cfgName]["overallComparison"]))

            log.info(' Completed execution!')



def generateWindows(windowValues, defaultWindow):
    windows = None
    for dimKey, dimRange in windowValues.items():
        if type(dimRange) is list and len(dimRange) == 3:
            newWindows = []
            for dimValue in arange(dimRange[0], dimRange[1], dimRange[2]):
                if windows is None:
                    newWindowObj = copy.deepcopy(defaultWindow)
                    newWindowObj[dimKey] = int(round(dimValue, 3))
                    newWindows.append(newWindowObj)
                else:
                    for window in windows:
                        newWindowObj = copy.deepcopy(window)
                        newWindowObj[dimKey] = int(round(dimValue, 3))
                        newWindows.append(newWindowObj)
            print('Produced ' + str(len(newWindows)) + ' windows varying dimension ' + str(dimKey))
            windows = newWindows

    if windows is None:
        windows = [windowValues]
    return windows


def generateConfigs(testDataDir):
    cfgFilesArray = []
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
            windowParam = (paramKey == 'core_window' or paramKey == 'searchWindow')
            if (type(paramValue) is list and len(paramValue) == 3) or windowParam:
                newParamConfigObjects = []
                print('Producing configs for parameter -- '+str(paramKey) + ' ' + paramSetKey)

                if windowParam:
                    newParamValues = generateWindows(paramValue, defaultParams[paramSetKey][paramKey])
                else:
                    newParamValues = arange(paramValue[0], paramValue[1], paramValue[2])

                for value in newParamValues:
                    if paramConfigObjects is None:
                        newConfigObj = copy.deepcopy(defaultParams)
                        if windowParam:
                            newConfigObj[paramSetKey][paramKey] = value
                        else:
                            newConfigObj[paramSetKey][paramKey] = round(value, 3)
                        newParamConfigObjects.append(newConfigObj)
                    else:
                        for configObj in paramConfigObjects:
                            newConfigObj = copy.deepcopy(configObj)
                            if windowParam:
                                newConfigObj[paramSetKey][paramKey] = value
                            else:
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
        cfgFilesArray = generateConfigs(testDataDir)
    else:
        cfgDir = join(testDataDir, 'cfgFiles/')
        if not exists(cfgDir):
            print('Provided mode cannot be enabled as no cfgFiles directory is present!')
            return
        cfgFilesArray = [join(cfgDir, cfgName) for cfgName in listdir(cfgDir)]
        print(cfgFilesArray)


    log.basicConfig(level=log.INFO, format='+++ %(threadName)s +++ %(message)s')
    thArray = []
    lockArray = [th.Lock(), th.Lock(), th.Lock()]
    for index, workdir in enumerate(testDirectoriesArray):
        classificationTh = ClassificationThread(workdir[0], cfgFilesArray, workdir[1], lockArray[index % 3])
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
