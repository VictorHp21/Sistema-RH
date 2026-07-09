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
public class CargoService {

    private final CargoRepository cargoRepository;
    private final EmpresaRepository empresaRepository;
    private final DepartamentoRepository departamentoRepository;

    public CargoService(
            CargoRepository cargoRepository,
            EmpresaRepository empresaRepository, DepartamentoRepository departamentoRepository) {

        this.cargoRepository = cargoRepository;
        this.empresaRepository = empresaRepository;
        this.departamentoRepository = departamentoRepository;
    }

    public Cargo cadastrar(Long empresaId, Long departamentoId, Cargo cargo){

        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() ->
                        new RuntimeException("Empresa não encontrada"));

        Departamento departamento = departamentoRepository.findById(departamentoId)
                .orElseThrow(() ->
                        new RuntimeException("Cargo não encontrado"));

        if (cargo.getSalarioMin().compareTo(cargo.getSalarioMax()) > 0) {
            throw new RuntimeException("O salário mínimo não pode ser maior que o salário máximo.");
        }

        cargo.setEmpresa(empresa);
        cargo.setDepartamento(departamento);
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


    public Cargo editarCargo(Long id, Long departamentoId, Cargo cargo){
        Cargo cargoExiste = cargoRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Cargo não encontrado"));

        Departamento departamento = departamentoRepository.findById(departamentoId)
                .orElseThrow(() ->
                        new RuntimeException("Cargo não encontrado"));

        cargoExiste.setNome(cargo.getNome());
        cargoExiste.setSalarioMin(cargo.getSalarioMin());
        cargoExiste.setSalarioMax(cargo.getSalarioMax());
        cargoExiste.setDescricao(cargo.getDescricao());
        cargoExiste.setDepartamento(cargoExiste.getDepartamento());
        cargoExiste.setStatus(cargo.getStatus());
        cargoExiste.setDepartamento(departamento);


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
