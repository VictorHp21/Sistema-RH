package com.Rh.Sistema.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Usuários")
public class UserRH {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;


    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    public UserRH(){}

    public UserRH(String nome, String email, String senha, Empresa empresa) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.empresa = empresa;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }
}
