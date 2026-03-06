"use strict";
const validDate = require("./valid-date.js");

module.exports = function calculateRelativeDate(from, relativeDate) {
  const newDate = validDate(from, "from");
  const originalDate = new Date(newDate);

  if (relativeDate.years) {
    newDate.setFullYear(newDate.getFullYear() + relativeDate.years);
  }

  if (relativeDate.months) {
    newDate.setMonth(newDate.getMonth() + relativeDate.months);
  }

  // If the new month/year has fewer days than the original month, we need to
  // compensate by rolling it back to the last day of the previous month
  // Example: January 31 + 1 month = February 31, which rolls over to March 3
  if (newDate.getDate() !== originalDate.getDate()) {
    newDate.setDate(0);
  }

  if (relativeDate.weeks) {
    newDate.setDate(newDate.getDate() + relativeDate.weeks * 7);
  }

  if (relativeDate.days) {
    newDate.setDate(newDate.getDate() + relativeDate.days);
  }

  return newDate;
};
