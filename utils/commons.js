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

export function generateReservationCode(objectId) {
  const objectIdStr =
    typeof objectId === "string" ? objectId : objectId?.toString();

  if (!objectIdStr || !/^[a-f\d]{24}$/i.test(objectIdStr)) {
    throw new Error("Invalid MongoDB ObjectID format.");
  }

  const uniquePart = objectIdStr.slice(-8);

  const prefix = "RES";
  const timestamp = Date.now().toString(36);

  // Combine the parts into a reservation code
  return `${prefix}-${uniquePart}-${timestamp}`.toUpperCase();
}
