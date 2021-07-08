# **http 모듈로 서버 만들기**
## **1. 요청과 응답 이해하기**
---
### 1.1. 서버와 클라이언트
서버와 클라이언트의 관계
- 클라이언트가 서버로 요청(request)을 보낸다.
- 서버는 요청을 처리한다.
- 처리 후 클라이언트로 응답(request)을 보낸다.

### 1.2. 노드로 http 서버 만들기
http 요청에 응답하는 노드 서버
- createServer로 요청 이벤트에 대기한다.
- req 객체는 요청에 관한 정보가, res 객체는 응답에 관한 정보가 담겨 있다.
```javascript
// createServer.js
const http =  require('http');

http.createServer((req, res) => {
    // 여기에 어떻게 응답할지 적는다.
});
```

### 1.3. 8080 포트에 연결하기
res 메서드로 응답을 보낸다.
- write로 응답 내용을 적고
- end로 응답 마무리한다.

listen(포트) 메서드로 특정 포트에 연결한다.
```javascript
// server1.js
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})
    .listen(8080, () => {   // 서버 연결
        console.log('8080번 포트에서 서버 대기중입니다.');
    });
```

### 1.4. 8080 포트로 접속하기
스크립트를 실행하면 8080 포트에 연결된다.
```javascript
// console
$ node server1
8080번 포트에서 서버 대기중입니다.
```

연결되고 난 후 localhost:8080 또는 http://127.0.0.1:8080에 접속한다.
<img width="372" alt="port" src="https://user-images.githubusercontent.com/35963403/124872877-c08cb200-e000-11eb-8a6b-3913f615f218.PNG">

### 1.5. localhost와 포트
**localhost**는 컴퓨터 내부 주소이다.
- 외부에서는 접근이 불가능하다.

**포트**는 서버 내에서 프로세스를 구분하는 번호이다.
- 기본적으로 http 서버는 80번 포트를 사용한다(https는 443).
- 다른 포트로 데이터베이스나 다른 서버 동시에 연결이 가능하다.

### 1.6. 이벤트 리스너 붙이기
listening 과 error 이벤트를 붙일 수 있다.
```javascript
// server1-1.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
});
server.listen(8080);

server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기중입니다.');
});
server.on('error', (error) => {
    console.error(error);
});
```

### 1.7. 한 번에 여러 개의 서버 실행하기
createServer를 여러 번 호출하면 된다.
- 단, 두 서버의 포트를 다르게 지정해야 한다.

### 1.8. html 읽어서 전송하기
write와 end에 문자열을 넣는 것은 비효율적이다.
- fs 모듈로 html을 읽어서 전송하면 된다.
- write가 버퍼도 전송 가능하다.
```javascript
// server2.html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Node.js 웹 서버</title>
</head>
<body>
    <h1>Node.js 웹 서버</h1>
    <p>준비</p>
</body>
</html>
```
```javascript
// server2.js
const http = require('http');
const fs = require('fs').promise;

http.createServer(async (req, res) => {
    try {
        const data = await fs.readFile('./server2.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(err.message);
    }
})
    .listen(8081, () => {
        console.log('8081번 포트에서 서버 대기 중입니다.');
    });
```

### 1.9. server2 실행하기
포트번호를 8081로 바꾼다.
- server1.js를 종료했다면 8080번 포트를 계속 써도 된다.
- 종료하지 않은 경우 같은 포트를 쓰면 충돌이 나 에러가 발생한다.

<br/>

## **2. REST API와 라우팅**
---
### 2.1. REST API
서버에 요청을 보낼 때는 주소를 통해 요청의 내용을 표현한다.
- /index.html이면 index.html을 보내달라는 뜻이다.
- 항상 html을 요구할 필요는 없다.
- 서버가 이해하기 쉬운 주소가 좋다.

**REST API(Respresentational State Transfer)**
- 서버의 자원을 정의하고 자원에 대한 주소를 지정하는 방법이다.
- /user이면 사용자 정보에 관한 정보를 요청하는 것이다.
- /post이면 게시글에 관련된 자원을 요청하는 것이다.

**HTTP** 요청 메서드
- GET: 서버 자원을 가져오려고 할 때 사용한다.
- POST: 서버에 자원을 새로 등록하고자 할 때 사용한다.
- PUT: 서버의 자원을 요청에 들어있는 자원으로 치환하고자할 때 사용한다.
- PATCH: 서버 자원의 일부만 수정하고자 할 때 사용한다.
- DELETE: 서버의 자원을 삭제하고자할 때 사용한다.

