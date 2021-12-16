# 프로젝트 환경설정

### Gradle

- 필요한 라이브러리를 가져오고 빌드하는 life cycle까지 관리해주는 tool
- Maven과 Gradle이 있지만 Gradle로 넘어오는 추세

### https://start.spring.io

- ADD DEPENDENCIES에서 Spring Web, Thymeleaf 추가
- intelliJ에서 해당 폴더에 있는 build.gradle 파일을 오픈하면 됨
  - /src/build.gradle

### 실행

- 자바가 바로 실행되지 않고 gradle을 통해서 실행되면 느림
- setting-gradle에서 Build and run using, Run tests using을 IntelliJ IDEA로 변경

<br>

# 스프링 웹 개발 기초

## 정적 컨텐츠

- 서버에서 작업 없이 html 파일을 그대로 웹브라우저로 보냄
- 스프링부트는 resuorces/static 폴더에서 정적 컨텐츠를 찾아서 제공
  - 해당 폴더에 index.html을 생성하면 Welcome Page 기능을 제공

1. 웹브라우저에서 static html을 입력

2. 내장 톰캣 서버가 요청을 받음

3. 스프링에서는 hello-static 관련 Controller가 있는지 찾음(**Controller가 정적 파일보다 우선순위 가짐**)

4. 없으면 resources/static/hello-static.html을 찾아서 반환

<br>

## MVC와 템플릿 엔진

- Model
  - 화면에 필요한 것들을 담아서 화면에 넘김
- View
  - 화면 관련된 일에만 집중해야 됨
  - Controller와 Model은 비즈니스 로직과 관련 있거나 서버 뒷단의 일들을 처리하는데 집중해야 됨
- Controller
  - 웹 애플리케이션에서 첫번째 진입점
  - Controller에는 Controller 애노테이션을 적어줘야 함
- 템플릿 엔진은 서버에서 html 파일을 동적으로 바꿔서 웹브라우저로 보냄

```java
package hello.studyspring.controller;

...

@Controller
public class HelloController {

    @GetMapping("hello")
    public String hello(Model model) {
        model.addAttribute("data", "hello!!!");
        return "hello";
    }

    @GetMapping("hello-mvc")
    public String helloMvc(@RequestParam("name") String name, Model model) {    // @RequestParam("name"): 외부에서 파라미터를 받음, Model model: 모델을 받으면 뷰에서 렌더링할 때 씀
        model.addAttribute("name", name);
        return "hello-template";
    }
}
```

1. 웹 브라우저에서 localhost:8080/hello-mvc?name=spring를 넘기면

2. 내장 톰캣서버가 요청을 받고 스프링에 보냄

3. @GetMapping("hello-mvc") 매핑이 되어있는 Controller를 찾아서 helloController에 있는 helloMvc 메서드를 호출

4. 스프링이 만들어서 넣어준 model에 값을 추가하고 return 하면

5. 메서드의 리턴 html 파일명과 같은 html을 뷰 리졸버(viewResolver)가 찾음

   - 뷰 리졸버: 뷰를 찾아주고 템플릿 엔진을 연결시켜 줌
   - `resources:templates/` + {ViewName} + `.html`

6. 타임리프 템플릿 엔진이 렌더링해서 변환을 한 html을 웹 브라우저에 반환

```html
<html xmlns:th="http://www.thymeleaf.org">
  <body>
    <p th:text="'hello ' + ${name}">hello! empty</p>
  </body>
</html>
```

- 모델의 키값이 name인 것에서 값을 꺼내서 치환 해줌

<br>

## API

문자, 객체만 전달하거나 서버끼리 통신할 때 API 방식을 이용

### 문자 반환

```java
package hello.studyspring.controller;

...

@Controller
public class HelloController {
    ...

    @GetMapping("hello-spring")
    @ResponseBody
    public String helloString(@RequestParam("name") String name) {
        return "hello " + name;
    }
}
```

### 객체 반환

