<div align="center">
  <h1>basic-styled</h1>
</div>
basic-styled 는 기본적인 스타일링 기능을 제공하는 CSS-in-JS 라이브러리예요. 고급 스타일링이나 성능이 중요하지 않은 간단한 프로젝트에 사용할 가벼운 라이브러리가 필요하시다면 사용해 보세요!

## 기능
- 작은 사이즈
- 간단한 사용
- 의존성 없음
- Theming 지원
- Server-Side Rendering 지원
- Server Comonent 지원

## 지원
<div>
  <img src="https://img.shields.io/badge/React-rgb(35%2039%2047)?style=flat-square&logo=react" /> <img src="https://img.shields.io/badge/Next.js-rgb(35%2039%2047)?style=flat-square&logo=next.js" />
</div>

## 시작
```bash
pnpm add basic-styled
```
```typescript
import basic-styled from 'basic-styled';

function App() {
  return (
    <Box>App</Box>
  );
}

const Box = styled.div`
  border: 1px solid;
`;
```
