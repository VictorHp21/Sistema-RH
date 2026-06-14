package com.Rh.Sistema.Services;

import com.Rh.Sistema.Entities.Cargo;
import com.Rh.Sistema.Entities.Departamento;
import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Repositories.CargoRepository;
import com.Rh.Sistema.Repositories.DepartamentoRepository;
import com.Rh.Sistema.Repositories.EmpresaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final EmpresaRepository empresaRepository;

    public DepartamentoService(
            DepartamentoRepository departamentoRepository,
            EmpresaRepository empresaRepository) {

        this.departamentoRepository = departamentoRepository;
        this.empresaRepository = empresaRepository;
    }

    public Departamento cadastrar(Long empresaId,
                                  Departamento departamento){

        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() ->
                        new RuntimeException("Empresa não encontrada"));

        departamento.setEmpresa(empresa);

        return departamentoRepository.save(departamento);
    }

    public List<Departamento> listar(){
        return departamentoRepository.findAll();
    }

    public Departamento buscarPorId(Long id){
        return departamentoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Departamento não encontrado"));
    }
}
