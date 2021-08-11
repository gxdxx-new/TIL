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

**npx create-react-app .** 으로 리액트를 설치한다.

- Babel, Webpack 설정 없이 바로 시작할 수 있게 해준다.
- .을 넣어서 client 디렉토리 안에 create-react-app을 설치할 수 있게 한다.

---

### npm npx

NPM(Node Package Manager)

- 라이브러리들을 담고 있는 저장소 역할을 한다.
- 어플리케이션을 실행하거나 배포할 때 빌드를 해준다.
- create-react-app을 실행하려면 global로 다운로드 받아야 한다.
- -g를 하면 컴퓨터 안에 다운로드가 된다.
- -D를 하면 devDependencies에 저장이 된다.
  - devDependencies: 실제 코드에 포함되지 않고 개발 단계에만 필요한 의존성 파일들

**NPX**

- npm registry에 있는 create-react-app을 다운로드 받지 않고 실행할 수 있다.
  - global로 다운로드 받지 않아도 된다.
  - 저장 공간을 낭비하지 않는다.
  - 항상 최신 버전을 사용할 수 있다.

---

### Create React App 구조

- Webpack은 src 폴더에 있는 파일들만 관리해준다.
  - 이미지와 같은 파일들은 src 폴더에 넣어서 관리한다.

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
  - 페이지가 렌더링된다.
- ./Config.js
  - 환경 변수같은 것들을 정하는 곳이다.
- ./hoc
  - Higher Order Component
  - 리액트 컴포넌트를 인자로 받아서 다른 리액트 컴포넌트를 반환하는 함수이다.
  - 컴포넌트 로직을 재사용하게 해준다.
  - ex) 유저가 페이지에 들어갈 자격이 되는지를 알아낸 후에 자격이 되면 다음 컴포넌트에 가게 해주고 자격이 안되면 다른 페이지로 보낸다.
- ./utils
  - 여러 군데에서 쓰일수 있는 것들을 넣어서 어디서든 쓸 수 있게 해준다.

---

### 화면 렌더링 방법

1. src/index.js의 첫 번째 인수에 렌더링 할 페이지를 넣는다.
2. 두 번째 인수와 index.html의 id를 같게 한다.
3. App.js가 렌더링된다.

```javascript
// src/index.js
...
ReactDOM.render(<App />, document.getElementById("root"));
...
```

```javascript
// public/index.html
...
<div id="root"></div>
...
```

---

### 리액트 함수형 컴포넌트 생성

- 마켓플레이스에 es7으로 검색하고 제일 위에 있는 익스텐션을 설치한다.
- js파일에서 **rfce**를 누르면 자동완성이 뜬다.
- react 임포트와 파일이름으로 컴포넌트를 생성해준다.
- rcc를 누르면 클래스 컴포넌트를 생성해준다.

---

### App.js React Router DOM

- **페이지 이동을 할 때 React Router Dom을 사용한다.**
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

- **요청을 보낼 때 Axios 라이브러리를 이용해 보낸다.**

  - JQuery의 AJAX와 비슷하다.
  - npm i axios

- LandingPage()의 useEffect 실행순서
  1. axios.get("/api/hello")로 서버에 요청을 보낸다.
  2. 서버에서 요청을 처리하고 응답을 클라이언트로 보낸다.
  3. .then()이 실행되며 response.data로 서버에서 res.send()로 보낸 응답을 사용한다.

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
  - 프론트와 서버를 한 번에 작동시킬 수 있다.
- npm i concurrently
- **"dev": "concurrently \\"npm run backend\\" \\"npm run start --prefix client\\""**

---

### CSS Framework

- 기능을 만드는것에 더 집중할 수 있다.
- npm i antd
- client/index.js에 아래 코드를 추가한다.
  - import "antd/dist/antd.css";

---

### **Redux**

- 상태 관리 라이브러리이다.

  - **State를 관리해준다.**

