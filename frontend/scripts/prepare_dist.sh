#!/bin/bash

# Clear all the old files to avoid any conflict
sh ./scripts/clear.sh

# Build the client library
(cd client; npm i; npm run build;)

# Moving the dist to inside the module
mkdir pipecat_ai_small_webrtc_prebuilt/client
mv client/dist pipecat_ai_small_webrtc_prebuilt/client

# Build the dist
python setup.py sdist

# Removing the dist from inside the module
rm -rf pipecat_ai_small_webrtc_prebuilt/client/
