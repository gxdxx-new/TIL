# **노드 기능**

## 1.1. REPL 사용하기
자바스크립트는 스크립트 언어이기 때문에 코드를 즉석으로 실행할 수 있다.
- REPL이라는 콘솔을 사용한다.
- R(read), E(Evaluate), P(Print), L(Loop)
- 명령프롬프트에 입력하면 프롬프트가 > 모양으로 바뀐다.
- 입력한 값의 결괏값이 바로 출력된다.
- 간단한 코드를 테스트하는 용도로 적합하다.
```javascript
> const str = 'Hello world, hello node';
undefined
> console.log(str);
Hello world, hello node
undefined
>
```
</br>

## 1.2. JS 파일 실행하기
자바스크립트 파일을 만들어 통째로 코드를 실행하는 방법이다.
```javascript
// helloWorld.js
function hellowWorld() {
    console.log('Hello World');
    helloNode();
}

function helloNode() {
    console.log('Hello Node');
}

helloWorld();
```

```javascript
// console
$ node helloWorld
Hello World
Hello Node
```

</br>

## 1.3. 모듈로 만들기
### 1.3.1. 모듈
노드는 자바스크립트 코드를 모듈로 만들 수 있다.
- 모듈 : 특정한 기능을 하는 함수다 변수들의 집합
- 모듈로 만들면 여러 프로그램에서 재사용이 가능하다.
- 파일들간의 중복을 제거 가능하다.

### 1.3.2. 모듈 만들기
같은 폴더 내에 var.js, func.js, index.js을 만든다.
- 파일 끝에 **module.exports**로 모듈로 만들 값을 지정한다.
    - module.exports는 파일에서 한 번만 써야된다.
- 다른 파일에서 **require(파일경로)**로 그 모듈의 내용을 가져올 수 있다.
```javascript
// var.js
const odd = '홀수입니다';
const even = '짝수입니다';

module.exports = {
    odd,    // 객체의 키와 값 변수가 같으면 생략 가능(원래는 odd: odd)
    even,   // even: even
};

// func.js
const { odd, even } = require('./var.js');  // 구조분해 할당

function checkOddOrEven(num) {
    if (num % 2) {
        return odd;
    }
    return even;
}

module.exports = checkOddOrEven;

// index.js
const { odd, even } = require('./var.js');
const checkNumber = require('./func');

function checkStringOddOrEnen(str) {
    if (str.length % 2) {
        return odd;
    }
    return even;
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven('hello'));
```
```javascript
// console
$ node index
짝수입니다
혹수입니다
```

### 1.3.3. ES2015 모듈
자바스크립트 자체 모듈 시스템 문법이 생겼다.
- 아직 노드에서는 완벽하게 지원하지는 않는다. mjs 확장자를 사용해야 한다.
- require 대신 import, module.exports 대신 export default
```javascript
// func.mjs
import { odd, even } from './var';

function checkOddOrEven(num) {
    if (num % 2) {
        return odd;
    }
    return even;
}

export default checkOddOrEven;
```

</br>

## 1.4. 노드 내장 객체 알아보기
### 1.4.1. global
노드의 전역 객체이다.
- 브라우저의 window같은 역할을 한다.
- 모든 파일에서 접근이 가능하다.
- window처럼 생략이 가능하다(console, require도 global의 속성이다).

### 1.4.2. global 속성 공유
global 속성에 값을 대입하면 다른 파일에서도 사용이 가능하다.
- 추천하지 않음(modeule.exports를 쓰는걸 추천)
```javascript
// globalA.js
module.exports = () => global.message;

// globalB.js
const A = require('./globalA.js');

global.message = '안녕하세요';
console.log(A());

// console
$ node globalB
안녕하세요
```