<img width="368" alt="10" src="https://user-images.githubusercontent.com/35963403/128973259-2ae8f518-14ee-46f4-97dc-037b8161e8f1.PNG">

- 하위/상위 컴포넌트에서 State 수정이 있으면 상위/하위 컴포넌트에 알려주어야 한다.
  - State 관리가 복잡해진다.

<img width="349" alt="11" src="https://user-images.githubusercontent.com/35963403/128973266-ca57798a-9b8e-47be-a268-6a586c04876d.PNG">

- Redux Store에 저장을 해놓으면 Store에 바로 접근하면 된다.

<img width="550" alt="3" src="https://user-images.githubusercontent.com/35963403/128363435-5ac5dd01-06fc-40c9-96ed-d5ee65b0cfad.PNG">

- **Redux는 React Component에서 시작된다.**

<img width="550" alt="4" src="https://user-images.githubusercontent.com/35963403/128364109-bfd504be-2419-4eb3-9cd4-645418dd6148.PNG">

- **Action은 무엇이 일어났는지 설명하는 객체이다.**
  - ex) { type: 'ADD_TODO', text: 'Read the Redux docs.' }
    - 'Read the Redux docs.' text를 TODO 리스트에 추가했다.

<img width="550" alt="5" src="https://user-images.githubusercontent.com/35963403/128364117-6505d3d2-34c3-4538-9907-889902b5d9f1.PNG">

- **Reducer는 이전 State와 Action object를 받은 후에 next State를 return한다.**

<img width="550" alt="6" src="https://user-images.githubusercontent.com/35963403/128364332-a62b7661-9368-4877-9ce0-0e3f1b800c89.PNG">

- **Store는 application의 전체적인 State를 감싸주는 역할을 한다.**
- Store 내장함수로 State를 관리할 수 있다.

<mark>Props vs State</mark>

- **Props**

  - properties
  - 컴포넌트간에 주고받을 때 사용한다.
  - 부모 컴포넌트에서 자식 컴포넌트로만 보낼 수 있다.
  - 자식 컴포넌트로 보내진 prop는 변경할 수 없다.
  - 부모 컴포넌트에서 새로운 값을 보내줘야 변경할 수 있다.

    <img width="300" alt="1" src="https://user-images.githubusercontent.com/35963403/128348422-36f96900-20ce-4e75-b333-d8608238cd2f.PNG">

- **State**

  - 자식 컴포넌트 내에서 state를 변경할 수 있다.
  - state가 변경되면 다시 렌더링 된다.

    <img width="300" alt="2" src="https://user-images.githubusercontent.com/35963403/128348429-0b4e2fe5-509d-4bf5-8e98-9d375d75b9b8.PNG">

---

### Redux 세팅

- Redux 미들웨어를 설치한다.
- npm i redux react-redux redux-promise redux-thunk
- **Store는 객체 형식의 dispatch(action)만 받을 수 있다.**
  - redux-thunk
    - dispatch에게 function을 받을 수 있게 한다.
  - redux-promise
    - dispatch에게 promise를 받을 수 있게 한다.

1. client/index.js의 App에 redux를 연결시켜야 한다.
   - redux에서 제공하는 Provider를 이용한다.
2. applyMiddleeware() 미들웨어에 redux-promise와 redux-thunk를 넣는다.
   - Redux Store가 promise와 function을 받을 수 있게 된다.
3. 만든 Store에 Reducer를 넣어준다.

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

- 여러 State로 인해 여러 Reducer가 생긴다.
  - Root Reducer로 여러 Reducer를 하나로 합친다.

---

### React Hooks

- Class Component
  - 많은 기능을 제공한다.
  - 코드가 길어진다.
  - 코드가 복잡하다.
  - 성능이 느리다.
- Functional Component
  - 적은 기능을 제공한다.
  - 코드가 짧아진다.
  - 코드가 간결하다.
  - 성능이 빠르다.

