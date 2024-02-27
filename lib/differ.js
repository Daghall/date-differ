"use strict";

const parseRelativeDate = require("./parse-relative-date");

const ONE_DAY_IN_MILLISECONDS = 86400000;

module.exports = function differ({from, to} = {}) {
  if (!from) throw new Error("Missing parameter: \"from\"");
  if (!to) throw new Error("Missing parameter: \"to\"");
  console.log({from, to}); // eslint-disable-line no-console

  const fromDate = validDate(from, "from");
  const toDate = validDate(to, "to");

  if (fromDate > toDate) throw new Error("From date is after to date");

  const totalDays = getTotalDays(fromDate, toDate);
  const result = {
    totalDays,
  };

  const days = getDays(fromDate, toDate);
  if (days) {
    result.days = days;
  }

  const months = getMonths(fromDate, toDate);
  if (months) {
    result.months = months;
  }

  const years = getYears(fromDate, toDate);
  if (years) {
    result.years = years;
  }

  return result;
};

function getTotalDays(from, to) {
  return Math.round((to.getTime() - from.getTime()) / ONE_DAY_IN_MILLISECONDS);
}

function getDays(from, to) {
  const fromDay = from.getDate();
  const toDay = to.getDate();
  if (fromDay > toDay) {
    const remainingDays = getRemainingDaysInMonth(from);
    return remainingDays + toDay;
  }
  return toDay - fromDay;
}

function getRemainingDaysInMonth(from) {
  const date = new Date(from);
  const currentTime = date.setDate(from.getDate()) + ONE_DAY_IN_MILLISECONDS;
  let remainingDays = 0;
  const currentMonth = date.getMonth();

  while (new Date(currentTime + remainingDays * ONE_DAY_IN_MILLISECONDS).getMonth() === currentMonth) {
    ++remainingDays;
  }

  return remainingDays;
}

function getMonths(from, to) {
  const fromMonth = from.getMonth() + 1;
  const toMonth = to.getMonth() + 1;
  const fromDay = from.getDate();
  const toDay = to.getDate();
  let months;

  if (fromMonth > toMonth) {
    months = 12 - fromMonth + toMonth;
  } else {
    months = toMonth - fromMonth;
  }

  if (fromDay > toDay) {
    months = (months - 1 + 12) % 12;
  }

  return months;
}

function getYears(from, to) {
  const fromYears = from.getFullYear();
  const toYears = to.getFullYear();
  let years = toYears - fromYears;

  if (from.getMonth() > to.getMonth() || (from.getMonth() === to.getMonth() && from.getDate() > to.getDate())) {
    --years;
  }
  return Math.max(years, 0);
}

function validDate(date, name) {
  const newDate = new Date(new Date(date).setHours(0, 0, 0, 0));
  if (newDate instanceof Date && !isNaN(newDate)) {
    return newDate;
  }

  throw new Error(`Parameter "${name}" is not a valid date: ${date}`);
}
