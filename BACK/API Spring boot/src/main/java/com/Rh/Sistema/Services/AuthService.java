package com.Rh.Sistema.Services;

import com.Rh.Sistema.DTOs.LoginRequest;
import com.Rh.Sistema.DTOs.RegisterRequest;
import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.UserRH;
import com.Rh.Sistema.Repositories.EmpresaRepository;
import com.Rh.Sistema.Repositories.UserRHRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRHRepository repository;
    private final PasswordEncoder encoder;
    private final EmpresaRepository empresaRepository;

    public AuthService(UserRHRepository repository, PasswordEncoder encoder, EmpresaRepository empresaRepository){
        this.repository = repository;
        this.encoder = encoder;
        this.empresaRepository = empresaRepository;
    }

    // login

    public String login(LoginRequest request){

        UserRH user =
                repository.findbyEmailAndEmpresaid(
                                request.getEmail(),
                                request.getEmpresaId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuário não encontrado nesta empresa"
                                ));

        if(!encoder.matches(
                request.getSenha(),
                user.getSenha())){

            throw new RuntimeException("Senha inválida");
        }

        return "LOGIN EFETUADO";
    }


    // cadastro

    public UserRH register(RegisterRequest request){
        if(repository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Email já cadastrado");
        }

        Empresa empresa = empresaRepository.findById(request.getEmpresaId())
                .orElseThrow(()-> new RuntimeException("Empresa não encontrada"));

        UserRH usuario = new UserRH();

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());

        usuario.setSenha(
                encoder.encode(request.getSenha())
        );

        usuario.setEmpresa(empresa);

        return repository.save(usuario);
    }

}
