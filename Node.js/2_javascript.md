# **자바스크립트**

## **1. 호출 스택, 이벤트 루프**

---

### **1.1. 호출 스택**

```javascript
function first() {
  second();
  console.log("첫 번째");
}
function second() {
  third();
  console.log("두 번째");
}
function third() {
  console.log("세 번째");
}
first();
```

- 위 코드의 순서: 세 번째 -> 두 번째 -> 첫 번째
- 쉽게 파악하는 방법 : 호출 스택 그리기

<img width="400" alt="callStack" src="https://user-images.githubusercontent.com/35963403/135278528-053759de-9d86-47a6-9b63-2b5e9d447d46.PNG">

- Anonymous는 가상의 전역 컨텍스트(항상 있다고 생각하는게 좋다.)
- 함수 호출 순서대로 쌓이고, 역순으로 실행된다.
- 함수 실행이 완료되면 스택에서 빠진다.

```javascript
function run() {
  console.log("3초 후 실행");
}
console.log("시작");
setTimeout(run, 3000); // 비동기 코드, 3초 뒤에 run() 호출
console.log("끝");
```

- 위 코드는 시작 -> 끝 -> 3초 후 실행
- 비동기 코드 때문에 호출 스택만으로는 설명이 안되고 이벤트 루프도 봐야된다.

---

### **1.2. 이벤트 루프**

- 이벤트 루프
  - 이벤트(setTimeout 등)가 발생할 때 호출할 콜백 함수들의 순서를 결정한다.
- 태스크 큐
  - 이벤트 발생 후 호출되어야 할 콜백 함수들이 순서대로 기다리는 공간이다.
- 백그라운드
  - 타이머나 I/O 작업 콜백, 이벤트 리스너들이 대기하는 공간이다.
  - 여러 작업이 동시에 실행될 수 있다.
- 호출 스택과 백그라운드는 동시에 실행된다.

<img width="500" alt="eventLoop" src="https://user-images.githubusercontent.com/35963403/135278913-640115d4-1ab3-45cd-ad9d-b09721834ae8.PNG">

- 코드에서 setTimeout이 호출될 때 콜백 함수 run은 백그라운드로 보내진다.
- 3초 뒤 백그라운드에서 태스크 큐로 보내진다.

<img width="500" alt="eventLoop3" src="https://user-images.githubusercontent.com/35963403/135278925-1b17d6f9-d686-4506-afe3-6c728cecdc53.PNG">

- setTimeout과 anonymous가 실행 완료된 후 호출 스택이 완전히 비워지면 이벤트 루프가 태스크 큐의 콜백을 호출 스택으로 올린다.
  - 호출 스택이 완전히 비워져야만 올린다.
  - 호출 스택에 함수가 많이 차 있으면 그것들을 처리하느라 3초가 지난 후에도 run 함수가 태스크 큐에서 대기하게 된다.
    - 타이머가 정확하지 않을 수 있는 이유이다.

<img width="500" alt="eventLoop4" src="https://user-images.githubusercontent.com/35963403/135278940-b6ddcd69-aab3-4caf-ab66-faf63a120b5b.PNG">

- run이 호출 스택에서 실행되고, 완료 후 호출 스택에서 나간다.
  - 이벤트 루프는 태스크 큐에 다음 함수가 들어올 때까지 계속 대기한다.
  - 태스크 큐는 실제로 여러 개고, 태스크 큐들과 함수들 간의 순서를 이벤트 루프가 결정함
  - 태스크 큐에선 우선순위에 따라 호출 스택으로 이동한다.

## **2. ES2015++**

---

### **2.1. var**

- ES2015 이전에는 var 키워드로 변수를 선언했다.
  - 문제점: 중복 선언이 가능해서 오류 발생 가능성이 있다.
  - ES2015부터는 const와 let이 대체한다.
  - const, let: 블록 스코프(Block Scope)
  - var: 함수 스코프(Function Scope)
- 함수 스코프
  - var 키워드로 선언한 변수는 함수의 블록만을 지역 스코프로 인정한다.
  - 함수 외부에서 var 키워드로 선언한 변수는 코드 블록 내에서 선언해도 모두 전역 변수가 된다.
  - 전역 변수가 남발될 수 있기 때문에 조심해야한다.