<img width="800" alt="7" src="https://user-images.githubusercontent.com/35963403/128370056-15d7a8e4-253d-4a90-a5cd-68bcd2b79d0e.PNG">

리액트 생성 순서

1. constructor가 실행되면서 state를 부여한다.
2. render에 있는 JSX가 DOM에 들어가 화면에 렌더링된다.
3. componentDidMount()가 실행된다.

React Hooks를 이용해 함수형 컴포넌트를 클래스 컴포넌트처럼 사용할 수 있다.

---

### 로그인 페이지

- Email, Password를 위한 State를 생성한다.

  - uses를 치면 State가 생성된다.
  - useState()에 ""를 넣는다.
    - react 라이브러리에서 useState를 가져온다.
  - Email, Password를 State를 input type의 value에 넣는다.

- form에 onSubmit 이벤트를 넣어서 submit 버튼을 누를 떄 onSubmitHandler가 실행된다.

  - event.preventDefault()
    - 페이지가 refresh 되는걸 막아준다.

1. <mark>**타이핑을 할 때 onChange 이벤트를 발생시켜서 Email, Password State를 바꿔준다.**</mark>
   - 이벤트 핸들러에서 setEmail(), setPassword()을 이용해서 State를 바꾼다.
   - <mark>**State가 바뀌면 value가 바뀌게 된다.**</mark>
   - **서버로 보내려는 값들을 State에서 갖고 있다.**
2. **dispatch를 이용해서 action을 보낸다.**
3. client/src/\_actions/user_action.js 에서
   - server의 /api/users/login로 값을 보낸다.
4. **서버에서 사용자 정보와 입력된 정보가 일치하는지 확인하고**
   - 결과값을 클라이언트로 보낸다.
5. **서버로부터 받은 데이터(response)를 request에 저장하고 reducer로 보낸다.**
   - type와 request를 넣어서 보낸다.
6. **reducer에서 action의 type마다 처리를 해준다.**
   - \_actions/type.js에 type을 모아두고 사용한다.
7. **request를 reducer의 loginSuccess: action.payload에 넣으면 Redux Store에 저장된다.**
8. **로그인에 성공하면 LandingPage로 이동한다.**
   - export default withRouter(LoginPage);로 해야 history를 사용할 수 있다.

```javascript
// client/src/components/views/LoginPage/LoginPage.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        props.history.push("/");
      } else {
        alert("Error");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label> Email </label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label> Password </label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit"> Login </button>
      </form>
    </div>
  );
}

export default LoginPage;
```

```javascript
// client/src/_actions/user_action.js
import Axios from "axios";
import { LOGIN_USER } from "./types";

export function loginUser(dataToSubmit) {
  const request = Axios.post("/api/users/login", dataToSubmit).then(
    (response) => response.data // 서버에서 처리한 정보들이 response에 들어있다.
  );

  return {
    type: LOGIN_USER,
    payload: request,
  };
}
```

```javascript
// client/src/_actions/types.js
export const LOGIN_USER = "login_user";
```

```javascript
// client/src/_reducers/user_reducer.js
import { LOGIN_USER } from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };

    default:
      return state;
  }
}
```

```javascript
// client/src/_reducer/index.js
import { combineReducers } from "redux";
import user from "./user_reducer";

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
```

<img width="207" alt="8" src="https://user-images.githubusercontent.com/35963403/128449585-87d8da87-540c-4446-9897-0007781b9555.PNG">

---

### 회원가입 페이지

- user_actions.js에서 registerUser() 액션의 경로가 server의 index.js에서 register 경로와 같게 한다.

