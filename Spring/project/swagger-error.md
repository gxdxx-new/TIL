##  Failed to start bean 'documentationPluginsBootstrapper'; 에러 해결법

```
org.springframework.context.ApplicationContextException: Failed to start bean 'documentationPluginsBootstrapper'; nested exception is java.lang.NullPointerException
```

<img src="https://user-images.githubusercontent.com/35963403/165728655-fc8a2b90-377f-46da-a72d-89bdf00f529d.PNG" width="900">

- swagger 연동을 하는데 위와 같은 에러가 발생했다.
- Spring boot 2.6버전 이후에 spring.mvc.pathmatch.matching-strategy 값이 ant_apth_matcher에서 path_pattern_parser로 변경되면서,
- 몇몇 라이브러리(swagger포함)에 오류가 발생한다도 한다.
- application.properties 에 아래 설정을 추가하면 오류가 발생하지 않는다.

```
spring.mvc.pathmatch.matching-strategy=ant_path_matcher
```