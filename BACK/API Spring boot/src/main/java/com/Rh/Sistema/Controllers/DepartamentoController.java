package com.Rh.Sistema.Controllers;

import com.Rh.Sistema.Entities.Cargo;
import com.Rh.Sistema.Entities.Departamento;
import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Services.CargoService;
import com.Rh.Sistema.Services.DepartamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departamentos")
public class DepartamentoController {

    private final DepartamentoService service;

    public DepartamentoController(DepartamentoService service){
        this.service = service;
    }

    @PostMapping("/{empresaId}")
    public Departamento cadastrar(
            @PathVariable Long empresaId,
            @RequestBody Departamento departamento){

        return service.cadastrar(empresaId, departamento);
    }

    @GetMapping("/{empresaId}")
    public List<Departamento> listar(@PathVariable Long empresaId) {
        return service.listar(empresaId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Departamento> editarDepartamento(
            @PathVariable Long id,
            @RequestBody Departamento departamento
    ){

        return ResponseEntity.ok(
                service.editarDepartamento(id, departamento)
        );
    }

    @DeleteMapping("{id}")
    public String excluir(@PathVariable Long id){
        boolean removido = service.excluirDepartamento(id);

        return removido ? "Departamento removido com sucesso ✅" : "Departamento não encontrado! ⚠️";
    }
}
