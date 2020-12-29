"use strict";

const ck = require("chronokinesis");
const chai = require("chai");
const chaiSpies = require("chai-spies");
const expect = chai.expect;
const proxyquire = require("proxyquire");
let diffToString;
const cli = proxyquire("../bin/cli.js", {
  "../lib/diff-to-string.js": (...args) => diffToString(...args),
});

const baseArgs = ["/path/to/node", "/path/to/script.js"];
let fakeProcess;
chai.use(chaiSpies);

describe("cli test", () => {
  beforeEach(() => {
    diffToString = chai.spy();
    fakeProcess = {
      stdout: {
        write: chai.spy(),
      },
      stderr: {
        write: chai.spy(),
      },
    };
  });

  before(() => {
    ck.freeze("2020-12-24");
  });

  after(ck.defrost);

  it("no parameters", () => {
    cli(baseArgs, fakeProcess);
    expect(diffToString).to.not.have.been.called;
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.have.been.called.once.with("At least one of the parameters \"to\" and \"from\" must be provided\n");
  });

  it("one anonymous parameter, before today", () => {
    cli(baseArgs.concat("2020-12-23"), fakeProcess);
    expect(diffToString).to.have.been.called.once.with.exactly({
      from: "2020-12-23",
    });
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.not.have.been.called;
  });

  it("one anonymous parameter, after today", () => {
    cli(baseArgs.concat("2020-12-25"), fakeProcess);
    expect(diffToString).to.have.been.called.once.with.exactly({
      to: "2020-12-25",
    });
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.not.have.been.called;
  });

  it("one anonymous parameter, and \"to\"", () => {
    cli(baseArgs.concat("2020-12-23", "-t", "2020-12-24"), fakeProcess);
    expect(diffToString).to.have.been.called.once.with.exactly({
      from: "2020-12-23",
      to: "2020-12-24",
    });
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.not.have.been.called;
  });

  it("one anonymous parameter, and \"from\"", () => {
    cli(baseArgs.concat("-f", "2020-12-23", "2020-12-24"), fakeProcess);
    expect(diffToString).to.have.been.called.once.with.exactly({
      from: "2020-12-23",
      to: "2020-12-24",
    });
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.not.have.been.called;
  });

  it("one anonymous parameter, and \"from\"", () => {
    cli(baseArgs.concat("2020-12-24", "-f", "2020-12-23"), fakeProcess);
    expect(diffToString).to.have.been.called.once.with.exactly({
      from: "2020-12-23",
      to: "2020-12-24",
    });
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.not.have.been.called;
  });

  it("two anonymous parameters", () => {
    cli(baseArgs.concat("2020-12-23", "2020-12-24"), fakeProcess);
    expect(diffToString).to.have.been.called.once.with.exactly({
      from: "2020-12-23",
      to: "2020-12-24",
    });
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.not.have.been.called;
  });

  it("two anonymous parameters, and \"from\"", () => {
    cli(baseArgs.concat("2020-12-23", "2020-12-24", "-f", "2020-12-01"), fakeProcess);
    expect(diffToString).to.not.have.been.called;
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.have.been.called.once.with("Too many/ambiguous arguments\n");
  });

  it("two anonymous parameters, and \"to\"", () => {
    cli(baseArgs.concat("2020-12-23", "2020-12-24", "-t", "2020-12-31"), fakeProcess);
    expect(diffToString).to.not.have.been.called;
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.have.been.called.once.with("Too many/ambiguous arguments\n");
  });

  it("two anonymous parameters, both in the future", () => {
    cli(baseArgs.concat("2021-12-23", "2021-12-24"), fakeProcess);
    expect(diffToString).to.have.been.called.once.with.exactly({
      from: "2021-12-23",
      to: "2021-12-24",
    });
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.not.have.been.called;
  });

  it("two named parameters", () => {
    cli(baseArgs.concat("-f", "2020-12-23", "-t", "2020-12-24"), fakeProcess);
    expect(diffToString).to.have.been.called.once.with.exactly({
      from: "2020-12-23",
      to: "2020-12-24",
    });
    expect(fakeProcess.stdout.write).to.have.been.called.once;
    expect(fakeProcess.stderr.write).to.not.have.been.called;
  });
});
