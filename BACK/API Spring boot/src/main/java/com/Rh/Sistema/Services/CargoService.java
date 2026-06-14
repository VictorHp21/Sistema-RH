package com.Rh.Sistema.Services;

import com.Rh.Sistema.Entities.Cargo;
import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Repositories.CargoRepository;
import com.Rh.Sistema.Repositories.EmpresaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CargoService {

    private final CargoRepository cargoRepository;
    private final EmpresaRepository empresaRepository;

    public CargoService(
            CargoRepository cargoRepository,
            EmpresaRepository empresaRepository) {

        this.cargoRepository = cargoRepository;
        this.empresaRepository = empresaRepository;
    }

    public Cargo cadastrar(Long empresaId, Cargo cargo){

        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() ->
                        new RuntimeException("Empresa não encontrada"));

        cargo.setEmpresa(empresa);

        return cargoRepository.save(cargo);
    }

    public List<Cargo> listar(){
        return cargoRepository.findAll();
    }

    public Cargo buscarPorId(Long id){
        return cargoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Cargo não encontrado"));
    }
}