### 1.4.3. console 객체
브라우저의 console 객체와 매우 유사하다.
- console.time, console.timeEnd: 시간 로깅
- console.error: 에러 로깅
- console.log: 평범한 로그
- console.dir: 객체 로깅
- console.trace: 호출스택 로깅
```javascript
const string = 'abc';
const number = 1;
const boolean = true;
const obj = {
    outside: {
        inside: {
            key: 'value',
        },
    },
};
console.time('전체 시간');
console.log('평범한 로그입니다 쉼표로 구분해 여러 값을 찍을 수 있습니다.');
console.log(string, number, boolean);
console.error('에러 메시지는 console.error에 담아주세요');

console.table([{ name:'돈', birth: 1996 }, { name: '윤', birth: 2000 }]);

console.dir(obj, { colors: false, depth: 2 });
console.dir(obj, { colors: true, depth: 1 });

console.time('시간 측정');
for (let i = 0; i < 10000; i++) {}
console.timeEnd('시간 측정');

function b() {
    console.trace('에러 위치 추적');
}

function a() {
    b();
}
a();

console.timeEnd('전체 시간');
```

### 1.4.4. 타이머 메서드
set 메서드에 clear 메서드가 대응된다.
- set 메서드의 리턴 값(아이디)을 clear 메서드에 넣어 취소한다.
- 함수들을 백그라운드로 보내는 비동기함수이다.
    - setTimeout(콜백 함수, 밀리초): 주어진 밀리초(1000분의 1초) 이후에 콜백 함수를 실행한다.
    - setInterval(콜백 함수, 밀리초): 주어진 밀리초마다 콜백 함수를 반복 실행한다.
    - setImmediate(콜백 함수): 콜백 함수를 즉시 실행한다.
    - clearTimeout(아이디): setTimeout을 취소한다.
    - clearInterval(아이디): setInterval을 취소한다.
    - clearImmediate(아이디): setImmediate을 취소한다.
```javascript
// timer.js
const timeout = setTimeout(() => {
    console.log('1.5초 후 실행');
}, 1500);

const interval = setInterval(() => {
    console.log('1초마다 실행');
}, 1000);

const timeout2 = setTimeout(() => {
    console.log('실행되지 않습니다');
}, 3000);

setTimeout(() => {
    clearTimeout(timeout2);
    clearInterval(interval);
}, 2500);

const immediate = setImmediate(() => {
    console.log('즉시 실행');
});

const immediate2 = setImmediate(() => {
    console.log('실행되지 않습니다');
});

clearImmediate(immediate2);
```
```javascript
// console
$ node timer
즉시 실행
1초마다 실행
1.5초 후 실행
1초마다 실행
```

### 1.4.5. __filename, __dirname
__filename: 현재 파일 경로
__dirname: 현재 폴더(디렉터리) 경로
```javascript
// filename.js
console.log(__filename);
console.log(__dirname);

// console
$ node filename.js
C:\Users\don\filename.js
C:\Users\don\
```

### 1.4.6. module, exports
module.exports 외에도 exports로 모듈을 만들 수 있다.
- module.exports와 exports가 참조 관계
    - exports -> module.exports -> {}
- exports에 객체의 속성이 아닌 다른 값을 대입하면 참조 관계가 깨진다.

```javascript
// var.js
exports.odd = '홀수입니다';
exports.even = '짝수입니다';
/*
    두 코드가 같지만 exports와 module.exports를 같이 쓸 수는 없다.
    module.exports = {
        odd,
        even,
    };
*/

// console
$ node index
짝수입니다
홀수입니다
```

### 1.4.7. this
노드에서 this를 사용할 때 주의점
- 최상위 스코프의 this는 module.exports를 가리킨다.
- 그 외에는 브라우저의 자바스크립트와 동일하다.
- 함수 선언문 내부의 this는 global(전역) 객체를 가리킨다.
```javascript
// this.js
console.log(this);
console.log(this === module.exports);
console.log(this === exports);

function whatIsThis() {
    console.log('function', this === exports, this === global);
}
whatIsThis();

// console
$ node this
{}
true
true
function false true
```

### 1.4.8. require의 특성
- require가 제일 위에 올 필요는 없다.
- require.cache에 한 번 require한 모듈에 대한 캐쉬 정보가 들어있다.
    - 다시 require할 때는 캐쉬에서 가져온다(하드디스크 -> 메모리).
- require.main은 노드 실행 시 첫 모듈을 가리킨다.
```javascript
// require.js
console.log('require가 가장 위에 오지 않아도 됩니다.');

module.exports = '저를 찾아보세요.';

require('./var');

console.log('require.cache입니다.');
console.log(require.cache);
console.log('require.main입니다.');
console.log(require.main === module);
console.log(require.main.filename);
```

