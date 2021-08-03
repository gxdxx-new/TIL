# **익스프레스로 SNS 서비스 만들기**

## **1. 프로젝트 구조 갖추기**

---

### 1.1. NodeBird SNS 서비스

기능: 로그인, 이미지 업로드, 게시글 작성, 해시태그 검색, 팔로잉

- express-generator 대신 직접 구조를 갖춘다.
- 프론트엔드 코드보다 노드 라우터 중심으로 한다.
- 관계형 데이터베이스 MySQL을 사용한다.

---

### 1.2. 프로젝트 시작하기

nodebird 폴더를 만들고 package.json 파일을 생성한다.

- 노드 프로젝트의 기본
- npm init

```javascript
// package.json
{
    "name": "nodebird",
    "version": "0.0.1",
    "description": "익스프레스로 만드는 SNS 서비스",
    "main": "app.js",
    "scripts": {
        "start": "nodemon app"
    },
    "author": "don",
    "license": "MIT",
}
```

시퀄라이즈 폴더 구조를 생성한다.

- npm sequelize init을 하면 config, migrations, node_modules, seeders 폴더가 생성된다.

```javascript
// console
$ npm i sequelize mysql2 sequelize-cli
$ npx sequelize init
```

---

### 1.3. 폴더 구조 설정

views(템플릿 엔진), routes(라우터), public(정적 파일), passport(패스포트) 폴더를 생성한다.

- app.js와 .env 파일도 생성한다.

---

### 1.4. 패키지 설치와 nodemon

npm 패키지 설치 후 nodemon도 설치한다.

- nodemon은 서버 코드가 변경되었을 때 자동으로 서버를 재시작해 준다.
- nodemon은 콘솔 명령어이기 때문에 글로벌로 설치한다.

```javascript
// console
$ npm i express cookie-parser express-session morgan multer dotenv nunjucks
$ npm i -D nodemon
```

---

### 1.5. app.js

노드 서버의 핵심인 app.js 파일을 생성한다.

- dotenv.config(); 는 최대한 위로 올려야 한다.
  - dotenv.config(); 이후부터 process.env 값들이 적용된다.
- app.set("port", process.env.PORT || 8001);
  - 개발할 때는 8001, 배포할 때는 80 또는 443을 사용한다.
- res.locals
  - 템플릿 엔진에서 message, error 변수 사용할 수 있게 해준다.

```javascript
// app.js
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config();
const pageRouter = require("./routes/page");

const app = express();
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use("/", pageRouter);

app.use((req, res, next) => {
  // 404 처리 미들웨어
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  // 에러 미들웨어
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
```

---

### 1.6. 라우터 생성

```javascript
// routes/page.js
const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

router.get("/", (req, res, next) => {
  const twits = [];
  res.render("main", {
    title: "NodeBird",
    twits,
  });
});

module.exports = router;
```

- routes/page.js: 템플릿 엔진을 렌더링하는 라우터
- views/layout.html: 프론트 엔드 화면 레이아웃(로그인/유저 정보 화면)
- views/main.html: 메인 화면(게시글들이 보임)
- views/profile.html: 프로필 화면(팔로잉 관계가 보임)
- views/error.html: 에러 발생 시 에러가 표시될 화면
- public/main.css: 화면 CSS

npm start로 서버 실행 후 http://localhost:8081 로 접속한다.

<br/>

## **2. 데이터베이스 세팅하기**

---

### 2.1. 모델 생성

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
    db.User.belongsToMany(db.User, {
      foreignKey: "followingId",
      as: "Followers",
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
  }
};
```

```javascript
// models/post.js
const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
  }
};
```

```javascript
// models/hashtag.js;
const Sequelize = require("sequelize");

