package com.Rh.Sistema.Services;

import com.Rh.Sistema.Entities.Cargo;
import com.Rh.Sistema.Repositories.CargoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CargoService {

    private final CargoRepository repository;

    public CargoService(CargoRepository repository){
        this.repository = repository;
    }

    public Cargo cadastrar(Cargo cargo){
        return repository.save(cargo);
    }

    public List<Cargo> listar(){
        return repository.findAll();
    }
}
