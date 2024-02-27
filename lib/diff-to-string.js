"use strict";

const differ = require("./differ.js");
const parseRelativeDate = require("./parse-relative-date");

module.exports = function diffToString(rawOptions) {
  if (!rawOptions.from && !rawOptions.to) throw new Error("At least one of the parameters \"to\" and \"from\" must be provided");

  const options = getOptions(rawOptions);
  if (options.relativeDate) {
    const relative = parseRelativeDate(options.to);
    const date = calculateRelativeDate(relative);
    return date.toISOString().split("T").shift();
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

function calculateRelativeDate(relativeDate) {
  const date = new Date();

  if (relativeDate.years) {
    date.setFullYear(date.getFullYear() + relativeDate.years);
  }

  if (relativeDate.months) {
    date.setMonth(date.getMonth() + relativeDate.months);
  }

  if (relativeDate.weeks) {
    date.setDate(date.getDate() + relativeDate.weeks * 7);
  }

  if (relativeDate.days) {
    date.setDate(date.getDate() + relativeDate.days);
  }

  console.log({date}); // eslint-disable-line no-console

  return date;
}

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
