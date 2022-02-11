package com.works.glycemic.restcontrollers;

import com.works.glycemic.models.User;
import com.works.glycemic.services.UserService;
import com.works.glycemic.utils.REnum;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@CrossOrigin(origins = "*",allowedHeaders = "*")
@RestController
@RequestMapping("/register")
public class RegisterRestController {

    final UserService userService;

    public RegisterRestController(UserService userService) {
        this.userService = userService;
    }

    //user register
    @PostMapping("/userRegister")
    public Map<REnum, Object> userRegister(@RequestBody User user){
       Map<REnum, Object> hm = new LinkedHashMap<>();
       User u = userService.userRegisterService(user);
       if ( u == null){
           hm.put(REnum.status, false);
           hm.put(REnum.message, "Bu mail adresiyle daha önce kayıt olunmuş");
           hm.put(REnum.result, u);
       }else {
           hm.put(REnum.status, true);
           hm.put(REnum.message, "Kayıt işlemi başarılı");
           hm.put(REnum.result, u);
       }

       return hm;
    }
    //admin register
    @PostMapping("/adminRegister")
    public Map<REnum, Object> adminRegister(@RequestBody User user){
        Map<REnum, Object> hm = new LinkedHashMap<>();
        User u = userService.adminRegisterService(user);
        if ( u == null){
            hm.put(REnum.status, false);
            hm.put(REnum.message, "Bu mail adresi ile daha önce kayıt olunmuş");
            hm.put(REnum.result, u);
        }else {
            hm.put(REnum.status, true);
            hm.put(REnum.message, "Kayıt işlemi başarılı");
            hm.put(REnum.result, u);
        }

        return hm;
    }

    @PostMapping("login")
    public Map<REnum, Object> login(@RequestParam String email){
        Map<REnum, Object> hm = new LinkedHashMap<>();
        User u = userService.login(email);
        if( u == null){
            hm.put(REnum.status, false);
            hm.put(REnum.message, "Böyle Bir Kullanıcı Yok");
            hm.put(REnum.result, u);
        }else{
            hm.put(REnum.status, true);
            hm.put(REnum.message, "Giriş Bilgileri");
            hm.put(REnum.result, u);
        }
        return hm;
    }
}
