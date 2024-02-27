"use strict";

module.exports = function parseRelativeDate(string) {
  if (typeof string !== "string") {
    throw new TypeError(`Expected parameter to be a string, '${typeof string}' given`);
  }

  const result = {};
  let add = true;

  const parts = string.match(/[+-]?[0-9]+[^0-9+-]+/g);

  if (!parts?.length > 0) {
    throw new RangeError("Unknown format");
  }
  parts.forEach((part) => {
    const [, sign, value, unit] = [...part.match(/([+-]?)([0-9]+)([^0-9]+)/)];
    if (sign) {
      add = sign === "+";
    }

    const unitName = getUnitName(unit);

    if (result[unitName]) {
      throw new RangeError(`'${unitName}' specified more than once`);
    }

    result[unitName] = value * (add ? 1 : -1);
  });

  return result;
};

function getUnitName(unit) {
  switch (unit) {
    case "y":
    case "year":
    case "years":
      return "years";

    case "m":
    case "month":
    case "months":
      return "months";

    case "w":
    case "week":
    case "weeks":
      return "weeks";

    case "d":
    case "day":
    case "days":
      return "days";

    default:
      throw new RangeError(`Unit '${unit}' is not recognized`);
  }
}
