#!/usr/bin/env bash
 source activate opencv

: '
 python3 clsfX_testParameters.py ./classificationParamsTests/test0_nothingChanges/

 python3 clsfX_testParameters.py ./classificationParamsTests/test1_BlockParams/

 python3 clsfX_testParameters.py ./classificationParamsTests/test2_BlockHasChangedTh/

 python3 clsfX_testParameters.py ./classificationParamsTests/test3_highlvlMinDist/

 python3 clsfX_testParameters.py ./classificationParamsTests/test4_highlvlMaxDist/

 python3 clsfX_testParameters.py ./classificationParamsTests/test6_coreWindowWidth/

 python3 clsfX_testParameters.py ./classificationParamsTests/test7_coreWindowHeight/

 python3 clsfX_testParameters.py ./classificationParamsTests/test8_corelvlMinDist/

 python3 clsfX_testParameters.py ./classificationParamsTests/test9_corelvlMaxDist/
'

 python3 clsfX_testParameters.py ./classificationParamsTests/test10_consecPatternCount/

 python3 clsfX_testParameters.py ./classificationParamsTests/test11_patternShape/

 python3 clsfX_testParameters.py ./classificationParamsTests/test12_searchWindowWidth/

: '
 python3 clsfX_testParameters.py ./classificationParamsTests/test13_searchWindowHeight/

 python3 scX_testThresholds.py ./secDetectionParamsTests/test1_nn0pde/

 python3 scX_testThresholds.py ./secDetectionParamsTests/test2_limitCaptures/
'
