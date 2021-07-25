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

---

### 2.2. app.js 생성하기

8002번 포트를 사용한다.

- 8001번을 사용하는 NodeBird 서비스와 8003을 사용할 nodecat 서비스와 함께 사용할 수 있다.
- 콘솔을 여러 개 실행해 각각의 서비스를 돌리면 된다.

nodebird-api/views/login.html 화면을 생성한다.

- NodeBird 서비스의 계정으로 로그인하면 된다(카카오톡 로그인은 안된다).

---

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

---

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

---

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

---

### 3.2. JWT 사용 시 주의점

JWT에 민감한 내용을 넣으면 안된다.

- 페이로드 내용을 볼 수 있다.
- 그럼에도 사용하는 이유는 토큰 변조가 불가능하고, 내용물이 들어있기 때문이다.
- 내용물이 들어있으므로 데이터베이스 조회를 하지 않을 수 있다(데이터베이스 조회는 비용이 큰 작업이다).
- 노출되어도 괜찮은 정보만 넣어야 한다.
- 용량이 커서 요청 시 데이터 양이 증가한다는 단점이 있다.

---

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

---

### 3.4. JWT 토큰 발급 라우터 만들기

routes/v1.js을 작성한다.

```javascript
// nodebird-api/routes/v1.js
...
 const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m', // 1분
            issuer: 'nodebird',
        });
...
```

- 버전 1이라는 뜻의 v1.js
- 한 번 버전이 정해진 후에는 라우터를 함부로 수정하면 안된다.

  - 다른 사람이 기존 API를 쓰고 있기 때문(그 사람에게 영향이 간다)
  - 수정 사항이 생기면 버전을 올려야 한다.

- POST /token에서 JWT 토큰을 발급한다.
- 먼저 도메인 검사 후 등록된 도메인이면 jwt.sign 메서드로 JWT 토큰을 발급한다.
- 첫 번째 인수로 페이로드를 넣고, 두 번째 인수는 JWT 비밀키, 세 번째 인수로 토큰 옵션(expiresIn은 만료 시간, issuer은 발급자)
- expiresIn은 1m(1분), 60 \* 1000같은 밀리초 단위도 가능하다.

- GET /test 라우터에서 토큰 인증 테스트가 가능하다.

- 라우터의 응답은 일정한 형식으로 해야 사용자들이 헷갈리지 않는다.

- axios 요청을 할 때 res.json(req.decoded)을 보내면 result.data가 된다.

---

### 3.5. app.js에 라우터 연결

app.js에 v1 라우터를 연결한다.

```javascript
// nodebird-api/app.js
...
const dotenv = require('dotenv');
const v1 = require('./routes/v1');
const authRouter = require('./routes/auth');
...
app.use(passport.session());

app.use('/v1', v1);
app.use('/auth', authrouter);
...
```

---

### 3.6. JWT 토큰으로 로그인하기

세션 쿠키 발급 대신 JWT 토큰을 쿠키로 발급하면 된다.

```javascript
// nodebird-api/routes/auth.js
...
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', { session: false }, (authError, user, info) => {
        if (authError) {
...
```

- Authenticate 메서드의 두 번째 인수로 옵션을 주면 세션을 사용하지 않는다.

클라이언트에서 JWT를 사용하고 싶으면?

- process.env.JWT_SECRET은 클라이언트에서 노출되면 안된다.
- RSA같은 양방향 비대칭 암호화 알고리즘을 사용해야 한다.
- JWT는 PEM 키를 사용해서 양방향 암호화를 하는 것을 지원한다.

<br/>

## **4. 호출 서버 만들기**

---

### 4.1. API 호출용 서버 만들기

nodecat 폴더를 만들고 package.json 파일을 만든다.

```javascript
// nodecat/package.json
{
  "name": "nodecat",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "don",
  "license": "MIT",
  "dependencies": {
    "axios": "^0.21.1",
    "cookie-parser": "^1.4.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-session": "^1.17.2",
    "morgan": "^1.10.0",
    "nunjucks": "^3.2.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
}
```

---

### 4.2. 간단한 폴더 구조 갖추기