### 2.2. HTTP 프로토콜
클라이언트가 누구든 서버와 HTTP 프로토콜로 소통 가능하다.
- IOS, 안드로이드, 웹이 모두 같은 주소로 요청 보낼 수 있다.
- 서버와 클라이언트 분리가 가능하다.

**RESTful**
- REST API를 사용한 주소 체계를 이용하는 서버이다.
- GET /user는 사용자를 조회하는 요청, POST /user는 사용자를 등록하는 요청이다.

>| HTTP 메서드 | 주소 | 역할 |
>|:---|:---|:---|
>| GET | / | restFront.html 파일 제공 |
>| GET | /about | about.html 파일 제공 |
>| GET | /users | 사용자 목록 제공 |
>| GET | 기타 | 기타 정적 파일 제공 |
>| POST | /users | 사용자 등록 |
>| PUT | /users/사용자id | 해당 id의 사용자 수정 |
>| DELETE | /users/사용자id | 해당 id의 사용자 제거 |

### 2.3. REST 서버 만들기








<br/>


## **3. 쿠키와 세션 이해하기**
---
### 3.1. 쿠키의 필요성
쿠키에는 단점이 있다.
- 누가 요청을 보냈는지 알 수 없다(IP 주소와 브라우저 정보 정도만 알 수 있다).
    - 로그인을 구현하려면 쿠키와 세션을 같이 이용하면 된다.

쿠키: 키=값의 쌍이다.
- name = don
- 매 요청마다 서버에 포함해서 보낸다.
- 서버는 쿠키를 읽어 누구인지 파악한다.

### 3.2. 쿠키 서버 만들기
쿠키 넣는 것을 직접 구현해본다.
- writeHead: 요청 헤더에 입력하는 메서드
- Set-Cookie: 브라우저에게 쿠키를 설정하라고 명령하는 키
```javascript
// cookie.js
const http = require('http');

http.createServer((req, res) => {
    console.log(req.url, req.headerscookie);
    res.writeHead(200, { 'Set-Cookie': 'mycookie=test' });
    res.end('Hello Cookie');
})
    .listen(8083, () => {
        console.log('8083번 포트에서 서버 대기중입니다.');
    });
```

### 3.3. 쿠키 서버 실행하기
req.headers.cookie: 쿠키가 문자열로 담겨있다.

req.url: 요청 주소이다.

localhost:8082에 접속한다.
- 요청이 전송되고 응답이 왔을 때 쿠키가 설정된다.
- favicon.ico는 브라우저가 자동으로 보내는 요청이다.
- 두 번째 요청인 favicon.ico에 쿠키가 넣어진다.


### 3.4. 헤더와 본문
http 요청과 응답은 헤더와 본문을 가진다.
- 헤더는 요청 또는 응답에 대한 정보를 가진다.
- 본문은 주고받는 실제 데이터이다.
- 쿠키는 부가적인 정보이므로 헤더에 저장한다.

### 3.5. http 상태 코드
writeHead 메서드에 첫 번째 인수로 넣은 값이다.
- 요청이 성공했는지 실패했는지를 알려준다.
- 2XX: 성공을 알리는 상태 코드이다. 대표적으로 200(성공), 201(작성됨)이 많이 사용된다.
- 3XX: 리다이렉션(다른 페이지로 이동)을 알리는 상태 코드이다. 어떤 주소를 입력했는데 다른 주소의 페이지로 넘어갈 때 이 코드가 사용된다. 대표적으로 301(영구 이동), 302(임시 이동)가 있다.
- 4XX: 요청 오류를 나타낸다. 요청 자체에 오류가 있을 때 표시됩니다. 대표적으로 401(권한 없음), 403(금지됨), 404(찾을 수 없음)가 있다.
- 5XX: 서버 오류를 나타낸다. 요청은 제대로 왔지만 서버에 오류가 생겼을 때 발생한다. 이 오류가 뜨지 않게 주의해서 프로그래밍해야 한다. 이 오류를 클라이언트로 res.writeHead로 직접 보내는 경우는 없고, 예기치 못한 에러 발생 시 서버가 알아서 5XX대 코드를 보낸다. 500(내부 서버 오류), 502(불량 게이트웨이), 503(서비스를 사용할 수 없음)이 자주 사용된다.

### 3.6. 쿠키로 나를 식별하기
쿠키에 내 정보를 입력한다.
- parseCookies: 쿠키 문자열을 객체로 변환한다.
- 주소가 /login인 경우와 /인 경우로 나뉜다.
    - /login인 경우 querystring으로 온 이름을 쿠키로 저장한다.
    - 그 외의 경우 쿠키가 있는지 없는지 판단한다.
        - 없으면 로그인 페이지로 리다이렉트한다.

