# About

This tool is aimed to control contributions to Wikipedia's *Edit-a-thons*.

It tracks editions of a set of users and computes aggregated data like number of articles edited, size of contributions in bytes, amount of new articles created.

# Installation

## Environment

This tool requires `NodeJS` and `NPM`.

## Dependencies

Dependencies can be installed with `NPM`:

```
npm install
```

# Usage

## Customizing settings

Settings are separated in three files:

* `wikiprojects.json` defines formats and URLs to query different Wikimedia projects. Currently only Spanish Wikipedia is supported.
* `wikiusers.json` defines the list of users to be checked. Only username or IP address is required.
* `app.js` defines at line 7 and 8 the starting and ending date of articles to be considered. in `YYYY-MM-DD` format.

## Running tool

After customizing settings this tool can be run with the following commands:

* `npm start`
* `node app.js`

Both will query Wikipedia and log progress. When finished file `results.csv` will be created. It contains data aggregated on article scope as well as global scope.
