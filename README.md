![Banner(basic-styled)](https://github.com/user-attachments/assets/62bb8839-3fa1-403d-a39b-4e6d22481588)

# basic-styled

기초적인 스타일링 기능을 제공하는 React 전용 CSS-in-JS 라이브러리예요.

<p align="center">
    <img src="https://img.shields.io/npm/v/basic-styled?style=flat-square&labelColor=%2360758B&color=%23004ECC" alt="basic-styled version"/>
    <img src="https://img.shields.io/github/license/kimjh96/basic-styled?style=flat-square" alt="license" />
</p>

## 특징

🎨 테마 설정 지원

🚀 서버 사이드 렌더링 지원

⚡ Next.js 호환

## 시작하기

### 설치

```bash
npm install basic-styled
# 또는
yarn add basic-styled
# 또는
pnpm add basic-styled
# 또는
bun add basic-styled
```

### 기본 사용법

```tsx
import styled from 'basic-styled';

function App() {
  return (
    <Box>
      <Title>Hello, basic-styled!</Title>
      <Button primary>버튼</Button>
    </Box>
  );
}

export default App;

// 기본 스타일 적용
const Box = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

// 중첩 선택자 사용
const Title = styled.h1`
  color: #333;
  font-size: 24px;
  
  &:hover {
    color: #007bff;
  }
`;

// props를 통한 조건부 스타일링
const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  
  background-color: ${({ primary }) => primary ? '#007bff' : '#f8f9fa'};
  color: ${({ primary }) => primary ? 'white' : '#333'};
  border: ${({ primary }) => primary ? 'none' : '1px solid #ddd'};
  
  &:hover {
    opacity: 0.9;
  }
`;
```

### Theme 설정

```tsx
// theme.ts - 테마 정의
export const theme = {
  palette: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};

// App.tsx - 최상위 컴포넌트
import { PropsWithChildren } from 'react';
import ThemeProvider from 'basic-styled/setup/ThemeProvider';
import { theme } from './theme';
import { ButtonContainer } from './ButtonContainer';

function App() {
  return (
    // ThemeProvider로 전체 앱을 감싸서 테마 컨텍스트를 제공
    <ThemeProvider theme={theme}>
      <ButtonContainer />
    </ThemeProvider>
  );
}

export default App;
```

## TypeScript

타입스크립트를 사용하여 설정한 테마의 타입 안정성을 확보할 수 있어요.

```tsx
// types/styled.d.ts 또는 원하는 타입 선언 파일에 정의해요
import "basic-styled";

declare module "basic-styled" {
  export interface BasicTheme {
    palette: {
      primary: string;
      secondary: string;
      success: string;
      danger: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
  }
}
```

이렇게 타입을 정의해두면 컴포넌트에서 테마 속성에 안전하게 접근할 수 있어요:

```tsx
import styled from 'basic-styled';

// 타입 시스템이 테마 속성 접근을 검증해줘요.
const Button = styled.button<{ variant?: 'primary' | 'success' | 'danger' }>`
  background-color: ${({ theme, variant = 'primary' }) => {
    // 자동 완성과 타입 체크가 작동해요.
    return theme.palette[variant];
  }};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: 4px;
  color: white;
`;

// 잘못된 테마 속성 접근은 오류가 발생해요.
const Invalid = styled.div`
  color: ${({ theme }) => theme.palette.invalidColor}; // 타입 오류 발생!
  margin: ${({ theme }) => theme.spacing.xl}; // 타입 오류 발생!
`;
```

## API 

### styled

컴포넌트를 스타일링하는 기본 API예요.

```tsx
import styled from 'basic-styled';

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
`;
```

### ThemeProvider

테마 컨텍스트를 제공하는 컴포넌트예요.

```tsx
// theme.ts
export const theme = {
  palette: {
    primary: '#007bff',
  }
};

// App.tsx
import ThemeProvider from 'basic-styled/setup/ThemeProvider';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* 자식 컴포넌트들 */}
    </ThemeProvider>
  );
}
```

### useTheme

테마에 직접 접근할 수 있는 Hook이에요.

```tsx
import useTheme from 'basic-styled/setup/useTheme';
import { Button } from './Button';

function ColorPalette() {
  const theme = useTheme();
  
  return (
    <div>
      <h2 style={{ color: theme.palette.primary }}>테마 색상 팔레트</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <ColorSwatch color={theme.palette.primary} name="Primary" />
        <ColorSwatch color={theme.palette.secondary} name="Secondary" />
        <ColorSwatch color={theme.palette.success} name="Success" />
        <ColorSwatch color={theme.palette.danger} name="Danger" />
      </div>
      <div style={{ marginTop: theme.spacing.medium }}>
        <Button>테마가 적용된 버튼</Button>
      </div>
    </div>
  );
}

// 색상 견본 컴포넌트
function ColorSwatch({ color, name }) {
  return (
    <div>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        background: color, 
        borderRadius: '4px' 
      }} />
      <p>{name}</p>
    </div>
  );
}
```

### css prop

styled 컴포넌트에 객체 형태로 추가 스타일을 적용할 수 있는 속성이에요. 별도의 컴포넌트를 새로 만들지 않고도 클래스 기반으로 스타일을 동적으로 확장할 수 있어요. 중첩 선택자와 테마 사용도 지원해요.

```tsx
import styled from 'basic-styled';

// 기본 컴포넌트 정의
const Box = styled.div`
  padding: 16px;
  border-radius: 4px;
`;

function App() {
  const theme = useTheme();
  
  return (
    <>
      {/* 기본 스타일만 적용 */}
      <Box>기본 박스</Box>
      
      {/* css prop으로 추가 스타일 적용 */}
      <Box css={{ 
        backgroundColor: theme.palette.primary,
        color: 'white'
      }}>
        파란색 박스
      </Box>
      
      {/* 중첩 선택자 사용 */}
      <Box css={{ 
        border: '1px solid #eee',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        },
        '& > p': {
          fontSize: '14px',
          marginTop: '8px'
        }
      }}>
        <p>마우스를 올리면 그림자 효과가 생겨요</p>
      </Box>
      
      {/* 함수형 스타일도 지원 */}
      <Box css={({ theme }) => ({
        backgroundColor: theme.palette.secondary,
        padding: theme.spacing.medium,
        color: 'white'
      })}>
        테마를 활용한 동적 스타일
      </Box>
    </>
  );
}
```

### configureStyled

라이브러리의 전역 설정을 구성하는 함수예요. 테마 설정과 클래스명의 접두사를 변경할 수 있어요.

```tsx
// theme.ts
export const theme = {
  palette: {
    primary: '#007bff',
  }
};

// app/layout.tsx
import { PropsWithChildren } from 'react';
import configureStyled from "basic-styled/setup/configureStyled";
import { theme } from '../theme';

configureStyled({
  prefix: 'basic-styled', // 접두사 (기본값: 'basic-styled')
  theme                   // 전역 테마 객체
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
```

### ResetStyle

CSS 리셋 스타일을 적용하는 컴포넌트예요. 브라우저 간 일관된 스타일링을 위해 기본 스타일을 초기화해요.

```tsx
import ThemeProvider from 'basic-styled/setup/ThemeProvider';
import ResetStyle from 'basic-styled/setup/ResetStyle';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ResetStyle />
      {/* 애플리케이션 컴포넌트 */}
    </ThemeProvider>
  );
}
```

### GlobalStyle

전역 스타일을 적용하는 방법이에요. 폰트, 색상 등 전체 애플리케이션에 적용될 스타일을 정의할 수 있어요.

```tsx
import styled from "basic-styled";

function GlobalStyle() {
  return <StyledGlobal globalStyle />;
}

const StyledGlobal = styled.style`
  html,
  body {
    height: 100%;
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  #root {
    min-height: 100%;
  }
  
  * {
    box-sizing: border-box;
  }
`;
```

## Next.js 예제

```tsx
// theme.ts
export const theme = {
  palette: {
    primary: '#007bff',
  }
};

// app/layout.tsx
import { PropsWithChildren } from 'react';
import configureStyled from "basic-styled/setup/configureStyled";
import { theme } from '../theme';
import Providers from "./providers";

configureStyled({
  prefix: 'basic-styled',
  theme
});

export default function RootLayout({ children }: PropsWithChildren) {
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
```

```tsx
// app/providers.tsx
'use client';

import { PropsWithChildren } from 'react';
import ThemeProvider from 'basic-styled/setup/ThemeProvider';
import { theme } from '../theme';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
```

## License

MIT