```java
package hello.studyspring.controller;

...

@Controller
public class HelloController {
    ...

    // JSON으로 반환
    // @ResponseBody가 있으면 HttpMessageConverter가 동작
    @GetMapping("hello-api")
    @ResponseBody
    public Hello helloApi(@RequestParam("name") String name) {
        Hello hello = new Hello();
        hello.setName(name);
        return hello;
    }

    static class Hello {  // static 클래스로 선언해서 HelloController 클래스 내에서 사용 가능
        private String name;

        // gettersetter : Alt + Insert
        // 자바 빈 규약(get, set 메서드를 통해서 접근 가능하게 함), property 접근방식이라고도 함
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
```

### @ResponseBody 사용원리

1. 웹브라우저에서 localhost:8080/hello-api 입력

2. 내장 톰캣 서버가 요청을 받고 스프링에 보냄

3. @GetMapping("hello-api") 매핑이 되어있는 Controller를 찾고 helloController에 있는 helloApi 메서드를 호출

4. @ResponseBody 애노테이션이 있기 때문에 리턴하면 뷰 리졸버 대신 HttpMessageConverte가 동작

   - 문자 반환: StringConverter 동작
   - 객체 반환: JsonConverter 동작

5. 리턴값이 객체이면 뷰 없이 JSON 방식으로 데이터를 만들어서 http 바디에 반환

<br>

# 회원 관리 예제 - 백엔드 개발

## 비즈니스 요구사항 정리

- 데이터: 회원ID, 이름
- 기능: 회원 등록, 조회
- 아직 데이터 저장소가 선정되지 않음

<br>

## 웹 애플리케이션 계층 구조

<img width="500" alt="1_1" src="https://user-images.githubusercontent.com/35963403/145792386-94eff002-1141-4182-b4f8-742ca0d49f95.PNG">

- 컨트롤러: 웹 MVC의 컨트롤러 역할, **외부 요청을 받음**
- 서비스: **핵심 비즈니스 로직 구현**
- 리포지토리: 데이터베이스에 접근, 도메인 객체를 DB에 **저장하고 관리**
- 도메인: 비즈니스 도메인 객체, ex) 회원, 주문, 쿠폰 등등 주로
  데이터베이스에 저장하고 관리됨

<br>

## 클래스 의존관계

<img width="500" alt="1_1" src="https://user-images.githubusercontent.com/35963403/145792945-d6320424-7d0d-4706-8ba2-a0f3e2370298.PNG">

- 인터페이스로 추후에 구현 클래스를 변경할 수 있도록 설계
- 일단은 구현체로 가벼운 메모리 기반의 데이터 저장소 사용

<br>

## 회원 도메인과 리포지토리 만들기

### 회원 객체

```java
package hello.studyspring.domain;

public class Member {

    private Long id;    //시스템이 정하는 id
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

### 회원 리포지토리 인터페이스

```java
package hello.studyspring.repository;

import hello.studyspring.domain.Member;

import java.util.List;
import java.util.Optional;

public interface MemberRepository {
    Member save(Member member);
    Optional<Member> findById(Long id); //Optional<> : null이 반환되면 null을 감싸서 반환
    Optional<Member> findByName(String name);
    List<Member> findAll();
}
```

### 회원 리포지토리 메모리 구현체

```java
package hello.studyspring.repository;

...

public class MemoryMemberRepository implements MemberRepository{

    //실무에선 동시성 문제로 인해 공유되는 변수일 때에는 concurrentHashMap을 써야됨
    private static Map<Long, Member> store = new HashMap<>();
    private static long sequence = 0L;  // 실무에선 long 보다는 동시성 문제를 고려해서 AtomicLong을 써야함

    @Override
    public Member save(Member member) {
        member.setId(++sequence);
        store.put(member.getId(), member);
        return member;
    }

    @Override
    public Optional<Member> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }   // store.get(id)의 결과가 null일 경우를 대비해서 Optional.ofNullable()으로 감싸서 반환해주면 클라이언트에서 처리 가능

    @Override
    public Optional<Member> findByName(String name) {
        return store.values().stream()
                .filter(member -> member.getName().equals(name))    // 루프를 돌면서 member의 name과 파라미터로 넘어온 name이 같은지 확인
                .findAny(); // 하나라도 찾고 반환
    }

    @Override
    public List<Member> findAll() {
        return new ArrayList<>(store.values());
    }

    public void clearStore() {
        store.clear();
    }
}
```

<br>

## 회원 리포지토리 테스트 케이스 작성

### 테스트 방법

- 자바의 main 메서드 실행
- 웹 애플리케이션의 컨트롤러를 통해 해당 기능 실행
- 단점: 준비하고 실행하는데 오래 걸리고, 반복 실행하기 어렵고 여러 테스트를 한번에 실행하기 어렵다.
- 해결책: JUnit 프레임워크

```java
package hello.studyspring.repository;