### 1.4.9. 순환참조
두 개의 모듈이 서로를 require하는 상황을 조심해야 한다.
- dep1이 dep2를 require하고, dep2가 dep1을 require하는 경우
- dep1의 module.exports가 함수가 아니라 빈 객체가 된다(무한 반복을 막기 위해).
```javascript
// dep1.js
const dep2 = require('./dep2');
console.log('require dep2', dep2);
module.exports = () => {
    console.log('dep2', dep2);
};

// dep2.js
const dep1 = require('./dep1');
console.log('require dep1', dep1);
module.exports = () => {
    console.log('dep1', dep1);
};

// dep-run.js
const dep1 = require('./dep1');
const dep2 = require('./dep2');

dep1();
dep2();

// console
$ node dep-run
require dep1 {}
require dep2 [Function (anonymous)]
dep2 [Function (anonymous)]
dep1 {}
```

### 1.4.10. process
현재 실행중인 노드 프로세스에 대한 정보를 담고 있다.
```javascript
// console
$ node
> process.version
v14.0.0 // 설치한 노드의 버전
> process.arch
x64 // 프로세서 아키텍처 정보
> process.platform
win32   // 운영체제 플랫폼 정보
> process.pid
14736   // 현재 프로세스의 아이디. 프로세스를 여러 개 가질 때 구분 가능
> process.uptime()
199.36  // 프로세스가 시작된 후 흐른 시간. 단위는 초
> process.execPath
C:\\Program Files\\nodejs\\node.exe // 노드의 경로
>process.cwd()
C:\\Users\\don  // 현재 프로세스가 실행되는 위치
> process.cpuUsage()
{ user: 390000, system: 203000 }    // 현재 cpu 사용량
```

### 1.4.11. process.env
시스템 환경 변수들이 들어있는 객체이다.
- 비밀키(DB 비밀번호, 서드파이 앱 키 등)을 보관하는 용도로 쓰인다.
- 환경변수는 process.env로 접근이 가능하다.
```javascript
const secretId = process.env.SECRET_ID;
const secretCode = process.env.SECRET_CODE;
```
- 일부 환경 변수는 노드 실행 시 영향을 미친다.
    - ex) NODE_OPTIONS(노드 실행 옵션), UV_THREADPOOL_SIZE(스레드풀 개수)
        - max-old-space-size는 노드가 사용할 수 있는 메모리를 지정하는 옵션이다.
```javascript
    NODE_OPTIONS = --max-old-space-size=8192
    UV_THREADPOOL_SIZE = 8
```

### 1.4.12. process.nextTick(콜백)
이벤트 루프가 다른 콜백 함수들보다 nextTick의 콜백 함수를 우선적으로 처리함
- 너무 남용하면 다른 콜백 함수들 실행이 늦어진다.
- 비슷한 경우로 promise가 있다(nextTick처럼 우선순위가 높다).
- 아래 예제에서 setImmediate, setTimeout보다 promise와 nextTick이 먼저 실행된다.
```javascript
// nextTick.js
setImmediate(() => {
    console.log('immediate');
});
process.nextTick(() => {
    console.log('nextTick');
});
setTimeout(() => {
    console.log('timeout');
}, 0);
Promise.resolve().then(() => console.log('promise'));

// console
$ node nextTick
nextTick
promise
timeout
immediate
```

### 1.4.13. process.exit
현재의 프로세스를 멈추게 한다.
- 코드가 없거나 0이면 정상 종료
- 이외의 코드는 비정상 종료를 의미한다.
```javascript
// exit.js
let i = 1;
setInterval(() => {
    if (i === 5) {
        console.log('종료!');
        process.exit();
    }
    console.log(i);
    i += 1;
}, 1000);

// console
$ node exit
1
2
3
4
종료!
```

</br>

## 1.5. 노드 내장 모듈 사용하기
### 1.5.1. os
운영체제의 정보를 담고 있다.
- 모듈은 require로 가져온다(내장 모듈이라 경로 대신 이름만 적어줘도 된다).
- os.arch(): process.arch와 동일하다.
- os.platform(): process.platform와 동일하다.
- os.type(): 운영체제의 종류를 보여준다.
- os.uptime(): 운영체제 부팅 이후 흐른 시간(초)을 보여준다.
    - process.uptime()은 노드의 실행 시간을 보여준다.
