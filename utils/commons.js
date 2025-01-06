import { randomBytes } from "crypto";
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
  // Generate a random ObjectID-like string if no ID is provided
  const objectIdStr =
    typeof objectId === "string"
      ? objectId
      : objectId?.toString() || randomBytes(12).toString("hex"); // Random 24-character hex string

  if (!/^[a-f\d]{24}$/i.test(objectIdStr)) {
    throw new Error("Invalid MongoDB ObjectID format.");
  }

  const uniquePart = objectIdStr.slice(-8); // Use the last 8 characters
  const prefix = "RES"; // Prefix for reservation codes
  const timestamp = Date.now().toString(36); // Current timestamp in Base36

  // Combine parts into a reservation code
  return `${prefix}-${uniquePart}-${timestamp}`.toUpperCase();
}

export function autoPopulateAllFields(schema) {
  const paths = [];

  schema.eachPath((pathname, schemaType) => {
    if (pathname === "_id") return;
    if (schemaType.options && schemaType.options.ref) {
      paths.push(pathname);
    }
  });

  if (paths.length > 0) {
    const populatePaths = paths.join(" ");

    schema.pre("find", function (next) {
      this.populate(populatePaths);
      next();
    });

    schema.pre("findOne", function (next) {
      this.populate(populatePaths);
      next();
    });
  }
}
