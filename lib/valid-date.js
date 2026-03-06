"use strict";

module.exports = function validDate(date, name) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0); // Force local time

  if (newDate instanceof Date && !isNaN(newDate)) {
    return newDate;
  }

  throw new TypeError(`Parameter "${name}" is not a valid date: ${date}`);
};