- **호이스팅(hoisting)**
  - var 키워드로 변수를 선언하면 변수 호이스팅에 의해 변수 선언문이 스코프의 제일 위로 올려져서 실행된다.
  - let, const도 호이스팅이 일어나지만 초기화 되기전까지 temporal dead zone에 머물게 구현되어 있어서 호이스팅 되지 않는다.

```javascript
if (true) {
  var x = 3;
}
console.log(x); // 3

if (true) {
  const y = 3;
}
console.log(y); // Uncaught ReferenceError: y is not defined
```

기존 : 함수 스코프(function() {}이 스코프의 기준점)

- 다른 언어와는 달리 if나 for, while은 영향을 미치지 못한다.
- const와 let은 함수 및 블록({})에도 별도의 스코프를 가진다.

---

### **2.2. const, let**

```javascript
const a = 0;
a = 1;  // Uncaught TypeError: Assignment to constant variable

let b = 0;
b = 1;  // 1

const c;    // unCaught SyntaxError: Missing initializier in const declaration
```

- const
  - 반드시 선언과 동시에 초기화해야 된다.
  - 값 변경이 불가능하다.
  - const 키워드로 선언된 변수에 객체를 할당하는 경우에는 값을 변경이 가능하다.
- let
  - 중복 선언할 경우 에러를 출력한다.
  - 블록안에서 지역변수로 동작하기 때문에 전역변수의 남발을 막을 수 있다.

---

### **2.3. 템플릿 문자열**

```javascript
var num1 = 1;
var num2 = 2;
var result = 3;
var string1 = num1 + " 더하기 " + num2 + "는 '" + result + "'";
console.log(string1); // 1 더하기 2는 '3'
```

- 기존에는 문자열을 합칠 때 + 기호때문에 지저분하다.
  - ES2015부터 **`(백틱)** 사용이 가능하다.
  - 백틱 문자열 안에 **${변수}** 처럼 사용한다.

```javascript
const num3 = 1;
const num4 = 2;
const result2 = 3;
const string2 = `${num3} 더하기 ${num4}는 '${result2}'`;
console.log(string2); // 1 더하기 2는 '3'
```

---

### **2.4. 객체 리터럴**

- 객체
  - 객체 지향 프로그래밍(OOP)에서 데이터(실체)와 그 데이터에 관련되는 동작(절차, 방법, 기능)을 모두 포함한다.

```javascript
var sayNode = function () {
  console.log("Node");
};
var es = "ES";
var oldObject = {
  sayJS: function () {
    console.log("JS");
  },
  sayNode: sayNode,
};
oldObject[es + 6] = "Fantastic";
oldObject.sayNode(); // Node
oldObject.sayJS(); // JS
console.log(oldObject.ES6); // Fantastic
```

- 위 코드는 ES5 시절의 객체 표현 방법이다.

```javascript
var sayNode = function () {
  console.log("Node");
};
var es = "ES";
const newObject = {
  sayJS() {
    console.log("JS");
  },
  sayNode,
  [es + 6]: "Fantastic",
};
newObject.sayNode(); // Node
newObject.sayJS(); // JS
console.log(newObject.ES6); // Fantastic
```

- 위 코드는 ES2015+ (ES6)에서의 객체 리터럴 표현 방법이다. 훨씬 간결해진 것을 볼 수 있다.
  - 객체의 메서드에 :function을 붙이지 않아도 된다.
  - { sayNode: sayNode } 와 같은 것을 { sayNode } 로 축약 가능하다.
  - [변수 + 값] 등으로 동적 속성명을 객체 속성 명으로 사용 가능하다.

---

### **2.5. 화살표 함수**

```javascript
function add1(x, y) {
    return x + y;
}

const add2 = (x, y) => {
    return x + y;
}

const add3 = (x, y) => x + y;

const add4 = (x, y) => (x + y);

function not1(x) {
    return !x;
}

