"use strict";

const differ = require("./differ.js");

module.exports = function diffToString(rawOptions) {
  if (!rawOptions.from && !rawOptions.to) throw new Error("At least one of the parameters \"to\" and \"from\" must be provided");

  const options = getOptions(rawOptions);
  const diff = differ(options);

  if (diff.totalDays === 0) {
    return "Dates are the same day";
  }

  if (options.days) {
    return formatDate(diff.totalDays, "day");
  }

  return getDateString(diff);
};

function getDateString(diff) {
  const result = [];

  if (diff.years) {
    result.push(formatDate(diff.years, "year"));
  }

  if (diff.months) {
    result.push(formatDate(diff.months, "month"));
  }

  if (diff.days) {
    result.push(formatDate(diff.days, "day"));
  }

  return result.join(", ");
}

function getOptions(options) {
  const today = new Date().toISOString().split("T")[0];
  return Object.assign({}, options, {
    from: options.from || today,
    to: options.to || today,
  });
}

function formatDate(number, string) {
  return `${number} ${string}${number === 1 ? "" : "s"}`;
}
