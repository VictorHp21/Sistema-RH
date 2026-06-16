package com.Rh.Sistema.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Funcionarios")
public class Funcionario {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer idade;
    private String cpf;

    @ManyToOne
    @JoinColumn(name = "cargo_id")
    private Cargo cargo;

    @ManyToOne
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;


    private String nome;

    //Utilizar decimal para evitar imprecisões
    // nullable = false => coluna não pode receber null
    // em Mysql seria: salario DECIMAL(10,2) NOT NULL, precision = 10 > total de digitos que podem contem no sálario, scale = 2 > número de casas decimais
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal salario;



    private LocalDate dataDeContratacao;
    private Boolean statusEmpregado;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    @JsonIgnore
    private Empresa empresa;


    public Funcionario(){}

    public Funcionario(Integer idade, String cpf, Cargo cargo, String nome, BigDecimal salario, Departamento departamento, LocalDate dataDeContratacao, Boolean statusEmpregado, Empresa empresa) {
        this.idade = idade;
        this.cpf = cpf;
        this.cargo = cargo;
        this.nome = nome;
        this.salario = salario;
        this.departamento = departamento;
        this.dataDeContratacao = dataDeContratacao;
        this.statusEmpregado = statusEmpregado;
        this.empresa = empresa;
    }


    //getters e setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIdade() {
        return idade;
    }

    public void setIdade(Integer idade) {
        this.idade = idade;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public Cargo getCargo() {
        return cargo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getSalario() {
        return salario;
    }

    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }

    public Departamento getDepartamento() {
        return departamento;
    }

    public void setCargo(Cargo cargo) {
        this.cargo = cargo;
    }

    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
    }

    public LocalDate getDataDeContratacao() {
        return dataDeContratacao;
    }

    public void setDataDeContratacao(LocalDate dataDeContratacao) {
        this.dataDeContratacao = dataDeContratacao;
    }

    public Boolean getStatusEmpregado() {
        return statusEmpregado;
    }

    public void setStatusEmpregado(Boolean statusEmpregado) {
        this.statusEmpregado = statusEmpregado;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }
}
