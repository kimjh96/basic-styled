import styled from "@core";

const StyledResetStyle = styled.style`
  * {
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  *,
  *:after,
  *:before {
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }
  :root {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    cursor: default;
    overflow-wrap: break-word;
    -moz-tab-size: 4;
    tab-size: 4;
  }
  html,
  body {
    font-family:
      -apple-system-,
      BlinkMacSystemFont,
      Helvetica Neue,
      Apple SD Gothic Neo,
      Malgun Gothic,
      Nanum Gothic,
      Noto Sans KR,
      Noto Sans CJK KR,
      arial,
      Dotum,
      Tahoma,
      Geneva,
      sans-serif;
  }
  input,
  textarea {
    user-select: text;
  }
  picture,
  video,
  canvas {
    display: block;
    max-width: 100%;
  }
  svg,
  img,
  video {
    vertical-align: middle;
  }
  button {
    background: none;
    border: 0;
    cursor: pointer;
  }
  a {
    text-decoration: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  ul {
    list-style: none;
  }
`;

function ResetStyle() {
  return <StyledResetStyle globalStyle />;
}

export default ResetStyle;
