## Annotation 개념 정리

### Annotation이란?

- 자바 소스 코드에 추가하여 사용할 수 있는 메타데이터의 일종이다.
- Annotation은 클래스와 메서드에 추가하여 다양한 기능을 부여하는 역할을 한다.

---

### Spring의 대표적인 Annotation과 역할

#### @Component

- 생성한 Class를 Spring의 Bean으로 등록할 때 사용하는 Annotation이다.
- Spring은 해당 Annotation을 보고 Spring의 Bean으로 등록한다.

#### @ComponentScan

- Spring Framework는 @Component, @Service, @Repository, @Controller, @Configuration 중 1개라도 등록된 클래스를 찾으면, Context에 bean으로 등록한다.
- @ComponentScan Annotation이 있는 클래스의 하위 Bean이 등록될 클래스들을 스캔하여 Bean으로 등록해준다.

#### @Bean

- 개발자가 제어가 불가능한 외부 라이브러리와 같은 것들을 Bean으로 만들 때 사용한다.

#### @Controller

- Spring에게 해당 Class가 Controller의 역할을 한다고 명시하기 위해 사용하는 Annotation이다.

#### @RequestHeader

- Request의 header값을 가져올 수 있으며, 해당 Annotation을 쓴 메소드의 파라미터에 사용한다.

#### @RequestMapping

- @RequestMapping(value=”“)와 같은 형태로 작성하며, 요청 들어온 URI의 요청과 Annotation value 값이 일치하면 해당 클래스나 메소드가 실행된다.
- Controller 객체 안의 메서드와 클래스에 적용 가능하다.
- Class 단위에 사용하면 하위 메소드에 모두 적용된다.
- 메소드에 적용되면 해당 메소드에서 지정한 방식으로 URI를 처리한다.

#### @RequestParam

- URL에 전달되는 파라미터를 메소드의 인자와 매칭시켜, 파라미터를 받아서 처리할 수 있는 Annotation이다.
- Json 형식의 Body를 MessageConverter를 통해 Java 객체로 변환시킨다.

#### @RequestBody

- Body에 전달되는 데이터를 메소드의 인자와 매칭시켜, 데이터를 받아서 처리할 수 있는 Annotation이다.
- 클라이언트가 보내는 HTTP 요청 본문(JSON 및 XML 등)을 Java 객체로 변환한다. 

#### @ModelAttribute

- 클라이언트가 전송하는 HTTP parameter, Body 내용을 Setter 함수를 통해 1:1로 객체에 데이터를 연결(바인딩)한다.
- @RequestBody와 다르게 HTTP Body 내용은 multipart/form-data 형태를 요구한다.
- @RequestBody가 json을 받는 것과 달리 @ModelAttribute의 경우에는 json을 받아 처리할 수 없다.

#### @Autowired

- Bean을 주입받기 위해 @Autowired를 사용한다.
- Spring Framework에서 Bean 객체를 주입받기 위한 방법은 크게 아래의 3가지가 있다.
- Spring Framework가 Class를 보고 Type에 맞게(Type을 먼저 확인 후, 없으면 Name 확인) Bean을 주입한다.

1. @Autowired (필드 주입)
2. setter
3. @RequiredArgsConstructor (생성자 주입)

#### @GetMapping

- RequestMapping(Method=RequestMethod.GET)과 똑같은 역할을 한다.

#### @PostMapping

- RequestMapping(Method=RequestMethod.POST)과 똑같은 역할을 한다.

#### @SpringBootTest

- SpringBoot 테스트에 필요한 의존성을 제공해준다.

#### @Test

- JUnit에서 테스트할 대상을 표시한다.

#### @NotNull

- Null만 허용하지 않는다.
- "" (초기화된 String) 이나 " " (공백)은 허용하게 된다.

#### @NotEmpty

- Null, "" 을 허용하지 않는다.
- " " (공백)은 허용한다.

#### @NotBlank

- Null, "", " " 모두 허용하지 않는다.

---

### Lombok의 대표적인 Annotation과 역할

#### @Setter

- Class의 모든 필드의 Setter method를 생성해준다.

#### @Getter

- Class의 모든 필드의 Getter method를 생성해준다.

#### @AllArgsConstructor

- Class의 모든 필드 값을 파라미터로 받는 생성자를 생성해준다.

#### @NoArgsConstructor

- Class의 기본 생성자를 자동으로 생성해준다.

#### @RequiredArgsConstructor

- final이 붙거나 @NotNull이 붙은 필드의 생성자를 생성해준다.

#### @ToString

- Class의 모든 필드의 toString method를 생성한다.