### 3.7. 쿠키 옵션
Set-Cookie 시 다양한 옵션이 있다.
- 쿠키명=쿠키값: 기본적인 쿠키의 값이다. mycookie=test 또는 name=don 같이 설정한다.
- Expires=날짜: 만료 기한이다. 이 기한이 지나면 쿠키가 제거된다. 기본값은 클라이언트가 종료될 때까지이다.
- Max-age=초: Expires와 비슷하지만 날짜 대신 초를 입력할 수 있다. 해당 초가 지나면 쿠기가 제거된다. Expires보다 우선한다.
- Domain=도메인명: 쿠키가 전송될 도메인을 특정할 수 있다. 기본값은 현재 도메인이다.
- Path=URL: 쿠키가 전송될 URL을 특정할 수 있다. 기본값은 ‘/’이고 이 경우 모든 URL에서 쿠키를 전송할 수 있다.
- Secure: HTTPS일 경우에만 쿠키가 전송된다.
- HttpOnly: 설정 시 자바스크립트에서 쿠키에 접근할 수 없다. 쿠키 조작을 방지하기 위해 설정하는 것이 좋다.

### 3.8. 쿠키 서버 실행하기


### 3.9. 세션 사용하기
쿠키의 정보는 노출되고 수정되는 위험이 있다.
- 중요한 정보는 서버에서 관리하고 클라이언트에는 세션 키만 제공한다.
- 서버에 세션 객체(session)생성 후, uniqueInt(키)를 만들어 속성명으로 사용한다.
- 속성 값에 정보를 저장하고 uniqueInt를 클라이언트에 보낸다.

### 3.10 세션 서버 실행하기






<br/>


## **4. http와 http2**
---
### 4.1. https
웹 서버에 SSL 암호화를 추가하는 모듈이다.
- 오고 가는 데이터를 암호화해서 중간에 다른 사람이 요청을 가로채더라도 내용을 확인할 수 없다.
- 요즘에는 https 적용이 필수이다.

### 4.2. https 서버
http 서버를 https 서버로 변경하려면?
- 암호화를 위해 인증서를 발급받아야 한다.

createServer가 인자를 두 개 받는다.
- 첫 번째 인자는 인증서와 관련된 옵션 객체이다.
- pem, crt, key 등 인증서를 구입할 때 얻을 수 있는 파일을 넣는다.
- 두 번째 인자는 서버 로직이다.
```javascript
// server1.js
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})
    .listen(8080, () => {   // 서버 연결
        console.log('8080번 포트에서 서버 대기중입니다.');
    })
```
**http -> https**
```javascript
// server1-3.js
const https = require('https');
const fs = require('fs');

https.createServer({
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ]
}, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html charset=utf=8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})
    .listen(443, () => {
        console.log('443번 포트에서 서버 대기중입니다.');
    });
```

### 4.3. http2
SSL 암호화와 더불어 최신 HTTP 프로토콜인 http/2를 사용하는 모듈이다.
- 요청 및 응답 방식이 기존 http/1.1보다 개선되었다.
- 웹의 속도도 개선되었다.

### 4.4. http2 적용 서버
https 모듈을 http2로, createServer 메서드를 createSecureServer 메서드로 변경한다.

**https -> http2**
```javascript
// server1-4.js
const http2 = require('http2');
const fs = require('fs');

https.createServer({
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ]
}, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html charset=utf=8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})
    .listen(443, () => {
        console.log('443번 포트에서 서버 대기중입니다.');
    });
```

<br/>

## **5. cluster**
---
### 5.1. cluster
기본적으로 싱글 스레드인 노드가 CPU 코어를 모두 사용할 수 있게 해주는 모듈이다.
- 포트를 공유하는 노드 프로세스를 여러 개 둘 수 있다.
- 요청이 많이 들어왔을 때 병렬로 실행된 서버의 개수만큼 요청이 분산된다.
- 서버에 무리가 덜 간다.
- 코어가 8개인 서버가 있을 때: 보통은 코어 하나만 활용한다.
    - cluster로 코어 하나당 노드 프로세스 하나를 배정 가능하다.
    - 성능이 8배가 되는 것은 아니지만 개선된다.
    - 단점: 컴퓨터 자원(메모리, 세션)을 공유하지 못한다.
    - Redis등 별도 서버로 해결 해야된다.

### 5.2. 서버 클러스터링
마스터 프로세스와 워커 프로세스
- 마스터 프로세스는 CPU 개수만큼 워커 프로세스를 만든다(worker_threads랑 구조가 비슷하다).
- 요청이 들어오면 워커 프로세스에 고르게 분배한다.

### 5.3. 워커 프로세스 개수 확인하기

### 5.4. 워커 프로세스 다시 살리기