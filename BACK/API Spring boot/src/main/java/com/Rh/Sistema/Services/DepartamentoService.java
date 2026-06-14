package com.Rh.Sistema.Services;

import com.Rh.Sistema.Entities.Cargo;
import com.Rh.Sistema.Entities.Departamento;
import com.Rh.Sistema.Repositories.CargoRepository;
import com.Rh.Sistema.Repositories.DepartamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartamentoService {

    private final DepartamentoRepository repository;

    public DepartamentoService(DepartamentoRepository repository){
        this.repository = repository;
    }

    public Departamento cadastrar(Departamento departamento){
        return repository.save(departamento);
    }

    public List<Departamento> listar(){
        return repository.findAll();
    }
}
