"use strict";

const ck = require("chronokinesis");
const diffToString = require("../lib/diff-to-string.js");
const expect = require("chai").expect;

describe("date diff", () => {
  before(() => {
    ck.freeze("2020-12-24");
  });

  after(ck.defrost);

  describe("standard output", () => {
    describe("one date parameter", () => {
      it("from same day", () => {
        const result = diffToString({from: "2020-12-24"});
        expect(result).to.equal("Dates are the same day");
      });

      it("to same day", () => {
        const result = diffToString({to: "2020-12-24"});
        expect(result).to.equal("Dates are the same day");
      });

      it("from one day ago", () => {
        const result = diffToString({from: "2020-12-23"});
        expect(result).to.equal("1 day");
      });

      it("to one day in the future", () => {
        const result = diffToString({to: "2020-12-25"});
        expect(result).to.equal("1 day");
      });

      it("from one month ago", () => {
        const result = diffToString({from: "2020-11-24"});
        expect(result).to.equal("1 month");
      });

      it("to one month in the future", () => {
        const result = diffToString({to: "2021-01-24"});
        expect(result).to.equal("1 month");
      });

      it("from one year ago", () => {
        const result = diffToString({from: "2019-12-24"});
        expect(result).to.equal("1 year");
      });

      it("to one year in the future", () => {
        const result = diffToString({to: "2021-12-24"});
        expect(result).to.equal("1 year");
      });
    });

    describe("two date parameters", () => {
      it("two days, three month ago", () => {
        const result = diffToString({from: "2020-09-22", to: "2020-12-24"});
        expect(result).to.equal("3 months, 2 days");
      });

      it("two days, three months, four years ago", () => {
        const result = diffToString({from: "2016-09-22", to: "2020-12-24"});
        expect(result).to.equal("4 years, 3 months, 2 days");
      });

      it("seven days, five years in the future", () => {
        const result = diffToString({from: "2020-12-24", to: "2025-12-31"});
        expect(result).to.equal("5 years, 7 days");
      });

      it("one day, different months", () => {
        const result = diffToString({from: "2020-10-31", to: "2020-11-01"});
        expect(result).to.equal("1 day");
      });

      it("one day, different years", () => {
        const from = new Date("2020-12-31");
        const to = new Date("2021-01-01");
        const result = diffToString({from, to});
        expect(result).to.equal("1 day");
      });
    });
  });

  describe("output: days", () => {
    describe("one date parameter", () => {
      it("from same day", () => {
        const result = diffToString({from: "2020-12-24", days: true});
        expect(result).to.equal("Dates are the same day");
      });

      it("to same day", () => {
        const result = diffToString({to: "2020-12-24", days: true});
        expect(result).to.equal("Dates are the same day");
      });

      it("from one day ago", () => {
        const result = diffToString({from: "2020-12-23", days: true});
        expect(result).to.equal("1 day");
      });

      it("to one day in the future", () => {
        const result = diffToString({to: "2020-12-25", days: true});
        expect(result).to.equal("1 day");
      });

      it("from one month ago", () => {
        const result = diffToString({from: "2020-11-24", days: true});
        expect(result).to.equal("30 days");
      });

      it("to one month in the future", () => {
        const result = diffToString({to: "2021-01-24", days: true});
        expect(result).to.equal("31 days");
      });

      it("from one year ago", () => {
        const result = diffToString({from: "2019-12-24", days: true});
        expect(result).to.equal("366 days");
      });

      it("to one year in the future", () => {
        const result = diffToString({to: "2021-12-24", days: true});
        expect(result).to.equal("365 days");
      });
    });

    describe("two date parameters", () => {
      it("two days, three months ago", () => {
        const result = diffToString({from: "2020-09-24", to: "2020-12-24", days: true});
        expect(result).to.equal("91 days");
      });

      it("two days, three months, four years ago", () => {
        const result = diffToString({from: "2016-09-22", to: "2020-12-24", days: true});
        expect(result).to.equal("1554 days");
      });

      it("seven days, five years in the future", () => {
        const result = diffToString({from: "2020-12-24", to: "2025-12-31", days: true});
        expect(result).to.equal("1833 days");
      });

      it("one day, different months", () => {
        const result = diffToString({from: "2020-10-31", to: "2020-11-01", days: true});
        expect(result).to.equal("1 day");
      });

      it("one day, different years", () => {
        const result = diffToString({from: "2020-12-31", to: "2021-01-01", days: true});
        expect(result).to.equal("1 day");
      });
    });
  });

  describe("relative date", () => {
    describe("one parameter", () => {
      it("two days, three months ago", () => {
        const result = diffToString({to: "-3m2d"});
        expect(result).to.equal("2020-09-22");
      });

      it("two days, three months ahead", () => {
        const result = diffToString({to: "+3m2d"});
        expect(result).to.equal("2021-03-26");
      });

      it("three weeks, minus one day, ahead", () => {
        const result = diffToString({to: "+3w-1d"});
        expect(result).to.equal("2021-01-13");
      });

      it("three weeks ago, plus one day", () => {
        const result = diffToString({to: "-3w+1d"});
        expect(result).to.equal("2020-12-04");
      });

      it("zero units", () => {
        const result = diffToString({to: "-0w0d+0y0m"});
        expect(result).to.equal("2020-12-24");
      });

      it("relative time in \"from\" parameter", () => {
        const fn = diffToString.bind(null, ({from: "-2w"}));
        expect(fn).to.throw(TypeError, "Parameter \"from\" is not a valid date: -2w");
      });
    });

    describe("two parameters", () => {
      it("two days, three months ago", () => {
        const result = diffToString({from: "2025-01-17", to: "-3m2d"});
        expect(result).to.equal("2024-10-15");
      });

      it("two days, three months ahead", () => {
        const result = diffToString({from: "2025-01-17", to: "+3m2d"});
        expect(result).to.equal("2025-04-19");
      });

      it("three weeks, minus one day, ahead", () => {
        const result = diffToString({from: "2025-01-17", to: "+3w-1d"});
        expect(result).to.equal("2025-02-06");
      });

      it("three weeks ago, plus one day", () => {
        const result = diffToString({from: "2025-01-17", to: "-3w+1d"});
        expect(result).to.equal("2024-12-28");
      });

      it("one month after January 31st", () => {
        const result = diffToString({from: "2025-01-31", to: "+1m"});
        expect(result).to.equal("2025-02-28");
      });

      it("one month before February 28th", () => {
        const result = diffToString({from: "2025-02-28", to: "-1m"});
        expect(result).to.equal("2025-01-28");
      });

      it("three months and two days after March 31st", () => {
        const from = new Date("2025-03-31");
        const result = diffToString({from, to: "+3m2d"});
        expect(result).to.equal("2025-07-02");
      });

      it("one year, from leap day", () => {
        const from = new Date("2020-02-29");
        const result = diffToString({from, to: "+1y"});
        expect(result).to.equal("2021-02-28");

      });

      it("one year ago, from leap day", () => {
        const from = new Date("2020-02-29");
        const result = diffToString({from, to: "-1y"});
        expect(result).to.equal("2019-02-28");
      });
    });

    describe("incompatible flags", () => {
      it("is not compatible with the `days` flag", () => {
        const fn = diffToString.bind(null, {to: "-3w+1d", days: true});
        expect(fn).to.throw(TypeError, "Relative dates are not supported with the `days` flag");
      });
    });
  });
});
