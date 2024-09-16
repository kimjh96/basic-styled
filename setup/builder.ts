import { BasicTheme } from "@styled/typing";

const builder: { prefix: string; theme: BasicTheme } = { prefix: "basic-styled", theme: {} };

export const createBuilder = (options: Partial<typeof builder>) => {
  if (options?.prefix) builder.prefix = options.prefix;
  if (options?.theme) builder.theme = options.theme;
};

export default builder;
