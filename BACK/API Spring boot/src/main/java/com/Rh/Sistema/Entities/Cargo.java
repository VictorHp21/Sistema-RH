package com.Rh.Sistema.Entities;

import com.Rh.Sistema.Enums.TipoDeContrato;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Cargos")
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal salarioMax;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal salarioMin;

    private String descricao;

    private Integer vagas;

    @Enumerated(EnumType.STRING)
    private TipoDeContrato tipoDeContrato;

    private Boolean status;

    @Column(nullable = false)
    private Boolean excluido = false;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    @JsonIgnore
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "departamento_id")
    @JsonIgnoreProperties({
            "gerente",
            "funcionarios"
    })
    private Departamento departamento;


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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public BigDecimal getSalarioMax() {
        return salarioMax;
    }

    public void setSalarioMax(BigDecimal salarioMax) {
        this.salarioMax = salarioMax;
    }

    public BigDecimal getSalarioMin() {
        return salarioMin;
    }

    public void setSalarioMin(BigDecimal salarioMin) {
        this.salarioMin = salarioMin;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getVagas() {
        return vagas;
    }

    public void setVagas(Integer vagas) {
        this.vagas = vagas;
    }

    public TipoDeContrato getTipoDeContrato() {
        return tipoDeContrato;
    }

    public void setTipoDeContrato(TipoDeContrato tipoDeContrato) {
        this.tipoDeContrato = tipoDeContrato;
    }

    public Departamento getDepartamento() {
        return departamento;
    }

    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
    }

    public Boolean getExcluido() {
        return excluido;
    }

    public void setExcluido(Boolean excluido) {
        this.excluido = excluido;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

}
