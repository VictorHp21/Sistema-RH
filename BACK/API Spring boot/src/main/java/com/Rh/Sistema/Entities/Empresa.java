package com.Rh.Sistema.Entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.List;

public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    private String nome;
    private String cnpj;




    // relacionamentos

    @OneToMany(mappedBy = "empresa")
    private List<Funcionario> funcionarios;

    @OneToMany(mappedBy = "empresa")
    private List<UserRH> usuariosRH;

    public Empresa(){}

    public Empresa(String nome, String cnpj) {
        this.nome = nome;
        this.cnpj = cnpj;
    }

    public long getId() {
        return Id;
    }

    public void setId(long id) {
        Id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public List<Funcionario> getFuncionarios() {
        return funcionarios;
    }

    public void setFuncionarios(List<Funcionario> funcionarios) {
        this.funcionarios = funcionarios;
    }

    public List<UserRH> getUsuariosRH() {
        return usuariosRH;
    }

    public void setUsuariosRH(List<UserRH> usuariosRH) {
        this.usuariosRH = usuariosRH;
    }
}
