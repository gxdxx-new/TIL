# **익스프레스 웹 서버 만들기**
## **1. 익스프레스 프로젝트 시작하기**
---

### 1.1. 익스프레스 소개
http 모듈로 웹 서버를 만들 때 코드가 보기 좋지 않고, 확장성도 떨어진다.
- Express라는 프레임워크로 해결할 수 있다.
    - 코드 관리가 용이하고 편의성이 좋다.

### 1.2. package.json 만들기
npm init 명령어로 생성한다.
- nodemon이 소스 코드 변경 시 서버를 재시작해준다.
```javascript
// package.json
{
    "name": "learn-express",
    "version": "0.0.1",
    "description": "익스프레스 배우기",
    "main": "app.js",
    "scripts": {
        "start": "nodemon app"
    },
    "author": "don",
    "license": "MIT",
}
```
```javascript
// console
$ npm i express
$ npm i -D nodemon
```

### 1.3. app.js 작성하기
서버 구동의 핵심이 되는 파일이다.
- app.set('port', 포트)로 서버가 실행될 포트를 지정한다.
- app.get('주소', 라우터)로 GET 요청이 올 때 어떤 동작을 할지 지정한다.
- app.listen('포트', 콜백)으로 몇 번 포트에서 서버를 실행할지 지정한다.
```javascript
// app.js
const express = require('express');

const app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.send('Hello, Express');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
```

### 1.4. 서버 실행하기
- app.js: 핵심 서버 스크립트
- public: 외부에서 접근 가능한 파일들을 모아둔다.
- views: 템플릿 파일을 모아둔다.
- routes: 서버의 라우터와 로직을 모아둔다.

### 1.5. 익스프레스 서버 실행하기
- npm start(package.json의 start 스크립트) 콘솔에서 실행한다.
```javascript
// console
$ npm start
> learn-express@0.0.1 start C:\Users\don\learn-express
> nodemon app
```

### 1.6. HTML 서빙하기
- res.sendFile로 HTML 서빙 가능하다.
```html
<!-- index.html -->
<html>
<head>
    <meta charset="UTF-8" />
    <title>익스프레스 서버</title>
</head>
<body>
    <h1>익스프레스</h1>
    <p>배워본다.</p>
</body>
</html>
```
```javascript
const express = require('express');
const path = require('path');

const app = express();
app.set('port', process.env.PORT||3000);

app.get('/', (req, res) => {
    // res.send('Hello, Express');
    //res.sendFile(path.join(__dirname, '/index.html'));

    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify({ hello: 'zerocho' }));

    res.json({ hello: 'zerocho' }); // 익스프레스가 위 두 줄의 코드를 한 줄로 줄여준다.
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
```
- res.end(): 데이터 없이 응답을 보낸다.
- res.send(데이터): 데이터와 함께 응답을 보낸다.

<br/>

## **2. 자주 사용하는 미들웨어**
---

### 2.1. 미들웨어
익스프레스는 미들웨어로 구성된다.
- 요청과 응답에 중간에 위치한다.
- app.use(미들웨어)로 장착한다.
    - 공통되는 코드를 모아서 다른 모든 요청에서 실행시켜 준다. 
    - 주소를 지정해 줄 수도 있다.
- 위에서 아래로 순서가 실행된다.
    - 미들웨어에 따라 미들웨어 끼리의 순서가 중요한 경우도 있다.
- 미들웨어는 req, res, next가 매개변수인 함수이다.
- req: 요청, res: 응답 조작 가능
    - res.send(), res.sendFile(), res.json(), res.render() 등을 한 라우트에서 2개 이상 사용하면 안된다.
        - 한번 응답을 하고 또 응답을 해주는 것이기 때문에 에러 발생
- next()로 다음 미들웨어로 넘어간다.

