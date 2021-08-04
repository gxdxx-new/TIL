## **리액트**

---

### 리액트란?

- 페이스북에서 만든 **라이브러리**이다.
- **컴포넌트**로 구성된다.
  - 재사용성이 뛰어나다.
- Virtual DOM을 사용한다.

Real DOM과 Virtual DOM의 차이

- Real DOM
  - 10개의 리스트 중 한개가 변경되도 전체를 다시 load 해야 된다.
- Virtual DOM
  - 변경된 한개만 load 하면 된다.

Virtual DOM

1. JSX를 렌더링 하면 Update가 된다.
2. 이전 Virtual DOM에서 찍어둔 Snapshot과 비교를 해서 바뀐 부분을 찾는다.
   - diffing
3. 그 바뀐 부분만 Real DOM에서 바꿔준다.

---

### 리액트 시작하기

Babel

- 최신 자바스크립트 문법을 지원하지 않는 브라우저들을 위해서 최신 자바스크립트 문법을 구형 브라우저에서도 작동할 수 있게 ES5 문법으로 변환 해준다.

Webpack

- 복잡한 모듈들을 같은 형식파일 끼리 묶어준다.

**npx create-react-app** 으로 리액트를 설치한다.

- Babel, Webpack 설정 없이 바로 시작할 수 있게 해준다.

---

### npm npx

NPM(Node Package Manager)

- 라이브러리들을 담고 있는 저장소 역할을 한다.
- 어플리케이션을 실행하거나 배포할 때 빌드를 해준다.
- create-react-app을 실행하려면 global로 다운로드 받아야 한다.

NPX

- npm registry에 있는 create-react-app을 다운로드 받지 않고 실행할 수 있다.
  - 저장 공간을 낭비하지 않는다.
  - 항상 최신 버전을 사용할 수 있다.

---

### Create React App 구조

- Webpack은 src 폴더에 있는 파일들만 관리해준다.

Boiler Plater에 특성화된 구조로 변경하기

- ./src/\_actions, ./src/\_reducers
  - Redux를 위한 폴더들이다.
- ./src/components/views
  - Page들을 넣는다.
  - ./LandingPage
    - 첫 페이지
  - ./LoginPage
    - 로그인 페이지
  - ./NavBar
    - 네비게이션 바
- ./App.js
  - Routing 관련 일을 처리한다.
- ./Config.js
  - 환경 변수같은 것들을 정하는 곳이다.
- ./hoc
  - Higher Order Component
  - 리액트 컴포넌트를 인자로 받아서 다른 리액트 컴포넌트를 반환하는 함수이다.
  - 컴포넌트 로직을 재사용하게 해준다.
- ./utils
  - 여러 군데에서 쓰일수 있는 것들을 넣어서 어디서든 쓸 수 있게 해준다.

---

### 리액트 함수형 컴포넌트 생성

- 마켓플레이스에 es7으로 검색하고 제일 위에 있는 익스텐션을 설치한다.
- js파일에서 rfce를 누르면 자동완성이 뜬다.
- react 임포트와 파일이름으로 컴포넌트를 생성해준다.

---

### App.js React Router DOM

- 페이지 이동을 할 때 React Router Dom을 사용한다.
- npm i react-router-dom
- react router dom 코드 documentation에서 코드를 복사한다.
- 앱에 맞게 코드를 수정한다.

```javascript
// App.js
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";

function App() {
  return (
    <Router>
      <div>
        <hr /> {}{" "}
        <Switch>
          <Route exact path="/" component={LandingPage} />{" "}
          <Route exact path="/login" component={LoginPage} />{" "}
          <Route exact path="/register" component={RegisterPage} />{" "}
        </Switch>{" "}
      </div>{" "}
    </Router>
  );
}

export default App;
```

---

### 데이터 Flow & Axios

1. Client에서 사용자의 아이디와 비밀번호를 적고 로그인 버튼을 누른다.
2. 요청이 Server로 간다.
3. Server에서는 Database에 사용자가 존재하고 요청된 정보와 일치하는지 찾는다.
4. Client로 응답을 보낸다.

- 요청을 보낼 때 Axios 라이브러리를 이용해 보낸다.
  - JQuery의 AJAX와 비슷하다.
  - npm i axios
