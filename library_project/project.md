프론트는 부트스트랩을 사용한다.

사용자, 게시글, 책을 db에 저장한다.

- sequelize을 이용한다.

패스포트 모듈로 로그인한다.

---

### 회원가입 절차

1. 아이디 비밀번호를 입력하고 회원가입 버튼을 누른다.
2. routes/auth/join이 실행되고 #about으로 redirect된다.

---

### 로그인 폼

부트스트랩 로그인 폼을 가져온다.

---

### net:ERR_ABORTED 404 에러

js, css 파일을 불러올 때 발생한다.

- 처음엔 ../public/css/style.css 와 같이 경로를 설정했다.
- net:ERR_ABORTED 404 에러가 발생했다.
- css와 js같은 정적 리소스 파일의 경로는 /public/이 default로 설정되어 있다.
- 경로에 /public/css/style.css 로 입력하면 /public/public/css/style.css 경로를 찾는것과 같다.
- 따라서 public이 기본 경로에 포함되어있다고 생각하고 경로를 설정해야 한다.

---

### 넌적스

html 파일에 다른 html을 불러올 때

```javascript
{% include "login.html" %}
```

---

### 페이지 로딩시 로그인 폼으로 이동하는 문제

첫 화면으로 최상단 페이지가 나와야 되는데 자꾸 로그인 폼으로 이동이 되었다.

- 로그인 폼을 이곳저곳으로 옮겨봐도 로그인 폼이 제일 먼저 나타난다.
- autofocus를 해제하니 최상단 페이지로 로딩이 잘된다.

```javascript
<input
  type="email"
  id="inputEmail"
  class="form-control"
  placeholder="Email address"
  required
  autofocus
/>
```

---

### 새로고침 후 페이지 시작점

새로고침을 하면 현재 보고있는 화면으로 새로고침이 된다.

- 최상단으로 새로고침이 되게 하려면 jquery 코드를 body 맨 아래에 넣는다.
- 열람실 현황을 실시간으로 확인하기 위해 계속 새로고침 하는 경우가 있을 수 있으므로 일단은 사용하지 않는다.

```javascript
    <script>
      $(function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
      });
    </script>
```

---

### 회원가입 페이지

회원가입 버튼을 누르면 로그인 폼에서 회원가입 폼으로 바뀌게 만든다.

로그인 했으면 아무것도 뜨지 않게 한다.

- routes/page.js에서 res.locals.user을 login.html로 넘겨준다.
  - req.user가 모든 라우터에 들어가면 res.locals에 넣어 중복 제거 가능하다

---

### 로컬 로그인

이메일 비밀번호를 입력하고 로그인 버튼을 누르면 로그인이 된다.

- navbar의 로그인이 로그아웃으로 바뀌게 만들어야 한다.

**Missing credentials 오류**

- form의 name과 local strategy의 field name을 같게 해야한다.

---

### 카카오 로그인

카카오 로그인 버튼을 누르면 카카오 로그인이 된다.

---

### 입력폼 입력이 안되는 문제

크롬이나 익스플로러에서 입력이 되지 않았다.

- label 태그를 없애니 입력은 됐지만 placeholder이 보이지 않았다.
- label 태그를 놔두고 placeholder을 지우니 잘 작동이 되었다.

<img width="362" alt="loginform" src="https://user-images.githubusercontent.com/35963403/130752936-a721088e-dd90-4132-bb86-b603ad182d3f.PNG">

- 변경전

<img width="362" alt="loginform2" src="https://user-images.githubusercontent.com/35963403/130753385-90ca98d3-6153-442d-9cda-15553fd8a4b2.PNG">

-변경후

https://ibrahimovic.tistory.com/30 를 참고했다.

---

### 유효성검사

데이터를 서버에 보내기 전에 유효성 검사를 한다.

```javascript
    <script>
      function joinFormSubmit() {
        const joinEmail = document.getElementById('joinEmail');
        const joinNick = document.getElementById('joinNick');
        const joinPassword = document.getElementById('joinPassword');
        const joinConfirmPassword = document.getElementById('joinConfirmPassword');

        if (joinEmail.value === "") {
          alert('이메일을 입력하세요.')
          joinEmail.focus();
          return false;
        }

        if (joinNick.value === "") {
          alert('이메일을 입력하세요.')
          joinNick.focus();
          return false;
        }

        if(joinPassword.value !== joinConfirmPassword.value) {
          alert('비밀번호가 일치하지 않습니다.')
          joinConfirmPassword.focus();
          return false;
        }

        document.joinForm.submit()
      }
    </script>
```

- 버튼 타입을 button으로 바꾸고 onclick="joinFormSubmit();"를 사용했다.

서버에서도 한번 더 유효성 검사를 한다.

```javascript
// routes/auth.js
router.post(
  "/join",
  isNotLoggedIn,
  [
    check("joinEmail", "Invalid Email").isEmail(),
    check("joinPassword", "Invalid Password").isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { joinEmail, joinNick, joinPassword, joinConfirmPassword } = req.body;
    if (joinPassword !== joinConfirmPassword) {
      return res.redirect("/join?error=exist");
    }
    try {
      const exUser = await User.findOne({ where: { email: joinEmail } });
      if (exUser) {
        return res.redirect("/join?error=exist");
      }
      const hash = await bcrypt.hash(joinPassword, 12);
      await User.create({
        email: joinEmail,
        nick: joinNick,
        password: hash,
      });
      return res.redirect("/");
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);
```

- 클라이언트에서만 유효성 검사를 하면 위험이 있기 때문에 서버에서 한번 더 확인한다.
- express-validator을 이용해 이메일을 입력했는지, 패스워드가 최소 6자 이상인지 확인한다.
  - 두 비밀번호가 일치하는지 확인하는 기능은 계속 에러가 나서 따로 처리했다.
- Unknown column 'User.joinEmail' in 'where clause' 에러
  - findOne이나 create를 할 때 email: joinEmail을 하지 않고 joinEmail만 적어서 그랬다.
  - 모델의 column명과 클라이언트에서 가져온 column이 다르면 대입해줘야 한다.

---

### 로그아웃

로그인을 하면 navbar에 로그인, 회원가입 버튼 대신 로그아웃 버튼이 나타나게 한다.

- 로그아웃 버튼을 누르면 /auth/logout 라우터가 실행되면서 세션 로그아웃을 한다.

### 글쓰기

로그인을 해야지 글쓰기 기능을 사용할 수 있도록 한다. post 모델에 제목, 내용을 저장하고 UserId를 받아서 저장한다.

글쓰기를 성공하면 게시판 페이지로 돌아온다.

- /#board가 아니라 스크롤으로 돌아오는법?

추가해야될 것

- 작성 시간
- 게시판 목록
- 제일 처음에는 게시판 목록을 보여주고 글쓰기 버튼을 누르면 글쓰기 폼이 나오게
- post 모델에 제목, 내용, 작성시간, 조회수를 저장해놓고 게시판에 보여줘야한다.

---

### 게시판

db에서 게시글들을 가져와서 화면에 보여줘야 한다.

- 한페이지에 10개씩 보여주도록 만든다.
- 제목, 작성자, 조회수가 보이게 하고 제목을 누르면 글 내용을 볼수있게 한다.

  - 내용은 Modal로 뜨게 만들기

- 현재 게시판에 게시글이 보이게 해놨다.
  - 클릭할 때 마다 조회수 오르도록 해야함
  - 글 제목 누르면 Modal로 내용이 보이게
