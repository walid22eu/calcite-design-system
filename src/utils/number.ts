import { numberKeys } from "./key";
import { numberStringFormatter } from "./locale";

// adopted from https://stackoverflow.com/a/66939244
export class BigDecimal {
  value: bigint;

  // BigInt("-0").toString() === "0" which removes the minus sign when typing numbers like -0.1
  isNegative: boolean;

  // Configuration: constants
  static DECIMALS = 100; // number of decimals on all instances

  static ROUNDED = true; // numbers are truncated (false) or rounded (true)

  static SHIFT = BigInt("1" + "0".repeat(BigDecimal.DECIMALS)); // derived constant

  constructor(input: string | BigDecimal) {
    if (input instanceof BigDecimal) {
      return input;
    }
    const [integers, decimals] = String(input).split(".").concat("");
    this.value =
      BigInt(integers + decimals.padEnd(BigDecimal.DECIMALS, "0").slice(0, BigDecimal.DECIMALS)) +
      BigInt(BigDecimal.ROUNDED && decimals[BigDecimal.DECIMALS] >= "5");

    this.isNegative = input.charAt(0) === "-";
  }

  static _divRound(dividend: bigint, divisor: bigint): bigint {
    return BigDecimal.fromBigInt(
      dividend / divisor + (BigDecimal.ROUNDED ? ((dividend * BigInt(2)) / divisor) % BigInt(2) : BigInt(0))
    );
  }

  static fromBigInt(bigint: bigint): bigint {
    return Object.assign(Object.create(BigDecimal.prototype), { value: bigint });
  }

  toString(): string {
    const s = this.value
      .toString()
      .replace(new RegExp("-", "g"), "")
      .padStart(BigDecimal.DECIMALS + 1, "0");

    const i = s.slice(0, -BigDecimal.DECIMALS);
    const d = s.slice(-BigDecimal.DECIMALS).replace(/\.?0+$/, "");
    const value = i.concat(d.length ? "." + d : "");
    return `${this.isNegative ? "-" : ""}${value}`;
  }

  formatToParts(formatter: Intl.NumberFormat): Intl.NumberFormatPart[] {
    const s = this.value
      .toString()
      .replace(new RegExp("-", "g"), "")
      .padStart(BigDecimal.DECIMALS + 1, "0");

    const i = s.slice(0, -BigDecimal.DECIMALS);
    const d = s.slice(-BigDecimal.DECIMALS).replace(/\.?0+$/, "");

    const parts = formatter.formatToParts(BigInt(i));
    this.isNegative && parts.unshift({ type: "minusSign", value: numberStringFormatter.minusSign });

    if (d.length) {
      parts.push({ type: "decimal", value: numberStringFormatter.decimal });
      d.split("").forEach((char: string) => parts.push({ type: "fraction", value: char }));
    }

    return parts;
  }

  format(formatter: Intl.NumberFormat): string {
    const s = this.value
      .toString()
      .replace(new RegExp("-", "g"), "")
      .padStart(BigDecimal.DECIMALS + 1, "0");

    const i = s.slice(0, -BigDecimal.DECIMALS);
    const d = s.slice(-BigDecimal.DECIMALS).replace(/\.?0+$/, "");

    const iFormatted = `${this.isNegative ? numberStringFormatter.minusSign : ""}${formatter.format(BigInt(i))}`;
    const dFormatted = d.length ? `${numberStringFormatter.decimal}${formatter.format(BigInt(d))}` : "";

    return `${iFormatted}${dFormatted}`;
  }

  add(num: string): bigint {
    return BigDecimal.fromBigInt(this.value + new BigDecimal(num).value);
  }

  subtract(num: string): bigint {
    return BigDecimal.fromBigInt(this.value - new BigDecimal(num).value);
  }

  multiply(num: string): bigint {
    return BigDecimal._divRound(this.value * new BigDecimal(num).value, BigDecimal.SHIFT);
  }

  divide(num: string): bigint {
    return BigDecimal._divRound(this.value * BigDecimal.SHIFT, new BigDecimal(num).value);
  }
}

export function isValidNumber(numberString: string): boolean {
  return !(!numberString || isNaN(Number(numberString)));
}

export function parseNumberString(numberString?: string): string {
  if (!numberString || !stringContainsNumbers(numberString)) {
    return "";
  }

  return sanitizeExponentialNumberString(numberString, (nonExpoNumString: string): string => {
    let containsDecimal = false;
    const result = nonExpoNumString
      .split("")
      .filter((value, i) => {
        if (value.match(/\./g) && !containsDecimal) {
          containsDecimal = true;
          return true;
        }
        if (value.match(/\-/g) && i === 0) {
          return true;
        }
        return numberKeys.includes(value);
      })
      .reduce((string, part) => string + part);
    return isValidNumber(result) ? new BigDecimal(result).toString() : "";
  });
}

// regex for number sanitization
const allLeadingZerosOptionallyNegative = /^([-0])0+(?=\d)/;
const decimalOnlyAtEndOfString = /(?!^\.)\.$/;
const allHyphensExceptTheStart = /(?!^-)-/g;
const isNegativeDecimalOnlyZeros = /^-\b0\b\.?0*$/;

export const sanitizeNumberString = (numberString: string): string =>
  sanitizeExponentialNumberString(numberString, (nonExpoNumString) => {
    const sanitizedValue = nonExpoNumString
      .replace(allHyphensExceptTheStart, "")
      .replace(decimalOnlyAtEndOfString, "")
      .replace(allLeadingZerosOptionallyNegative, "$1");

    return isValidNumber(sanitizedValue)
      ? isNegativeDecimalOnlyZeros.test(sanitizedValue)
        ? sanitizedValue
        : new BigDecimal(sanitizedValue).toString()
      : nonExpoNumString;
  });

export function sanitizeExponentialNumberString(numberString: string, func: (s: string) => string): string {
  if (!numberString) {
    return numberString;
  }

  const firstE = numberString.toLowerCase().indexOf("e") + 1;

  return numberString
    .replace(/[eE]*$/g, "")
    .substring(0, firstE)
    .concat(numberString.slice(firstE).replace(/[eE]/g, ""))
    .split(/[eE]/)
    .map((section, i) => (i === 1 ? func(section.replace(/\./g, "")) : func(section)))
    .join("e")
    .replace(/^e/, "1e");
}

function stringContainsNumbers(string: string): boolean {
  return numberKeys.some((number) => string.includes(number));
}
