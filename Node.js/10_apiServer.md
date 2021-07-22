# **웹 API 서버 만들기**

## **1. API 서버 이해하기**

---

### 1.1. NodeBird SNS 서비스

9장 NodeBird 서비스의 API 서버를 만든다.

**API**: Application Programming Interface

- 다른 애플리케이션에서 현재 프로그램의 기능을 사용할 수 있게 한다.
- 웹 API: 다른 웹 서비스의 기능을 사용하거나 자원을 가져올 수 있게 한다.
- 다른 사람에게 정보를 제공하고 싶은 부분만 API를 열고, 제공하고 싶지 않은 부분은 API를 만들지 않으면 된다.
- API에 제한을 걸어 일정 횟수 내에서만 가져가게 할 수도 있다.
- NodeBird에서는 인증된 사용자에게만 정보를 제공한다.

<img width="430" alt="api" src="https://user-images.githubusercontent.com/35963403/126451291-93acb76b-a64f-4087-bfd0-83fbcb2a67d7.PNG">

<br/>

## **2. 프로젝트 구조 갖추기**

---

### 2.1. NodeBird API 폴더 세팅

nodebird-api 폴더를 만들고 package.json를 생성한다.

- 생성 후 npm i로 패키지를 설치한다.
- NodeBird 프로젝트에서 config, models, passport 모두 복사해서 nodebird-api에 붙여넣는다.
- routes 폴더에서는 auth.js와 middlewares를 재사용한다.
- .env 파일을 복사한다.
- views 폴더를 만들고 error.html 파일을 생성한다.

### 2.2. app.js 생성하기

8002번 포트를 사용한다.

- 8001번을 사용하는 NodeBird 서비스와 8003을 사용할 nodecat 서비스와 함께 사용할 수 있다.
- 콘솔을 여러 개 실행해 각각의 서비스를 돌리면 된다.

nodebird-api/views/login.html 화면을 생성한다.

- NodeBird 서비스의 계정으로 로그인하면 된다(카카오톡 로그인은 안된다).

### 2.3. 도메일 모델 생성하기

models/domain.js를 작성한다.

```javascript
// models/domain.js
const Sequelize = require("sequelize");

module.exports = class Domain extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        host: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM("free", "premium"),
          allowNull: false,
        },
        clientSecret: {
          type: Sequelize.STRING(36),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Domain",
        tableName: "domains",
      }
    );
  }

  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
};
```

- API를 사용할 도메인(또는 호스트)을 저장하는 모델이다.
- API를 사용하려면 회원가입을 하고 도메인을 등록하고 허가를 받아야 한다.
  - API 서버를 통해 데이터를 가져가는데에 제한을 두기 위해
- ENUM type으로 free나 premium만 쓸 수 있게 제한한다.
- clientSecret은 uuid 타입으로 한다.
  - REST API 키, Android 키 등과 같은 역할을 한다.
- models/user.js에 db.User.hasMany(db.Domain); 을 추가한다.
- routes/inedx.js에 Domain 테이블을 추가한다.

### 2.4. 도메인 등록 라우터

routes/index에서 도메인 등록 라우터를 생성한다.

```javascript
// routes/index.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { User, Domain } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: (req.user && req.user.id) || null },
      include: { model: Domain },
    });
    res.render("login", {
      user,
      domains: user && user.Domains,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/domain", isLoggedIn, async (req, res, next) => {
  try {
    await Domain.create({
      UserId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientSecret: uuidv4(),
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

- uuid 패키지로 사용자가 등록한 도메인에 고유한 비밀번호(클라이언트 비밀키)를 부여한다.
- uuidv4()는 충돌(고유하지 않은 상황) 위험이 있지만 매우 희박하다.
- 비밀번호가 일치하는 요청만 API 응답한다.

### 2.5. 도메인 등록하고 비밀번호 발급받기

라우터 작성 후 localhost:8002로 접속한다.

- 도메인이 다른 프론트엔드에서 요청을 보내면 CORS 에러가 발생한다.
- 로그인 후 localhost:8003(nodecat 서버)을 등록한다.

<img width="300" alt="login1" src="https://user-images.githubusercontent.com/35963403/126648865-d6ba6ef1-c003-4fb9-8104-01cafcad6d95.PNG">

- http://localhost:8002 접속 화면

<img width="300" alt="login2" src="https://user-images.githubusercontent.com/35963403/126648896-4811c07b-f892-4544-8113-d8eab04ce9d6.PNG">

- 도메인 등록 화면

<img width="300" alt="login3" src="https://user-images.githubusercontent.com/35963403/126648940-15babb5a-af16-4408-9e50-2dfaa7c9fbeb.png">

- 도메인 등록 후 화면

<br/>

## **3. JWT 토큰으로 인증하기**

---

### 3.1. 인증을 위한 JWT

NodeBird가 아닌 다른 클라이언트가 데이터를 가져가게 하려면 인증 과정이 필요하다.

- **JWT**(JSON Web Token)을 사용한다.
  - 헤더, 페이로드, 시그니처로 구성된다.
  - 헤더: 토큰 종류와 해시 알고리즘 정보가 들어있다.
  - 페이로드: 토큰의 내용물이 인코딩된 부분이다.
  - 시그니처: 일련의 문자열로, 시그니처를 통해 토큰이 변조되었는지 여부를 확인한다.
    - 시그니처는 JWT 비밀키로 만들어지고, 비밀키가 노출되면 토큰 위조가 가능하다.

### 3.2. JWT 사용 시 주의점

JWT에 민감한 내용을 넣으면 안된다.

- 페이로드 내용을 볼 수 있다.
- 그럼에도 사용하는 이유는 토큰 변조가 불가능하고, 내용물이 들어있기 때문이다.
- 내용물이 들어있으므로 데이터베이스 조회를 하지 않을 수 있다(데이터베이스 조회는 비용이 큰 작업이다).
- 노출되어도 괜찮은 정보만 넣어야 한다.
- 용량이 커서 요청 시 데이터 양이 증가한다는 단점이 있다.

### 3.3. 노드에서 JWT 사용하기

JWT 모듈을 설치한다.

- npm i jsonwebtoken
- JWT 비밀키를 .env에 저장한다.

```javascript
// nodebird-api/routes/middlewares.js

