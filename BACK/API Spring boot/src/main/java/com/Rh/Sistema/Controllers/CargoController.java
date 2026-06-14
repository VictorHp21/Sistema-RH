package com.Rh.Sistema.Controllers;

import com.Rh.Sistema.Entities.Cargo;
import com.Rh.Sistema.Services.CargoService;
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

    @GetMapping
    public List<Cargo> listar() {
        return service.listar();
    }
}