- os.hostname(): 컴퓨터의 이름을 보여준다.
- os.release(): 운영체제의 버전을 보여준다.
- os.homedir(): 홈 디렉터리 경로를 보여준다.
- os.tmpdir(): 임시 파일 저장 경로를 보여준다.
- os.cpus(): 컴퓨터의 코어 정보를 보여준다.
- os.freemem(): 사용 가능한 메모리(RAM)을 보여준다.
- os.totalmem(): 전체 메모리 용량을 보여준다.

### 1.5.2. path
폴더와 파일의 경로를 쉽게 조작하도록 도와주는 모듈이다.

os에 따른 구분자의 차이를 알아서 처리해준다.
- path.sep: 경로의 구분자이다. Windows는 \, POSIX는 /이다.
- path.delimiter: 환경 변수의 구분자이다. process.env.PATH를 입력하면 여러 개의 경로가 이 구분자로 구분되어 있다. Windows는 세미콜론(;)이고 POSIX는 콜론(:)이다.
- path.dirname(경로): 파일이 위치한 폴더 경로를 보여준다.
- path.extname(경로): 파일의 확장자를 보여준다.
- path.basename(경로, 확장자): 파일의 이름(확장자 포함)을 보여준다. 파일의 이름만 표시하고 싶다면 basename의 두 번째 인자로 파일의 확장자를 넣어주면 된다.
- path.parse(경로): 파일 경로를 root, dir, base, ext, name으로 분리한다.
- path.format(객체): path.parse()한 객체를 파일 경로로 합친다.
- path.normalize(경로): /나 \를 실수로 여러 번 사용했거나 혼용했을 때 정상적인 경로로 변환해준다.
- path.isAbsolute(경로): 파일의 경로가 절대경로인지 상대경로인지 true나 false로 알려준다.
- path.relative(기준경로, 비교경로): 경로를 두 개 넣으면 첫 번째 경로에서 두 번째 경로로 가는 방법을 알려준다.
- path.join(경로, .. .): 여러 인자를 넣으면 하나의 경로로 합쳐준다. 상대경로인 ..(부모 디렉터리)과 .(현 위치)도 알아서 처리해준다.
- path.resolve(경로, .. .): path.join()과 비슷하지만 차이가 있다.

join과 resolve의 차이: resolve는 /를 절대경로로 처리, join은 상대경로로 처리한다.
- 상대 경로: 현재 파일 기준. 같은 경로면 점 하나(.), 한 단계 상위 경로면 점 두개(..)
```javascript
path.join('/a', '/b', 'c'); // 결과: /a/b/c/
path.resolve('/a', '/b', 'c');  // 결과: /b/c
```
\\\와 \ 차이: \는 윈도 경로 구분자, \\\는 자바스크립트 문자열 안에서 사용한다.

### 1.5.3. url 모듈
인터넷 주소를 쉽게 조작하도록 도와주는 모듈이다.
- 기존 노드 방식과 WHATWG 방식이 있다.
- 기존 노드 방식 메서드
    - url.parse(주소): 주소를 분해한다. WHATWG 방식과 비교하면 username과 password 대신 auth 속성이 있고, searchParams 대신 query가 있다.
    - url.format(객체): WHATWG 방식의 url과 기존 노드의 url모두 사용할 수 있다. 분해되었던 url 객체를 다시 원래 상태로 조립한다.
- searchParams
    - WHATWG 방식에서 쿼리스트링(search) 부분 처리를 도와주는 객체이다.
    - getAll(키): 키에 해당하는 모든 값들을 가져온다. category 키에는 두 가지 값, 즉 nodejs와 javascript의 값이 들어 있다.
    - get(키): 키에 해당하는 첫 번째 값만 가져온다.
    - has(키): 해당 키가 있는지 없는지를 검사한다.
    - keys(): searchParams의 모든 키를 반복기(iterator, ES2015 문법) 객체로 가져온다.
    - values(): searchParams의 모든 값을 반복기 객체로 가져옵온다.
    - append(키, 값): 해당 키를 추가한다. 같은 키의 값이 있다면 유지하고 하나 더 추가한다.
    - set(키, 값): append와 비슷하지만 같은 키의 값들을 모두 지우고 새로 추가한다.
    - delete(키): 해당 키를 제거한다.
    - toString(): 조작한 searchParams 객체를 다시 문자열로 만든다. 이 문자열을 search에 대입하면 주소 객체에 반영된다.
