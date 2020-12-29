# date-differ
Calculate difference between two dates, with the resolution of days.

# Table of contents
<!-- toc start -->
 - [CLI](#cli)
   - [Installation](#installation)
   - [Usage](#usage)
   - [Examples](#examples)
 - [Node module](#node-module)
   - [Installation](#installation)
   - [Usage](#usage)
     - [Arguments](#arguments)
     - [Examples](#examples)
<!-- toc end -->

# CLI

Run as a command line program.

## Installation

```npm install -g date-differ```

## Usage
```
date-differ [-f] <date> [[-t] <date>] [-d]
```

Calculate difference between two dates. Result is relative, for years, months and days, or absolute days.

```
Parameters:
  -f, --from,  Date from, valid JavaScript date format
  -t, --to,    Date to, valid JavaScript date format
  -d, --days,  Only print days
```

## Examples
```
$ date-differ -f 2020-11-24 -t 2020-12-24
1 month
```
```
$ date-differ -f 2020-11-24 -t 2020-12-24 -d
30 days
```

# Node module

Use in a node script.

## Installation
```npm install date-differ```

## Usage

```javascript
const dateDiffer = require("date-differ");
```

### Arguments

The functions takes an object as its only parameter:
```javascript
{
  from, // String, a parsable date, defaults to today
  to,   // String, a parsable date, defaults to today
  days, // Boolean, optional, return only days
}
```

### Examples
```javascript
const result = dateDiffer({
  from: "2020-11-24",
  to: 1608764400000, // 2020-12-24 in milliseconds since Unix Epoch
});

console.log(result); // 1 month
```
```javascript
const result = dateDiffer({
  from: "2020-11-24",
  to: "2020-12-24T15:00:00",
  days: true,
});

console.log(result); // 30 days
```
