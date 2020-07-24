#!/bin/bash

node .github/workflows/scripts/update-all.js
git config --global user.name 'Alexis Lemaire'
git config --global user.email 'a.lemaire@klimapartner.de'
git add package.json
git add package-lock.json
git commit -m "Updated packages"
git push
echo "Packages have been updated."