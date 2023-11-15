# This script re-builds the Angular output target before publishing to ensure the version is correctly updated.
#
# Angular generates a package.json file in the dist directory and expects users to `cd` into the dist and publish from there.
# A Lerna config option for publishing from a different directory was added due to this Angular workflow. Related issues:
# https://github.com/lerna/lerna/issues/901
# https://github.com/lerna/lerna/issues/1282
#
# Unfortunately, the version in Angular's auto-generated package.json is outdated if you build before versioning with Lerna, 
# which we do to ensure tests pass. Building again will ensure the version is correct and the Angular output target is published.
npm run build
