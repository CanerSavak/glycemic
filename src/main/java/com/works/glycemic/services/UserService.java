package com.works.glycemic.services;

import com.works.glycemic.models.Role;
import com.works.glycemic.models.User;
import com.works.glycemic.repositories.RoleRepository;
import com.works.glycemic.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService extends SimpleUrlLogoutSuccessHandler implements UserDetailsService {

    final UserRepository userRepository;
    final RoleRepository roleRepository;
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    // user login method
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails userDetails = null;
        Optional<User> oUser = userRepository.findByEmailEqualsIgnoreCase(email);
        if( oUser.isPresent() ){
            User u = oUser.get();
            userDetails = new org.springframework.security.core.userdetails.User(
                    u.getEmail(),
                    u.getPassword(),
                    u.isEnabled(),
                    u.isTokenExpired(),
                    true,
                    true,
                    getAuthorities( u.getRoles() )
            );

        }
        throw new UsernameNotFoundException("User name not found");
    }

    //user roles
    private List<GrantedAuthority> getAuthorities (List<Role> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority( role.getName() ));
        }
        return authorities;
    }


    // logout listener method
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        super.onLogoutSuccess(request, response, authentication);
    }


    //user register method
    public User register( User us ) throws AuthenticationException {

        Optional<User> uOpt = userRepository.findByEmailEqualsIgnoreCase(us.getEmail());
        if ( uOpt.isPresent() ) {
            return null;
        }
        us.setPassword( encoder().encode( us.getPassword() ) );

        return userRepository.save(us);
    }

    // password encoder
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }



}