const not2 = x = > !x;
```

- add1, add2, add3, add4는 같은 기능을 하는 함수이다.
- add2: add1을 화살표 함수로 나타냈다.
- add3: 함수의 본문이 return만 있는 경우 return 생략 가능하다.
- add4: return이 생략된 함수의 본문을 소괄호로 감싸줄 수 있다.
- not1과 not2도 같은 기능을 한다.

### **밑의 두 코드는 화살표 함수가 기존 function() {}을 대체할 수 없는 것을 보여준다.**

```javascript
var relationship1 = {
  name: "don",
  friends: ["con", "mon", "hon"],
  logFriends: function () {
    var that = this; // relationship1을 가리키는 this를 that에 저장
    this.friends.forEach(function (friend) {
      console.log(that.name, friend);
    });
  },
};
relationship1.logFriends();
```

- **화살표 함수는 부모의 this를 물려받는다.** 자기 만의 this를 가지지 않는다.
- function은 function마다 자기 만의 this를 가진다.
- forEach의 function의 this와 logFriends의 this는 다르다.
- that이라는 중간 변수를 이용해서 logFriends의 this를 전달한다.
- function 내부의 this는 부모의 this와 다르기 때문에 부모의 this를 that에 저장하고 사용한다.

```javascript
const relationship2 = {
  name: "don",
  friends: ["con", "mon", "hon"],
  logFriends() {
    this.friends.forEach((friend) => {
      console.log(this.name, friend);
    });
  },
};
relationship2.logFriends();
```

- forEach의 화살표함수의 this와 logFriends의 this가 같아진다.
- 부모의 this를 물려받지 않고 싶을 경우 function() {}을 사용하면 된다.

---

### **2.6. 구조분해 할당**

- this가 있을 경우 구조분해를 하지 않는게 좋다.
- 객체나 배열에 저장된 데이터 전체가 아닌 일부만 필요한 경우
  - 객체나 배열을 변수로 분해할 수 있게 해준다.

```javascript
var candyMachine = {
  status: {
    name: "node",
    count: 5,
  },
  getCandy: function () {
    this.staute.count--;
    return this.status.count;
  },
};
var getCandy = candyMachine.getCandy;
var count = candyMachine.status.count;
```

- getCandy와 count를 보자. candyMachine부터 시작해서 속성을 찾아 들어가야 한다.

```javascript
const candyMachine = {
  status: {
    name: "node",
    count: 5,
  },
  getCandy() {
    this.status.count--;
    return this.status.count;
  },
};
const {
  getCandy,
  status: { count },
} = candyMachine;
```

- const { 변수 } = 객체; 로 객체 안의 속성을 변수명으로 사용 가능하다.
  - 단, getCandy()를 실행했을 때 결과가 candyMachine.getCandy()와는 달라지므로 주의해야 한다(this 때문에).
- count처럼 속성 안의 속성도 변수명으로 사용 가능하다.

```javascript
var array = ["node.js", {}, 10, true];
var node = array[0];
var obj = array[1];
var bool = array[3];

const array = ["node.js", {}, 10, true];
const [node, obj, , bool] = array;
```

- const [변수] = 배열; 로 배열 안의 속성을 변수명으로 사용 가능하다.
- 각 배열 인덱스와 변수가 대응된다.

---

### **2.7. 클래스**

```javascript
Class Human {
    constructor(type = 'human') {
        this.type = type;
    }

    static isHuman(human) {
        return human insstanceof Human;
    }

    breathe() {
        alert('h-a-a-a-m');
    }
}

Class Zero extends Human {
    constructor(type, firstName, lastName) {
        super(type);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    sayName() {
        super.breathe();
        alert(`${this.firstName} ${this.lastName}`);
    }
}

const newZero = new Zero('human', 'Zero', 'Cho');
Human.isHuman(newZero); // true
```

- Constructor(생성자), Extends(상속) 등을 깔끔하게 처리할 수 있다.
- 코드가 그룹화되어 가독성이 향상된다.
- Super로 부모 Class 호출 가능하다.
- Static 키워드로 클래스 메서드 생성 가능하다.

---

### **2.8. 프로미스**

- 내용이 실행은 되었지만 결과를 아직 반환하지 않은 객체이다.
- 콜백 헬이라고 불리는 지저분한 자바스크립트 코드의 해결책이다.
- **콜백과 프로미스의 중요한 차이**
  - 콜백은 코드가 바로 이어져야 된다.
  - 프로미스는 중간에 다른 코드가 들어올 수 있다(코드 분리).

```javascript
const condition = true; //  true면 resolve, false면 reject
const promise = new Promise((resolve, reject) => {
  if (condition) {
    resolve("성공");
  } else {
    reject("실패");
  }
});
// 다른 코드가 들어갈 수 있음
promise
  .then((message) => {
    console.log(message); //  성공(resolve)한 경우 실행
  })
  .catch((error) => {
    console.error(error); //  실패(reject)한 경우 실행
  })
  .finally(() => {
    //  끝나고 무조건 실행
    console.log("무조건");
  });
```

- then을 붙이면 결과를 반환한다.
- 실행이 완료되지 않았으면 완료된 후 then 내부 함수가 실행된다.
- **Resolve(성공리턴값) -> then으로 연결**
- **Reject(실패리턴값) -> catch로 연결**
- **Finally -> 무조건 실행**

```javascript
promise
    .then(message) => {
        return new Promise((resolve, reject) => {
            resolve(message);
        });
    })
    .then((message2) => {
        console.log(message2);
        return new Promise((resolve, reject) => {
            resolve(message2);
        });
    })
    .then((message3) =>{
        console.log(message3);
    })
    .catch((error) => {
        console.error(error);
    });
