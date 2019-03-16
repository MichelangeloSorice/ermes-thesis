import json
import shutil
import sys
from os import listdir, mkdir
from os.path import isfile, join, exists
from shutil import copy, rmtree


import matplotlib.pyplot as pyplot


xVar, yVar, xLabel, yLabel, multicurveVar = None, None, None, None, None

def setPlotData(plotConfig):
    global xVar, yVar, xLabel, yLabel, multicurveVar
    xVar, yVar, xLabel, yLabel, multicurveVar = plotConfig.values()


def plotData(outFileName, curves):
    legend = []
    if len(curves)> 1:
        for curve in curves:
            legend.append(multicurveVar["legendLabel"]+ str(curve["multicurveValue"]))

    pyplot.ylabel(yLabel)
    pyplot.xlabel(xLabel)

    for curve in curves:
        pyplot.plot(curve['xValues'], curve['yValues'])

    if len(legend) > 0:
        pyplot.legend(legend, loc='best')
    pyplot.savefig(outFileName)

    return


# Access a value deep in a structured object
def accessValue(structuredObj, keysList):
    value = structuredObj
    for key in keysList:
        value = value[key]
    return value


# Extracts sorted xValues and yValues
def getXYValues(testData, cfgData):
    xKeys = xVar.split('.')
    # Sorted list of xVar values and their cfgName
    xTuples = []
    # Actual xValues and yValues
    xValues, yValues = [], []
    for cfgKey, cfgValue in cfgData.items():
        xTuples.append((cfgKey, accessValue(cfgValue, xKeys)))
    # Sort xValues in ascending order
    xTuples = sorted(xTuples, key=lambda elem: elem[1])

    for xtuple in xTuples:
        # access the yvalue associated to this xValue
        yValues.append(testData[xtuple[0]][yVar])
        xValues.append(xtuple[1])

    return xValues, yValues


def buildCurves(testDataCollection, cfgData):
    curves = []

    if multicurveVar == "":
        xValues, yValues = getXYValues(testDataCollection, cfgData)
        curves.append({
            "xValues": xValues,
            "yValues": yValues,
        })

    else:
        # Keeps cfgData associated to a certain value of the multicurve variable
        multiCurveValueCfgsDictionary = {}
        for cfgKey, cfgValue in cfgData.items():
            multicurveValue = accessValue(cfgValue, multicurveVar["var"].split('.'))
            if not multicurveValue in multiCurveValueCfgsDictionary:
                multiCurveValueCfgsDictionary[multicurveValue] = {}
            multiCurveValueCfgsDictionary[multicurveValue][cfgKey] = cfgValue

        sortedMultiCurveValues = sorted(multiCurveValueCfgsDictionary.keys())

        for multicurveValue in sortedMultiCurveValues:
            xValues, yValues = getXYValues(testDataCollection, multiCurveValueCfgsDictionary[multicurveValue])
            curves.append({
                "xValues": xValues,
                "yValues": yValues,
                "multicurveValue": multicurveValue
            })

    return curves


def main():
    # Dir of interest, must contain the results of a certain test
    workdir = sys.argv[1]
    # Variable to plot configuration in plotConfigs
    plotConfig = sys.argv[2]

    # Retrieving plot configuration
    with open(join('plotConfigs', plotConfig+'.json'), 'r') as file:
        plotConfigData = json.load(file)
        file.close()

    setPlotData(plotConfigData)

    # Loading results
    with open(join(workdir, 'resultsSummary.json'), 'r') as testDataFile:
        testDataCollection = json.load(testDataFile)
        testDataFile.close()

    # Loading config files
    configsData = {}
    cfgFilesDir = join(workdir, 'cfgFiles')
    for file in listdir(cfgFilesDir):
        cfgName = file.split('.json')[0]
        with open(join(cfgFilesDir, file), 'r') as cfgFile:
            configsData[cfgName] = json.load(cfgFile)

    plotOutFolder = join(workdir, 'plots')
    if not exists(plotOutFolder):
        mkdir(plotOutFolder)

    plotOutFile = join(plotOutFolder, plotConfig+'.png')

    # Compute a graphic representation of classification metrics
    plotData(plotOutFile, buildCurves(testDataCollection, configsData))




# +++++ Script Entrypoint
main()
