export const toLocalString = (numberOrString: string | number): string => {
  const num = Number(numberOrString);

  if (Number.isNaN(num)) return "0";

  return num.toLocaleString(undefined, {
    maximumSignificantDigits: 9,
  });
};
