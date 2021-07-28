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

- npm i -D jest
- Nodebird 프로젝트에 설치한다.
- package.json 의 "scripts" 에 넣어놓으면 npm (run) test 로 실행이 가능하다.

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

---

### 2.4. 라우터 테스트 위해 분리하기

라우터도 미들웨어이므로 분리해서 테스트가 가능하다.

```javascript
// controllers/user.js
const User = require("../models/user");

exports.addFollowing = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowings([parseInt(req.params.id, 10)]);
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
```

```javascript
// routes/user.js
const express = require("express");

const { isLoggedIn } = require("./middlewares");
const { addFollowing } = require("../controllers/user");

const User = require("../models/user");

const router = express.Router();

router.post("/:id/follow", isLoggedIn, addFollowing);

module.exports = router;
```

---

### 2.5. 라우터 테스트

async 함수를 테스트 할 때 await을 해야한다.

- addFollowing에 await을 붙여야지 addFollowing이 다 끝나고 expect가 실행된다.
  - await을 붙이지 않으면 실행이 다 되기전에 expect가 실행될 수도 있다.

```javascript
// controllers/user.test.js
const { addFollowing } = require("./user");

describe("addFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 한다.", async () => {
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("사용자를 못찾으면 res.status(404).send(no user)를 호출한다.", async () => {
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에서 에러가 발생하면 next(error)를 호출한다.", async () => {
    const error = "테스트용 에러";
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
```

---

### 2.6. DB 모킹하기

Jest를 사용해 모듈 모킹이 가능하다(jest.mock).

- 메서드에 mockReturnValue 메서드가 추가되어 리턴값 모킹이 가능하다.

require 하는 모듈들은 미리 모킹을 해놔야 한다.

- require 하는 모듈들은 지금 테스트할 대상이 아니다.
- jest.mock 이 require보다 위에 있어야 가짜로 바꾼다음에 require 한다.

```javascript
// controllers/user.test.js
const { addFollowing } = require("./user");
jest.mock("../models/user");
const User = require("../models/user");

describe("addFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 한다.", async () => {
    User.findOne.mockReturnValue(
      Promise.resolve({
        id: 1,
        name: "don",
        addFollowings(value) {
          return Promise.resolve(true);
        },
      })
    );
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("사용자를 못찾으면 res.status(404).send(no user)를 호출한다.", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에서 에러가 발생하면 next(error)를 호출한다.", async () => {
    const error = "테스트용 에러";
    User.findOne.mockReturnValue(Promise.reject(error));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
```

## **3. 테스트 커버리지**

---

### 3.1. 테스트 커버리지란?

전체 코드 중에서 테스트되고 있는 코드의 비율이다.

- 테스트되지 않는 코드의 위치도 알려준다.
- jest -coverage
- Stmts: 구문
- Branch: 분기점
- Funcs: 함수
- Lines: 줄 수

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
        "coverage": "jest --coverage"
    },
    ...
```

---

### 3.2. 테스트 커버리지 올리기

models/users.js의 5 ~ 48 줄을 확인한다.

<img width="496" alt="커버리지1" src="https://user-images.githubusercontent.com/35963403/127262364-ef06e160-a512-45d7-b9e3-75478b65e824.PNG">

```javascript
// models/user.js
const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    // 팔로잉 팔로워 구분하기 위해 foreignKey
    db.User.belongsToMany(db.User, {
      foreignKey: "followingId", // followingId를 검색해서 팔로워들을 알 수 있음
      as: "Followers",
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      // followerId를 검색해서 누굴 팔로잉 하는지 알 수 있음
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
  }
};
```

---

### 3.3. 테스트 커버리지 올리기

models/user.test.js 를 작성한다.

```javascript
// models/user.test.js
const User = require("./user");
const Sequelize = require("sequelize");
const config = require("../config/config.js")["test"];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