app.js 파일을 생성한다.

```javascript
// nodecat/app.js
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config();
const indexRouter = require("./routes");

const app = express();
app.set("port", process.env.PORT || 4000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use("/", indexRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
```

- views/error.html은 nodebird-api로부터 복사한다.
- 아까 발급받은 비밀키를 .env에 입력한다.

```javascript
// nodecat/.env
COOKIE_SECRET = nodecat;
CLIENT_SECRET = [];
```

---

### 4.3. 토큰 테스트용 라우터 만들기

routes/index.js 을 생성한다.

```javascript
// nodecat/routes/index.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/test", async (req, res, next) => {
  // 토큰 테스트 라우터
  try {
    if (!req.session.jwt) {
      // 세션에 토큰이 없으면 토큰 발급 시도
      const tokenResult = await axios.post("http://localhost:8002/v1/token", {
        clientSecret: process.env.CLIENT_SECRET,
      });
      if (tokenResult.data && tokenResult.data.code === 200) {
        // 토큰 발급 성공
        req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
      } else {
        // 토큰 발급 실패
        return res.json(tokenResult.data); // 발급 실패 사유 응답
      }
    }
    // 발급받은 토큰 테스트
    const result = await axios.get("http://localhost:8002/v1/test", {
      headers: { authorization: req.session.jwt },
    });
    return res.json(result.data);
  } catch (error) {
    console.error(error);
    if (error.response.status === 419) {
      // 토큰 만료 시
      return res.json(error.response.data);
    }
    return next(error);
  }
});

module.exports = router;
```

- GET /test에 접근 시 세션을 검사한다.
- 세션에 토큰이 저장되어 있지 않으면 POST http://localhost:8002/v1/token 라우터로부터 토큰을 발급한다.
- 이 때 HTTP 요청 본문에 클라이언트 비밀키를 동봉한다.
- 발급에 성공했다면 발급받은 토큰으로 다시 GET https://localhost:8002/v1/test 라우터에 접근해서 토큰을 테스트한다.

---

### 4.4. 실제 요청 보내기

npm start로 서버를 시작한다.

- http://localhost:4000/test/ 로 접속한다.

<br/>

## **5. SNS API 서버 만들기**

---

### 5.1. NodeBird 데이터 제공하기

nodebird-api의 라우터 작성

- GET /posts/my, GET /posts/hashtag/:title

```javascript
// nodebird-api/routes/v1.js
const express = require("express");
const jwt = require("jsonwebtoken");

const { verifyToken } = require("./middlewares");
const { Domain, User, Post, Hashtag } = require("../models");

const router = express.Router();

router.post("/token", async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ["nick", "id"],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요",
      });
    }
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m", // 1분
        issuer: "nodebird",
      }
    );
    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

router.get("/test", verifyToken, (req, res) => {
  res.json(req.decoded);
});

router.get("/posts/my", verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: "서버 에러",
      });
    });
});

router.get("/posts/hashtag/:title", verifyToken, async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({
      where: { title: req.params.title },
    });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        messgae: "검색 결과가 없습니다.",
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

module.exports = router;
```

---

### 5.2. NodeBird 데이터 가져오기

nodecat의 라우터를 작성한다.

```javascript
// nodecat/routes/index.js
const express = require("express");
const axios = require("axios");

const router = express.Router();
const URL = "http://localhost:8002/v1";

axios.defaults.headers.origin = "http://localhost:4000"; // origin 헤더 추가

const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      // 세션에 토큰이 없으면
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    });
  } catch (error) {
    console.error(error);
    if (error.response.status === 419) {
      // 토큰 만료시 토큰 재발급 받기
      delete req.session.jwt;
      return request(req, api);
    } // 419 외의 다른 에러면
    return error.response;
  }
};

router.get("/mypost", async (req, res, next) => {
  try {
    const result = await request(req, "/posts/my");
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/search/:hashtag", async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

module.exports = router;
```

- 토큰을 발급받고 요청을 보내는 부분을 request 함수로 만들어 둔다.
- 요청은 axios로 보내고 세션 토큰 검사, 재발급까지 같이 수행한다.

