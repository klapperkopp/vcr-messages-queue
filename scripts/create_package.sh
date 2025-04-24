#!/bin/sh
rm -rf ./dist
mkdir ./dist
zip -vr ./dist/app.zip . -x "*.DS_Store" -x ".git/*" -x "*.git" -x ".env" -x "create_package.sh" -x ".gitignore" -x "./dist"