describe("User 모델", () => {
  test("static init 메서드 호출", () => {
    expect(User.init(sequelize)).toBe(User);
  });

  test("static associate 메서드 호출", () => {
    const db = {
      User: {
        hasMany: jest.fn(),
        belongsToMany: jest.fn(),
      },
      Post: {},
    };
    User.associate(db);
    expect(db.User.hasMany).toBeCalledWith(db.Post);
    expect(db.User.belongsToMany).toBeCalledTimes(2);
  });
});
```

<img width="496" alt="커버리2ㅣ" src="https://user-images.githubusercontent.com/35963403/127262449-24f2e0a1-dc0b-4fd5-9673-81c81f9455f6.PNG">

---

### 3.4. 테스트 커버리지 주의점

모든 코드가 테스트되지 않는데도 커러리지가 100%이다.

- 테스트 커버리지를 맹신할 필요는 없다.
- 커버리지를 높이는 것이 의미는 있지만 높이는 데 너무 집착할 필요는 없다.
- 필요한 부분 위주로 올바르게 테스트하는 것이 좋다.

## **4. 통합 테스트**

---

### 4.1. 통합 테스트 해보기

라우터 하나를 통째로 테스트 해본다.

- 여러 개의 미들웨어, 모듈을 한 번에 테스트한다.
- app.js를 분리한다.
  - app.listen()이 있으면 app.js을 실행할 때 서버가 실제로 돌아간다.
  - server.js를 만들고 app.listen()을 넣는다.
- Supertest를 사용한다.
  - npm i -D supertest
  - 요청을 모킹한다.
    - 실제 요청을 보내면 DB에 영향을 미칠수도 있어서 가짜 요청을 보내고 가짜 응답을 검사한다.

```javascript
// app.js
...
app.use((err, req, res, next) => {
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exprots = app;
```

```javascript
// server.js
const app = require("./app");

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
```

```javascript
// package.json
{
    "name": "nodebird",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "nodemon server",
        "test": "jest",
        "coverage": "jest --coverage"
    },
    ...
```

---

### 4.2. 테스트용 DB 설정하기

개발/배포용 DB랑 별도로 설정하는 것이 좋다.

- config/config.js의 test 속성을 수정한다.

```javascript
// config/config.js
require("dotenv").config();
const env = process.env;

const development = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    dialect: "mysql",
    //port: env.MYSQL_PORT
};

const test = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE_TEST,
    host: env.MYSQL_HOST,
    dialect: "mysql",
    //port: env.MYSQL_PORT
};
...
```

<img width="500" alt="통합테스트" src="https://user-images.githubusercontent.com/35963403/127265313-34caf23d-6f1d-49fd-82be-ee65f6a98760.png">

---

### 4.3. 라우터 테스트

routes/auth.test.js를 작성한다.

- 서버는 실행 안되지만 라우터는 실행된다.
- request(app).post(주소)로 요청한다.
- send로 data를 전송한다.
- login을 두번 테스트 하는이유

  - 하나는 beforeEach를 적용 받지 않는다.

- **beforeAll**

  - 모든 테스트 전에 실행된다.
  - sequelize 테이블들이 생성된 채로 실행된다.

- **afterAll**

  - 테스트가 끌나고 실행된다.
  - 테스트할 때 사용한 테스트 DB를 초기화한다.
    - 다음 테스트를 할 때도 정상적인 테스트를 할 수 있게 해준다.

- **agent**

  - 한 번 로그인한 상태로 여러 테스트를 할 수 있다.

- **beforeEach**

  - 테스트 마다 붙어서 테스트 직전에 실행된다.

```javascript
// routes/auth.test.js
const request = require("supertest");
const { sequelize } = require("../models");
const app = require("../app");

beforeAll(async () => {
  await sequelize.sync();
});

describe("POST /join", () => {
  test("로그인 안했으면 가입한다.", (done) => {
    request(app)
      .post("/auth/join")
      .send({
        email: "don@naver.com",
        nick: "don",
        password: "123123",
      })
      .expect("Location", "/")
      .expect(302, done);
  });
});

describe("POST /login", () => {
  test("로그인 수행", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "don@naver.com",
        password: "123123",
      })
      .expect("Location", "/")
      .expect(302, done);
  });
});

describe("POST /login", () => {
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "don@naver.com",
        password: "123123",
      })
      .end(done);
  });

  test("이미 로그인 했는데 가입하면 redirect /에러", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post("/auth/join")
      .send({
        email: "don@naver.com",
        nick: "don",
        password: "123123",
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });

  test("이미 로그인 했는데 로그인하면 redirect /에러", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post("/auth/login")
      .send({
        email: "don@naver.com",
        password: "123123",
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

describe("POST /login", () => {
  test("가입되지 않은 회원", (done) => {
    const message = encodeURIComponent("가입되지 않은 회원입니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "dondon@naver.com",
        password: "123123",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });

  test("로그인 수행", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "don@naver.com",
        password: "123123",
      })
      .expect("Location", "/")
      .expect(302, done);
  });

  test("비밀번호 틀림", (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "don@naver.com",
        password: "wrong",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });
});

describe("GET /logout", () => {
  test("로그인 되어있지 않으면 403", (done) => {
    request(app).get("/auth/logout").expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "don@naver.com",
        password: "123123",
      })
      .end(done);
  });

  test("로그아웃 수행", (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");
    agent.get("/auth/logout").expect("Location", "/").expect(302, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
```

## **5. 부하 테스트**

---

### 5.1.
