#!/usr/bin/env node

"use strict";

const parseArgv = require("../lib/parse-argv.js");
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
      } else {
        const today = new Date().toISOString().split("T")[0];

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
      "\nUsage: date-differ [-f] <date> [[-t] <date>] [-d]",
      "\nParameters: \n",
      "   -f, --from,  Date from, valid JavaScript date format\n",
      "   -t, --to,    Date to, valid JavaScript date format\n",
      "   -d, --days,  Only print days\n",
    ].join(""));
  }
}

// Expose to tests
module.exports = cli;

// Execute, if run as script
if (require.main === module) {
  cli(process.argv, process);
}
