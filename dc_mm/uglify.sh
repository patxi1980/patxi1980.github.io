#! /bin/bash

cd js
cat elements.js dragons.js dc_mm.js | uglifyjs -o dragondle.min.js

cd ../css
uglifycss styles.css > dragondle.min.css
