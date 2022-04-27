## CQS (Command-Query Seperation)

- #### 커맨드와 쿼리를 분리하는 것이다.
- #### 커맨드와 쿼리를 분리하면 데이터 변경 관련 이슈가 발생했을 때 변경이 일어나는 메서드만 찾아보면 된다.
- #### command(명령)은 결과를 반환하지 않는다. 시스템의 상태를 변경한다.
- #### query(질의)는 결과를 반환한다. 내부에 변경이 발생하지 않는다. (사이드 이펙트가 없다.)

---

### JPA에서의 CQS 활용 예시

#### insert는 id만 반환한다.

```java
private EntityManager em;

@Transactional
public Long save(Item item) {
    em.persist(item);
    Item item = em.find(Item.class, id);
    return item.getId();
}
```

#### update는 아무것도 반환하지 않는다.

```java
private EntityManager em;

@Transactional
public void update(Item item) {
    em.persist(item);
}
```

#### (조회) select는 내부 변경 없이 결과값만 반환한다.

```java
@Transactional(readOnly = true)
public Item findOne(Long id) {
    Item findItem = em.find(Item.class, id);
    return findItem;
}
```