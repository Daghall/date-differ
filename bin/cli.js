#!/usr/bin/env node

"use strict";

const parseArgv = require("../lib/parse-argv.js");
const dateString = require("../lib/date-string.js");
const diffToString = require("../lib/diff-to-string.js");

const flags = [
  {short: "f", long: "from"},
  {short: "t", long: "to"},
  {short: "d", long: "days"},
];

function cli(argv, nodeProcess) {
  try {
    const options = parseArgv(argv, flags);
    const date = Array.isArray(options._anonymous) && options._anonymous.shift();

    if (date) {
      const date2 = options._anonymous.shift();

      if (options.from && options.to) {
        throw new Error("Too many/ambiguous arguments");
      } else if (/^[-+]/.test(date)) {
        options.to = date;
      } else {
        const today = dateString(new Date());

        if (options.from || (!date2 && !options.to && date > today)) {
          options.to = date;
        } else if (!options.from) {
          options.from = date;
        } else {
          throw new Error("Too many/ambiguous arguments");
        }
      }

      if (date2) {
        if (options.to) {
          throw new Error("Too many/ambiguous arguments");
        } else {
          options.to = date2;
        }
      }

      delete options._anonymous;
    }

    if (!options.from && !options.to) throw new Error("At least one of the parameters \"to\" and \"from\" must be provided");
    const result = diffToString(options);

    nodeProcess.stdout.write(`${result}\n`);
  } catch (e) {
    nodeProcess.stderr.write(`${e.message}\n`);
    nodeProcess.stdout.write([
      "\nUsage: date-differ [-f] <date> [[-t] <date | <relative>...>] [-d]",
      "\nParameters: \n",
      "   -f, --from,  Date from, valid JavaScript date format\n",
      "   -t, --to,    Date to, valid JavaScript date format,\n",
      "                or one or more relative segments\n",
      "   -d, --days,  Only print days\n",
      "\nRelative segments: \n",
      "   <+|-><number><unit>, where unit is one of \"d(ay[s])\", \"w(eek[s])\", \"m(onth[s])\" , \"y(ear[s])\" \n",
    ].join(""));
  }
}

// Expose to tests
module.exports = cli;

// Execute, if run as script
if (require.main === module) {
  cli(process.argv, process);
}