module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Hashtag",
        tableName: "hashtags",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  }
};
```

- models/user.js: 사용자 테이블과 연결된다.
  - 시퀄라이즈는 id를 생략한다.
  - password: bcrypt로 암호화하면 길이가 늘어나는걸 대비하기 위해 100글자로 지정한다.
  - provider: 카카오 로그인인 경우 kakao, 로컬 로그인(이메일/비밀번호)인 경우 local
  - snsId: 카카오 로그인인 경우 주어지는 id
  - timestamps: created_at, updated_at이 기록된다.
  - paranoid: deleted_at이 기록된다.
- models/post.js: 게시글 내용과 이미지 경로를 저장한다(이미지는 파일로 저장).
- models/hashtag.js: 해시태그 이름을 저장한다(나중에 태그로 검색하기 위해서).
  - belongsToMany는 중간테이블이 생긴다.

---

### 2.2. models/index.js

```javascript
// models/inedx.js
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Post = require("./post");
const Hashtag = require("./hashtag");

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;
```

시퀄라이즈가 자동으로 생성해주는 코드 대신 다음과 같이 변경한다.

- 모델들을 불러옴(require)
- 모델 간 관계가 있는 경우 관계 설정
- User(1):Post(다)
- Post(다):Hashtag(다)
- User(다):User(다)

---

### 2.3. associate 작성하기

모델관의 관계를 associate에 작성한다.

- 1대다: hasMany와 belongsTo
- 다대다: belongsToMany
  - foreignKey: 외래키
  - as: 컬럼에 대한 별명
  - through: 중간 테이블명

---

### 2.4. 팔로잉-팔로워 다대다 관계

<img width="550" alt="db" src="https://user-images.githubusercontent.com/35963403/126131266-ec439c7d-f2af-4dc6-a8b6-b70fdad52a63.PNG">

User(다):User(다)

- 다대다 관계이므로 중간 테이블(Follow)이 생성된다.
- 모델 이름이 같으므로 구분이 필요하다(as가 구분자 역할, foreignKey는 반대 테이블 컬럼의 프라이머리 키 컬럼).
- 시퀄라이즈는 as 이름을 바탕으로 자동으로 addFollower, getFollowers, addFollowing, getFollowings 메서드를 생성한다.

---

### 2.5. 시퀄라이즈 설정하기

시퀄라이즈 설정은 config/config.json에서 한다.

- 개별환경용 설정은 development 아래에 한다.

```javascript
// config/config.json
{
    "development": {
        "username": "root",
        "password": "[root 비밀번호]",
        "database": "nodebird",
        "host": "127.0.0.1",
        "dialect": "mysql",
    },
}
```

설정 파일 작성 후 nodebird 데이터베이스를 생성한다.

```javascript
// console
$ npx sequelize db:create
```

---

### 2.6. 모델과 서버 연결하기

sequelize.sync()가 테이블을 생성한다.

- IF NOT EXIST(SQL문)으로 테이블이 없을 때만 생성해준다.

```javascript
// app.js
...
const pageRouter = require('./routes/page');
const { sequelize } = require('./moedls');
...
nunjucks.configure('views', {
    express: app,
    watch: true,
});
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan('dev'));
...
```

- 테이블 정의를 수정하면 테이블을 수동으로 수정해줘야 한다.
  - force
    - true: 테이블이 지워졌다가 다시 생성된다.
      - 데이터가 날라가므로 조심해야 한다.
    - false: 개발환경에서만 사용한다.
  - alter
    - true: 데이터는 유지하고 테이블 컬럼 바뀐것만 반영한다.
      - 기존 데이터와 맞지 않아 에러 발생할 수 있다.

<br/>

## **3. 패스포트 모듈로 로그인**

---

### 3.1. 패스포트 설치하기

```javascript
// app.js
...
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
passportConfig();
...
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
```

로그인 과정을 쉽게 처리할 수 있게 도와주는 Passport를 설치한다.

- 비밀번호 암호화를 위한 bcrypt도 같이 설치한다.
  - 설치 후 app.js와도 연결한다.
- passportConfig()를 통해 passport.serializeUser()와 passport.deserializeUser()를 사용할 수 있게 된다.
- passport.initialize(): 요청 객체에 passport 설정을 심는다.
  - express-session 미들웨어에 의존하므로 이보다 더 뒤에 위치해야 한다.
- passport.session(): req.session 객체에 passport 정보를 저장한다.
  - express-session 미들웨어에 의존하므로 이보다 더 뒤에 위치해야 한다.
  - 로그인 후 그 다음 요청부터 passport.session()이 실행될 때 ()이 실행된다.

```javascript
// console
$ npm i passport passport-local passport-kakao bcrypt
```

---

### 3.2. 패스포트 모듈 작성

passport/index.js 에 작성한다.

```javascript
// passport/index.js
const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};
```

- **passport.serializeUser: req.session**
  - 객체에 어떤 데이터를 저장할 지 선택, 사용자 정보를 다 들고 있으면 메모리를 많이 차지하기 때문에 사용자의 아이디만 저장한다.
- **passport.deserializeUser**
  - req.session에 저장된 사용자 아이디를 바탕으로 DB 조회로 사용자 정보를 얻어낸 후 **req.user에 저장한다**.
    - 미들웨어에서 res.user을 하면 로그인한 사용자의 정보가 나타난다.

---

### 3.3. 패스포트 처리 과정

로그인 과정

1. 로그인 요청이 들어온다.
2. passport.authenticate 메서드 호출
3. 로그인 전략 수행
4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
5. req.login 메서드가 passport.serializeUser 호출
6. req.session에 사용자 아이디만 저장
7. 로그인 완료

로그인 이후 과정

1. 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드 호출
2. req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
3. 조회된 사용자 정보를 req.user에 저장
4. 라우터에서 req.user 객체 사용 가능

---

### 3.4. 로컬 로그인 구현하기

passport-local 패키지가 필요하다.

```javascript
// routes/middlewares.js
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
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
```

- isAuthenticated()로 로그인 되어있는지 확인할 수 있다.
  - passport.deserializeUser()을 통해 isAuthenticated가 true가 된다.

```javascript
// routes/page.js
const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