- querystring
    - 기존 노드 방식에서는 url querystring을 querystring 모듈로 처리한다.
    - querystring.parse(쿼리): url의 query 부분을 자바스크립트 객체로 분해해준다.
    - querystring.stringify(객체): 분해된 query 객체를 문자열로 다시 조립해준다.

### 1.5.4. 단방향 암호화(crypto)
암호화는 가능하지만 복호화는 불가능하다.
- 암호화: 평문을 암호로 만듦
- 복호화: 암호를 평문으로 해독

단방향 암호화의 대표주자는 해시 기법이다.
- 문자열을 고정된 길이의 다른 문자열로 바꾸는 방식이다.

sha512
- createHash(알고리즘): 사용할 해시 알고리즘을 넣어준다.
    - md5, sha1, sha256, sha512 등이 가능하지만, md5와 sha1은 이미 취약점이 발견되었다.
    - 현재는 sha512 정도로 충분하지만, 나중에 sha512 마저도 취약해지면 더 강화된 알고리즘으로 바꿔야 한다.
- update(문자열): 변환할 문자열을 넣어준다.
- digest(인코딩): 인코딩할 알고리즘을 넣어준다.
    - base64가 결과 문자열이 가장 짧아 자주 사용된다.

pbkdf2
- pbkdf2나, bcrypt, scrypt 알고리즘으로 비밀번호를 암호화한다.
- Node는 pbkdf2와 scrypt를 지원한다.
```javascript
// pbkdf2.js
const crypto = require('crypto');

crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    console.log('salt:', salt);
    crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
        console.log('password', key.toString('base64'));
    });
});
```
- crypto.randomBytes로 64바이트 문자열 생성 -> salt 역할
- pbkdf2 인수로 순서대로 비밀번호, salt, 반복 횟수, 출력 바이트, 알고리즘
- 반복 횟수를 조정해 암호화하는데 1초 정도 걸리게 맞추는 것이 권장됨

### 1.5.5. 양방향 암호화
대칭형 암호화(암호문 복호화 가능)
- 암호화할 때와 복호화할 때 같은 key를 사용해야 한다.
- crypto.createCipheriv(알고리즘, 키, iv): 암호화 알고리즘과 키, 초기화벡터를 넣어준다.
- cipher.update(문자열, 인코딩, 출력 인코딩): 암호화할 대상과 대상의 인코딩, 출력 결과물의 인코딩을 넣어준다.
    - 보통 문자열은 utf8 인코딩을, 암호는 base64를 많이 사용한다.
- cipher.final(출력 인코딩): 출력 결과물의 인코딩을 넣어주면 암호화가 완료된다.
- crypto.createDecipheriv(알고리즘, 키, iv): 복호화할 때 사용한다. 암호화할 때 사용했던 알고리즘과 키, iv를 그대로 넣어주어야 한다.
- decipher.update(문자열, 인코딩, 출력 인코딩): 암호화된 문장, 그 문장의 인코딩, 복호화할 인코딩을 넣어준다.
createCipher의 update()에서 utf8, base64 순으로 넣었다면 createDecipher의 update()에서는 base64, utf8 순으로 넣으면 된다.
- decipher.final(출력 인코딩): 복호화 결과물의 인코딩을 넣어준다.

### 1.5.6. util
각종 편의 기능을 모아둔 모듈이다.
- deprecated와 promisify가 자주 쓰인다.
```javascript
// util.js
const util = require('util');
const crypto = require('crypto');

const dontUseMe = util.deprecate((x, y) => {
    console.log(x + y);
}, 'dontUseMe 함수는 deprecated되었으니 더 이상 사용하지 마세요!');
dontUseMe(1, 2);

const randomBytesPromise = util.promisify(crypto.randomBytes);
randomBytesPromise(64)
    .then((buf) => {
        console.log(buf.toString('base64'));
    })
    .catch((error) => {
        console.error(error);
    });
```
- util.deprecate: 함수가 deprecated 처리되었음을 알려준다.
- util.promisify: 콜백 패턴을 프로미스 패턴으로 바꿔준다.

