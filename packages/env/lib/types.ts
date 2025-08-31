import type { dynamicEnvValues } from "./index.js";

interface IKkEnv {
  readonly KK_EXAMPLE: string;
  readonly KK_DEV_LOCALE: string;
}

interface IKkCliEnv {
  readonly CLI_KK_DEV: string;
  readonly CLI_KK_FIREFOX: string;
}

export type EnvType = IKkEnv & IKkCliEnv & typeof dynamicEnvValues;
