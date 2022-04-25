## Builder 패턴

- #### 복합 객체의 생성 과정과 표현 방법을 분리해 동일한 생성 절차에서 서로 다른 표현 결과를 만들수 있게 하는 패턴이다.

### 생성자를 빌더 패턴으로 생성하지 않을 경우

- 생성자 인자로 너무 많은 인자가 넘겨지면 코드를 읽을 때 어떤 인자가 어떠한 값을 나타내는지 확인하기 힘들다.
- 매개변수의 개수를 항상 확인해야 한다.
- 실수로 매개변수의 순서가 바뀌면 컴파일러가 해당 에러를 잡지 못해 런타임 에러가 발생한다.

### Builder 패턴 장점

- #### 필요한 데이터만 설정할 수 있다.
- #### 유연성을 확보할 수 있다.
- #### 가독성을 높일 수 있다.
- #### 불변성을 확보할 수 있다.

---

## Builder 패턴 사용법

### Lombok 없이 Java로 생성

- 생성자의 매개변수가 아래와 같이 많을 경우 보통 Builder 패턴을 이용해 객체를 생성한다.

```java
public Hero(Profession profession, String name, HairType hairType, HairColor hairColor, Armor armor, Weapon weapon) {
}
```

- 위와 같이 생성자 매개변수의 수가 많으면 빠르게 처리할 수 없고 매개변수의 배열을 이해하기 어려워진다.
- 또한 앞으로 더 많은 옵션을 추가하려는 경우 이 매개변수 목록이 계속 늘어날 수 있는데,
- 그렇게 되면 이미 생성되어 있는 것들을 수정하기 어려워진다.

#### 빌더 패턴으로 생성자 Class 생성

```java
public final class Hero {
	private final Profession profession;
	private final String name;
	private final HairType hairType;
	private final HairColor hairColor;
	private final Armor armor;
	private final Weapon weapon;

	private Hero(Builder builder) {
		this.profession = builder.profession;
		this.name = builder.name;
		this.hairColor = builder.hairColor;
		this.hairType = builder.hairType;
		this.weapon = builder.weapon;
		this.armor = builder.armor;
	}
}
```

#### 빌더 Class 생성

```java
public static class Builder {
	private final Profession profession;
	private final String name;
	private HairType hairType;
	private HairColor hairColor;
	private Armor armor;
	private Weapon weapon;

	public Builder(Profession profession, String name) {
		if (profession == null || name == null) {
			throw new IllegalArgumentException("profession and name can not be null");
		}
		this.profession = profession;
		this.name = name;
	}

	public Builder withHairType(HairType hairType) {
		this.hairType = hairType;
		return this;
	}

	public Builder withHairColor(HairColor hairColor) {
		this.hairColor = hairColor;
		return this;
	}
    
	public Builder withArmor(Armor armor) {
		this.armor = armor;
		return this;
	}

	public Builder withWeapon(Weapon weapon) {
		this.weapon = weapon;
		return this;
	}

	public Hero build() {
		return new Hero(this);
	}
}
```

#### 빌더 패턴으로 생성자 생성

```java
Hero mage = new Hero
	.Builder(Profession.MAGE, "Riobard")
	.withHairColor(HairColor.BLACK)
	.withWeapon(Weapon.DAGGER)
	.build();
```

---

### Lombok을 이용해 생성

- Lombok 없이 자바로 생성하면 클래스를 만들 때마다 코드를 작성해야 하기 때문에 코드가 길어지고 불편해진다.
- Lombok 라이브러리의 @Builder 어노테이션을 사용하면 따로 Builder Class를 만들지 않아도 된다.

#### Builder 패턴을 적용할 클래스

```java
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(builderMethodName = "HeroBuilder")
@ToString
public class Hero {

	private final Profession profession;
	private final String name;
	private final HairType hairType;
	private final HairColor hairColor;
	private final Armor armor;
	private final Weapon weapon;

	public static HeroBuilder builder(String name) {
		if(name == null) {
			throw new IllegalArgumentException("필수 파라미터 누락");
		}
	return HeroCheckListBuilder().name(name);
	}
}
```

- #### AllArgsConstructor(access = AccessLevel.PRIVATE)
  - @AllArgsConstructor 어노테이션은 전체 인자를 갖는 생성자를 만드는 데, 접근자를 private로 만들어서 외부에서 접근 못하도록 만든다.
