## Comparable vs Comparator

- #### 객체는 기본형 데이터와 달리 정렬 기준이 없으면 정렬을 할 수가 없다.
- #### 따라서 정렬 기준을 정의하여 알려주어야 한다.

## Comparable 인터페이스

- 정렬 대상 클래스를 자바에서 기본적으로 제공하고 있는 Comparable 인터페이스를 구현하도록 변경하는 것이다.

```java
public class Player implements Comparable<Player> {
    
    // Fields, Getters, Setters 생략

    @Override
    public int compareTo(Player o) {
        return o.getScore() - this.getScore();
    }
    
}
```

- Comparable 인터페이스의 compareTo() 메서드를 통해 인자로 넘어온 같은 타입의 다른 객와 대소 비교가 가능하다.
- 메서드를 호출하는 객체가 인자로 넘어온 객체보다 작으면 음수를 리턴하고, 크기가 동일하면 0, 크면 양수를 리턴해야한다.
- <mark>return this.getScore() - o.getScore()는 오름차순 정렬이다.</mark>
- <mark>return o.getScore() - this.getScore()는 내림차순 정렬이다.</mark>

## Comparator 객체

- 정렬 대상 클래스의 코드를 직접 수정할 수 없는 경우이거나,
- 정렬하고자 하는 객체에 이미 존재하고 있는 정렬 기준과 다른 정렬 기준으로 정렬을 하고 싶을 경우에 사용한다.

```java
Comparator<Player> comparator = new Comparator<Player>() {
    
    @Override
    public int compare(Player a, Player b) {
        return b.getScore() - a.getScore();
    }
    
};

Collections.sort(players, comparator);
System.out.println(players);
```

- Collections.sort() 메서드의 두번째 인자에 comparator 객체를 넘기면,
- 정렬 대상 객체의 Comparable 인터페이스 구현 여부와 상관없이, 넘어온 Comparator 구현체의 compare() 메서드 기준으로 정렬한다.
- compare() 메서드에 첫번째 인자가 두번째 인자보다 작다면 음수, 같다면 0, 크다면 양수를 리턴하면 된다.

#### 람다 함수로 대체

- Comparator 객체는 메서드가 하나 뿐인 함수형 인터페이스를 구현하기 때문에 람다 함수로 대체가 가능하다.

```java
Collections.sort(players, (a, b) -> b.getScore() - a.getScore());
```