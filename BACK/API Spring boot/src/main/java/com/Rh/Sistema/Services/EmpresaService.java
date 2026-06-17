package com.Rh.Sistema.Services;

import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.Funcionario;
import com.Rh.Sistema.Repositories.EmpresaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    private List<Funcionario> funcionariosEmpresa(Long empresaId){
        return buscarEmpresaId(empresaId).get().getFuncionarios();
    }

    public Optional<Empresa>buscarEmpresaId(Long id){
        return repository.findById(id);
    }

    private Empresa buscarEmpresa(Long empresaId){
        return repository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
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


    // metodo para pegar funcionarios pelo repository


    // Regras de negócio:

    // estas abaixo ainda precisam ser colocadas no controller

    public BigDecimal calcularFolhaDepagamento(Long id){

        BigDecimal folhaDePagamento = BigDecimal.valueOf(0.0);


        // bigdecimal é imutavel entao usar add()

        for (Funcionario f: funcionariosEmpresa(id)){
            folhaDePagamento = folhaDePagamento.add(f.getSalario());
        }

        return folhaDePagamento;

    }


    // Alterar para retornar um DTO
    public StringBuilder gerarRelatorioFolhaSalarial(Long id){

        Empresa empresaExiste = buscarEmpresa(id);

        StringBuilder relatorio = new StringBuilder();


        relatorio.append("\n===== FOLHA SALARIAL =====\n");
        relatorio.append("Empresa: ").append(empresaExiste.getNome()).append("\n");
        relatorio.append("CNPJ: ").append(empresaExiste.getCnpj()).append("\n\n");

        BigDecimal totalFolha = BigDecimal.valueOf(0.0);

        for (Funcionario f : funcionariosEmpresa(id)) {
            relatorio.append("Funcionário: ")
                    .append(f.getNome())
                    .append(" | Salário: R$ ")
                    .append(String.format("%.2f", f.getSalario()))
                    .append("\n");

            totalFolha = totalFolha.add(f.getSalario());
        }

        relatorio.append("\n-------------------------\n");
        relatorio.append("Total da folha salarial: R$ ")
                .append(String.format("%.2f", totalFolha));

        return relatorio;

    }


    // Funcionário com o maior sálario
    public Funcionario funcionarioMaiorSalario(Long idEmpresa){

        Empresa empresaExiste = buscarEmpresa(idEmpresa);

        if(empresaExiste.getFuncionarios().isEmpty()){
            throw new RuntimeException("Nenhum funcionário cadastrado.");
        }

        List<Funcionario> funcionarios = funcionariosEmpresa(idEmpresa);

        BigDecimal maior = funcionarios.get(0).getSalario();

        Funcionario funcionarioMaiorSalario = funcionarios.get(0);

        StringBuilder relatorioMaiorSalarioFuncionario = new StringBuilder("");

        for (Funcionario f: funcionarios){

            //Obs para consulta
            // comparação com bigdecimal deve ser feita com compareTo() e não operadores como > ou < ou =

            if(f.getSalario().compareTo(maior) == 1){
                maior = f.getSalario();
                funcionarioMaiorSalario = f;
            }

        }

        return funcionarioMaiorSalario;

    }


    // Funcionário com o menor sálario

    public Funcionario funcionarioMenorSalario(Long idEmpresa){

        Empresa empresaExiste = buscarEmpresa(idEmpresa);

        if(empresaExiste.getFuncionarios().isEmpty()){
            throw new RuntimeException("Nenhum funcionário cadastrado.");
        }

        List<Funcionario> funcionarios = funcionariosEmpresa(idEmpresa);

        BigDecimal menor = funcionarios.get(0).getSalario();

        Funcionario funcionarioMenorSalario = funcionarios.get(0);

        StringBuilder relatorioMenorSalarioFuncionario = new StringBuilder("");

        for (Funcionario f: funcionarios){

            if(f.getSalario().compareTo(menor) == -1){
                menor = f.getSalario();
                funcionarioMenorSalario = f;
            }

        }

        return funcionarioMenorSalario;

    }

    // Media sálarial

    public BigDecimal mediaSalarial(Long idEmpresa){
        BigDecimal soma = BigDecimal.ZERO;
        int numFunc = 0;

        for (Funcionario f: funcionariosEmpresa(idEmpresa)){
            soma = soma.add(f.getSalario());
            numFunc++;
        }

        BigDecimal media = soma.divide(
                BigDecimal.valueOf(numFunc),
                2,
                RoundingMode.HALF_UP);

        return media;

    }




}
