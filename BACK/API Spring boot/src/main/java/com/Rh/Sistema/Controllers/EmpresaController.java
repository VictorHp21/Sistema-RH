package com.Rh.Sistema.Controllers;

import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.Funcionario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresa")
public class EmpresaController {

    private final EmpresaService service;

    public EmpresaController (EmpresaService service){
        this.service = service;
    }

    @PostMapping
    public Empresa cadastrarEmpresa(@RequestBody Empresa empresa){
        return service.cadastrarEmpresa(empresa);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> buscarEmpresaPorId(@PathVariable Long id){
        return service.buscarEmpresaId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Funcionario> listarFuncionarios(){
        return service.listarFuncionarios();
    }


    // em excluir colocar logica no service que so torne o status da empresa como inativo e n apague diretamente do banco
    @DeleteMapping("{id}")
    public String excluir(@PathVariable Long id){
        boolean removido = service.excluirEmpresa(id);

        return removido ? "Empresa removida com sucesso ✅" : "Empresa não encontrada! ⚠️";
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empresa> editarEmpresa(
            @PathVariable Long id,
            @RequestBody Empresa empresa
    ){

        return ResponseEntity.ok(
                service.editarEmpresa(id, empresa)
        );
    }

}
