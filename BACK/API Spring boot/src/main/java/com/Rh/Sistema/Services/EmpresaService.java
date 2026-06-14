package com.Rh.Sistema.Services;

import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.Funcionario;
import com.Rh.Sistema.Repositories.EmpresaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class EmpresaService {

    private final EmpresaRepository repository;

    public EmpresaService(EmpresaRepository repository){
        this.repository = repository;
    }

    // métodos de CRUD:

    public List<Funcionario> listarFuncionarios(Long empresaId){
        Empresa empresa = repository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        return empresa.getFuncionarios();
    }

    public Optional<Empresa>buscarEmpresaId(Long id){
        return repository.findById(id);
    }

    public Empresa cadastrarEmpresa(Empresa empresa){
        return repository.save(empresa);
    }

    public boolean excluirEmpresa(Long id){
        if(repository.existsById(id)){
            Empresa empresa = repository.findById(id).get();
            empresa.setStatus(false);
            return true;
        }

        return false;
    }

    public Empresa editarEmpresa(Long id, Empresa empresa){
        Empresa empresaExiste = repository.findById(id)
                .orElseThrow(()-> new RuntimeException("Empresa não encontrada"));

        empresaExiste.setNome(empresa.getNome());
        empresaExiste.setCnpj(empresa.getCnpj());

        return repository.save(empresaExiste);
    }



    // Regras de negócio:

    // estas abaixo ainda precisam ser colocadas no controller

    public BigDecimal calcularFolhaDepagamento(Long id){

        BigDecimal folhaDePagamento = BigDecimal.valueOf(0.0);

        Empresa empresaExiste = repository.findById(id)
                .orElseThrow(()-> new RuntimeException("Empresa não encontrada"));

        List<Funcionario> funcionarios = empresaExiste.getFuncionarios();

        // bigdecimal é imutavel entao usar add()

        for (Funcionario f: funcionarios){
            folhaDePagamento = folhaDePagamento.add(f.getSalario());
        }

        return folhaDePagamento;

    }




}
