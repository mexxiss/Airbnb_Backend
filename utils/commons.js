export function formatNumber(num) {
  if (num < 1000) return num.toString();

  const units = ["", "k", "M", "B", "T"]; // k: thousand, M: million, B: billion, T: trillion
  const exponent = Math.floor(Math.log10(num) / 3); // Determine the index for units
  const shortNumber = num / Math.pow(1000, exponent);

  return `${shortNumber.toFixed(shortNumber % 1 === 0 ? 0 : 1)}${
    units[exponent]
  }`;
}

export function formatWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
