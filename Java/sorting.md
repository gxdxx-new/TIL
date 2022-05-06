## 배열 정렬 (오름차순, 내림차순)

- #### Arrays.sort()을 이용하면 쉽게 배열을 정렬할 수 있다.
- #### 기본적으로 객체는 Comparable이 구현되어있다.
- #### sort()는 Comparable에 의해 리턴되는 값을 비교하여 오름차순 또는 내림차순으로 배열을 정렬한다.

### int 배열 정렬

#### 오름차순 정렬

- Arrays.sort()의 인자로 배열을 전달하면 오름차순으로 정렬해준다.
- sort() 함수 내부에서 변수의 순서를 변경해주기 때문에 따로 arr에 할당해줄 필요가 없다.

```java
int[] arr = {1, 26, 17, 25, 99, 44, 303};

Arrays.sort(arr);

System.out.println("Sorted arr[] : " + Arrays.toString(arr));
```

#### 내림차순 정렬

- 내림차순으로 정렬하려면 sort()의 인자에 추가로 Collections.reverseOrder()를 전달해야 한다.
- Collections.reverseOrder()는 Comparator 객체인데 Collections에서 기본으로 제공해주고 있다.
- Compartator로 비교할 때는 <mark>**Integer**</mark>를 사용해야 한다.

```java
Integer[] arr = {1, 26, 17, 25, 99, 44, 303};

Arrays.sort(arr, Collections.reverseOrder());

System.out.println("Sorted arr[] : " + Arrays.toString(arr));
```

- 내림차순 Comparator를 직접 구현하려면 다음과 같이 할 수 있다.

```java
Integer[] arr = {1, 26, 17, 25, 99, 44, 303};

Arrays.sort(arr, new Comparator<Integer>() {
    @Override
    public int compare(Integer i1, Integer i2) {
        return i2 - i1;
    }
});

System.out.println("Sorted arr[] : " + Arrays.toString(arr));
```

#### 부분 정렬

- sort()의 인자로 처음 index와 마지막 index를 전달해 정렬할 범위를 지정해주면 된다.

```java
int[] arr = {1, 26, 17, 25, 99, 44, 303};

Arrays.sort(arr, 0, 4);

System.out.println("Sorted arr[] : " + Arrays.toString(arr));
```

### String 배열 정렬

#### 오름차순, 내림차순 정렬

- 오름차순, 내림차순 정렬은 Integer와 동일하다.

#### 문자열 길이 순서로 정렬

- 문자열 길이 순서로 정렬하려면 Comparator을 직접 구현해야 한다.

```java
String[] arr = {"Apple", "Kiwi", "Orange", "Banana", "Watermelon", "Cherry"};

Arrays.sort(arr, new Comparator<String>() {
    @Override
    public int compare(String s1, String s2) {
        return s1.length() - s2.length();
    }
});

System.out.println("Sorted arr[] : " + Arrays.toString(arr));
```

### 객체 배열 정렬

- 클래스에 Comparable을 구현해 비교할 수 있게 해주어야 한다.

```java
public static class Fruit implements Comparable<Fruit> {
    
    private String name;
    private int price;
    
    public Fruit(String name, int price) {
        this.name = name;
        this.price = price;
    }

    @Override
    public int compareTo(Fruit fruit) {
        return this.price - fruit.price;
    }

    @Override
    public String toString() {
        return "{name: " + name + ", price: " + price + "}";
    }
    
}
```