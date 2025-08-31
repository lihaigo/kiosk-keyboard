export const IS_DEV = process.env["CLI_KK_DEV"] === "true";
export const IS_PROD = !IS_DEV;
export const IS_FIREFOX = process.env["CLI_KK_FIREFOX"] === "true";
export const IS_CI = process.env["KK_CI"] === "true";
