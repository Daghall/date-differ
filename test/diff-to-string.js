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
        const result = diffToString({from: "2020-12-31", to: "2021-01-01"});
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
      it("two days, three month ago", () => {
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
});
