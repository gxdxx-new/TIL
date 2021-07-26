# **노드 서비스 테스트하기**

## **1. 테스트 준비하기**

---

### 1.1. 테스트를 하는 이유

자신이 만든 서비스가 제대로 동작하는지 테스트를 해야 한다.

- 기능이 많으면 수작업으로 테스트하기 힘들다.
  - 프로그램이 프로그램을 테스트할 수 있도록 **자동화**한다.
- 테스트 환경을 최대한 실제 환경과 비슷하게 흉내낸다.
- 아무리 철저하게 테스트해도 에러를 완전히 막을 수는 없다.

테스트를 하면 좋은 점

- 하지만 허무한 에러로 프로그램이 고장나는 것은 막을 수 있다.
- 한 번 발생한 에러는 테스트로 만들어두면 같은 에러가 발생하지 않게 막을 수 있다.
  - 코드를 수정할 때 프로그램이 자동으로 어떤 부분이 고장나는 지 알려준다.

---

### 1.2. Jest 설치하기

npm i -D jest

```javascript
// package.json
{
    "name": "nodebird",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "nodemon app",
        "test": "jest"
    },
    ...
}
```

- Nodebird 프로젝트에 설치한다.
- package.json 의 "scripts" 에 넣어놓으면 npm (run) test 로 실행이 가능하다.

---

### 1.3. 테스트 실행해보기

routes 폴더 안에 middlewares.test.js 를 작성한다.

- 테스트용 파일은 파일명에 test나 spec이 있어야 한다.
- npm test로 test나 spec 파일들을 테스트한다.

---

### 1.4. 첫 테스트 코드 작성하기

routes/middlewares.test.js 를 작성한다.

- if 문을 기준으로 테스트 코드를 작성하면 된다.

```javascript
// routes/middlewares.js
test("1 + 1은 2입니다.", () => {
  expect(1 + 1).toEqual(2);
});
```

- test 함수의 첫 번째 인수로 테스트에 대한 설명을 적는다.
- 두 번째 인수인 함수에는 테스트 내용을 적는다.
- expect 함수의 인수로 실제 코드를, toEqual 함수의 인수로는 예상되는 결과값을 적는다.

<img width="450" alt="캡처" src="https://user-images.githubusercontent.com/35963403/126959875-03ff40cc-d1f6-46bc-b44d-ff1629778349.PNG">

- expect와 toEqual의 인수가 일치하면 테스트를 통과한다.

---

### 1.5. 실패하는 경우

두 인수를 다르게 작성하면 실패한다.

```javascript
// routes/middlewares.js
test("1 + 1은 2입니다.", () => {
  expect(1 + 1).toEqual(3);
});
```

<img width="450" alt="실패" src="https://user-images.githubusercontent.com/35963403/126959973-80bacfc7-39b3-41ad-8c58-f9d5fd7ea8d1.PNG">

## **2. 유닛 테스트**

---

### 2.1. middlewares 테스트하기

middlewares.test.js를 작성한다.

```javascript
// routes/middlewares.test.js
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

describe("isLoggedIn", () => {
  test("로그인되어 있으면 isLoggedIn이 next를 호출해야 한다.", () => {});

  test("로그인되어 있으면 isLoggedIn이 에러를 응답해야 한다.", () => {});
});

describe("isNotLoggedIn", () => {
  test("로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 한다.", () => {});

  test("로그인되어 있으면 isNotLoggedIn이 next를 호출해야 한다.", () => {});
});
```

- 테스트 틀을 잡는다.
- describe로 테스트 그룹화가 가능하다.

---

### 2.2. req, res 모킹하기

미들웨어 테스트를 위해 req와 res를 가짜로 만들어 주어야 한다.

- jest.fn()으로 함수를 모킹한다.

```javascript
// routes/middlewares.test.js
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

describe("isLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();
  ...
});

describe("isNotLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
    redirect: jest.fn(),
  };
  const next = jest.fn();
  ...
});
```

**모킹(Mocking)** 이란?

- 단위 테스트를 작성할 때 외부에 의존하는 부분을 임의의 가짜로 대체하는 기법이다.
- 독립적으로 실행이 가능한 단위 테스트를 작성하기 위해 사용되는 기법이다.

---

### 2.3. expect 메서드

expect 에는 toEqual 말고도 많은 메서드를 지원한다.

```javascript
// routes/middlewares.test.js
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

describe("isLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("로그인되어 있으면 isLoggedIn이 next를 호출해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test("로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("로그인 필요");
  });
});

describe("isNotLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test("로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    const message = encodeURIComponent("로그인한 상태입니다.");
    isNotLoggedIn(req, res, next);
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  test("로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
```

- toBeCalledWith로 인수를 체크한다.
- toBeCalledTimes로 호출 횟수를 체크한다.

## <img width="450" alt="캡처3" src="https://user-images.githubusercontent.com/35963403/126960037-e58581a1-8204-4646-9f2f-a6c0f05fcd2b.PNG">

### 2.4. 라우터 테스트 위해 분리하기

라우터도 미들웨어이므로 분리해서 테스트가 가능하다.

async 함수를 테스트 할 때 await을 해야한다.

- addFollowing에 await을 붙여야지 addFollowing이 다 끝나고 expect가 실행된다.
  - await을 붙이지 않으면 실행이 다 되기전에 expect가 실행될 수도 있다.

### 2.5. 라우터 테스트

---

### 2.6. DB 모킹하기

Jest를 사용해 모듈 모킹이 가능하다(jest.mock).

- 메서드에 mockReturnValue 메서드가 추가되어 리턴값 모킹이 가능하다.

## **3. 테스트 커버리지**

---

### 3.1.

## **4. 통합 테스트**

---

### 4.1.

## **5. 부하 테스트**

---

### 5.1.