router.get("/", (req, res, next) => {
  const twits = [];
  res.render("main", {
    title: "NodeBird",
    twits,
    user: req.user,
  });
});

module.exports = router;
```

- 로컬 로그인 전략 수립
- 로그인에만 해당하는 전략이므로 회원가입은 따로 만들어야 한다.
- 사용자가 로그인했는지, 하지 않았는지 여부를 체크하는 미들웨어도 만든다.

---

### 3.5. 회원가입 라우터

```javascript
// routes/auth.js
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
```

- **isNotLoggedIn() 함수를 통해 로그인 한 상태인지 확인한다.**
  - 로그인 하지 않았으면 next()를 호출해서 돌아온다.
- **프론트에서 email, nick, password를 받아온다.**
- **이미 존재하는 이메일로 가입하는 사람이 있는지 확인한다.**
  - 이미 존재하면
    - ?error=exist 쿼리스트링으로 1회성 메시지 전달한다.
      - 프론트엔드에서 에러처리를 하도록 표시해주는 것이다.
  - 존재하지 않으면
    - db에 저장한다.
- **bcrypt.hash()로 비밀번호를 암호화한다.**
  - hash의 두 번째 인수는 암호화 라운드
    - 숫자가 클수록 해킹 위험은 적지만 시간이 오래 걸린다.

---

### 3.6. 로그인 라우터

```javascript
// routes/auth.js
...
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});
```

- 프론트에서 서버로 로그인 요청을 보내면 실행된다.
- **isNotLoggedIn() 함수를 통해 로그인 한 상태인지 확인한다.**
  - 로그인 하지 않았으면 next()를 호출해서 돌아온다.
- **passport.authenticate('local')이 실행된다.**
  - **passport가 local strategy를 찾아서 실행시킨다.**
- **전략을 수행하고 나면 authenticate의 콜백 함수가 호출된다.**
  - authError: 인증 과정 중 에러
  - user: 인증 성공 시 유저 정보
  - info: 인증 오류에 대한 메시지
- **인증이 성공했다면 req.login(user)으로 세션에 유저 정보를 저장한다.**
  - passport/index.js 의 serializeUser()가 실행된다.
    - 세션에 유저 id만 저장해서 메모리를 아낀다.
- 콜백 함수로 로그인 에러가 발생했는지 확인한다.
  - 로그인에 성공했으면 메인 페이지로 이동한다.
    - 로그인 할 때 세션 쿠키를 브라우저로 전송해서 로그인 상태를 확인하게 해준다.

---

### 3.7. 로그아웃 라우터

```javascript
// routes/auth.js
...
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});
```

- **isLoggedIn() 함수를 통해 로그인 한 상태인지 확인한다.**
  - 로그인 한 상태이면 다음 콜백함수를 실행한다.
- **req.logout()이 실행되면서 서버가 세션 쿠키를 삭제한다.**
  - 로그인이 풀리게 된다.

---

### 3.8. 로컬 전략 작성

```javascript
// passport/localStrategy.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
```

<img width="400" alt="done" src="https://user-images.githubusercontent.com/35963403/126243185-91e79932-c5d3-4d93-baea-63c0563afd3b.png">

- usernameField와 passwordField가 input 태그의 name(body-parser의 req.body)
- 사용자가 DB에 저장되어있는지 확인한 후 있다면 비밀번호를 비교한다(bcrypt.compare).
- 비밀번호까지 일치한다면 로그인
- **done()** 함수는 인수를 3개 받는다.
  - 첫번째 : 서버 에러
  - 두번째 : 로그인 성공했을 때 User 객체
    - 실패하면 false
  - 세번째 : 로그인이 실패했을 때 메시지
  - 실행이 끝나면 다음 콜백 함수로 간다.

---

### 3.9. 카카오 로그인 구현

```javascript
// passport/kakaoStrategy.js;
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("kakao profile", profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
```

- 이메일, 비밀번호를 검사하는 과정을 카카오에서 대신 해준다.
- clientID에 카카오 앱 아이디 추가
- callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
- accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰(사용하지 않음)
- snsId와 provider로 카카오에 가입한 사람이 있는지 db에서확인한다.
  - 가입한 사람이 있으면 로그인한다.
  - 가입한 사람이 없으면 회원가입을 시킨 후 로그인한다.
- profile: 카카오가 보내준 유저 정보
- profile의 정보를 바탕으로 회원가입

---

### 3.10. 카카오 로그인용 라우터 만들기

회원가입과 로그인이 전략에서 동시에 수행된다.

```javascript
// routes/auth.js
...
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;
```

```javascript
// app.js
...
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
...
app.use('/', pageRouter);
app.use('/auth', authRouter);
...
```

- passport.authenticate(‘kakao’)만 하면 된다.
  - passport/kakaoStrategy.js가 실행된다.
- /kakao/callback 라우터에서는 인증 성공 시(res.redirect)와 실패 시(failureRedirect) 리다이렉트할 경로를 지정한다.

---

### 3.11. 카카오 로그인 앱 만들기

https://developers.kakao.com 에 접속하여 회원가입한다.

<img width="500" alt="kakao1" src="https://user-images.githubusercontent.com/35963403/126243676-c4001b80-a530-412b-aad2-4e2438851692.PNG">

- 추가하기 버튼 클릭

<img width="500" alt="kakao2" src="https://user-images.githubusercontent.com/35963403/126243699-9378ee32-2248-4e63-b907-c372041ed87f.PNG">

- 앱 정보 작성

---

### 3.12. 카카오 앱 키 저장하기

REST API 키를 저장해서 .env에 저장한다.

## <img width="500" alt="kakao3" src="https://user-images.githubusercontent.com/35963403/126243958-57c31d37-092f-45cf-925f-23529e139b5b.PNG">

---

### 3.13. 카카오 웹 플랫폼 추가

웹 플랫폼을 추가해야 callbackURI 등록할 수 있다.

<img width="500" alt="kakao4" src="https://user-images.githubusercontent.com/35963403/126244125-5253a7b1-f90a-4239-9b28-8c085fef900e.png">

- http://localhost:8001 등록
- Redirect URI에 http://localhost:8001/auth/kako/callback 을 등록한다.

---

### 3.14. 카카오 동의항목 설정

이메일, 생일 등의 정보를 얻기 위해 동의항목을 설정한다.

## <img width="300" alt="kakao5" src="https://user-images.githubusercontent.com/35963403/126244236-4356e2a5-c8c7-4f65-9a91-72da3c3b63da.PNG">

---

### 3.15. 카카오 로그인 시도

<img width="500" alt="kakao6" src="https://user-images.githubusercontent.com/35963403/126244385-fdb4a657-4b0a-4727-ad06-538564f37a93.png">

- 카카오톡 로그인 버튼을 누르면 카카오 로그인 창으로 전환한다.

<img width="500" alt="kakako7" src="https://user-images.githubusercontent.com/35963403/126244465-cb833e59-0ec1-4990-a439-90f5937c73af.PNG">

- 계정 동의 후 NodeBird 서비스로 리다이렉트한다.

<br/>

## **4. Multer 모듈로 이미지 업로드**

---

### 4.1. 이미지 업로드 구현

form 태그의 enctype이 multipart/form-data 인 경우

- body-parser로는 요청 본문을 해석할 수 없다.
- **multer** 패키지가 필요하다.
  - $ npm i multer
- 이미지를 먼저 업로드하고, 이미지가 저장된 경로를 반환할 것이다.
- 게시글 form을 submit할 때는 이미지 자체 대신 경로를 전송한다.

---

### 4.2. 이미지 업로드 라우터 구현

```javascript
// routes/post.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 업로드
router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

// 게시글 업로드
const upload2 = multer();
router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
```

- fs.readdir(), fs.mkdirSync()로 upload 폴더가 없으면 생성한다.
- multer() 함수로 업로드 미들웨어를 생성한다.
- storage: diskStorage는 이미지를 서버 디스크에 저장(destination은 저장 경로, filename은 저장 파일명)
- uploads 폴더에 이미지 파일을 저장한다.
- limits는 파일 최대 용량(5MB)
- 업로드할 때 multer() 함수를 실행하면 함수를 실행한 객체 안에 single()이라는 미들웨어가 실행된다.
- upload.single(‘img’): 요청 본문의 img에 담긴 이미지 하나를 읽어 설정대로 저장하는 미들웨어이다.
  - 클라이언트에서는 img 폴더 안에 있는 이미지 파일을 요청하지만 실제로는 uploads 폴더 안에 있는 이미지 파일을 가져온다.
    - app.js에서 static 미들웨어를 사용해 요청과 실제 주소가 다르게 만든다.
- 저장된 파일에 대한 정보는 req.file 객체에 담긴다.
- res.json({ url: `/img/${req.file.filename}` }); 으로 url을 프론트로 보내서 게시글과 같이 묶여있도록 한다.

---

### 4.3. 게시글 등록

upload2.none()은 multipart/formdata 타입의 요청이지만 이미지는 없을 때 사용한다.

<img width="250" alt="hashtag" src="https://user-images.githubusercontent.com/35963403/126441446-fb7fa1d9-1fbc-4a42-83e6-d491bd8f20cc.PNG">

- 게시글 등록 시 아까 받은 이미지 경로에 저장한다.
- 게시글에서 해시태그를 찾아서 게시글과 연결한다(post.addHashtags())
- findOrCreate()는 기존에 해시태그가 존재하면 그걸 사용하고, 없다면 생성하는 시퀄라이즈 메서드이다.

---

### 4.4. 메인 페이지에 게시글 보여주기

```javascript
// routes/page.js
const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

router.get("/", async (req, res, next) => {
  try {
    res.locals.user = req.user;
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "NodeBird",
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

modulse.exports = router;
```

메인 페이지(/) 요청 시 게시글을 먼저 조회한 후 템플릿 엔진 렌더링을 한다.

- render에 넣는 변수들은 **res.locals**로 뺄 수 있다.
  - **req.user가 모든 라우터에 들어가면 res.locals에 넣어 중복 제거 가능하다.**
- Post.findAll()으로 업로드한 게시글을 찾는다.
- 찾은 게시글들(posts)을 twits에 넣는다.
- include로 관계가 있는 모델을 합쳐서 가져올 수 있다.
- Post와 User는 관계가 있다. (Post.findAll => 1대다)
- 게시글을 가져올 때 게시글 작성자까지 같이 가져온다.

<br/>

## **5. 프로젝트 마무리하기**

---

### 5.1. 팔로잉 기능 구현

```javascript
// routes/user.js
const express = require("express");

const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
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
});

module.exports = router;
```

POST /:id/follow 라우터를 추가한다.

- /사용자아이디/follow
- User.findOne()으로 사용자를 찾는다.
- 사용자 아이디는 req.params.id로 접근한다.
- user.addFollowings(사용자아이디)로 팔로잉하는 사람을 추가한다.
  - Followings로 복수이므로 배열로 추가한다.

---

### 5.2. 팔로잉 기능 구현

**deserializeUser** 수정

- <mark>**req.user는 deserializeUser에서 생성된다.**</mark>
- req.user.Followers로 팔로워 접근 가능
- req.user.Followings로 팔로잉 접근
- 단, 목록이 유출되면 안 되므로 팔로워/팔로잉 숫자만 프론트로 전달

---

### 5.3. 해시태그 검색 기능 추가

```javascript
// routes/post.js
...
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async(req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
...
```

GET /hashtag 라우터를 추가한다.

- 게시글에서 해시태그를 꺼내온다.
  - 정규표현식
    - **req.body.content.match(/#[^\s#]\*/g);**
      - #으로 시작해서 띄어쓰기와 #이 아닌 글자 모두 고르기
- 해시태그 배열에서 첫글자인 #을 떼고 findOrCreate(해시태그) 실행한다.
  - tag.slice(1).toLowerCase()
  - db에 이미 등록된 해시태그이면 조회한다.
    - [[해시태그, false], ...] 가 된다.
  - 등록되어 있지 않으면 생성한다.
    - [[해시태그, true], ...] 가 된다.
  - 중복 저장을 막아준다.

```javascript
// routes/page.js
...
router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User, attributes: ['id', 'nick'] }] });
    }

    return res.render('main', {
      title: `#${query} 검색 결과 | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
...
```

- 해시태그 입력이 없으면 메인 페이지로 돌아간다.
- 해시태그 입력이 있으면 Hashtag.findOne()으로 db에 등록된 해시태그가 있는지 찾는다.
- 해시태그가 있으면 hashtag.getPosts()로 해시태그와 관련된 게시글을 모두 찾는다.
  - 찾으면서 include로 게시글 작성자 모델도 같이 가져온다.
    - 보안을 위해 프론트로 보낼 때 id, nick과 같이 필요한 것만 attributes로 설정해서 보낸다.
- main 페이지로 검색 결과를 보낸다.
- 한글로 입력이 들어오면 encodeURIComponent를 사용한다.
  - 서버쪽에선 decodeURIComponent로 받아야 한다.

---

### 5.4. 업로드한 이미지 제공하기

express.static 미들웨어로 uploads 폴더에 저장된 이미지를 제공한다.

- 프론트엔드에서는 /img/이미지명 주소로 이미지에 접근이 가능하다.

---

### 5.5. 프로젝트 화면

서버를 실행하고 http://localhost:8001 로 접속한다.

<img width="500" alt="page" src="https://user-images.githubusercontent.com/35963403/126434730-24faf7ab-f119-439f-b5c7-8fba0c14086b.PNG">
