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
// client/src/App.js
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

```javascript
// client/src/components/vies/LandingPage/LandingPage.js
import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);
  return <div> LandingPage </div>;
}

export default LandingPage;
```

```javascript
// server/index.js
...
app.get("/api/hello", (req, res) => {
  res.send("안녕하세요");
});
...
```

---

### CORS 이슈, Proxy 설정

- 5000번 포트를 사용하는 서버와 3000번 포트를 사용하는 클라이언트
  - Request를 보낼 수 없다.

**CORS**

- Cross-Origin-Resource-Sharing
- 보안을 위해 포트가 다르면 Request를 막는다.
- Proxy로 해결이 가능하다.

**Proxy**

- npm i http-proxy-middleware
- 아이피를 Proxy Server에서 임의로 바꿔 버린다.
  - 인터넷에서는 접근하는 사용자의 IP를 모르게 된다.
- 보내는 데이터도 임의로 바꿀 수 있다.
- Proxy의 기능
  1. 방화벽 기능
  2. 웹 필터 기능
  3. 캐쉬 데이터, 공유 데이터 제공 기능

```javascript
// client/src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
```

- src/setupProxy.js 파일을 생성한다.
- 프론트에서 보낼 때 3000번 포트에서 5000번 포트로 보낸다.

---

### Concurrently

```javascript
// package.json
{
    "name": "react",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "node server/index.js",
        "backend": "nodemon server/index.js",
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "concurrently \"npm run backend\" \"npm run start --prefix client\""
    },
    ...
```

- 여러개의 명령어를 동시에 작동시켜주는 Tool이다.
- npm i concurrently

---

### CSS Framework

- 기능을 만드는것에 더 집중할 수 있다.
- npm i antd
- client/index.js에 아래 코드를 추가한다.
  - import "antd/dist/antd.css";

---

### Redux

- 상태 관리 라이브러리이다.

  - State를 관리해준다.

<img width="550" alt="3" src="https://user-images.githubusercontent.com/35963403/128363435-5ac5dd01-06fc-40c9-96ed-d5ee65b0cfad.PNG">

<img width="550" alt="4" src="https://user-images.githubusercontent.com/35963403/128364109-bfd504be-2419-4eb3-9cd4-645418dd6148.PNG">

<img width="550" alt="5" src="https://user-images.githubusercontent.com/35963403/128364117-6505d3d2-34c3-4538-9907-889902b5d9f1.PNG">

<img width="550" alt="6" src="https://user-images.githubusercontent.com/35963403/128364332-a62b7661-9368-4877-9ce0-0e3f1b800c89.PNG">

Props vs State

- Props

  - properties
  - 컴포넌트간에 주고받을 때 사용한다.
  - 부모 컴포넌트에서 자식 컴포넌트로만 보낼 수 있다.
  - 자식 컴포넌트로 보내진 prop는 변경할 수 없다.
  - 부모 컴포넌트에서 새로운 값을 보내줘야 변경할 수 있다.

    <img width="327" alt="1" src="https://user-images.githubusercontent.com/35963403/128348422-36f96900-20ce-4e75-b333-d8608238cd2f.PNG">

- State

  - 자식 컴포넌트 내에서 state를 변경할 수 있다.
  - state가 변경되면 다시 렌더링 된다.

    <img width="295" alt="2" src="https://user-images.githubusercontent.com/35963403/128348429-0b4e2fe5-509d-4bf5-8e98-9d375d75b9b8.PNG">

---

### Redux 세팅

- Redux 미들웨어를 설치한다.
- npm i redux react-redux redux-promise redux-thunk
- Store는 객체 형식의 dispatch(action)만 받을 수 있다.
  - redux-thunk
    - dispatch에게 함수를 받을 수 있게 한다.
  - redux-promise
    - dispatch에게 promise를 받을 수 있게 한다.
- client/index.js의 App에 redux를 연결시켜야 한다.
  - redux에서 제공하는 Provider를 이용한다.

```javascript
// client/index.js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import "antd/dist/antd.css";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./_reducers";

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

ReactDOM.render(
  <Provider
    store={createStoreWithMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <APP />
  </Provider>,

  document.getElementById("root")
);

reportWebVitals();
```

```javascript
// client/_reducers/index.js
import { combineReducers } from "redux";
// imoprt user from './user_reducer'

const rootReducer = combineReducers({
  // user,
});

export default rootReducer;
```

---

### React Hooks

- Class Component
  - 더 많은 기능을 제공한다.
  - 코드가 길어진다.
  - 코드가 복잡하다.
  - 성능이 느리다.
- Functional Component
  - 적은 기능을 제공한다.
  - 코드가 짧아진다.
  - 코드가 간결하다.
  - 성능이 빠르다.

<img width="800" alt="7" src="https://user-images.githubusercontent.com/35963403/128370056-15d7a8e4-253d-4a90-a5cd-68bcd2b79d0e.PNG">

- React Hooks를 이용해 함수형 컴포넌트를 클래스 컴포넌트처럼 사용할 수 있다.