---

### 5.3. 실제 요청 보내기

localhost:4000/mypost 에 접속하면 게시글을 받아온다(NodeBird 서비스에 게시글이 있어야 한다).

localhost:4000/search/:hashtag 에 접속하면 해시태그를 검색한다.

<br/>

## **6. 사용량 제한 구현하기**

---

### 6.1. 사용량 제한 구현하기

DOS 공격 등을 대비해야 한다.

```javascript
// nodebird-api/routes/middlewares.js
const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');
...
exports.apiLimiter = new RateLimit({
    windowMs: 60 * 1000, // 1분
    max: 10,
    delayMs: 0,
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode, // 기본값 429
            message: '1분에 한 번만 요청할 수 있습니다.',
        });
    },
});

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
    });
};
```

- 일정 시간동안 횟수 제한을 두어 무차별적인 요청을 막을 필요가 있다.
- npm i express-rate-limit
- apiLimiter() 미들웨어를 추가한다.
  - windowMS(기준 시간)
  - max(허용 횟수)
  - delayMS(호출 간격)
  - handler(제한 초과 시 콜백 함수)
- deprecated 미들웨어는 사용하면 안 되는 라우터에 붙여서 사용 시 경고한다.

---

### 6.2. 응답 코드 정리

응답 코드를 정리해서 어떤 에러가 발생했는지 알려주기

- 일관성이 있으면 된다.

| 응답 코드 | 메시지                                              |
| --------- | --------------------------------------------------- |
| 200       | JSON 데이터입니다.                                  |
| 401       | 유효하지 않은 토큰입니다.                           |
| 410       | 새로운 버전이 나왔습니다. 새로운 버전을 사용하세요. |
| 419       | 토큰이 만료되었습니다.                              |
| 429       | 1분에 한 번만 요청할 수 있습니다.                   |
| 500~      | 기타 서버 에러                                      |

---

### 6.3. 새 라우터 버전 내놓기

사용량 제한 기능이 추가되어 기존 API와 호환되지 않는다.

- 이런 경우 새로운 버전의 라우터를 내놓으면 된다.

```javascript
// nodebird-api/routes/v1.js
const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, deprecated } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(deprecated);

router.post('/token', async (req, res) => {
  ...
});
...
```

```javascript
// nodebird-api/routes/app.js
...
const v1 = require('./routes/v1');
const v2 = require('./routes/v2');
const authRouter = require('/routes/auth');
...
app.use('/v1', v1);
app.use('/v2', v2);
app.use('/auth', authRouter);
...
```

- v2 라우터 작성(apiLimiter가 추가된다).
  - apiLimiter는 router.use(apiLimiter); 할 때 미들웨어의 순서를 고려해야 한다.
    - verifyToken을 먼저 하고 apiLimiter을 하는 경우
      - verifyToken 뒤에 apiLimiter을 적는다.
    - apiLimiter을 먼저 하고 verifyToken을 하는 경우
      - router.use(apiLimiter); 을 적는다.
- v1 라우터는 deprecated 처리된다(router.use로 한 번에 모든 라우터에 적용한다).

---

### 6.4. 새 라우터 실행해보기

nodecat의 버전 v2로 바꾸기

```javascript
// nodecat/routes/index.js
const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v2';
...
```

v1 API를 사용하거나 사용량을 초과하면 에러 발생

<img width="400" alt="v2" src="https://user-images.githubusercontent.com/35963403/126737848-6d902f18-bd37-4ccf-a84e-399971f57bd2.PNG">

- deprecated된 API 사용 화면

<img width="400" alt="v22" src="https://user-images.githubusercontent.com/35963403/126737855-fb42b152-2e60-4e33-8aaa-8d3dabc8d787.PNG">

- 사용량 초과 화면

<br/>

## **7. CORS 이해하기**

---

### 7.1. nodecat 프론트 작성하기

프론트에서 서버의 API를 호출하면 어떻게 될까?

- routes/index.js 와 views/main.html 을 작성한다.

