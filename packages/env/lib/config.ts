import { config } from "@dotenvx/dotenvx";

export const baseEnv =
  config({
    path: `${import.meta.dirname}/../../../../.env`,
  }).parsed ?? {};

export const dynamicEnvValues = {
  KK_NODE_ENV: baseEnv.KK_DEV === "true" ? "development" : "production",
} as const;
