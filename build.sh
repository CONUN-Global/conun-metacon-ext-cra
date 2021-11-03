#!/bin/bash

build() {
    echo 'Building React App to Ext'

    rm -rf build/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    react-scripts build

    echo 'Done!'
}

build