```javascript
const express = require('express');
const path = require('path');

const app = express();

app.set('port', process.env.PORT||3000);

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
}, (req, res, next) => {
    try {
        console.log(adad);  // 에러 발생시키기
    } catch(error) {
        next(error);    // next()에 인수값이 있으면 다음 미들웨어로 넘어가지 않고 에러처리 미들웨어로 넘어간다.
    }
});

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    if(true) {
        next('route');  // 같은 라우터의 다른 미들웨어가 실행되는게 아니라 다음 라우터의 미들웨어가 실행된다.
    } else {
        next(); // 같은 라우터의 다른 미들웨어가 실행된다.
    }
}, (req, res) => {
    console.log('실행되나요?');
});

app.get('/', (req, res) => {
    console.log('실행됩니다');
});

app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.'); // 익스프레스에서 에러 처리 해주지만 보안 문제가 있어서 직접 에러 처리를 해주어야 한다.
});

app.use((err, req, res, next) => {  // try catch 문으로 모든 에러들을 받아서 처리해준다.
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});
```

>|||
>|:---|:---|
>| app.use(미들웨어) | 모든 요청에서 미들웨어 실행 |
>| app.use('/abc', 미들웨어) | abc로 시작하는 요청에서 미들웨어 실행 |
>| app.post('/abc', 미들웨어) | abc로 시작하는 POST 요청에서 미들웨어 실행 |

### 2.2. 에러 처리 미들웨어
에러가 발생하면 에러 처리 미들웨어로 처리한다.
- err, req, res, next까지 매개변수가 4개이다.
    - 생략할 수 없다.
- 첫 번째 err에는 에러에 관한 정보가 담긴다.
- res.status 메서드로 HTTP 상태 코드를 지정 가능하다(기본값 200).
    - res.statue(200).send(err.message);
- 에러 처리 미들웨어를 연결하지 않아도 익스프레스 에러를 알아서 처리해주긴 한다.
- 특별한 경우가 아니라면 가장 아래에 위치하도록 한다.

### 2.3. 자주 쓰는 미들웨어
morgan, cookie-parser, express-session
- app.use로 장착한다.
- 내부에서 알아서 next를 호출해서 다음 미들웨어로 넘어간다.
```javascript
// console
$ npm i morgan cookie-parser express-session dotenv
```
```javascript
// .env
COOKIE_SECRET = cookiescret
```
```javascript
// app.js
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.set('port', provess.env.PORT||3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
});
...
```

### 2.4. dotenv
.env 파일을 읽어서 process.env로 만든다.
- process.env.COOKIE_SECRET에 cookiesecret 값이 할당된다(키=값 형식).
    - 마지막에 ; 붙이면 안된다.
- const dotenv = require('dotenv'); 와 dotenv.config()를 선언해야 한다.
- 비밀키들을 소스 코드에 그대로 적어두면 소스 코드가 유출되었을 때 비밀키도 같이 유출된다.
    - .env 파일에 비밀키들을 모아두고 .env 파일만 잘 관리하면 된다.

### 2.5. morgan
서버로 들어온 요청과 응답을 기록해주는 미들웨어이다.
- 로그의 자세한 정도 선택 가능하다(dev, tiny, short, common, combined).
    - **ex) app.use(morgan('dev'));**
    - **ex) GET / 200 51.267 ms - 1539**
    - 순서대로 HTTP요청 요청주소 상태코드 응답속도 - 응답바이트
- 개발환경에서는 dev, 배포환경에서는 combined를 보통 사용한다.

### 2.6. static
정적인 파일들을 제공하는 미들웨어이다.
- 인수로 정적 파일의 경로를 제공한다.
- 파일이 있을 때 fs.readFile로 직접 읽을 필요 없다.
- 요청하는 파일이 없으면 알아서 next를 호출해 다음 미들웨어로 넘어간다.
- 파일을 발견했다면 다음 미들웨어는 실행되지 않는다.
- **ex) app.use('요청 경로', express.static('실제 경로'));**
- **ex) app.use('/', express.static(path.join(__dirname, 'public')));**

컨텐츠 요청 주소와 실제 컨텐츠의 경로를 다르게 만들 수 있다.
- 요청 주소: localhost:3000/stylesheets/style.css
- 실제 컨텐츠 경로: /public/stylesheets/sytle.css
- 서버의 구조를 파악하기 어려워져서 보안에 도움이 된다.