**deprecated이란?**
- 중요도가 떨어져 더 이상 사용되지 않고 앞으로는 사라지게 될' 것이라는 뜻이다. 새로운 기능이 나와서 기존 기능보다 더 좋을 때, 기존 기능을 depreceate 처리하곤 한다. 이전 사용자를 위해 기능을 제거하지는 않지만 곧 없앨 예정이므로 더 이상 사용하지 말라는 의미이다.

### 1.5.7. worker_threads
노드에서 멀티 스레드 방식으로 작업할 수 있다.

### 1.5.8. child_process




</br>

## 1.6. 파일 시스템 접근하기
### 1.6.1. fs
파일 시스템에 접근하는 모듈이다.
- 파일/폴더 생성, 삭제, 읽기, 쓰기가 가능하다.
- 웹 브라우저에서는 제한적이었으나 노드는 권한을 가지고 있다.
```javascript
// readme.txt
txt 파일입니다.

//readFile.js
const fs = require('fs');

fs.readFile('./readme.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log(data);
    console.log(data.toString());
});
```

### 1.6.2. fs 프로미스
콜백 방식 대신 프로미스 방식으로 사용 가능하다.
```javascript
// readFilePromise.js
const fs = require('fs').promises;

fs.readFile('./readme.txt')
    .then((data) => {
        console.log(data);
        console.log(data.toString());
    })
    .catch((err) => {
        console.log(err);
    });
```

### 1.6.3. fs로 파일 만들기
```javascript
// writeFile.js
const fs = require('fs').promises;

fs.writeFile('./writeme.txt', '글이 입력됩니다')
    .then(() => {
        return fs.readFile('./writeme.txt');
    })
    .then((data) => {
        console.log(data.toString());
    })
    .catch((err) => {
        console.log(err);
    )};
```

### 1.6.4. 동기 메서드와 비동기 메서드
노드는 대부분의 내장 모듈 메서드를 **비동기 방식**으로 처리한다.
- 비동기는 코드의 순서와 실행 순서가 일치하지 않는 것을 의미한다.
- 일부는 동기 방식으로 사용 가능하다.

동기와 비동기: 백그라운드 작업 완료 확인 여부

블로킹과 논 블로킹: 함수가 바로 return 되는지 여부

노드에서는 대부분 동기-블로킹 방식과 비동기-논 블로킹 방식이다.
<img src="./image/synchronous.png" width="500" height="250">

### 1.6.5. 동기 메서드 사용하기
```javascript
// sync.js
const fs = require('fs');

console.log('시작');
let data = fs.readFileSync('./readme2.txt');
console.log('1번', data.toString());
data = fs.readFileSync('./readme2.txt');
console.log('2번', data.toString());
data = fs.readFileSync('./readme2.txt');
console.log('3번', data.toString());
console.log('끝');

// console
$ node sync
시작
1번
2번
3번
끝
```

### 1.6.6. 비동기 메서드로 순서 유지하기
콜백 형식을 유지한다
- 코드가 우측으로 너무 들어가는 현상인 콜백 헬이 발생한다.
```javascript
//asyncOrder.js
const fs = require('fs');

console.log('시작');
fs.readFile('./readme2.txt', (err, data) => {
    if(err) {
        throw err;
    }
    console.log('1번', data.toString());
    fs.readFile('./readme2.txt', (err, data) => {
        if(err) {
            thorw err;
        }
        console.log('2번', data.toString());
        fs.readFile('./readme2.txt', (err, data) => {
            if(err) {
                thorw err;
            }
            console.log('3번', data.toString());
            console.log('끝');
        });
    });
});
```

프로미스로 콜백 헬을 극복할 수 있다.
```javascript
// asyncOrderPromise.js
const fs = require('fs').promises;

console.log('시작');
fs.readFile('./readme2.txt')
    .then((data) => {
        console.log('1번', data.toString());
        return fs.readFile('./readme2.txt');
    })
    .then((data) => {
        console.log('2번', data.toString());
        return fs.readFile('./readme2.txt');
    })
    .then((data) => {
        console.log('3번', data.toString());
        console.log('끝');
    })
    .catch((err) => {
        console.log(err);
    });
```

