package com.Rh.Sistema.Controllers;

import com.Rh.Sistema.Entities.Cargo;
import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Services.CargoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cargos")
public class CargoController {

    private final CargoService service;

    public CargoController(CargoService service){
        this.service = service;
    }

    @PostMapping("/{empresaId}")
    public Cargo cadastrar(@PathVariable Long empresaId, @RequestBody Cargo cargo){
        return service.cadastrar(empresaId, cargo);
    }

    @GetMapping("/{empresaId}")
    public List<Cargo> listar(@PathVariable Long empresaId) {
        return service.listar(empresaId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cargo> editarCargo(
            @PathVariable Long id,
            @RequestBody Cargo cargo
    ){

        return ResponseEntity.ok(
                service.editarCargo(id, cargo)
        );
    }

    @DeleteMapping("{id}")
    public String excluir(@PathVariable Long id){
        boolean removido = service.excluirCargo(id);

        return removido ? "Cargo removida com sucesso ✅" : "Cargo não encontrado! ⚠️";
    }
}
