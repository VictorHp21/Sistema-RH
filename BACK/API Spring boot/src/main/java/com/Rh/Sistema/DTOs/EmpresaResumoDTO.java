package com.Rh.Sistema.DTOs;

public class EmpresaResumoDTO {

    private Long id;
    private String nome;
    private String cnpj;
    private String endereco;
    private String telefone;
    private String email;
    private String site;
    private String segmento;
        private String corPrincipal;
        private String corPrincipalClara;
        private String corPrincipalEscura;
        private String corSecundaria;



    private Long quantidadeFuncionarios;
    private Long quantidadeCargos;
    private Long quantidadeDepartamentos;


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

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public String getSegmento() {
        return segmento;
    }

    public void setSegmento(String segmento) {
        this.segmento = segmento;
    }

    public String getCorPrincipal() {
        return corPrincipal;
    }

    public void setCorPrincipal(String corPrincipal) {
        this.corPrincipal = corPrincipal;
    }

    public String getCorPrincipalClara() {
        return corPrincipalClara;
    }

    public void setCorPrincipalClara(String corPrincipalClara) {
        this.corPrincipalClara = corPrincipalClara;
    }

    public String getCorPrincipalEscura() {
        return corPrincipalEscura;
    }

    public void setCorPrincipalEscura(String corPrincipalEscura) {
        this.corPrincipalEscura = corPrincipalEscura;
    }

    public String getCorSecundaria() {
        return corSecundaria;
    }

    public void setCorSecundaria(String corSecundaria) {
        this.corSecundaria = corSecundaria;
    }

    public Long getQuantidadeFuncionarios() {
        return quantidadeFuncionarios;
    }

    public void setQuantidadeFuncionarios(Long quantidadeFuncionarios) {
        this.quantidadeFuncionarios = quantidadeFuncionarios;
    }

    public Long getQuantidadeCargos() {
        return quantidadeCargos;
    }

    public void setQuantidadeCargos(Long quantidadeCargos) {
        this.quantidadeCargos = quantidadeCargos;
    }

    public Long getQuantidadeDepartamentos() {
        return quantidadeDepartamentos;
    }

    public void setQuantidadeDepartamentos(Long quantidadeDepartamentos) {
        this.quantidadeDepartamentos = quantidadeDepartamentos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}