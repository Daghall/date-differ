"use strict";

const differ = require("../lib/differ.js");
const expect = require("chai").expect;

describe("differ test", () => {
  it("missing parameter \"to\"", () => {
    const fn = differ.bind(null, {from: "2020-12-24"});
    expect(fn).to.throw();
  });

  it("missing parameter \"from\"", () => {
    const fn = differ.bind(null, {to: "2020-12-24"});
    expect(fn).to.throw();
  });

  it("invalid from date", () => {
    const fn = differ.bind(null, {from: null, to: "2020-12-24"});
    expect(fn).to.throw();
  });

  it("invalid to date", () => {
    const fn = differ.bind(null, {from: "2020-12-24", to: "my birthday"});
    expect(fn).to.throw();
  });

  it("missing parameters", () => {
    expect(differ).to.throw();
  });

  it("from date is after to date", () => {
    const fn = differ.bind(null, {from: "2020-12-24", to: "2020-12-23"});
    expect(fn).to.throw();
  });

  it("same day", () => {
    const result = differ({from: "2020-12-24", to: "2020-12-24"});
    expect(result).to.deep.equal({totalDays: 0});
  });

  it("one day", () => {
    const result = differ({from: "2020-12-24", to: "2020-12-25"});
    expect(result).to.deep.equal({days: 1, totalDays: 1});
  });

  it("one month", () => {
    const result = differ({from: "2020-11-24", to: "2020-12-24"});
    expect(result).to.deep.equal({months: 1, totalDays: 30});
  });

  it("one year, leap year", () => {
    const result = differ({from: "2019-12-24", to: "2020-12-24"});
    expect(result).to.deep.equal({years: 1, totalDays: 366});
  });

  it("two days, three months", () => {
    const result = differ({from: "2020-09-22", to: "2020-12-24"});
    expect(result).to.deep.equal({months: 3, days: 2, totalDays: 93});
  });

  it("two days, three months, four years", () => {
    const result = differ({from: "2016-09-22", to: "2020-12-24"});
    expect(result).to.deep.equal({years: 4, months: 3, days: 2, totalDays: 1554});
  });

  it("seven days, five years in the future", () => {
    const result = differ({from: "2020-12-24", to: "2025-12-31"});
    expect(result).to.deep.equal({years: 5, days: 7, totalDays: 1833});
  });

  it("one day, different months", () => {
    const result = differ({from: "2020-10-31", to: "2020-11-01"});
    expect(result).to.deep.equal({days: 1, totalDays: 1});
  });

  it("seven days, one month, different months", () => {
    const result = differ({from: "2020-09-27", to: "2020-11-04"});
    expect(result).to.deep.equal({months: 1, days: 7, totalDays: 38});
  });

  it("nine days, five months, different years", () => {
    const result = differ({from: "2020-09-27", to: "2021-03-06"});
    expect(result).to.deep.equal({months: 5, days: 9, totalDays: 160});
  });

  it("one day, different years", () => {
    const result = differ({from: "2020-12-31", to: "2021-01-01"});
    expect(result).to.deep.equal({days: 1, totalDays: 1});
  });

  it("one day and one year", () => {
    const result = differ({from: "2019-12-31", to: "2021-01-01"});
    expect(result).to.deep.equal({years: 1, days: 1, totalDays: 367});
  });

  it("two days, leap year", () => {
    const result = differ({from: "2020-02-28", to: "2020-03-01"});
    expect(result).to.deep.equal({days: 2, totalDays: 2});
  });

  it("one day, leap year", () => {
    const result = differ({from: "2020-02-28", to: "2020-03-01"});
    expect(result).to.deep.equal({days: 2, totalDays: 2});
  });

  it("one year, minus one day", () => {
    const result = differ({from: "2019-12-24", to: "2020-12-23"});
    expect(result).to.deep.equal({months: 11, days: 30, totalDays: 365});
  });

  it("20th of August to the last of September", () => {
    const result = differ({from: "2020-08-20", to: "2020-09-30"});
    expect(result).to.deep.equal({months: 1, days: 10, totalDays: 41});
  });

  it("20th of August to the first of October", () => {
    const result = differ({from: "2020-08-20", to: "2020-10-01"});
    expect(result).to.deep.equal({months: 1, days: 12, totalDays: 42});
  });

  it("30 of August to the last of September", () => {
    const result = differ({from: "2020-08-30", to: "2020-09-30"});
    expect(result).to.deep.equal({months: 1, totalDays: 31});
  });

  it("last of August to the last of September", () => {
    const result = differ({from: "2020-08-31", to: "2020-09-30"});
    expect(result).to.deep.equal({days: 30, totalDays: 30});
  });

  it("31 of August to the first of October", () => {
    const result = differ({from: "2020-08-31", to: "2020-10-01"});
    expect(result).to.deep.equal({months: 1, days: 1, totalDays: 31});
  });

  it("30 of August to the first of October", () => {
    const result = differ({from: "2020-08-30", to: "2020-10-01"});
    expect(result).to.deep.equal({months: 1, days: 2, totalDays: 32});
  });
});