const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다",
      });
    }
    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다",
    });
  }
};
```

- JWT 토큰을 검사하는 verifyToken 미들웨어를 작성한다.
- jwt.verify() 메서드로 검사 가능하다.
  - 요청을 보낼 때 헤더에 authorization과 jwt 키를 같이 넣어서 서버로 보내면 req.headers.authorization에 담긴다.
  - 두 번째 인수는 JWT 비밀키이다.
- JWT 토큰은 req.headers.authorization에 들어 있다.
- 만료된 JWT 토큰인 경우 419 에러가 발생한다.
- 유효하지 않은 토큰인 경우 401에러가 발생한다.
- req.decoded에 페이로드를 넣어 다음 미들웨어에서 쓸 수 있게 한다.

### 3.4. JWT 토큰 발급 라우터 만들기

routes/v1.js을 작성한다.

- 버전 1이라는 뜻의 v1.js
- 한 번 버전이 정해진 후에는 라우터를 함부로 수정하면 안 됨
- 다른 사람이 기존 API를 쓰고 있기 때문(그 사람에게 영향이 감)
- 수정 사항이 생기면 버전을 올려야 함

- POST /token에서 JWT 토큰 발급
- 먼저 도메인 검사 후 등록된 도메인이면 jwt.sign 메서드로 JWT 토큰 발급
- 첫 번째 인수로 페이로드를 넣고, 두 번째 인수는 JWT 비밀키, 세 번째 인수로 토큰 옵션(expiresIn은 만료 시간, issuer은 발급자)
- expiresIn은 1m(1분), 60 \* 1000같은 밀리초 단위도 가능

- GET /test 라우터에서 토큰 인증 테스트 가능

- 라우터의 응답은 일정한 형식으로 해야 사용자들이 헷갈리지 않음

### 3.5. app.js에 라우터 연결

app.js에 v1 라우터를 연결한다.

### 3.6. JWT 토큰으로 로그인하기

세션 쿠키 발급 대신 JWT 토큰을 쿠키로 발급하면 된다.

- Authenticate 메서드의 두 번째 인수로 옵션을 주면 세션을 사용하지 않는다.

클라이언트에서 JWT를 사용하고 싶으면?

- process.env.JWT_SECRET은 클라이언트에서 노출되면 안 됨
- RSA같은 양방향 비대칭 암호화 알고리즘을 사용해야 함
- JWT는 PEM 키를 사용해서 양방향 암호화를 하는 것을 지원함

<br/>

## **4. 호출 서버 만들기**

---

### 4.1. API 호출용 서버 만들기

nodecat 폴더를 만들고 package.json 파일을 만든다.

### 4.2. 간단한 폴더 구조 갖추기

app.js 파일을 생성한다.

- views/error.html은 nodebird-api로부터 복사한다.
- 아까 발급받은 비밀키를 .env에 입력한다.

```javascript
// nodecat/.env
COOKIE_SECRET = nodecat;
CLIENT_SECRET = [];
```

### 4.3. 토큰 테스트용 라우터 만들기

routes/index.js 생성

- GET /test에 접근 시 세션 검사
- 세션에 토큰이 저장되어 있지 않으면 POST http://localhost:8002/v1/token 라우터로부터 토큰 발급
- 이 때 HTTP 요청 본문에 클라이언트 비밀키 동봉
- 발급에 성공했다면 발급받은 토큰으로 다시 GET https://localhost:8002/v1/test 라우터 접근해서 토큰 테스트

### 4.4. 실제 요청 보내기

npm start로 서버 시작

<br/>

## **5. SNS API 서버 만들기**

---

### 5.1.

<br/>

## **6. 사용량 제한 구현하기**

---

### 6.1.

<br/>

## **7. CORS 이해하기**

---

### 7.1.
