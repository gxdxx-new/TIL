필요한 라이브러리를 가져오고 빌드하는 life cycle까지 관리해주는 tool

- Maven과 Gradle이 있지만 Gradle로 넘어오는 추세

ADD DEPENDENCIES에서 Spring Web, Thymeleaf 추가

intelliJ에서 해당 폴더에 있는 build.gradle 파일을 오픈하면 된다.

/src/build.gradle

자바가 바로 실행되지 않고 gradle을 통해서 실행될 때

- 실행 속도가 느림
- setting-gradle에서 Build and run using, Run tests using을 IntelliJ IDEA로 변경한다.

웹 애플리케이션에서 첫번째 진입점이 Controller

Controller에는 Controller 애노테이션을 적어줘야 한다.

@GetMapping("hello")을 적어주면 /hello로 들어왔을때 메서드를 호출해준다.

model.addAttribute("data", "hello!!!");의 value가 hello.html에서 ${data}로 치환이 된다.

웹브라우저에서 localhost:8080/hello를 보내면 스프링부트는 톰캣이라는 내장 웹서버에서 받아서 스프링으로 보낸다.

- GetMapping("Hello")를 찾고 HelloController에 있는 hello 메서드가 실행된다.
- 스프링이 model을 만들어서 넣어준다.
- model에 값을 추가하고 return("hello")하면 resources/templates/hello.html을 렌더링한다.
- 컨트롤러에서 리턴 값으로 문자를 반환하면 뷰 리졸버(viewResolver)가 화면을 찾아서 처리한다.

템플릿 엔진: 서버에서 프로그래밍해서 html을 동적으로 바꿔서

웹브라우저에서 static html을 입력 -> 내장 톰캣 서버가 요청을 받음 -> 스프링에서는 hello-static 관련 컨트롤러가 있는지 찾아봄(컨트롤러가 우선순위 가짐) -> 없으면 resources/static/hello-static.html을 찾아서 반환

### MVC와 템플릿 엔진

웹 브라우저에서 localhost:8080/hello-mvc 넘기면 -> 내장 톰캣서버가 요청을 받고 스프링에 보냄 -> 매핑이 돼있는 helloController의 메서드를 호출해줌 -> 메서드의 리턴 html 파일명과 같은 html을 뷰 리졸버가 찾아줌-> 타임리프가 렌더링해서 변환을 한 html을 웹 브라우저에 반환

### API

@ResponseBody: http의 바디부분에 데이터를 직접 넣어주겠다는 뜻
JSON(키-값으로 이루어진 구조)를 반환
객체를 반환 가능

#### @ResponseBody 사용원리

- 웹브라우저에서 localhost:8080/hello-api 입력 -> 내장 톰캣 서버가 요청을 받고 스프링에 보냄 -> @ResponseBody 애노테이션이 있기 때문에 객체가 오면 뷰 없이 JSON 방식으로 데이터를 만들어서 http 바디에 반환 -> HttpMessageConverte가 동작 -> 단순문자: StringConverter 동작, 객체: JsonConverter 동작

### 웹 애플리케이션 계층 구조

컨트롤러: 웹 MVC의 컨트롤러 역할
서비스: 핵심 비즈니스 로직 구현
리포지토리: 데이터베이스에 접근, 도메인 객체를 DB에 저장하고 관리
도메인: 비즈니스 도메인 객체, ex) 회원, 주문, 쿠폰 등등 주로 데이터베이스에 저장하고 관리됨

### 회원 리포지토리 테스트 케이스 작성

테스트는 메서드 순서에 관계없이 따로 실행됨 -> 테스트에 사용한 데이터를 메서드마다 clear 해주어야 됨.

- @AfterEach 애노테이션을 붙여주면 메서드 실행이 끝날 때마다 호출이 됨

테스트 하려는 클래스에서 ctrl + shift + T를 누르면 자동으로 테스트 클래스가 생성됨

예외 케이스를 테스트 하는게 중요

- try catch문보다 assertThrows()을 사용

테스트 하려는 클래스와 테스트 클래스는 같은 리포지토리(인스턴스)를 테스트 해야함

```java
    private final MemberRepository memberRepository;


    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
```

- memberRepository를 직접 생성하는게 아니라 외부에서 넣어주도록 수정

```java
    @BeforeEach
    public void BeforeEach() {
        memberRepository = new MemoryMemberRepository();
        memberService = new MemberService(memberRepository);
    }
```

- 테스트 실행때마다 각각 생성해줌 (테스트는 독립적으로 실행돼야 하기 때문에)
- DI

### 스프링 빈과 의존관계

컨트롤러와 서비스 연결: 컨트롤러에 생성자에 @Autowired 해놓으면 컨트롤러가 생성될 때 스프링 빈에 등록되어 있는 서비스 객체를 가져와 넣어줌 -> DI

서비스와 리포지터리 연결:

스프링이 실행될 때 스프링 컨테이너가 생김 -> @Controller 애노테이션이 있으면 컨트롤러 객체를 생성해서 스프링에 넣어둠 -> 스프링이 관리
-> 스프링 컨테이너에서 스프링 빈이 관리되는것임

컨트롤러가 서비스를 가져다 써야됨 -> 객체를 생성해서 쓰는것보다 스프링 컨테이너에 등록을 하고 씀(하나만 등록이 됨) -> 생성자에 @Autowired가 돼있으면 스프링 컨테이너에서 서비스를 받아와서 씀 -> 서비스 클래스에 @Service 추가 -> 리포지터리 클래스에 @Repository 추가

@Component가 있어도 되는 위치?

- SpringApplication이 있는 패키지만 가능하다.

### 자바코드로 직접 스프링 빈 등록하기

DI

- 필드 주입
- setter 주입
  - 단점: 컨트롤러 호출했을 때 setter가 public으로 되어있어야함 -> 잘못 바뀌면 문제발생
- 생성자 주입
  - 의존관계가 실행중에 동적으로 변하는 경우는 없으므로 생성자 주입 권장
  - 한번 세팅하면 바꿀일 없음

정형화된 컨트롤러, 서비스, 리포지터리 같은 코드는 컴포넌트 스캔 사용

정형화되지 않거나, 상황에 따라 구현 클래스를 변경해야할 때는 설정을 통해 스프링 빈으로 등록

- ex) 리포지터리를 다른 리포지터리로 교체할 때 기존 코드를 수정하지 않고 교체 가능

@Autowired을 통한 DI는 스프링 컨테이너에 올라가 있어야 가능