### 2.7. body-parser
요청의 본문을 해석해주는 미들웨어이다.
- form 데이터나 AJAX 요청의 데이터를 처리해준다.
- json 미들웨어는 요청 본문이 json인 경우 해석, urlencoded 미들웨어는 form 요청 해석
    - **app.use(express.json());**
        - 클라이언트에서 json 데이터로 보냈을 때 json 데이터를 파싱해서 req.body에 넣어준다.
    - **app.use(express.urlencoded({ extended: false }));**
- put이나 patch, post 요청 시에 req.body에 프런트에서 온 데이터를 넣어준다.

버퍼 데이터나 text 데이터일 때는 body-parser를 직접 설치해야 한다.
```javascript
// console
$ npm i body-parser
```
```javascript
const bodyParser = require('body-parser');
app.use(bodyParser.raw());
app.use(bodyParser.text());
```

Multipart 데이터(이미지, 동영상 등)인 경우는 다른 미들웨어를 사용해야 한다.
- multer 패키지

### 2.8. cookie-parser
요청 헤더의 쿠키를 해석해주는 미들웨어이다.
- parseCookies 함수와 기능이 비슷하다.
- req.cookies 안에 쿠키들이 들어있다.
- 비밀키로 쿠키 뒤에 서명을 붙여 내 서버가 만든 쿠키임을 검증할 수 있다.
```javascript
// app.js
app.use(cookieParser(비밀키));
```
- 쿠키 옵션들을 넣을 수 있다.
    - expires, domain, httpOnly, maxAge, path, secure, sameSite 등
    - 지울 때는 clearCookie로(expires와 maxAge를 제외한 옵션들이 일치해야 한다).
```javascript
res.cookie('name', 'don', {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
    secure: true,
});
res.clearCookie('name', 'don', { httpOnly: true, secure: true });
```

### 2.9. express-session
세션 관리용 미들웨어
- 세션 쿠키에 대한 설정(secret: 쿠키 암호화, cookie: 세션 쿠키 옵션)
- 세션 쿠키는 앞에 s%3A가 붙은 후 암호화되어 프론트에 전송된다.
- resave: 요청이 왔을 때 세션에 수정사항이 생기지 않아도 다시 저장할지 여부를 처리해준다. 
- saveUnitialized: 세션에 저장할 내역이 없더라도 세션을 저장할지 여부를 처리해준다.
- req.session.save로 수동 저장도 가능은 하다.
```javascript
app.use(session({
    resave: false,
    saveUnitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true, // 자바스크립트로 접근 못하게 해줌
        secure: false,
    },
    name: 'session-cookie',
}));

req.session.name = 'don'    // 세션 등록
req.sessionID;  // 세션 아이디 확인
req.session.destroy();  // 세션 모두 제거
```
```javascript
app.use((req, res, next) => {
    req.data = 'don';
});

app.get('/', (req, res, next) => {
    req.data;    // don
    res.sendFile(path.join(__dirname, 'index.html'));
});
```
- 두 미들웨어는 req가 같다.
    - app.get()에서 next()가 없으므로 세션을 한번만 받아와서 사용하고 끝나게 할 수 있다.
```javascript
app.use('/', (req, res, next) => {
    if (req.session.id) {
        express.static(__dirname, 'public')(req, res, next)
    } else {
        next();
    }
});
```
- 세션 아이디가 있으면(로그인 했으면) static 미들웨어를 실행하고 세션 아이디가 없으면 next()를 실행한다.

### 2.10. 미들웨어의 특성
req, res, next를 매개변수로 가지는 함수이다.
```javascript
app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
});
```

익스프레스 미들웨어들도 축약이 가능하다.
- 순서가 중요하다.
- static 미들웨어에서 파일을 찾으면 next를 호출 하지 않으므로 json, urlencoded, cookieParser는 실행되지 않는다.
```javascript
// 변경 전
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
```
```javascript
// 변경 후
app.use(
    morgan('dev'),
    express.stataic('/', path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.COOKIE_SECRET),
);
```

