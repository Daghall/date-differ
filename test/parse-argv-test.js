"use strict";

const expect = require("chai").expect;
const parseArgv = require("../lib/parse-argv.js");

const baseArgs = ["/path/to/node", "/path/to/script.js"];

describe("parseArgv", () => {
  it("incorrect argv", () => {
    const result = parseArgv.bind(null);
    expect(result).to.throw(Error, "Argv is malformed");
  });

  it("incorrect flags object", () => {
    const result = parseArgv.bind(null, baseArgs, "incorrect");
    expect(result).to.throw(Error, "Flags is malformed");
  });

  it("unrecognized argument", () => {
    const argv = baseArgs.concat(["--invalid"]);
    const flags = [];
    const result = parseArgv.bind(null, argv, flags);
    expect(result).to.throw(Error, "Unrecognized argument: --invalid");
  });

  it("anonymous argument", () => {
    const argv = baseArgs.concat(["anonymous"]);
    const flags = [];
    const result = parseArgv(argv, flags);
    expect(result).to.deep.equal({
      _anonymous: ["anonymous"],
    });
  });

  it("mix of named and anonymous arguments", () => {
    const argv = baseArgs.concat([
      "-a=alpha",
      "anonymous1",
      "anonymous2",
    ]);
    const flags = [
      {short: "a", long: "alpha"},
    ];
    const result = parseArgv(argv, flags);
    expect(result).to.deep.equal({
      alpha: "alpha",
      _anonymous: [
        "anonymous1",
        "anonymous2",
      ],
    });
  });

  it("anonymous argument beginning with `-`", () => {
    const argv = baseArgs.concat(["-3w"]);
    const flags = [];
    const result = parseArgv(argv, flags);
    expect(result).to.deep.equal({
      _anonymous: ["-3w"],
    });
  });

  it("anonymous argument beginning with `-`, following a named argument", () => {
    const argv = baseArgs.concat([
      "-f",
      "-3w",
    ]);
    const flags = [
      { short: "f", long: "from" },
    ];
    const result = parseArgv(argv, flags);
    expect(result).to.deep.equal({
      from: "-3w",
    });
  });

  it("short form", () => {
    const argv = baseArgs.concat([
      "-a",
      "-bBB",
      "-d=ddd",
      "-g",
      "GAMMA",
    ]);
    const flags = [
      {short: "a", long: "alpha"},
      {short: "b", long: "beta"},
      {short: "d", long: "delta"},
      {short: "g", long: "gamma"},
    ];
    const result = parseArgv(argv, flags);
    expect(result).to.deep.equal({
      alpha: true,
      beta: "BB",
      delta: "ddd",
      gamma: "GAMMA",
    });
  });

  it("long form", () => {
    const argv = baseArgs.concat([
      "--alpha",
      "--betaBB",
      "--delta=ddd",
      "--gamma",
      "GAMMA",
    ]);
    const flags = [
      {short: "a", long: "alpha"},
      {short: "b", long: "beta"},
      {short: "d", long: "delta"},
      {short: "g", long: "gamma"},
    ];
    const result = parseArgv(argv, flags);
    expect(result).to.deep.equal({
      alpha: true,
      beta: "BB",
      delta: "ddd",
      gamma: "GAMMA",
    });
  });

  it("short form, boolean last parameter", () => {
    const argv = baseArgs.concat([
      "-aA",
      "-b",
    ]);
    const flags = [
      {short: "a", long: "alpha"},
      {short: "b", long: "beta"},
    ];
    const result = parseArgv(argv, flags);
    expect(result).to.deep.equal({
      alpha: "A",
      beta: true,
    });
  });
});
