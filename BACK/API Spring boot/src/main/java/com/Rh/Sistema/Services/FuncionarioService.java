package com.Rh.Sistema.Services;


import com.Rh.Sistema.Configuration.TesteConexaoBD;
import com.Rh.Sistema.DTOs.FuncionarioDTO;
import com.Rh.Sistema.DTOs.FuncionarioResponseDTO;
import com.Rh.Sistema.DTOs.TempoEmpresaDTO;
import com.Rh.Sistema.Entities.*;
import com.Rh.Sistema.Repositories.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final CargoRepository cargoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final EmpresaRepository empresaRepository;

    public FuncionarioService(
            FuncionarioRepository funcionarioRepository,
            CargoRepository cargoRepository,
            DepartamentoRepository departamentoRepository,
            EmpresaRepository empresaRepository) {

        this.funcionarioRepository = funcionarioRepository;
        this.cargoRepository = cargoRepository;
        this.departamentoRepository = departamentoRepository;
        this.empresaRepository = empresaRepository;
    }

    // mapper

    public FuncionarioResponseDTO toDTO(Funcionario f) {

        FuncionarioResponseDTO dto = new FuncionarioResponseDTO();

        dto.setId(f.getId());
        dto.setNome(f.getNome());
        dto.setCpf(f.getCpf());

        dto.setSalario(f.getSalario());
        dto.setDataDeContratacao(f.getDataDeContratacao());
        dto.setStatusEmpregado(f.getStatusEmpregado());

        dto.setTipoDeContrato(
                f.getTipoDeContrato() != null ? f.getTipoDeContrato().name() : null
        );

        dto.setObservacoes(f.getObservacoes());


        if (f.getCargo() != null) {
            dto.setCargoId(f.getCargo().getId());
            dto.setCargoNome(f.getCargo().getNome());
        }


        if (f.getDepartamento() != null) {
            dto.setDepartamentoId(f.getDepartamento().getId());
            dto.setDepartamentoNome(f.getDepartamento().getNome());
        }

        if (f.getEmpresa() != null) {
            dto.setEmpresaId(f.getEmpresa().getId());
        }

        return dto;
    }


    // Métodos CRUD


    public List<FuncionarioResponseDTO> listarFuncionarios() {
        return funcionarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<FuncionarioResponseDTO> listarPorEmpresa(Long empresaId) {
        return funcionarioRepository.findByEmpresaId(empresaId)
                .stream()
                .map(this::toDTO)
                .toList();
    }


    public Optional<Funcionario> buscarFuncionarioId(Long id) {
        return funcionarioRepository.findById(id);
    }

    private Funcionario buscarFuncionario(Long id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Funcionário não encontrado"));
    }

    private Cargo buscarCargo(Long id){
        return cargoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cargo não encontrado"));
    }

    private Departamento buscarDepartamento(Long id){
        return departamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Departamento não encontrado"));
    }

    private Empresa buscarEmpresa(Long id){
        return empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
    }



    public Funcionario cadastrarFuncionario(com.Rh.Sistema.DTOs.FuncionarioDTO dto) {

        Cargo cargo = cargoRepository.findById(dto.getCargoId())
                .orElseThrow(() ->
                        new RuntimeException("Cargo não encontrado"));

        Departamento departamento =
                departamentoRepository.findById(dto.getDepartamentoId())
                        .orElseThrow(() ->
                                new RuntimeException("Departamento não encontrado"));

        Empresa empresa =
                empresaRepository.findById(dto.getEmpresaId())
                        .orElseThrow(() ->
                                new RuntimeException("Empresa não encontrada"));

        // valida se cargo pertence à empresa

        if (cargo.getEmpresa().getId() != (empresa.getId())) {
            throw new RuntimeException(
                    "O cargo informado não pertence à empresa.");
        }

        // valida se departamento pertence à empresa

        if (departamento.getEmpresa().getId() != (empresa.getId())) {
            throw new RuntimeException(
                    "O departamento informado não pertence à empresa.");
        }

        if (dto.getSalario().compareTo(cargo.getSalarioMin()) < 0) {
            throw new RuntimeException(
                    "O salário do funcionário não pode ser menor que o salário mínimo do cargo.");
        }

        if (dto.getSalario().compareTo(cargo.getSalarioMax()) > 0) {
            throw new RuntimeException(
                    "O salário do funcionário não pode ser maior que o salário máximo do cargo.");
        }

        Funcionario funcionario = new Funcionario();

        funcionario.setNome(dto.getNome());
        funcionario.setCpf(dto.getCpf());

        funcionario.setSalario(dto.getSalario());
        funcionario.setDataDeContratacao(dto.getDataDeContratacao());
        funcionario.setStatusEmpregado(dto.getStatusEmpregado());

        funcionario.setTipoDeContrato(dto.getTipoDeContrato());

        funcionario.setEmail(dto.getEmail());

        funcionario.setTelefone(dto.getTelefone());

        funcionario.setObservacoes(dto.getObservacoes());

        funcionario.setCargo(cargo);
        funcionario.setDepartamento(departamento);
        funcionario.setEmpresa(empresa);

        return funcionarioRepository.save(funcionario);
    }

    public Funcionario editarFuncionario(Long id,
                                         FuncionarioDTO dto) {

        Funcionario funcionarioExiste = buscarFuncionario(id);

        Cargo cargo = cargoRepository.findById(dto.getCargoId())
                .orElseThrow(() ->
                        new RuntimeException("Cargo não encontrado"));

        Departamento departamento =
                departamentoRepository.findById(dto.getDepartamentoId())
                        .orElseThrow(() ->
                                new RuntimeException("Departamento não encontrado"));

        funcionarioExiste.setNome(dto.getNome());
        funcionarioExiste.setCpf(dto.getCpf());
        funcionarioExiste.setSalario(dto.getSalario());
        funcionarioExiste.setDataDeContratacao(dto.getDataDeContratacao());
        funcionarioExiste.setStatusEmpregado(dto.getStatusEmpregado());
        funcionarioExiste.setObservacoes(dto.getObservacoes());
        funcionarioExiste.setEmail(dto.getEmail());
        funcionarioExiste.setTelefone(dto.getTelefone());

        funcionarioExiste.setCargo(cargo);
        funcionarioExiste.setDepartamento(departamento);

        return funcionarioRepository.save(funcionarioExiste);
    }



    public boolean excluirFuncionario(Long id) {

        if (funcionarioRepository.existsById(id)) {

            Funcionario funcionario = buscarFuncionario(id);

            funcionario.setStatusEmpregado(false);

            funcionarioRepository.save(funcionario);

            return true;
        }

        return false;
    }


    //Regras de negocio

    public Funcionario aumentarSalario(Long id, BigDecimal valor){


        Funcionario funcionarioExiste = buscarFuncionario(id);

        if (valor.compareTo(BigDecimal.ZERO) < 0){
            throw new RuntimeException("Valor negativo");
        }

        BigDecimal aumento = funcionarioExiste.getSalario().add(valor);

        funcionarioExiste.setSalario(aumento);

        return funcionarioRepository.save(funcionarioExiste);

    }

    public TempoEmpresaDTO calcularTempoEmpresa(Long id){

        Funcionario funcionarioExiste = buscarFuncionario(id);

        LocalDate hoje = LocalDate.now();

        Period tempoDeEmpresa = Period.between(funcionarioExiste.getDataDeContratacao(), hoje);

        TempoEmpresaDTO dto = new TempoEmpresaDTO();

        dto.setFuncionario(funcionarioExiste.getNome());
        dto.setAnos(tempoDeEmpresa.getYears());
        dto.setMeses(tempoDeEmpresa.getMonths());
        dto.setDias(tempoDeEmpresa.getDays());

        return dto;
    }

    // adicionar mais métodos conforme necessário

    public Funcionario alterarCargo(Long id, FuncionarioDTO dto){
        Funcionario funcionarioExiste = buscarFuncionario(id);

        Cargo cargo = cargoRepository.findById(dto.getCargoId())
                .orElseThrow(() ->
                        new RuntimeException("Cargo não encontrado"));

        funcionarioExiste.setCargo(cargo);


        return funcionarioRepository.save(funcionarioExiste);
    }


}