### 1.6.7. 버퍼와 스트림 이해하기
버퍼: 일정한 크기로 모아두는 데이터이다.
- 일정한 크기가 되면 한 번에 처리한다.
- 버퍼링: 버퍼에 데이터가 찰 때까지 모으는 작업이다.

스트림: 데이터의 흐름이다.
- 일정한 크기로 나눠서 여러 번에 걸쳐서 처리한다.
- 버퍼의 크기를 작게 만들어서 주기적으로 데이터를 전달한다.
- 스트리밍: 일정한 크기의 데이터를 지속적으로 전달하는 작업이다.

### 1.6.8. 버퍼 사용하기
노드에서는 Buffer 객체를 사용한다.
- from(문자열): 문자열을 버퍼로 바꿀 수 있다. length 속성은 버퍼의 크기를 알려준다. 바이트 단위이다.
- toString(버퍼): 버퍼를 다시 문자열로 바꿀 수 있다. 이때 base64나 hex를 인자로 넣으면 해당 인코딩으로도 변환할 수 있다.
- concat(배열): 배열 안에 든 버퍼들을 하나로 합친다.
- alloc(바이트): 빈 버퍼를 생성한다. 바이트를 인자로 지정해주면 해당 크기의 버퍼가 생성된다.
```javascript
// buffer.js
const buffer = Buffer.from('저를 버퍼로 바꿔보세요');
console.log('from():', buffer);
console.log('length:', buffer.length);
console.log('toString():', buffer.toString());

const array = [Buffer.from('띄엄 '), Buffer.from('띄엄 '), Buffer.from('띄어쓰기')];
const buffer2 = Buffer.concat(array);
console.log('concat():', buffer2.toString());

const buffer3 = Buffer.alloc(5);
console.log('alloc():', buffer3);
```

### 1.6.9. 파일 읽는 스트림 사용하기
fs.createReadStream
- 인자로 파일 경로와 옵션 객체를 전달한다.
- data(chunk 전달), end(전달 완료), error(에러 발생) 이벤트 리스너와 같이 사용한다.
```javascript
// createReadStream.js
const fs = require('fs');

const readStream = fs.createReadStream('./readme3.txt', { highWaterMark: 16 });
const data = [];

readStream.on('data', (chunk) => {
    data.push(chunk);
    console.log('data :', chunk, chunk.length);
});
readStream.on('end', () => {
    console.log('end :', Buffer.concat(data).toString());
});

readStream.on('error', (err) => {
    console.log('error :', err);
});
```

### 1.6.10. 파일 쓰는 스트림 사용하기
fs.createWriteStream
- 인자로 파일 경로를 전달한다.
- write로 chunk입력, end로 스트림 종료한다.
- 스트림 종료시 finish 이벤트가 발생한다.
```javascript
//createWriteStream.js
const fs = require('fs');

const writeStream = fs.createWriteStream('./writem2.txt');
writeStream.on('finish', () => {
    console.log('파일 쓰기 완료');
});

writeStream.write('이 글을 씁니다\n');
writeStream.write('한 번 더 씁니다.');
writeStream.end();
```

### 1.6.11. 스트림 사이에 pipe 사용하기

### 1.6.12. 여러 개의 스트림 연결하기

### 1.6.13. 큰 파일 만들기

### 1.6.14. 메모리 체크하기

### 1.6.15. 기타 fs 메서드

### 1.6.16. access, mkdir, open, rename

### 1.6.17. 폴더 내용 확인 및 삭제

### 1.6.18. 기타 fs 메서드

### 1.6.19. 스레드풀 알아보기

### 1.6.20. UV_THREAD_SIZE

</br>

