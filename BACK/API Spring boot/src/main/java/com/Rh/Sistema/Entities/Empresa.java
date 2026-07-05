package com.Rh.Sistema.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Empresas")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    private String nome;
    private String cnpj;

    private Boolean status;

    private String email;
    private String telefone;
    private String endereco;
    private String site;
    private String segmento;

    // paleta de cores

    private String corPrincipal;
    private String corPrincipalClara;
    private String corPrincipalEscura;
    private String corSecundaria;

    // para imagem logo irei amazenar por url, preciso de um site para armazenar as imagens e aceite que a api ou o front receba esta imagem e salve neste site ao mesmo tempo que ira retornar a url em que a imagem foi salva, salvando esta url no bd para consulta e exibição no front

    private String logoUrl;




    // relacionamentos

    @OneToMany(mappedBy = "empresa")
    @JsonIgnore
    private List<Funcionario> funcionarios;

    @OneToMany(mappedBy = "empresa")
    private List<UserRH> usuariosRH;

    @OneToMany(mappedBy = "empresa")
    private List<Cargo> cargos;

    @OneToMany(mappedBy = "empresa")
    private List<Departamento> departamentos;

    public Empresa(){}

    public Empresa(String nome, String cnpj, Boolean status) {
        this.nome = nome;
        this.cnpj = cnpj;
        this.status = status;
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
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

    public List<Cargo> getCargos() {
        return cargos;
    }

    public void setCargos(List<Cargo> cargos) {
        this.cargos = cargos;
    }

    public List<Departamento> getDepartamentos() {
        return departamentos;
    }

    public void setDepartamentos(List<Departamento> departamentos) {
        this.departamentos = departamentos;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
}
