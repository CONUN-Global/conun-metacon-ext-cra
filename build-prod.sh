#!/bin/bash

build() {
    echo 'Building MAINNET React App to Ext'

    rm -rf build/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    export REACT_APP_USE_TEST="FALSE"

    react-scripts build

    echo 'Done!'

    notify-send -u critical Metacon "MAINNET Build has ended"
}

build