import config from "@setup/config";

const configureStyled = (options: Partial<typeof config>) => {
  if (options?.prefix) config.prefix = options.prefix;
  if (options?.theme) config.theme = options.theme;
};

export default configureStyled;