### 2.11. next
next를 호출해야 다음 코드로 넘어간다.
- next를 주석 처리하면 응답이 전송되지 않는다.
    - 다음 미들웨어(라우터 미들웨어)로 넘어가지 않기 때문이다.
- next에 인수로 값을 넣으면 에러 핸들러로 넘어간다('route'인 경우 다음 라우터로).

<img width="700" alt="router" src="https://user-images.githubusercontent.com/35963403/125237358-88e37a00-e320-11eb-9093-deee9191a5e8.png">

### 2.12. 미들웨어간 데이터 전달하기
req나 res 객체 안에 값을 넣어 데이터 전달이 가능하다.
- app.set과의 차이점: app.set은 서버 내내 유지, req, res는 요청 하나 동안만 유지
- req.body나 req.cookies같은 미들웨어의 데이터와 겹치지 않게 조심한다.
```javascript
app.use((req, res, next) => {
    req.data = '데이터 넣기';
    next();
}, (req, res, next) => {
    console.log(req.data);  // 데이터 받기
    next();
});
```

### 2.13. 미들웨어 확장하기
미들웨어 안에 미들웨어를 넣는 방법
```javascript
app.use(morgan('dev'));
// 또는
app.use((req, res, next) => {
    morgan('dev')(req, res, next);
});
```

아래처럼 다양하게 활용도 가능하다.
```javascript
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        morgan('combined')(req, res, next);
    } else {
        morgan('dev')(req, res, next);
    }
});
```

### 2.14. 멀티파트 데이터 형식
form 태그의 enctype이 multipart/form-data인 경우
- body-parser로는 요청 본문을 해석할 수 없다.
- multer 패키지가 필요하다.
```javascript
// console
$ npm i multer
```
```html
<!-- multipart.html -->
<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="image"/>
    <input type="text" name="title"/>
    <button type="submit">업로드</button>
</form>
```

### 2.15. multer 설정하기
multer 함수를 호출한다.
- storage는 저장할 공간에 대한 정보이다.
- diskStorage는 하드디스크에 업로드 파일을 저장한다는 것이다.
- destination은 저장할 경로이다.
- filename은 저장할 파일명(파일명+날짜+확장자 형식)이다.
    - Date.now()를 이용해 파일들이 안겹치게 해준다.
- Limits는 파일 개수나 파일 사이즈를 제한할 수 있다.
- 실제 서버 운영 시에는 서버 디스크 대신에 S3 같은 스토리지 서비스에 저장하는게 좋다.

```javascript
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
```

### 2.16. multer 미들웨어들
single과 none, array, fields 미들웨어가 존재한다.
```javascript
app.post('/upload', upload.single('image'), (req, res,) => {
    console.log(req.file, req.body);
    res.send('ok');
});

app.posrt('/upload', upload.none(), (req, res) => {
    console.log(req.body);
    res.send('ok');
});
```
- single은 하나의 파일을 업로드 할 때, none은 파일을 업로드하지 않을 때 사용한다.
- req.file 안에 업로드 정보를 저장한다.

```javascript
app.post('/upload', upload.array('many'), (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
});
```
- array는 여러개의 파일을 업로드 할 때 사용한다.
- 하나의 요청 body 이름 아래 여러 파일이 있는 경우 사용한다.
- 업로드된 이미지 정보가 req.files 아래에 존재한다.

```javascript
app.post('/upload', upload.fields([{ name: 'image1' }, { name: 'image2' }]), (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
},
);
```
- fields는 여러개의 파일을 업로드 할 때 사용한다.
- 여러 개의 요청 body 이름 아래 파일이 하나씩 있는 경우 사용한다.
- 업로드된 이미지 정보다 req.files 아래에 존재한다.

<br/>

## **3. Router 객체로 라우팅 분리하기**
---
### 3.1. express.Router
app.js가 길어지는 것을 막을 수 있다.
- userRouter의 get은 /user와 /가 합쳐져서 GET /user/가 된다.
```javascript
// routes/index.js
const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/', (req, res) => {
    res.send('Hello, Express');
});

module.exports = router;
```
```javascript
// routes/user.js
const express = require('express');

const router = express.Router();

// GET /user 라우터
router.get('/', (req, res) => {
    res.send('Hello, User');
});

moudle.exports = router;
```
```javascript
// app.js
...
const path = require('path');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
...
    name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    ...
});
```