```

- 프로미스의 then 연달아 사용 가능하다(프로미스 체이닝).
- then 안에서 return한 값이 다음 then으로 넘어간다.
- 에러가 난 경우 바로 catch로 이동한다.
- 에러는 catch에서 한 번에 처리한다.

```javascript
function findAndSaveUser(Users) {
  Users.findOne({}, (err, user) => {
    if (err) {
      return console.error(err);
    }
    user.name = "zero";
    user.save((err) => {
      if (err) {
        return console.error(err);
      }
      Users.findOne({ gender: "m" }, (err, user) => {});
    });
  });
}
```

- 콜백 패턴(3중첩)으로 조금 지저분한 코드 모습이다.

```javascript
function findAndSaveUser(Users) {
    Users.findOne({})
        .then((user) => {
            user.name = 'zero';
            return user.save();
        })
        .then((user) => {
            return Users.findOne({ gender: 'm' });
        })
        .then((user => {
            // 생략
        })
        .catch(err => {
            console.error(err);
        });
}
```

- 위 코드는 콜백 패턴(3중첩)을 프로미스로 바꾼 모습이다.
- findOne, save 메서드가 프로미스를 지원한다고 가정 했을때의 경우이다.

```javascript
const promise1 = Promise.resolve("성공1");
const promise2 = Promise.resolve("성공2");
Promise.all([promise1, promise2])
  .then((result) => {
    console.log(result); //  ['성공1', '성공2']
  })
  .catch((error) => {
    console.error(error);
  });
```

- Promise.resolve(성공리턴값)
  - 바로 resolve하는 프로미스이다.
- Promise.reject(실패리턴값)
  - 바로 reject하는 프로미스이다.
- Promise.all(배열)
  - 여러 개의 프로미스를 동시에 실행한다.
  - 하나라도 실패하면 catch로 간다.
  - allSettled로 실패한 것만 추려낼 수도 있다.

---

### **2.9. async/await**

프로미스 패턴의 코드를 async/await으로 한 번 더 축약 가능하다.

```javascript
async function findAndSaveUser(Users) {
  try {
    let user = await Users.findOne({});
    user.name = "zero";
    user = await user.save();
    user = await Users.findOne({ gender: "m" });
    // 생략
  } catch (error) {
    console.error(error);
  }
}
```

- 변수 = await 프로미스;
  - 프로미스가 resolve된 값이 변수에 저장된다.
- 변수 await 값;
  - 값이 변수에 저장된다.
- 에러 처리를 위해 try catch로 감싸주어야 한다.
  - 각각의 프로미스 에러 처리를 위해서는 각각을 try catch로 감싸주어야 한다.

```javascript
const findAndSaveUser = async (Users) => {
  try {
    let user = await Users.findOne({});
    user.name = "zero";
    user = await user.save();
    user = await Users.findOne({ gender: "m" });
    // 생략
  } catch (error) {
    console.error(error);
  }
};
```

- 화살표 함수도 async/await 가능하다.

```javascript
async function findAndSaveUser(Users) {
    // 생략
}
findAndSaveUse().then(() => { // 생략 });
// 또는
async function other() {
    const result = await findAndSaveUser();
}
```

- async 함수는 항상 promise를 반환한다.
- then이나 await을 붙일 수 있다.

```javascript
const promise1 = Promise.resolve("성공1");
const promise2 = Promise.resolve("성공2");
(async () => {
  for await (promise of [promise1, promise2]) {
    console.log(promise);
  }
})();
```

- for await (변수 of 프로미스배열)
  - 노트 10부터 지원한다.
  - resolve된 프로미스가 변수에 담겨 나온다.
  - await을 사용하기 때문에 async 함수 안dp서 해야한다.

## **3. 프론트엔드 자바스크립트**

---

### **3.1. AJAX**

- 서버로 요청을 보내는 코드이다.
- 라이브러리 없이는 브라우저가 지원하는 XMLHttpRequest 객체를 이용한다.
- 하지만 AJAX 요청 시 Axios 라이브러리를 사용하는 게 편하다.
- HTML에 아래 스크립트를 추가하면 사용할 수 있다.

```javascript
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
    // 여기에 예제 코드를 넣으세요.
</script>
```

```javascript
axios
  .get("https://www.don.com/api/get")
  .then((result) => {
    console.log(result);
    console.log(result.data); // {}
  })
  .catch((error) => {
    console.error(error);
  });

// async/await 사용
async () => {
  try {
    const result = await axios.get("https://www.don.com/api/get");
    console.log(result);
    console.log(result.data); // {}
  } catch (error) {
    console.error(error);
  }
};
```

- axios.get 함수의 인수로 요청을 보낼 주소를 넣으면 된다.
- 프로미스 기반 코드라 async/await 사용 가능하다.

```javascript
(async () => {
  try {
    const result = await axios.post("https://www.zerocho.com/api/post/json", {
      name: "zerocho",
      birth: 1994,
    });
    console.log(result);
    console.log(result.data); // {}
  } catch (error) {
    console.error(error);
  }
})();
```

- 위 코드는 POST 요청을 하는 코드이다(데이터를 담아 서버로 보내는 경우).
- axios.post 함수의 두 번째 인수로 데이터를 넣어 보낸다.

---

### **3.2. FormData**

- HTML form 태그에 담긴 데이터를 AJAX 요청으로 보내고 싶은 경우
  - FormData 객체를 이용한다.

```javascript
const formData = new FormData();
formData.append("name", "zerocho");
formData.append("item", "orange");
formData.append("item", "melon");
formData.has("item"); // true
formData.has("money"); // false
formData.get("item"); // orange
formData.getAll("item"); // ['orange', 'melon'];
formData.append("test", ["hi", "zero"]);
formData.get("test"); //  hi, zero
formData.delete("test");
formData.get("test"); //  null
formData.set("item", "apple");
formData.getAll("item"); // ['apple'];
```

- FormData 메서드 사용 예제 코드이다.
- FormData POST 요청으로 보내려면 Axios의 data 자리에 formData를 넣어서 보내면 된다.

---

### **3.3. encodeURIConponent, decodeURIComponent**

- URL: 서버에 있는 파일 위치를 가리킨다.
- URI: 서버에 있는 자원 위치를 가리킨다.

```javascript
(async () => {
  try {
    const result = await axios.get(
      `https://www.don.com/api/search/${encodeURIComponent("노드")}`
    );
    console.log(result);
    console.log(result.data); // {}
  } catch (error) {
    console.error(error);
  }
})();
```

- 주소창에 한글 입력하면 서버가 처리하지 못하는 경우가 발생한다.
  - encodeURIComponent로 한글을 감싸서 처리하면 된다.
  - 서버에서는 decodeURIComponent로 한글로 해석해서 처리하면 된다.

---

### **3.4. data attribute와 dataset**

- HTML 태그에 데이터를 저장하는 방법이다.
- 태그 속성으로 **data-속성명**
- 자바스크립트에서 **태그.dataset.속성명**으로 접근 가능하다.
  - data-user-job -> dataset.userJob
  - data-id -> dataset.id
- 반대로 자바스크립트 dataset에 값을 넣으면 data-속성이 생긴다.
  - dataset.monthSalary = 10000 -> data-month-salary="10000"

```javascript
<ul>
    <li data-id="1" data-user-job="programmer">Zero</li>
    <li data-id="2" data-user-job="designer">Nero</li>
    <li data-id="3" data-user-job="programmer">Hero</li>
    <li data-id="4" data-user-job="ceo">Kero</li>
</ul>
<script>
    console.log(document.querySelector('li').dataset);
    // { id: '1', userJob: 'programmer' }
</script>
```
