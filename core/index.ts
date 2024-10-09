import styled from "./styled";
import tags from "./tags";
import { BasicTheme, CreateStyled } from "./typing";

const newStyled = styled.bind(null) as unknown as CreateStyled;

tags.forEach((tag) => {
  newStyled[tag] = (styledArray, ...styledArrayFunctions) =>
    newStyled(tag)(styledArray, ...styledArrayFunctions);
});

export default newStyled;

export type { BasicTheme };
