#!/bin/bash

npm ci

internalsecret="$(openssl rand -hex 64)"
vcr secret create --name "VCR_MESSAGES_QUEUE_INTERNAL_AUTH_KEY" --value $internalsecret
if [ $? -eq 0 ]; then 
    echo "Created new internal secret."; 
else
    echo "Secret already exists. Nothing to be done."; 
fi