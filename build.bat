    echo 'Building React App to Ext'

    rmdir /s dist

    set INLINE_RUNTIME_CHUNK=false
    set GENERATE_SOURCEMAP=false

    node react-scripts build

    mkdir dist\
    xcopy build\ dist\ /E /H

    echo 'Done!'