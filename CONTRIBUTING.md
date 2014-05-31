# Contributing to Share-Primus

## Bugs/pull requests

We're happy to take pull requests.
We won't fix bugs for you unless you send a pull request.

## Run tests

    npm install
    npm test

## Make a release

* Update version and date in `History.md`
* Commit and push everything. Then:

```
npm version NEW_VERSION
npm publish
git push && git push --tags
```
