#!/usr/bin/env bash

npm install \
    && npm run build \
    && docker build . -t docker.kuylar.dev/ztrelay \
    && docker push docker.kuylar.dev/ztrelay
