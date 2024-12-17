export const convertCurrencyStringToNumber = (
  currencyString: string,
): number => {
  const cleanedString = currencyString.replace(/[^\d,.-]/g, "").trim();

  const numericValue = parseFloat(cleanedString.replace(",", "."));

  return Math.round(numericValue * 100);
};