...

public class MemoryMemberRepositoryTest {

    MemoryMemberRepository repository = new MemoryMemberRepository();

    //테스트는 순서, 의존관계와 상관 없이 설계가 되어야 함.
    @AfterEach
    public void AfterEach() {
        repository.clearStore();
    }

    @Test
    public void save() {
        Member member = new Member();
        member.setName("spring");

        repository.save(member);

        // Optional<Member> result = repository.findById(member.getId());
        Member result = repository.findById(member.getId()).get();  // 반환타입이 Optional이기 때문에 .get()으로 꺼낸다. Optional 안의 Member 객체를 반환.
        assertThat(member).isEqualTo(result);   // org.assertj.core.api의 assertThat()
    }

    @Test
    public void findByName() {
        Member member1 = new Member();
        member1.setName("spring1");
        repository.save(member1);

        Member member2 = new Member();
        member2.setName("spring2");
        repository.save(member2);

        Member result = repository.findByName("spring1").get();

        assertThat(result).isEqualTo(member1);
    }

    @Test
    public void findAll() {
        Member member1 = new Member();
        member1.setName("spring1");
        repository.save(member1);

        Member member2 = new Member();
        member2.setName("spring2");
        repository.save(member2);

        List<Member> result = repository.findAll();

        assertThat(result.size()).isEqualTo(2);
    }
}
```

- 테스트는 메서드 순서에 관계없이 따로 실행됨
- **테스트에 사용한 데이터를 메서드마다 clear 해주어야 됨.**
- @AfterEach 애노테이션을 붙여주면 메서드 실행이 끝날 때마다 호출이 됨
- 테스트 하려는 클래스에서 ctrl + shift + T를 누르면 자동으로 테스트 클래스가 생성됨

<br>

## 회원 서비스 개발

### 서비스: 리포지토리와 도메인을 활용해서 실제 비즈니스 로직을 작성하는 것

```java
package hello.studyspring.service;

...

public class MemberService {

    private final MemberRepository memberRepository;


    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    /**
     * 회원 가입
     */
    public Long join(Member member) {

        validateDuplicateMember(member); //중복 회원 검증
        memberRepository.save(member);
        return member.getId();
    }

    //반환값이 Optional<>일 경우만 ifPresent 가능
    //ctrl+alt+shift+T -> Extract method
    private void validateDuplicateMember(Member member) {
        memberRepository.findByName(member.getName())
                .ifPresent(m -> {
                    throw new IllegalStateException("이미 존재하는 회원입니다.");
                });
    }

    /**
     * 전체 회원 조회
     */
    public List<Member> findMember() {
        return memberRepository.findAll();
    }

    public Optional<Member> findOne(Long memberId) {
        return memberRepository.findById(memberId);
    }


}
```

- null일 가능성이 있으면 Optional로 한번 감싸서 반환해주기 때문에 ifPresent()같은 메서드 사용 가능

<br>

## 회원 서비스 테스트

```java
// service/MemberService
// 변경전
private final MemberRepository memberRepository = new MemoryMemberRepository();

// 변경후
private final MemberRepository memberRepository;

public MemberService(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
}
```

- **memberRepository를 직접 생성하는게 아니라 외부에서 넣어주도록 수정**

```java
// MemberServiceTest
package hello.studyspring.service;

...

class MemberServiceTest {

    MemberService memberService;
    MemoryMemberRepository memberRepository;

    @BeforeEach
    public void BeforeEach() {
        memberRepository = new MemoryMemberRepository();
        memberService = new MemberService(memberRepository);
    }

    @AfterEach
    public void afterEach() {
        memberRepository.clearStore();
    }

