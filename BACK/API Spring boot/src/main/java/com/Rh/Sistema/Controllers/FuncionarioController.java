package com.Rh.Sistema.Controllers;


import com.Rh.Sistema.DTOs.FuncionarioDTO;
import com.Rh.Sistema.Entities.Funcionario;
import com.Rh.Sistema.Services.FuncionarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service){
        this.service = service;
    }

    @PostMapping
    public Funcionario cadastrarFuncionario(
            @RequestBody FuncionarioDTO dto){

        return service.cadastrarFuncionario(dto);
    }

    @GetMapping
    public List<Funcionario> listarFuncionarios(){
        return service.listarFuncionarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarFuncionarioPorId(
            @PathVariable Long id){

        return service.buscarFuncionarioId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> editarFuncionario(
            @PathVariable Long id,
            @RequestBody FuncionarioDTO dto){

        return ResponseEntity.ok(
                service.editarFuncionario(id, dto)
        );
    }

    /*
    @DeleteMapping("/{id}")
    public String excluirFuncionario(@PathVariable Long id){

        boolean removido = service.excluirFuncionario(id);

        return removido
                ? "Funcionário desligado com sucesso ✅"
                : "Funcionário não encontrado ⚠️";
    }

     */
}
