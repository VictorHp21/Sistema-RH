package com.Rh.Sistema.Services;

import com.Rh.Sistema.Entities.Cargo;
import com.Rh.Sistema.Entities.Departamento;
import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.Funcionario;
import com.Rh.Sistema.Repositories.CargoRepository;
import com.Rh.Sistema.Repositories.DepartamentoRepository;
import com.Rh.Sistema.Repositories.EmpresaRepository;
import com.Rh.Sistema.Repositories.FuncionarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final EmpresaRepository empresaRepository;

    private final FuncionarioRepository funcionarioRepository;

    public DepartamentoService(
            DepartamentoRepository departamentoRepository,
            EmpresaRepository empresaRepository, FuncionarioRepository funcionarioRepository) {

        this.departamentoRepository = departamentoRepository;
        this.empresaRepository = empresaRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public Departamento cadastrar(Long empresaId, Departamento departamento) {

        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        departamento.setEmpresa(empresa);

        departamento.setStatus(true);

        if (departamento.getGerente() != null &&
                departamento.getGerente().getId() != null) {

            Funcionario gerente = funcionarioRepository
                    .findById(departamento.getGerente().getId())
                    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

            departamento.setGerente(gerente);
        }

        Departamento salvo = departamentoRepository.save(departamento);

        if (salvo.getGerente() != null) {
            Funcionario gerente = salvo.getGerente();
            gerente.setDepartamento(salvo);
            funcionarioRepository.save(gerente);
        }

        return salvo;
    }




    public List<Departamento> listar(Long empresaId) {
        return departamentoRepository.findByEmpresaIdAndStatusTrue(empresaId);
    }

    public Departamento buscarPorId(Long id){
        return departamentoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Departamento não encontrado"));
    }

    public Departamento editarDepartamento(Long id, Departamento departamento) {

        Departamento departamentoExiste = departamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Departamento não encontrado"));

        departamentoExiste.setNome(departamento.getNome());
        departamentoExiste.setDescricao(departamento.getDescricao());
        departamentoExiste.setIcone(departamento.getIcone());
        departamentoExiste.setCor(departamento.getCor());


        if (departamento.getGerente() != null &&
                departamento.getGerente().getId() != null) {

            Funcionario gerente = funcionarioRepository.findById(
                    departamento.getGerente().getId()
            ).orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

            departamentoExiste.setGerente(gerente);


            gerente.setDepartamento(departamentoExiste);
            funcionarioRepository.save(gerente);

        } else {
            departamentoExiste.setGerente(null);
        }

        return departamentoRepository.save(departamentoExiste);
    }

    public boolean excluirDepartamento(Long id){
        if(departamentoRepository.existsById(id)){
            Departamento departamento = departamentoRepository.findById(id).get();
            departamento.setStatus(false);

            departamentoRepository.save(departamento);

            return true;
        }

        return false;
    }
}