- #### @Builder
  - @Builder 어노테이션을 선언하면 전체 인자를 갖는 생성자를 builderMethodName에 들어간 이름으로 생성한다.
- #### 클래스 내부 builder 메소드
    - 필수로 들어가야 할 필드들을 검증한다.
    - 해당 클래스를 객체로 생성할 때 필수적인 필드가 있다면 지정할 수 있다.
    - 보통 PK를 지정한다.

#### Builder 패턴을 사용해 생성자 생성

```java
public class MainClass {

	public static void main(String[] args) {
        
		Hero hero = Hero.builder("아이언맨")
			.profession(Profession.MAGE, "Riobard")
			.hairType("Paris flight ticket")
			.hairColor(HairColor.BLACK)
			.armor("1235-5345")
			.weapon(Weapon.DAGGER)
			.build();

		System.out.println("빌더 패턴 적용하기 : " + Hero.toString());
	}

}
```

---

### Builder 패턴 장점 이유 정리

#### 필요한 데이터만 설정할 수 있다.

- Hero 객체를 생성하는데 armor 필드를 사용하지 않는 상황이 있을 수가 있다.
- 이 때 빌더를 사용하지 않으면 armor 필드들에 더미 값을 넣어주거나 armor 필드를 가지지 않는 생성자를 따로 만들어줘야 한다.
- 이럴 때 빌더를 사용하면 동적으로 처리할 수 있다.

```java
Hero hero = Hero.builder("아이언맨")
	.profession(Profession.MAGE, "Riobard")
	.hairColor(HairColor.BLACK)
	.weapon(Weapon.DAGGER)
	.build();
```

- 이렇게 필요한 데이터만 설정할 수 있는 빌더의 장점은 테스트용 객체를 생성할 때 편리하고 불필요한 코드의 양을 줄여준다.

#### 유연성을 확보할 수 있다.

- Hero 클래스에 나이를 나타내는 새로운 변수 age를 추가해야 하는데, 이미 생성자로 객체를 만드는 코드가 있는 경우

```java
// age 추가해야 하는 수정이 필요함.
Hero hero = new Hero("아이언맨",Profession.MAGE, "Riobard","Paris flight ticket",HairColor.BLACK,"1235-5345",Weapon.DAGGER)
```

- 새롭게 추가되는 변수 때문에 기존의 코드를 수정해야 한다.
- 하지만 빌더 패턴을 사용하면 새로운 변수가 추가되어도 기존 코드에 영향을 주지 않는다.

#### 가독성을 높일 수 있다.

- 빌더 패턴을 사용하면 매개변수가 많아져도 가독성을 높일 수 있다.

```java
Hero hero = new Hero("아이언맨",Profession.MAGE, "Riobard","Paris flight ticket",HairColor.BLACK,"1235-5345",Weapon.DAGGER)
```

- 위와 같이 매개변수가 많으면 생성자의 각각의 값들이 무엇을 의미하는지 파악이 힘들다.
- 하지만 다음과 같이 빌더 패턴을 사용하면 가독성을 높일 수 있고,
- 직관적으로 어떤 데이터에 어떤 값이 설정되는지 쉽게 파악할 수 있다.

```java
Hero hero = Hero.builder("아이언맨")
	.profession(Profession.MAGE, "Riobard")
	.hairType("Paris flight ticket")
	.hairColor(HairColor.BLACK)
	.armor("1235-5345")
	.weapon(Weapon.DAGGER)
	.build();
```

#### 불변성을 확보할 수 있다.

- **수정자 패턴(Setter)를 사용하면 편하다는 장점이 있지만 불필요하게 확장 가능성을 열어두게 된다.**
- 이는 Open-Closed 법치에 위배되므로 **클래스 변수를 final로 선언하고 객체의 생성은 빌더에 맡기는게 좋다.**

```java
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString(exclude = "User")
public static final class User
{
    
    @Setter(AccessLevel.NONE)
    @Builder.Default
    @NotNull
    private String userkey;
    
    @NotNull
    private String name;
    
    @Setter(AccessLevel.NONE)
    private String number;
    
}
```

- 위와 같이 Setter에 AccessLevel.NONE을 두어 Setter Lombok이 메소드를 생성하지 않게 할 수도 있다.
- 그렇게 되면 이 클래스의 생성에서 수정은 오로지 빌더에 의해서만 적용이 되어질 수 있게 된다.