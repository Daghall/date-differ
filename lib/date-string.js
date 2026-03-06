"use strict";

module.exports = function dateString(date) {
  return date.toLocaleString("sv").split(" ").shift();
};
