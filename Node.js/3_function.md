# **노드 기능**

## 1.1. REPL 사용하기
자바스크립트는 스크립트 언어이기 때문에 코드를 즉석으로 실행할 수 있다.
- REPL이라는 콘솔을 사용한다.
- R(read), E(Evaluate), P(Print), L(Loop)
- 명령프롬프트에 node를 입력하면 프롬프트가 > 모양으로 바뀐다.
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
\\와 \ 차이: \는 윈도 경로 구분자, \\는 자바스크립트 문자열 안에서 사용한다.




</br>

## 1.6. 파일 시스템 접근하기


</br>

## 1.7. 이벤트 이해하기


</br>

## 1.8. 예외 처리하기