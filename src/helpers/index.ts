import moment from "moment";

export const isNumber = (value: any) => {
  if (value !== undefined && value !== null) {
    const check = Number.isInteger(value);
    if (check) {
      return value;
    }
    const changeStr = value.toString();
    const newVal = changeStr.slice(0, changeStr.indexOf(".") + 3);
    return Number(newVal);
  }

  return 0;
};

export const DataFormatter = (number: number) => {
  if (number > 1000000000) {
    return `$${isNumber(number / 1000000000).toString()}B`;
  }
  if (number > 1000000) {
    return `$${isNumber(number / 1000000).toString()}M`;
  }
  if (number > 1000) {
    return `$${isNumber(number / 1000).toString()}K`;
  }
  return `$${isNumber(number)}`;
};

export const getDate = (timestamp: any) =>
  moment(timestamp).format("MMM Do YY");
