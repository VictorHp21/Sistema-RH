package com.Rh.Sistema.Controllers;

import com.Rh.Sistema.DTOs.LoginRequest;
import com.Rh.Sistema.DTOs.RegisterRequest;
import com.Rh.Sistema.Entities.UserRH;
import com.Rh.Sistema.Services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request){

        try{
            String token = service.login(request);
            return ResponseEntity.ok(token);
        } catch (RuntimeException e){
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }

    }

    @PostMapping("/register")
    public ResponseEntity<UserRH> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }
}