### 3.2. 라우트 매개변수
:id를 넣으면 req.params.id로 받을 수 있다.
```javascript
router.get('/user/:id', (req, res) => {
    console.log(req.params, req.query);
});
```
- 동적으로 변하는 부분을 라우트 매개변수로 만든다.

```javascript
router.get('/user/:id', (req, res) => {
    console.log('실행됩니다');
});
router.get('/user/like', (req, res) => {
    console.log('실행되지 않습니다');
});
```
- 일반 라우터보다 뒤에 위치해야 한다.

```javascript
// console
{ id: '123' } { limit: '5', skip: '10' }
```
- /user/123?limit=5&skip=10 주소 요청인 경우

### 3.3. 404 미들웨어
요청과 일치하는 라우터가 없는 경우를 대비해 404 라우터를 만든다.
```javascript
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
```
- 404 라우터가 없으면 Cannot GET 주소 라는 문자열이 표시된다.

### 3.4. 라우터 그룹화하기
```javascript
router.get('/abc', (req, res) => {
    res.send('GET /abc');
});
router.get('/abc', (req, res) => {
    res.send('POST / abc');
});
```
- 주소는 같지만 메서드가 다른 코드가 있을 때

```javascript
router.route('/abc')
    .get((req, res) => {
        res.send('GET /abc');
    })
    .post((req, res) => {
        res.send('POST /abc');
    });
```
- router.route로 묶는다.

<br/>

## **4. req, res 객체 살펴보기**
---
### 4.1. req
- req.app: req 객체를 통해 app 객체에 접근할 수 있다. req.app.get('port')와 같은 식으로 사용할 수 있다.
- req.body: body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체이다.
- req.cookies: cookie-parser 미들웨어가 만드는 요청의 쿠키를 해석한 객체이다.
- req.ip: 요청의 ip 주소가 담겨 있다.
- req.params: 라우트 매개변수에 대한 정보가 담긴 객체이다.
- req.query: 쿼리스트링에 대한 정보가 담긴 객체이다.
- req.signedCookies: 서명된 쿠키들은 req.cookies 대신 여기에 담겨 있다.
- req.get(헤더 이름): 헤더의 값을 가져오고 싶을 때 사용하는 메서드이다

### 4.2. res
- res.app: req.app처럼 res 객체를 통해 app 객체에 접근할 수 있다.
- res.cookie(키, 값, 옵션): 쿠키를 설정하는 메서드이다.
- res.clearCookie(키, 값, 옵션): 쿠키를 제거하는 메서드이다.
- res.end(): 데이터 없이 응답을 보낸다.
- res.json(JSON): JSON 형식의 응답을 보낸다.
- res.redirect(주소): 리다이렉트할 주소와 함께 응답을 보낸다.
- res.render(뷰, 데이터): 다음 절에서 다룰 템플릿 엔진을 렌더링해서 응답할 때 사용하는 메서드이다.
- res.send(데이터): 데이터와 함께 응답을 보낸다. 데이터는 문자열일 수도 있고H TML일 수도 있으며, 버퍼일 수도 있고 객체나 배열일 수도 있다.
- res.sendFile(경로): 경로에 위치한 파일을 응답한다.
- res.setHeader(헤더, 값): 응답의 헤더를 설정한다.
- res.status(코드): 응답 시의 HTTP 상태 코드를 지정한다.

```javascript
res.writeHead(302, {
    Location: '/',
    'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTSring()}; HttpOnly; Path=/`,
});
res.end();
```
```javascript
res.status(302).redirect('/');  // redirect를 통해 코드가 짧아짐
```

### 4.3. 기타
메서드 체이닝을 지원한다.
```javascript
res
    .status(201)
    .cookie('test', 'test')
    .redirect('/admin');
```

응답은 한 번만 보내야 한다.
- 두 번 이상 보내면 에러가 발생한다.


<br/>

## **5. 템플릿 엔진 사용하기**
---

<br/>