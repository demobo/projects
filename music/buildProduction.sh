#!/bin/sh
#r.js -o build.js

#!/bin/bash
###################
# 1st Level Configuration
###########
#CURRENT_DIR=`pwd`
PROJ_DIR=`pwd`
DEV_DIR=$PROJ_DIR/dev
PROD_DIR=$PROJ_DIR/prod

####################
#2nd level configuration
###################
TARGET_CWS_DIR=$PROD_DIR/cws
SRC_CWS_DIR=$DEV_DIR/cws

DEV_WEB_DIR=$DEV_DIR
PROD_WEB_DIR=$PROD_DIR

SRC_ASSET_DIR=$DEV_WEB_DIR/asset
SRC_STATIC_DIR=$DEV_WEB_DIR #source folder of static files
SRC_JS_DIR=$DEV_WEB_DIR #source folder of js
SRC_CSS_DIR=$DEV_WEB_DIR #source folder of css
SRC_HTML=$SRC_STATIC_DIR/index.html #the source html file

TARGET_ASSET_DIR=$PROD_WEB_DIR/asset
TARGET_STATIC_DIR=$PROD_WEB_DIR #target folder of static files
TARGET_JS_DIR=$PROD_WEB_DIR #target folder of js
TARGET_CSS_DIR=$PROD_WEB_DIR #target folder of css
TARGET_HTML=$TARGET_STATIC_DIR/index.html #the target html file

BUILDTOOLS_DIR=$PROJ_DIR/../buildtools

########### Doing web project
echo "Start packaging $TARGET_JS_DIR"
rm -rf "$TARGET_JS_DIR/js/"*
rm -rf "$TARGET_CSS_DIR/styles/"*

### handling js
cd "$BUILDTOOLS_DIR"
echo "compiling javascripts and css of $SRC_HTML . it may take 2-3 minutes if you never built before"
python simplifyHtml.py "$SRC_JS_DIR" "$SRC_CSS_DIR" "$SRC_HTML" "$TARGET_JS_DIR" "$TARGET_CSS_DIR" "$TARGET_HTML"








