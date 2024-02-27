"use strict";

const parseRelativeDate = require("../lib/parse-relative-date.js");
const expect = require("chai").expect;

describe("parse relative date", () => {
  it("missing parameter", () => {
    const fn = parseRelativeDate.bind(null, undefined);
    expect(fn).to.throw(TypeError, "Expected parameter to be a string, 'undefined' given");
  });

  it("wrong data type", () => {
    const fn = parseRelativeDate.bind(null, 42);
    expect(fn).to.throw(TypeError, "Expected parameter to be a string, 'number' given");
  });

  it("wrong unit type", () => {
    const fn = parseRelativeDate.bind(null, "+1eon");
    expect(fn).to.throw(RangeError, "Unit 'eon' is not recognized");
  });

  it("missing unit", () => {
    const fn = parseRelativeDate.bind(null, "+1");
    expect(fn).to.throw(RangeError, "Unknown format");
  });

  it("same unit given twice", () => {
    const fn = parseRelativeDate.bind(null, "+1w2w");
    expect(fn).to.throw(RangeError, "'weeks' specified more than once");
  });

  it("single value: add two days", () => {
    const result = parseRelativeDate("+2day");
    expect(result).to.deep.equal({
      days: 2,
    });
  });

  it("single value: subtract two days", () => {
    const result = parseRelativeDate("-2day");
    expect(result).to.deep.equal({
      days: -2,
    });
  });

  it("multiple values: add four weeks and two days", () => {
    const result = parseRelativeDate("+4weeks2days");
    expect(result).to.deep.equal({
      weeks: 4,
      days: 2,
    });
  });

  it("all values, long format: add one year, two months, three weeks and four days", () => {
    const result = parseRelativeDate("+1year2months3weeks4days");
    expect(result).to.deep.equal({
      years: 1,
      months: 2,
      weeks: 3,
      days: 4,
    });
  });

  it("all values, medium format: subtract one year, two months, three weeks and four days", () => {
    const result = parseRelativeDate("-1year2month3week4day");
    expect(result).to.deep.equal({
      years: -1,
      months: -2,
      weeks: -3,
      days: -4,
    });
  });

  it("all values, short format: one year, two months, three weeks and four days", () => {
    const result = parseRelativeDate("+1y2m3w4d");
    expect(result).to.deep.equal({
      years: 1,
      months: 2,
      weeks: 3,
      days: 4,
    });
  });

  it("mixed values: add one year, subtract two months, add three weeks and subtract four days", () => {
    const result = parseRelativeDate("+1y-2m+3w-4d");
    expect(result).to.deep.equal({
      years: 1,
      months: -2,
      weeks: 3,
      days: -4,
    });
  });

  it("mixed values, remember last operation", () => {
    const result = parseRelativeDate("+1y2month-3w4days");
    expect(result).to.deep.equal({
      years: 1,
      months: 2,
      weeks: -3,
      days: -4,
    });
  });

  it("no sign assumes addition", () => {
    const result = parseRelativeDate("1d1y");
    expect(result).to.deep.equal({
      years: 1,
      days: 1,
    });
  });
});
