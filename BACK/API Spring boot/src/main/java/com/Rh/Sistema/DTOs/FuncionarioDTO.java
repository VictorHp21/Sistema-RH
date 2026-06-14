package com.Rh.Sistema.DTOs;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FuncionarioDTO {
    private String nome;
    private String cpf;
    private Integer idade;

    private BigDecimal salario;

    private LocalDate dataDeContratacao;

    private Boolean statusEmpregado;

    private Long cargoId;
    private Long departamentoId;
    private Long empresaId;


    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public Integer getIdade() {
        return idade;
    }

    public void setIdade(Integer idade) {
        this.idade = idade;
    }

    public BigDecimal getSalario() {
        return salario;
    }

    public void setSalario(BigDecimal salario) {
        this.salario = salario;
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

    public Long getCargoId() {
        return cargoId;
    }

    public void setCargoId(Long cargoId) {
        this.cargoId = cargoId;
    }

    public Long getDepartamentoId() {
        return departamentoId;
    }

    public void setDepartamentoId(Long departamentoId) {
        this.departamentoId = departamentoId;
    }

    public Long getEmpresaId() {
        return empresaId;
    }

    public void setEmpresaId(Long empresaId) {
        this.empresaId = empresaId;
    }
}
