## StackOverflowError

```
Servlet.service() for servlet [dispatcherServlet] in context with path [] 
threw exception [Handler dispatch failed; nested exception
is java.lang.StackOverflowError] with root cause
```

### ToString()

- @ToString()은 toString() 메소드를 Override 해서 각각의 필드를 출력할 수 있게 한다.
- 하지만 **연관 관계를 가질 경우 잘못하면 서로를 계속 참조하면서 무한 순환 참조가 발생한다.**
- A엔티티의 toString에서는 연결된 B엔티티를 확인하려고 b.toString을 호출하고,
- B엔티티의 toString에서도 연결된 A엔티티 데이터를 확인하려고 a.toString을 호출하게 되는 것이다.

#### exclude

- 무한 순환 참조를 해결하려면 @ToString에 exclude를 사용한다.
- **exclude는 특정 필드를 toString에 포함되지 않게 해준다.**

```java
@Entity
@ToString(exclude={"userEntity"})
public class BoardEntity {
    ...
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "u_num", nullable = false)
    UserEntity userEntity;
    ...
}
```