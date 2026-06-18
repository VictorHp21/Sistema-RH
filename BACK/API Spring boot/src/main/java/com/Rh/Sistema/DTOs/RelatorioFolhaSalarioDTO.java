package com.Rh.Sistema.DTOs;

import com.Rh.Sistema.Entities.Funcionario;

import java.math.BigDecimal;
import java.util.List;

public class RelatorioFolhaSalarioDTO {

    private String nomeEmpresa;
    private String cnpjEmpresa;
    private BigDecimal totalFolhaDePagamento;
    private List<Funcionario> funcionariosEmpresa;


    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public String getCnpjEmpresa() {
        return cnpjEmpresa;
    }

    public void setCnpjEmpresa(String cnpjEmpresa) {
        this.cnpjEmpresa = cnpjEmpresa;
    }

    public BigDecimal getTotalFolhaDePagamento() {
        return totalFolhaDePagamento;
    }

    public void setTotalFolhaDePagamento(BigDecimal totalFolhaDePagamento) {
        this.totalFolhaDePagamento = totalFolhaDePagamento;
    }

    public List<Funcionario> getFuncionariosEmpresa() {
        return funcionariosEmpresa;
    }

    public void setFuncionariosEmpresa(List<Funcionario> funcionariosEmpresa) {
        this.funcionariosEmpresa = funcionariosEmpresa;
    }
}
