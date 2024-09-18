import builder from "@setup/builder";

const createBuilder = (options: Partial<typeof builder>) => {
  if (options?.prefix) builder.prefix = options.prefix;
  if (options?.theme) builder.theme = options.theme;
};

export default createBuilder;
