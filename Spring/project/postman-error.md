## REST API POST 401 Unauthorized

### GET method 401 Unauthorized 해결법

<img src="https://user-images.githubusercontent.com/35963403/165711408-04e92421-8d6e-4a37-b6d4-8fd3cbce78fc.PNG" width="900">

- #### 아래 스프링 시큐리티 설정에서 **http.authorizeRequests().mvcMatchers().permitAll()에**
- #### "/api/**" 을 추가해 모든 사용자가 접근 가능하도록 설정해준다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    MemberService memberService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin()
                .loginPage("/members/login")
                .defaultSuccessUrl("/")
                .usernameParameter("email")
                .failureUrl("/members/login/error")
                .and()
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/members/logout"))
                .logoutSuccessUrl("/");

        http.authorizeRequests()
                .mvcMatchers("/", "/members/**",
                                "/item/**", "/images/**", "/api/**").permitAll()
                .mvcMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated();

        http.exceptionHandling()
                .authenticationEntryPoint((new CustomAuthenticationEntryPoint()));
        
    }
    
    ...
```

---

### POST method 401 Unauthorized 해결법

- #### 스프링 부트에 스프링 시큐리티 의존관계를 추가하면 기본 설정이 적용되면서,
- #### csrf에 대한 체크를 하기 때문에 post method가 정상적으로 동작하지 않는다.

<img src="https://user-images.githubusercontent.com/35963403/165712756-6e8a3945-b7f7-46da-97f2-80173ff1d233.jpg" width="900">

- #### 아래 스프링 시큐리티 설정에서 **http.csrf().disable();**을 추가해줘서
- #### 스프링 시큐리티에서 csrf에 대한 체크를 하지 않도록 설정하면 된다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    MemberService memberService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin()
                .loginPage("/members/login")
                .defaultSuccessUrl("/")
                .usernameParameter("email")
                .failureUrl("/members/login/error")
                .and()
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/members/logout"))
                .logoutSuccessUrl("/");

        http.authorizeRequests()
                .mvcMatchers("/", "/members/**",
                                "/item/**", "/images/**", "/api/**").permitAll()
                .mvcMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated();

        http.exceptionHandling()
                .authenticationEntryPoint((new CustomAuthenticationEntryPoint()));

        http.csrf().disable();
        
    }
    
    ...
```