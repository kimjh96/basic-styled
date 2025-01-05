![Banner(basic-styled)](https://github.com/user-attachments/assets/62bb8839-3fa1-403d-a39b-4e6d22481588)

basic-styled 는 기초적인 스타일링 기능을 제공하는 React 전용 CSS-in-JS 라이브러리예요. 고급 스타일링이나 성능이 중요하지 않은 간단한 프로젝트라면 한 번 사용해 보세요!

<p align="center">
    <img src="https://img.shields.io/npm/v/basic-styled?style=flat-square&labelColor=%2360758B&color=%23004ECC" alt="basic-styled version"/>
    <img src="https://img.shields.io/github/license/kimjh96/basic-styled?style=flat-square" alt="license" />
</p>

## 🚀 특징
- 간단한 사용
- 의존성 없음
- Theming 지원
- Server-Side Rendering 지원
- Next.js 호환

## 설치 및 시작
```bash
pnpm add basic-styled
```

```tsx
import styled from 'basic-styled';

function App() {
  return (
    <Box>App</Box>
  );
}

export default App;

const Box = styled.div`
  border: 1px solid;
`;
```

## 예시
### Theming
```tsx
// App.tsx

import ThemeProvider from 'basic-styled/setup/ThemeProvider';

const theme = {
  palette: {
    primary: '#007bff',
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      App
    </ThemeProvider>
  );
}

export default App;
```

```tsx
// with TypeScript

import "basic-styled";

declare module "basic-styled" {
  export interface BasicTheme {
    palette: {
      primary: string;
    };
  }
}
```

### Next.js
```tsx
// layout.tsx

import createBuilder from "basic-styled/setup/createBuilder";
import Providers from "./providers";

const theme = {
  palette: {
    primary: '#007bff',
  }
};

createBuilder({
  prefix: 'basic-styled', // prefix for class name, default is 'basic-styled'
  theme
});

async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
```

```tsx
// providers.tsx

'use client';

import ThemeProvider from 'basic-styled/setup/ThemeProvider';

const theme = {
  palette: {
    primary: '#007bff',
  }
};

function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

export default Providers;
```

### ResetStyle
```tsx
// App.tsx

import ThemeProvider from 'basic-styled/setup/ThemeProvider';
import ResetStyle from 'basic-styled/setup/ResetStyle';

const theme = {
  palette: {
    primary: '#007bff',
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ResetStyle />
      App
    </ThemeProvider>
  );
}

export default App;
```

### GlobalStyle
```tsx
// App.tsx

import styled from "basic-styled";
import ThemeProvider from 'basic-styled/setup/ThemeProvider';
import ResetStyle from 'basic-styled/setup/ResetStyle';

const theme = {
  palette: {
    primary: '#007bff',
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ResetStyle />
      <GlobalStyle />
      App
    </ThemeProvider>
  );
}

export default App;

function GlobalStyle() {
  return <StyledGlobal globalStyle />;
}

const StyledGlobal = styled.style`
  html,
  body {
    height: 100%;
  }
  #root {
    min-height: 100%;
  }
`;
```

## 데모
[plandy-web](https://github.com/case-d-plandy/plandy-web) (https://plandy.case-d.com)