    @Test
    void 회원가입() { //테스트는 한글 메서드명으로 바꿔도 됨
        //given
        Member member =  new Member();
        member.setName("hello");

        //when
        Long saveId = memberService.join(member);

        //then
        Member findMember = memberService.findOne(saveId).get();
        assertThat(member.getName()).isEqualTo(findMember.getName());
    }

    @Test
    public void 중복_회원_예외() {
        //given
        Member member1 = new Member();
        member1.setName("spring");

        Member member2 = new Member();
        member2.setName("spring");

        //when
        memberService.join(member1);
        IllegalStateException e = assertThrows(IllegalStateException.class, () -> memberService.join(member2));

        assertThat(e.getMessage()).isEqualTo("이미 존재하는 회원입니다.");
        //then

    }

    @Test
    void findMember() {
    }

    @Test
    void findOne() {
    }
}
```

- 예외 케이스를 테스트 하는게 중요
  - try catch문보다 assertThrows()을 사용
- 테스트 하려는 클래스와 테스트 클래스는 같은 리포지토리(인스턴스)를 테스트 하는게 좋음

```java
    // service/MemberServiceTest
    ...
    @BeforeEach
    public void BeforeEach() {
        memberRepository = new MemoryMemberRepository();
        memberService = new MemberService(memberRepository);
    }
    ...
```

- 테스트 실행때마다 각각 생성해줌 (테스트는 독립적으로 실행되어야 하기 때문에)
- DI

<br>

# 스프링 빈과 의존관계

## 컴포넌트 스캔과 자동 의존관계 설정

### 스프링 빈을 등록하고, 의존관계 설정하기

1. 스프링이 실행될 때 스프링 컨테이너가 생긴다.
2. @Component 애노테이션이 있으면 스프링 빈으로 자동 등록된다.
   - @Component를 포함하는 다음 애노테이션도 스프링 빈으로 자동 등록된다.
     - @Controller
     - @Service
     - @Repository
3. 등록된 스프링 빈은 스프링 컨테이너에서 관리된다.

<br>

### 컨트롤러와 서비스 연결

1. Controller에 @Controller, Service에 @Service 추가
2. Controller의 생성자에 @Autowired 추가
3. Controller가 생성될 때 스프링 컨테이너에 스프링 빈으로 등록되어 있는 Service 객체를 가져와 넣어줌

<br>

### 서비스와 리포지터리 연결

1. Service에 @service, Repository에 @Repository 추가
2. Service의 생성자에 @Autowired 추가
3. Service가 생성될 때 스프링 컨테이너에 스프링 빈으로 등록되어 있는 Repository 객체를 가져와 넣어줌

<br>

<img width="500" alt="1_1" src="https://user-images.githubusercontent.com/35963403/146039893-3f4eb971-aa22-4413-bd4d-7cf4fb9928ff.PNG">

<br>

### 객체를 생성해서 쓰기 vs 스프링 컨테이너에 등록 하고 쓰기

- 객체를 생성해서 쓰면 여러 컨트롤러에서 여러 서비스 객체가 생성됨
- 스프링 컨테이너에 등록을 하면 싱글톤으로 등록(유일하게 하나만 등록해서 공유)
  - 같은 스프링 빈이면 모두 같은 인스턴스

<br>

### @Component가 있어도 되는 위치?

- SpringApplication이 있는 패키지만 가능하다.

<br>

## 자바코드로 직접 스프링 빈 등록하기

### Dependency Injection (의존성 주입)의 3가지 방법

1. 필드 주입
   - 테스트 실행시 스프링 컨테이너의 도움 없이 Service가 가지고 있는 여러 Repository를 자유롭게 변경하면서 테스트 할 수 있어야 함
   - 필드 주입을 사용하면 스프링 컨테이너가 없을 때 의존하는 객체를 변경할 수 없음
2. setter 주입
   - 컨트롤러 호출했을 때 setter가 public으로 되어있어야함 -> 잘못 바뀌면 문제발생
3. 생성자 주입
   - 스프링 컨테이너가 올라가고 세팅이 될 때 넣고, 변경을 못하도록 막을 수 있음
   - 의존관계가 실행중에 동적으로 변하는 경우는 없으므로 생성자 주입 권장
   - 한번 세팅하면 바꿀일 없음
   - 스프링 컨테이너의 도움 없이 원하는 객체를 변경해서 테스트 하거나 실행 가능

<br>

### 컴포넌트 스캔 VS 직접 스프링 빈 등록

- 정형화된 컨트롤러, 서비스, 리포지터리 같은 코드는 컴포넌트 스캔 사용
- 정형화되지 않거나, 상황에 따라 구현 클래스를 변경해야할 때는 설정을 통해 스프링 빈으로 등록
  - ex) 리포지터리를 다른 리포지터리로 교체할 때 기존 코드를 수정하지 않고 교체 가능
- @Autowired을 통한 DI는 스프링 컨테이너에 올라가 있어야 가능
  - 스프링 빈으로 등록하지 않고 내가 직접 생성한 객체에는 동작하지 않음

<br>

# 회원 관리 예제 - 웹 MVC 개발

## 회원 웹 기능 - 홈 화면 추가

### 홈 컨트롤러 추가

```java
package hello.studyspring.controller;

