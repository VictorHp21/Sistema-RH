package com.Rh.Sistema.Controllers;

import com.Rh.Sistema.DTOs.LoginRequest;
import com.Rh.Sistema.DTOs.RegisterRequest;
import com.Rh.Sistema.DTOs.UserDTO;
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
    public ResponseEntity<?> login(@RequestBody LoginRequest request){

        try{

            UserRH usuario = service.login(request);

            UserDTO dto = new UserDTO(
                    usuario.getId(),
                    usuario.getNome(),
                    usuario.getEmail()
            );

            return ResponseEntity.ok(dto);

        }catch(RuntimeException e){

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