## 1.7. 이벤트 이해하기
### 1.7.1. 이벤트 만들고 호출하기
events 모듈로 커스텀 이벤트를 만들 수 있다.
- on(이벤트명, 콜백): 이벤트 이름과 이벤트 발생 시의 콜백을 연결해준다. 이렇게 연결하는 동작을 이벤트 리스닝이라고 부른다. event2처럼 이벤트 하나에 이벤트 여러 개를 달아줄 수도 있다.
- addListener(이벤트명, 콜백): on과 기능이 같다.
- emit(이벤트명): 이벤트를 호출하는 메서드이다. 이벤트 이름을 인자로 넣어주면 미리 등록해뒀던 이벤트 콜백이 실행된다.
- once(이벤트명, 콜백): 한 번만 실행되는 이벤트이다. myEvent.emit('event3')을 두 번 연속 호출했지만 콜백이 한 번만 실행된다.
- removeAllListeners(이벤트명): 이벤트에 연결된 모든 이벤트 리스너를 제거한다.event4가 호출되기 전에 리스너를 제거했으므로 event4의 콜백은 호출되지 않는다.
- removeListener(이벤트명, 리스너): 이벤트에 연결된 리스너를 하나씩 제거한다. 역시event5의 콜백도 호출되지 않는다.
- off(이벤트명, 콜백): 노드 10 버전에서 추가된 메서드로, removeListener와 기능이 같다.
- listenerCount(이벤트명): 현재 리스너가 몇 개 연결되어 있는지 확인한다.

### 1.7.2. 커스텀 이벤트 예제
```javascript
// event.js
const EventEmitter = require('events');

const myEvent = new EventEmitter();
myEvent.addListener('event1', () => {
    console.log('이벤트 1');
});
myEvent.on('event2', () => {
    console.log('이벤트 2');
});
myEvent.on('event2', () => {
    console.log('이벤트 2 추가');
});
myEvent.once('event3', () => {
    console.log('이벤트 3');
}); // 한 번만 실행된다.

myEvent.emit('event1'); // 이벤트 호출
myEvent.emit('event2'); // 이벤트 호출

myEvent.emit('event3'); // 이벤트 호출
myEvent.emit('event3'); // 실행 안 됨

myEnvent.on('event4', () => {
    console.log('이벤트 4');
});
myEvent.removeAllListeners('event4');
myEvent.emit('event4'); // 실행 안 됨

const listener = () => {
    console.log('이벤트 5');
};
myEvent.on('event5', listener);
myEvent.removeListener('event5', listener);
myEvent.emit('event5'); // 실행 안 된

console.log(myEvent.listenerCount('event2'));
```

</br>

## 1.8. 예외 처리하기
### 1.8.1. 예외 처리
예외(Exception): 처리하지 못한 에러이다.
- 노드 프로세스/스레드를 멈춘다.
- 노드는 기본적으로 싱글 스레드라 스레드가 멈춘다는 것은 프로세스가 멈추는 것이다.

### 1.8.2. try catch문
기본적으로 try catch문으로 예외를 처리한다.
- 에러가 발생할 만한 곳을 try catch로 감싸면 된다.
```javascript
// error1.js
setInterval(() => {
    console.log('시작');
    try {
        throw new Error('에러');
    } catch(err) {
        console.error(err);
    }
}, 1000);
```

### 1.8.3. 노드 비동기 메서드의 에러
노드 비동기 메서드 에러는 따로 처리하지 않아도 된다.
- 콜백 함수에서 에러 객체를 제공해준다.
```javascript
// error2.js
const fs = require('fs');

setInterval(() => {
    fs.unlink('./abcdefg.js', (err) => {
        if (err) {
            console.error(err);
        }
    });
}, 1000);
```

### 1.8.4. 프로미스의 에러
프로미스의 에러는 따로 처리하지 않아도 된다.
- 버전이 올라가면 동작이 바뀔 수 있다.
```javascript
// error3.js
const fs = require('fs');

setInterval(() => {
    fs.unlink('./abcdefg.js');
}, 1000)
```

### 1.8.5. 예측 불가능한 에러 처리하기
콜백 함수의 동작이 보장되지 않는다.
- 따라서 복구 작업용으로 쓰는 것은 부적합하고 에러 내용 기록용으로만 쓰는게 좋다.
```javascript
// error4.js
process.on('uncaughtException', (err) => {
    console.error('예기치 못한 에러', err);
});

setInterval(() => {
    throw new Error('에러');
}, 1000);

setTimeout(() => {
    console.log('실행');
}, 2000);
```

### 1.8.6. 프로세스 종료하기
윈도우
```javascript
// console
$ netstat -ano | findstr 포트
$ taskkill /pid 프로세스아이디 /f
```

맥/리눅스
```javascript
// console
$ lsof -i tcp:포트
$ kill -9 프로세스아이디
```