...

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "home"; //home.html 호충
    }
}
```

1. localhost:8080/ 요청이 들어옴
2. 스프링 컨테이너에 @Getmapping("/")이 있는지 찾음
3. 있기 때문에 static 폴더의 index.html을 무시하고 home.html을 실행시킴

```html
<!-- templates/home.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <body>
    <div class="container">
      <div>
        <h1>Hello Spring</h1>
        <p>회원 기능</p>
        <p>
          <a href="/members/new">회원 가입</a>
          <a href="/members">회원 목록</a>
        </p>
      </div>
    </div>
  </body>
</html>
```

<br>

## 회원 웹 기능 - 등록

### 회원 등록 폼 컨트롤러

```java
package hello.studyspring.controller;

...

@Controller
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/members/new")
    public String createForm() {
        return "members/createMemberForm";
    }

    @PostMapping("/members/new")
    public String create(MemberForm form) {
        Member member = new Member();
        member.setName(form.getName());

        // 회원가입
        memberService.join(member);

        // 홈 화면으로 이동
        return "redirect:/";
    }
}
```

1. home.html에서 회원가입 버튼을 누르면 /members/new로 이동함
2. createMemberForm.html이 실행되고 사용자가 이름을 입력하면 /members/new에 Post 방식으로 넘어옴
3. create 메서드가 호출되면서 MemberForm 객체에 입력값인 name이 들어옴
   - 스프링이 setName 메서드를 호출해 name 변수에 값을 넣어줌
4. getName 메서드로 값을 꺼내 member 객체에 저장
5. memberService에 회원가입 메서드를 실행
6. redirect로 홈 화면으로 이동

### 웹 등록 화면에서 데이터를 전달 받을 폼 객체

```java
package hello.studyspring.controller;

public class MemberForm {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

```

```html
<!-- templates/members/createMemberForm.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <body>
    <div class="container">
      <form action="/members/new" method="post">
        <div class="form-group">
          <label for="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="이름을 입력하세요"
          />
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  </body>
</html>
```

- get: 데이터 조회
- post: 데이터 전달

<br>

## 회원 웹 기능 - 조회

### 회원 컨트롤러에서 조회 기능

```java
package hello.studyspring.controller;

...

@Controller
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/members/new")
    public String createForm() {
        return "members/createMemberForm";
    }

    @PostMapping("/members/new")
    public String create(MemberForm form) {
        Member member = new Member();
        member.setName(form.getName());

        //회원가입
        memberService.join(member);

        //홈 화면으로 이동
        return "redirect:/";
    }

    @GetMapping("/members")
    public String List(Model model) {
        List<Member> members = memberService.findMember();
        model.addAttribute("members", members);
        return "members/memberList";
    }
}
```

- member 리스트 전체를 모델에 담아서 화면에 넘김

### 회원 리스트 html

```html
<!-- templates/members/memberLish.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <body>
    <div class="container">
      <div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>이름</th>
            </tr>
          </thead>
          <tbody>
            <tr th:each="member : ${members}">
              <td th:text="${member.id}"></td>
              <td th:text="${member.name}"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>
```

- 타임리프
  - th:each로 모델에 있는 members 키에 있는 members 리스트를 루프를 돌며 객체를 하나씩 꺼내서 member에 넣음
