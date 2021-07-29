# **Sequelize로 DB 세팅할 때 dotenv 모듈 사용하기**

## **중요한 정보 관리하기**

---

Sequelize를 사용하려면 DB 세팅할 때 필요한 정보들을 config.json 파일에 저장해야한다.

- 중요한 정보들은 .env 파일에 따로 저장해두는게 좋다.
  - 다른 중요한 정보들과 함께 관리할 수 있다.
  - .env 파일만 gitingore 하면 중요한 정보들을 관리하기가 쉬워진다.

---

## **dotenv 모듈 사용하기**

- npm i dotenv
- json 파일은 모듈로 불러오고 사용하는 것이 불가능 하다.
  - 파일 형식을 .js 으로 바꾸고 내부를 수정하면 가능하다.

기존 config.json

```javascript
{
    "development": {
        "username": [아이디],
        "password": [비밀번호],
        "database": [데이터베이스명],
        "host": [호스트 주소],
        "dialect": "mysql"
    },
    "test": {
        "username": [아이디],
        "password": [비밀번호],
        "database": [데이터베이스명],
        "host": [호스트 주소],
        "dialect": "mysql"
    },
    "production": {
        "username": [아이디],
        "password": [비밀번호],
        "database": [데이터베이스명],
        "host": [호스트 주소],
        "dialect": "mysql"
    }
}
```

수정한 config.js

```javascript
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

const production = {
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
```

---

## **.env 파일 수정하기**

.env 파일은 app.js와 같은 폴더 위치에 있어야 한다.

```javascript
// .env
...
MYSQL_USERNAME=(아이디)
MYSQL_PASSWORD=(비밀번호)
MYSQL_DATABASE=(데이터베이스명)
MYSQL_HOST=127.0.0.1
```

---

## **models/index.js 파일 수정하기**

수정전

```javasciprt
const config = require('../config/config.json')[env];
```

수정후

```javascript
const config = require("../config/config.js")[env];
```

---

## **깃 캐시 삭제하기**

.gitignore 파일에 .env 파일을 등록해야 외부로 노출이 안된다.

- .gitignore에 추가하기 전에 commit, push를 한 경우

  - .gitignore에 추가한 뒤 git cache를 삭제해야 한다.

깃 캐시 삭제하는 법

```javascript
git rm -r --cached .

git add .

git commit -m "캐시 삭제"
```
