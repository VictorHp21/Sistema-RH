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
        cargo.setExcluido(false);

        return cargoRepository.save(cargo);
    }

    public List<Cargo> listar(Long id) {
        return cargoRepository.findByEmpresaIdAndExcluidoFalse(id);
    }

    public Cargo buscarPorId(Long id){
        return cargoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Cargo não encontrado"));
    }


    public Cargo editarCargo(Long id, Cargo cargo){
        Cargo cargoExiste = cargoRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Cargo não encontrado"));

        cargoExiste.setNome(cargo.getNome());
        cargoExiste.setStatus(cargo.getStatus());


        return cargoRepository.save(cargoExiste);
    }

    public boolean excluirCargo(Long id){
        if(cargoRepository.existsById(id)){
            Cargo cargo = cargoRepository.findById(id).get();
            cargo.setStatus(false);
            cargo.setExcluido(true);

            cargoRepository.save(cargo);

            return true;
        }

        return false;
    }

}
