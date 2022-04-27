## REST (Representational State Transfer)

- #### 하나의 URI는 하나의 고유한 리소스를 대표하도록 설계된다.
- #### ex) /article/120 은 120번 게시물이라는 고유한 의미를 가지도록 설계하고,
- #### 이에 대한 처리는 GET, POST 방식과 같이 추가적인 정보를 통해 결정한다.

#### REST API

- 외부에서 특정 URI를 통해 사용자가 원하는 정보를 제공하는 방식이다.
- REST 방식의 서비스 제공이 가능한 것을 "Restful"하다고 표현한다.

#### 스프링에서의 REST

- 스프링3부터 @ResponseBody 어노테이션으로 REST 방식의 처리를 지원한다.
- 스프링4부터는 @RestController 어노테이션을 통해 구현이 가능하다.

---

### @RestController 어노테이션

#### @RestController

- 기존의 특정한 JSP와 같은 뷰를 만들어 내는 것이 목적이 아니라 **REST방식의 데이터를 처리하기 위해 사용**하는 어노테이션이다.
- 이 때 반환되는 데이터로 사용되는 것: 단순문자열, JSON, XML

#### @Controller, @ResponseBody

- 스프링3에서는 컨트롤러는 @Controller 어노테이션만을 사용해서 처리했기 때문에 화면을 처리를 담당하는 JSP가 아닌 데이터자체를 서비스하려면 해당 메서드나 리턴타입에 @ResponseBody애너테이션을 추가하는 형태로 작성하였다.

#### @PathVariable

- 일반 컨트롤러에서도 사용 가능하지만 REST 방식에서 자주 사용한다.
- URI경로의 일부를 파라미터로 사용할 때 이용한다.

#### @RequestBody

- **HTTP 요청과 함께 받은 JSON 형태의 데이터를 Java 객체에 매핑**할 때 사용한다.

---

## @RestController 를 이용해 REST API 개발

### @Controller 와 @ResponseBody를 이용한 REST API 개발

- @Controller 어노테이션을 이용하면 기본적으로 view 페이지를 찾아서 띄워주는 역할을 한다.
- REST API를 개발해야 하는 상황이면 각 메소드마다 @ResponseBody를 붙여서 데이터를 그대로 반환하도록 할 수 있다.

```java
import org.springframework.stereotype.Controller; 
import org.springframework.web.bind.annotation.RequestMapping; 
import org.springframework.web.bind.annotation.RequestMethod; 
import org.springframework.web.bind.annotation.ResponseBody; 

@Controller 
public class FirstController { 
    
    @ResponseBody // View 페이지가 아닌 응답값 그대로 반환하기 위해 사용 
    @RequestMapping(value = "/hello", method = RequestMethod.GET) 
    public String hello() { 
        return "hello"; 
    } 
    
}
```

---

### @RestController

- @RestController를 사용하면, @ResponseBody를 사용하지 않아도 되므로 훨씬 간편하다.

```java
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecondController {

    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    public String hello() {
        return "hello";
    }

}
```

---

### 회원 REST API 개발 예제

```java
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 모든 회원 정보를 가져오는 API
     * @return ResponseEntity<List<UserResponse>> 200 OK, 회원 정보 목록
     */
    @GetMapping("")
    public ResponseEntity<List<UserResponse>> getAllUser() {
        List<UserResponse> userList = userService.getAllUser();
        return ResponseEntity.status(HttpStatus.OK).body(userList);
    }

    /**
     * 회원 정보를 가져오는 API
     * @param id 회원의 ID (PK)
     * @return ResponseEntity<UserResponse> 200 OK, 회원 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable("id") long id) {
        UserResponse userResponse = userService.getUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(userResponse);
    }
    
    /**
     * 회원 가입 API
     * @param userRequest 회원 정보
     * @return ResponseEntity<UserResponse> 201 Created, 가입된 회원의 정보
     */
    @PostMapping("")
    public ResponseEntity<UserResponse> signUp(@RequestBody UserRequest userRequest) {
        UserResponse user = userService.insert(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    /**
     * 회원 정보 수정 API
     * @param id 회원의 ID (PK)
     * @param userRequest 회원 정보
     * @return ResponseEntity<UserResponse> 200 OK, 수정된 회원의 정보
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable("id") long id, @RequestBody UserRequest userRequest) {
        UserResponse user = userService.update(userRequest);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    /**
     * 회원 탈퇴(삭제) API
     * @param id 회원의 ID (PK)
     * @return ResponseEntity<Object> 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable("id") long id) {
        userService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }
}

```