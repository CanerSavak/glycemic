package com.works.glycemic.config;


import com.works.glycemic.services.UserService;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    final UserService userService;
    public SecurityConfig(UserService userService) {
        this.userService = userService;
    }


   // sql -> jpa query -> user control
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService((userService)).passwordEncoder(userService.encoder());
    }

    // hangi yöntemle giriş yapılarak, rollere göre hangi servis kullanılcak?
    @Override
    protected void configure(HttpSecurity http) throws Exception {
       http.cors().and();
        http

                .httpBasic()
                .and()
                .authorizeRequests()
                .antMatchers("/food/save").hasAnyRole("user","admin")
                .antMatchers("/food/userFoodList").hasAnyRole("user","admin")
                .antMatchers("/food/userFoodDelete").hasAnyRole("user","admin")
                .antMatchers("/food/list").hasAnyRole("global","user","admin")
                .antMatchers("/register/**").permitAll()
                .and()
                .csrf().disable()
                .formLogin().disable()
                .logout().logoutUrl("/logout").invalidateHttpSession(true);
    }


}