```javascript
// client/src/components/views/RegisterPage/RegisterPage.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
    }

    let body = {
      email: Email,
      name: Name,
      password: Password,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        props.history.push("/login");
      } else {
        alert("Failed to sign up");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label> Email </label>{" "}
        <input type="email" value={Email} onChange={onEmailHandler} />{" "}
        <label> Name </label>{" "}
        <input type="text" value={Name} onChange={onNameHandler} />{" "}
        <label> Password </label>{" "}
        <input type="password" value={Password} onChange={onPasswordHandler} />{" "}
        <label> Confirm Password </label>{" "}
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />{" "}
        <br />
        <button> 회원가입 </button>{" "}
      </form>{" "}
    </div>
  );
}

export default RegisterPage;
```

```javascript
// client/src/_actions/user_actions.js
import Axios from "axios";
import { LOGIN_USER, REGISTER_USER } from "./types";

export function loginUser(dataToSubmit) {
  const request = Axios.post("/api/users/login", dataToSubmit).then(
    (response) => response.data
  );

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = Axios.post("/api/users/register", dataToSubmit).then(
    (response) => response.data
  );

  return {
    type: REGISTER_USER,
    payload: request,
  };
}
```

```javascript
// client/src/_actions/types.js
export const LOGIN_USER = "login_user";
export const REGISTER_USER = "register_user";
```

```javascript
// clinet/src/_reducers/user_reducer.js
import { LOGIN_USER, REGISTER_USER } from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
    case REGISTER_USER:
      return { ...state, register: action.payload };
    default:
      return state;
  }
}
```

```javascript
// clinet/src/_reducers/index.js
import { combineReducers } from "redux";
import user from "./user_reducer";

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
```

<img width="196" alt="9" src="https://user-images.githubusercontent.com/35963403/128453641-ec1f71be-3f36-462c-9263-a7039616acc1.PNG">

---

### 로그아웃

- 메인 페이지에서 로그아웃 버튼을 누르면 로그아웃이 된다.

```javascript
// client/src/components/views/LandingPage/LandingPage.js
import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);

  const onClickHandler = () => {
    axios.get("/api/users/logout").then((response) => {
      if (response.data.success) {
        props.history.push("/login");
      } else {
        alert("로그아웃 실패");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2> 시작 페이지 </h2> <button onClick={onClickHandler}>로그아웃 </button>
    </div>
  );
}

export default LandingPage;
```

---

### 인증 체크

- 아무나 진입 가능한 페이지
  - Landing Page, About Page
- 로그인한 회원만 진입 가능한 페이지
  - Detail Page
- 로그인한 회원은 진입 못하는 페이지
  - Register Page, Login Page
- 관리자만 진입 가능한 페이지

  - Admin Page

HOC

- 컴포넌트를 인자로 받아 새로운 컴포넌트를 반환하는 함수이다.
- 컴포넌트 로직을 재사용하기 위한 방식이다.

1. 백엔드에 request를 보낸다.
   - useEffect() 사용
2. auth 미들웨어에서 로그인 유무를 판단해서 상태를 보내준다.

```javascript
// client/_actions/user_action.js
...
export function auth() {
  const request = Axios.get("/api/users/auth").then(
    (response) => response.data
  );

  return {
    type: AUTH_USER,
    payload: request,
  };
}
```

```javascript
// client/src/hoc/auth.js
import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
  //null    =>  아무나 출입이 가능한 페이지
  //true    =>  로그인한 유저만 출입이 가능한 페이지
  //false   =>  로그인한 유저는 출입 불가능한 페이지
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
        //로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push("/login");
          }
        } else {
          //로그인 한 상태
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) props.history.push("/");
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}
```

- 페이지가 이동할 때 마다 dispatch가 작동한다.
  - 서버에 계속 request를 준다.

```javascript
// client/App.js
...
          <Route exact path="/" component={Auth(LandingPage, null)} />{" "}
          <Route exact path="/login" component={Auth(LoginPage, false)} />{" "}
          <Route exact path="/register" component={Auth(RegisterPage, false)} />{" "}
...
```

- HOC에 컴포넌트를 넣으려면 Auth로 컴포넌트를 감싸면 된다.
