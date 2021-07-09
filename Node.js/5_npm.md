# **패키지 매니저**
## **1. npm 알아보기**
---
### 1.1. npm이란
Node Package Manager
- 노드의 패키지 매니저이다.
- 다른 사람들이 만든 소스 코드들을 모아둔 저장소이다.
- 다른 사람의 코드를 사용하여 프로그래밍 가능하다.
- 이미 있는 기능을 다시 구현할 필요가 없어 효율적이다.
- 오픈 소스 생태계를 구성중이다.

패키지
- npm에 업로드된 노드 모듈이다.
- 모듈이 다른 모듈을 사용할 수 있듯 패키지도 다른 패키지를 사용할 수 있다.
- 의존 관계라고 부른다.

</br>

## **2. package.json으로 패키지 관리하기**
---
### 2.1. package.json
현재 프로젝트에 대한 정보와 사용 중인 패키지에 대한 정보를 담은 파일이다.
- 같은 패키지라도 버전별로 기능이 다를 수 있으므로 버전을 기록해두어야 한다.
- 동일한 버전을 설치하지 않으면 문제가 생길 수 있다.
- 노드 프로젝트 시작 전 package.json부터 만들고 시작한다(npm init).

<img width="380" alt="npm" src="https://user-images.githubusercontent.com/35963403/125009024-b3be9b80-e09e-11eb-89ce-050be743c7f8.PNG">

### 2.2. package.json 속성들
- package name: 패키지의 이름이다. package.json의 name 속성에 저장된다.
- version: 패키지의 버전이다. npm의 버전은 다소 엄격하게 관리된다.
- entry point: 자바스크립트 실행 파일 진입점이다. 보통 마지막으로 module.exports를 하는 파일을 지정한다. package.json의 main 속성에 저장된다.
- test command: 코드를 테스트할 때 입력할 명령어를 의미한다. package.json scripts 속성 안의 test 속성에 저장된다.
- git repository: 코드를 저장해둔 Git 저장소 주소를 의미한다. 나중에 소스에 문제가 생겼을 때 사용자들이 이 저장소에 방문해 문제를 제기할 수도 있고, 코드 수정본을 올릴 수도 있다. package.json의 repository 속성에 저장된다.
- keywords: 키워드는 npm 공식 홈페이지(https://npmjs.com)에서 패키지를 쉽게 찾을 수 있게 해준다. package.json의 keywords 속성에 저장된다.
- license: 해당 패키지의 라이선스를 넣어주면 된다.

### 2.3. npm 스크립트
npm init이 완료되면 폴더에 package.json이 생성된다.
```javascript
// package.json
{
    "name": "npmtest",
    "version": "0.0.1",
    "description": "hello package.json",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "don",
    "license": "ISC",
}
```

### 2.4. 패키지 설치하기
express 설치하기
- $ npm install express
- package.json에 기록된다(dependencies에 express 이름과 버전이 추가된다).

### 2.5. node_modules
npm install 시 node_modules 폴더가 생성된다.
- 내부에 설치한 패키지들이 들어 있다.
- express 외에도 express와 의존 관계가 있는 패키지들이 모두 설치된다.

### 2.6. 여러 패키지 동시 설치하기

### 2.7. 개발용 패키지
npm install --save-dev 패키지명 또는 npm i -D 패키지명

### 2.8. 글로벌(전역) 패키지
npm install --global 패키지명 또는 npm i -g 패키지명

</br>

## **3. 패키지 버전 이해하기**
---
### 3.1. SemVer 버저닝
노드 패키지의 버전은 SemVar(유의적 버저닝) 방식을 따른다.
- Major(주 버전), Minor(부 버전), Patch(수 버전)
- 노드에서는 배포를 할 때 항상 버전을 올려야 한다.
- Major는 하위 버전과 호환되지 않은 수정 사항이 생겼을 때 올린다.
- Minor는 하위 버전과 호환되는 수정 사항이 생겼을 때 올린다.
- Patch는 기능에 버그를 해결했을 때 올린다.

### 3.2. 버전 기호 사용하기
버전 앞에 기호를 붙여 의미를 더한다.
- ^1.1.1: 패키지 업데이트 시 minor 버전까지만 업데이트 된다(2.0.0버전은 안 된다).
- ~1.1.1: 패키지 업데이트 시 patch버전까지만 업데이트 된다(1.2.0버전은 안 된다).
- <=, =>, >, <는 이하, 이상, 초과, 미만
- @latest는 최신 버전을 설치하라는 의미
- 실험적인 버전이 존재한다면 @next로 실험적인 버전 설치 가능하다(불안정함).
- 각 버전마다 부가적으로 알파/베타/RC 버전이 존재할 수도 있다(1.1.1-alpha.0, 2.0.0-beta.1, 2.0.0-rc.0).

</br>

## **4. 기타 npm 명령어**
---
### 4.1. 기타 명령어
- npm outdated: 어떤 패키지에 기능 변화가 생겼는지 알 수 있다.
- npm update: package.json에 따라 패키지 업데이트한다.
- npm uninstall 패키지명: 패키지 삭제(npm rm 패키지명으로도 가능)
- npm search 검색어: npm 패키지를 검색할 수 있다(npmjs.com에서도 가능).
- npm info 패키지명: 패키지의 세부 정보 파악 가능하다.
- npm login: npm에 로그인을 하기 위한 명령어(npmjs.com에서 회원가입 필요)
- npm whoami: 현재 사용자가 누구인지 알려준다.
- npm logout: 로그인한 계정을 로그아웃

### 4.2. 기타 명령어
- npm version 버전: package.json의 버전을 올린다(Git에 커밋도 한다).
- npm deprecate [패키지명][버전] [메시지]: 패키지를 설치할 때 경고 메시지를 띄우게 한다(오류가 있는 패키지에 적용).
- npm publish: 자신이 만든 패키지를 배포한다.
- npm unpublish --force: 자신이 만든 패키지를 배포 중단한다(배포 후 72시간 내에만 가능).
    - 다른 사람이 내 패키지를 사용하고 있는데 배포가 중단되면 문제가 생기기 때문
- 기타 명령어는 https://docs.npmjs.com의 CLI Commands에서 확인한다.

</br>

## **5. 패키지 배포하기**
---
### 5.1. npm 회원가입
### 5.2. 배포할 패키지 작성
### 5.3. 배포 시도하기
### 5.4. 배포 취소하기