package com.Rh.Sistema.Controllers;

import com.Rh.Sistema.Entities.Cargo;
import com.Rh.Sistema.Entities.Departamento;
import com.Rh.Sistema.Services.CargoService;
import com.Rh.Sistema.Services.DepartamentoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departamentos")
public class DepartamentoController {

    private final DepartamentoService service;

    public DepartamentoController(DepartamentoService service){
        this.service = service;
    }

    @PostMapping
    public Departamento cadastrar(@RequestBody Departamento departamento){
        return service.cadastrar(departamento);
    }

    @GetMapping
    public List<Departamento> listar() {
        return service.listar();
    }
}
