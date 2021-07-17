# **익스프레스로 SNS 서비스 만들기**

## **1. 프로젝트 구조 갖추기**

---

### 1.1. NodeBird SNS 서비스

기능: 로그인, 이미지 업로드, 게시글 작성, 해시태그 검색, 팔로잉

- express-generator 대신 직접 구조를 갖춘다.
- 프론트엔드 코드보다 노드 라우터 중심으로 한다.
- 관계형 데이터베이스 MySQL을 사용한다.

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

```javascript
// console
$ npm i sequelize mysql2 sequelize-cli
$ npx sequelize init
```

### 1.3. 폴더 구조 설정

views(템플릿 엔진), routes(라우터), public(정적 파일), passport(패스포트) 폴더를 생성한다.

- app.js와 .env 파일도 생성한다.

### 1.4. 패키지 설치와 nodemon

npm 패키지 설치 후 nodemon도 설치한다.

- nodemon은 서버 코드가 변경되었을 때 자동으로 서버를 재시작해준다.
- nodemon은 콘솔 명령어이기 때문에 글로벌로 설치한다.

```javascript
// console
$ npm i express cookie-parser express-session morgan multer dotenv nunjucks
$ npm i -D nodemon
```

### 1.5. app.js

노드 서버의 핵심인 app.js 파일을 생성한다.

- dotenv.config(); 는 최대한 위로 올려야 된다.

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

- models/user.js: 사용자 테이블과 연결됨
  - provider: 카카오 로그인인 경우 kakao, 로컬 로그인(이메일/비밀번호)인 경우 local
  - snsId: 카카오 로그인인 경우 주어지는 id
- models/post.js: 게시글 내용과 이미지 경로를 저장(이미지는 파일로 저장)
- models/hashtag.js: 해시태그 이름을 저장(나중에 태그로 검색하기 위해서)

### 2.2. models/index.js

시퀄라이즈가 자동으로 생성해주는 코드 대신 다음과 같이 변경한다.

- 모델들을 불러옴(require)
- 모델 간 관계가 있는 경우 관계 설정
- User(1):Post(다)
- Post(다):Hashtag(다)
- User(다):User(다)

### 2.3. associate 작성하기

모델관의 관계를 associate에 작성한다.

- 1대다: hasMany와 belongsTo
- 다대다: belongsToMany
  - foreignKey: 외래키
  - as: 컬럼에 대한 별명
  - through: 중간 테이블명

### 2.4. 팔로잉-팔로워 다대다 관계

User(다):User(다)

- 다대다 관계이므로 중간 테이블(Follow)이 생성된다.
- 모델 이름이 같으므로 구분이 필요하다(as가 구분자 역할, foreignKey는 반대 테이블 컬럼의 프라이머리 키 컬럼)
- 시퀄라이즈는 as 이름을 바탕으로 자동으로 addFollower, getFollowers, addFollowing, getFollowings 메서드를 생성한다.

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

<br/>

## **3. 패스포트 모듈로 로그인**

---

### 3.1. 패스포트 설치하기

로그인 과정을 쉽게 처리할 수 있게 도와주는 Passport를 설치한다.

- 비밀번호 암호화를 위한 bcrypt도 같이 설치한다.
- 설치 후 app.js와도 연결한다.
- passport.initialize(): 요청 객체에 passport 설정을 심는다.
- passport.session(): req.session 객체에 passport 정보를 저장한다.
- express-session 미들웨어에 의존하므로 이보다 더 뒤에 위치해야 한다.

```javascript
// console
$ npm i passport passport-local passport-kakao bcrypt
```

### 3.2. 패스포트 모듈 작성

passport/index.js 작성

- passport.serializeUser: req.session 객체에 어떤 데이터를 저장할 지 선택, 사용자 정보를 다 들고 있으면 메모리를 많이 차지하기 때문에 사용자의 아이디만 저장
- passport.deserializeUser: req.session에 저장된 사용자 아이디를 바탕으로 DB 조회로 사용자 정보를 얻어낸 후 req.user에 저장

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

### 3.4. 로컬 로그인 구현하기

passport-local 패키지 필요하다.

- 로컬 로그인 전략 수립
- 로그인에만 해당하는 전략이므로 회원가입은 따로 만들어야 한다.
- 사용자가 로그인했는지, 하지 않았는지 여부를 체크하는 미들웨어도 만든다.

### 3.5. 회원가입 라우터

routes/auth.js 작성

- bcrypt.hash로 비밀번호 암호화
- hash의 두 번째 인수는 암호화 라운드
- 라운드가 높을수록 안전하지만 오래 걸린다.
- 적당한 라운드를 찾는 게 좋다.
- ?error 쿼리스트링으로 1회성 메시지

### 3.6. 로그인 라우터

routes/auth.js 작성

- passport.authenticate(‘local’): 로컬 전략
- 전략을 수행하고 나면 authenticate의 콜백 함수 호출된다.
- authError: 인증 과정 중 에러
- user: 인증 성공 시 유저 정보
- info: 인증 오류에 대한 메시지
- 인증이 성공했다면 req.login으로 세션에 유저 정보 저장

