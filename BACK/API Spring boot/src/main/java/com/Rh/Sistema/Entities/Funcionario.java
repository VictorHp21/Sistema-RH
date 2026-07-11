package com.Rh.Sistema.Entities;

import com.Rh.Sistema.Enums.TipoDeContrato;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Funcionarios")
public class Funcionario {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;


    private String cpf;

    @Enumerated(EnumType.STRING)
    private TipoDeContrato tipoDeContrato;

    private String telefone;
    private String email;

    private String observacoes;

    @ManyToOne
    @JoinColumn(name = "cargo_id")
    private Cargo cargo;

    @ManyToOne
    @JoinColumn(name = "departamento_id")
    @JsonIgnore
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

    public Funcionario(String cpf, TipoDeContrato tipoDeContrato, String telefone, String email, String observacoes, Cargo cargo, Departamento departamento, String nome, BigDecimal salario, LocalDate dataDeContratacao, Boolean statusEmpregado, Empresa empresa) {
        this.cpf = cpf;
        this.tipoDeContrato = tipoDeContrato;
        this.telefone = telefone;
        this.email = email;
        this.observacoes = observacoes;
        this.cargo = cargo;
        this.departamento = departamento;
        this.nome = nome;
        this.salario = salario;
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



    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public TipoDeContrato getTipoDeContrato() {
        return tipoDeContrato;
    }

    public void setTipoDeContrato(TipoDeContrato tipoDeContrato) {
        this.tipoDeContrato = tipoDeContrato;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
