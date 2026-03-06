"use strict";

const calculateRelativeDate = require("./calculate-relative-date.js");
const differ = require("./differ.js");
const parseRelativeDate = require("./parse-relative-date.js");
const dateString = require("./date-string.js");

module.exports = function diffToString(rawOptions) {
  if (!rawOptions.from && !rawOptions.to) throw new Error("At least one of the parameters \"to\" and \"from\" must be provided");

  const options = getOptions(rawOptions);
  if (options.relativeDate) {
    if (options.days) {
      throw new TypeError("Relative dates are not supported with the `days` flag");
    }
    const relative = parseRelativeDate(options.to);
    const date = calculateRelativeDate(options.from, relative);
    return dateString(date);
  }
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
  const today = dateString(new Date());
  return {
    ...options,
    from: options.from || today,
    to: options.to || today,
    relativeDate: /^[+-]/.test(options.to) || false,
  };
}

function formatDate(number, string) {
  return `${number} ${string}${number === 1 ? "" : "s"}`;
}