### 3.7. 로컬 전략 작성

passport/localStrategy.js 작성

- usernameField와 passwordField가 input 태그의 name(body-parser의 req.body)
- 사용자가 DB에 저장되어있는지 확인한 후 있다면 비밀번호 비교(bcrypt.compare)
- 비밀번호까지 일치한다면 로그인

### 3.8. 카카오 로그인 구현

passport/kakaoStratecy.js 작성

- clientID에 카카오 앱 아이디 추가
- callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
- accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰(사용하지 않음)
- profile: 카카오가 보내준 유저 정보
- profile의 정보를 바탕으로 회원가입

### 3.9. 카카오 로그인용 라우터 만들기

회원가입과 로그인이 전략에서 동시에 수행된다.

- passport.authenticate(‘kakao’)만 하면 된다.
- /kakao/callback 라우터에서는 인증 성공 시(res.redirect)와 실패 시(failureRedirect) 리다이렉트할 경로 지정

### 3.10. 카카오 로그인 앱 만들기

https://developers.kakao.com 에 접속하여 회원가입한다.

- NodeBird 앱 만들기

### 3.11. 카카오 앱 키 저장하기

REST API 키를 저장해서 .env에 저장한다.

### 3.12. 카카오 웹 플랫폼 추가

웹 플랫폼을 추가해야 callbackURL 등록할 수 있다.

- http://localhost:8001 등록

### 3.13. 카카오 동의항목 설정

이메일, 생일 등의 정보를 얻기 위해 동의항목을 설정한다.

### 3.14. 카카오 로그인 시도

카카오톡 로그인 버튼을 누르면 카카오 로그인 창으로 전환한다.

- 계정 동의 후 NodeBird 서비스로 리다이렉트한다.

<br/>

## **4. Multer 모듈로 이미지 업로드**

---

### 4.1. 이미지 업로드 구현

form 태그의 enctype이 multipart/form-data

- body-parser로는 요청 본문을 해석할 수 없다.
- multer 패키지가 필요하다.
  - $ npm i multer
- 이미지를 먼저 업로드하고, 이미지가 저장된 경로를 반환할 것이다.
- 게시글 form을 submit할 때는 이미지 자체 대신 경로를 전송한다.

### 4.2. 이미지 업로드 라우터 구현

fs.readdir, fs.mkdirSync로 upload 폴더가 없으면 생성한다.

multer() 함수로 업로드 미들웨어를 생성한다.

- storage: diskStorage는 이미지를 서버 디스크에 저장(destination은 저장 경로, filename은 저장 파일명)
- limits는 파일 최대 용량(5MB)
- upload.single(‘img’): 요청 본문의 img에 담긴 이미지 하나를 읽어 설정대로 저장하는 미들웨어
- 저장된 파일에 대한 정보는 req.file 객체에 담김

### 4.3. 게시글 등록

upload2.none()은 multipart/formdata 타입의 요청이지만 이미지는 없을 때 사용한다.

- 게시글 등록 시 아까 받은 이미지 경로 저장
- 게시글에서 해시태그를 찾아서 게시글과 연결(post.addHashtags)
- findOrCreate는 기존에 해시태그가 존재하면 그걸 사용하고, 없다면 생성하는 시퀄라이즈 메서드

### 4.4. 메인 페이지에 게시글 보여주기

메인 페이지(/) 요청 시 게시글을 먼저 조회한 후 템플릿 엔진 렌더링

- include로 관계가 있는 모델을 합쳐서 가져올 수 있음
- Post와 User는 관계가 있음 (1대다)
- 게시글을 가져올 때 게시글 작성자까지 같이 가져오는 것)

<br/>

## **5. 프로젝트 마무리하기**

---

### 5.1. 팔로잉 기능 구현

POST /:id/follow 라우터를 추가한다.

- /사용자아이디/follow
- 사용자 아이디는 req.params.id로 접근
- user.addFollowing(사용자아이디)로 팔로잉하는 사람 추가

### 5.2. 팔로잉 기능 구현

deserializeUser 수정

- req.user.Followers로 팔로워 접근 가능
- req.user.Followings로 팔로잉 접근
- 단, 목록이 유출되면 안 되므로 팔로워/팔로잉 숫자만 프런트로 전달

### 5.3. 해시태그 검색 기능 추가

GET /hashtag 라우터를 추가한다.

- 해시태그를 먼저 찾고(hashtag)
- hashtag.getPosts로 해시태그와 관련된 게시글을 모두 찾음
- 찾으면서 include로 게시글 작성자 모델도 같이 가져옴

### 5.4. 업로드한 이미지 제공하기

express.static 미들웨어로 uploads 폴더에 저장된 이미지를 제공한다.

- 프론트엔드에서는 /img/이미지명 주소로 이미지에 접근이 가능하다.

### 5.5. 프로젝트 화면

서버를 실행하고 http://localhost:8001 로 접속한다.
