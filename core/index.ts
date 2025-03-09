import css from "@core/css";
import styled from "@core/styled";
import tags from "@core/tags";
import { BasicTheme, CreateStyled, CSSObject } from "@core/typing";

const newStyled = styled.bind(null) as unknown as CreateStyled;

tags.forEach((tag) => {
  newStyled[tag] = (styledArray, ...styledArrayFunctions) =>
    newStyled(tag)(styledArray, ...styledArrayFunctions);
});

export default newStyled;

export { css };

export type { BasicTheme, CSSObject };
