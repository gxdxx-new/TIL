## 페이징

```java
// ItemRepositoryCustomImpl

@Override
public Page<Item> getAdminItemPage(ItemSearchDto itemSearchDto, Pageable pageable) {
        QueryResults<Item> results = queryFactory.selectFrom(QItem.item)
            .where(regDtsAfter(itemSearchDto.getSearchDateType()),
                    searchSellStatusEq(itemSearchDto.getSearchSellStatus()),
                    searchByLike(itemSearchDto.getSearchBy(),
                    itemSearchDto.getSearchQuery()))
            .orderBy(QItem.item.id.desc())
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetchResults();

        List<Item> content = results.getResults();
        long total = results.getTotal();
        
        return new PageImpl<>(content, pageable, total);
}
```

- 기존 페이징을 할 때 fetchResults()와 fetchCount()가 Querydsl 5.0부터 deprecated 되었다는 문구가 나타났다.
- 그래서 아래와 같이 List의 size() 함수를 이용해서 totalCount를 구했다.
- 하지만 이 방법을 사용하면 기존 페이징처럼 데이터의 총 개수를 구해주는게 아니라,
- 해당 페이지 기준에서의 데이터 개수만을 구해준다.

```java
System.out.println(items.getTotalPages());
System.out.println(items.getTotalElements());
System.out.println(items.getNumberOfElements());
```

- 위와 같이 페이지수, 데이터수를 출력해봐도 도저히 다른 방법을 찾을수가 없었다.
- limit이 3이고, 총 데이터가 15개이면 5페이지가 나와야 되는데,
- url에 4페이지를 들어가면 1~4페이지 까지는 나오지만 마지막 5페이지는 페이지에서 나타나지가 않는다.
- 그래서 어쩔수없이 fetchCount를 사용해서 페이징을 구현했다.

---

## Count 쿼리를 분리한 페이징 최적화

```java
// ItemRepositoryCustomImpl

@Override
public Page<Item> getAdminItemPage(ItemSearchDto itemSearchDto, Pageable pageable) {
        List<Item> content = queryFactory.selectFrom(QItem.item)
            .where(regDtsAfter(itemSearchDto.getSearchDateType()),
                    searchSellStatusEq(itemSearchDto.getSearchSellStatus()),
                    searchByLike(itemSearchDto.getSearchBy(),
                    itemSearchDto.getSearchQuery()))
            .orderBy(QItem.item.id.desc())
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();

        JPAQuery<Item> countQuery = queryFactory.selectFrom(QItem.item)
            .where(regDtsAfter(itemSearchDto.getSearchDateType()),
                    searchSellStatusEq(itemSearchDto.getSearchSellStatus()),
                    searchByLike(itemSearchDto.getSearchBy(),
                    itemSearchDto.getSearchQuery()));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchCount);
}
```

#### Count 쿼리를 분리한 이유

- fetchCount, fetchResult는 둘다 querydsl 내부에서 count용 쿼리를 만들어서 실행해야 하는데, 
- 이 때 작성한 select 쿼리를 기반으로 count 쿼리를 만들어낸다.
- 그런데 이 기능이 select 구문을 단순히 count 처리하는 것으로 바꾸는 정도여서, 
- 단순한 쿼리에서는 잘 동작하는데, 복잡한 쿼리에서는 잘 동작하지 않는다.
- 이럴때는 명확하게 카운트 쿼리를 별도로 작성하고, fetch()를 사용해서 해결한다.

#### PageableExcutionUtils.getPage()

- 스프링 Data 라이브러리가 제공한다.
- 페이지 시작이면서, 컨텐츠 사이즈가 페이지 사이즈보다 작거나, 마지막 페이지 일 경우에는 count쿼리를 생략해서 처리한다.
- 쿼리가 1번 더 최적화 될 수도 있다는 뜻이다.