```javascript
// nodecat/routes/index.js
...
router.get('/', (req, res) => {
  res.render('main', { key: process.env.CLIENT_SECRET });
});

module.exports = router;
```

---

### 7.2. 프론트에서 요청 보내기

localhost:4000 에 접속하면 에러가 발생한다.

**요청을 보내는 프론트(localhost:4000), 요청을 받는 서버(localhost:8002)가 다르면 에러가 발생한다(서버에서 서버로 요청을 보낼때는 발생하지 않는다).**

- **CORS**: Cross-Origin Resource Sharing 문제
- POST 대신 OPTIONS 요청을 먼저 보내 서버가 도메인을 허용하는지 미리 체크한다.
- 브라우저에서 나는 에러이지만 서버에서 처리를 해주어야 한다.

---

### 7.3. CORS 문제 해결 방법

Access-Control-Allow-Origin 응답 헤더를 넣어주어야 CORS 문제 해결이 가능하다.

- res.set() 메서드로 직접 넣어주어도 되지만 패키지를 사용하는게 편리하다.
- npm i cors
- v2 라우터에 적용한다.
- credentials: true 를 해야 프론트와 백엔드 간에 쿠키가 공유된다.

```javascript
// nodebird-api/routes/v2.js
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(cors({
  credentials: true,
}));
...
```

---

### 7.4. CORS 적용 확인하기

http://localhost:4000 에 접속하면 정상적으로 토큰이 발급된다.

- 브라우저에서 Method가 OPTIONS인 token을 전송해서 서버가 허용하는지 먼저 확인한다.
  - Access-Control-Allow-Origin 헤더가 들어 있다.
- 허용했으면 원래 요청인 POST를 보낸다.

---

### 7.5. 클라이언트 도메인 검사하기

```javascript
// nodebird-api/routes/v2.js
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const url = require("url");

const { verifyToken, apiLimiter } = require("./middlewares");
const { Domain, User, Post, Hashtag } = require("../models");

const router = express.Router();
router.use((req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: url.parse(req.get("origin")) ? host : undefined },
  });
  if (domain) {
    cors({
      origin: true,
      credentials: true,
    })(req, res, next);
  } else {
    next();
  }
});
```

클라이언트 환경에서는 비밀키가 노출된다.

- app.use() 보다 개별 라우터마다 다르게 적용하는게 좋다.
  - origin: true로 해놓으면 모든 주소가 허용되기 때문에 보안상 위협이 된다.
    - 미들웨어 확장 패턴을 사용하여 엄격하게 검사를 해야 한다.
- 도메인까지 같이 검사해야 요청 인증이 가능하다.
- 호스트와 비밀키가 모두 일치할 때만 CORS를 허용한다.
- 클라이언트와 도메인(req.get('origin'))과 등록된 호스트가 일치하는지 찾는다.
  - cors의 인자로 origin을 주면 \* 대신 주어진 도메인만 허용할 수 있다.
- url.parse().host는 http 같은 프로토콜을 떼어내기 위해서 사용한다.
- { host: url.parse(req.get('origin'))?.host }
  - nodecat/routes/index.js 에서 설정한 origin을 API 서버인 nodebird-api 에서 사용한다.
  - 노드 14 문법: url.parse()가 undefined이면 undefined, 객체로 존재하면 객체 안에서 host를 꺼내온다.

---

### 7.6. 유용한 미들웨어 패턴 알아보기

```javascript
router.use(cors());

router.use((req, res, next) => {
  cors()(req, res, next);
});
```

- 아래처럼 쓰면 미들웨어 위 아래로 임의의 코드를 추가할 수 있다.
  - 미들웨어 확장 패턴

---

### 7.7. CORS 요청 보내기

localhost:4000 에 접속한다.

- 응답 헤더의 도메인을 확인한다.

---

### 7.8. 프록시 서버

CORS 문제에 대한 또다른 해결책이다.

- 서버-서버 간의 요청/응답에는 CORS 문제가 발생하지 않는 것을 활용한다.
- 직접 구현해도 되지만 http-proxy-middleware 같은 패키지로 손쉽게 연동이 가능하다.
