# date-differ
Calculate difference between two dates, with the resolution of days.

Or calculate date relative to a given date using a relative date format.

Any date not given is defaulted to the current date.


## Relative dates

When adding/subtracting months or years, the resulting date is adjusted to the
last day of the month if the resulting date exceeds the number of days in the
start month.

For example, adding one month to January 31st results in February 28th.

# Table of contents
<!-- toc start -->
 - [CLI](#cli)
   - [Installation](#installation)
   - [Usage](#usage)
   - [Examples](#examples)
 - [Node module](#node-module)
   - [Installation](#installation-1)
   - [Usage](#usage-1)
     - [Arguments](#arguments)
     - [Examples](#examples-1)
<!-- toc end -->

# CLI

Run as a command line program.

## Installation

```npm install -g date-differ```

## Usage
```
date-differ [-f] <date> [[-t] <date | <relative>...>] [-d]
```

Calculate difference between two dates. Result is relative, for years, months and days, or absolute days.

A date in the format `YYYY-MM-DD` is returned when a relative string is given as the second argument.

```
Parameters:
  -f, --from,  Date from, valid JavaScript date format
  -t, --to,    Date to, valid JavaScript date format,
               or one or more relative segments
  -d, --days,  Only print days

Relative segments:
   <+|-><number><unit>, where unit is one of "d(ay[s])", "w(eek[s])", "m(onth[s])" , "y(ear[s])"
```

## Examples
```
$ date-differ -f 2020-11-24 -t 2020-12-24
1 month
```
```
$ date-differ 2020-11-24 2020-12-24 -d
30 days
```
```
$ date-differ -f 2020-11-24 -1year+2months-4w+1d
2019-12-28
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

The function takes an object as its only parameter:
```javascript
{
  from, // Date or a parsable date
  to,   // Date or a parsable date, or a relative date string, e.g. -1year+2months-4w+1d
  days, // Boolean, optional, return only days
}
```

`from` and/or `to` must be given. Any one not given defaults to the current
date.  
Any parsable date format is accepted, including milliseconds since Unix Epoch.  
A date object may also be passed. It will be converted to local time and
stripped of the time component.


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
  from: new Date("2020-11-24"),
  to: "2020-12-24T15:00:00",
  days: true,
});

console.log(result); // 30 days
```

```javascript
const result = dateDiffer({
  from: "2020-11-24",
  to: "-1year+2months-4w+1d",
});

console.log(result); // 2019-12-28
```
