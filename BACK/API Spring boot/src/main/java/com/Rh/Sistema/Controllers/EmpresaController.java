package com.Rh.Sistema.Controllers;

import com.Rh.Sistema.DTOs.RelatorioFolhaSalarioDTO;
import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.Funcionario;
import com.Rh.Sistema.Services.EmpresaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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




    @GetMapping("/{id}/funcionarios")
    public List<Funcionario> listarFuncionarios(@PathVariable Long id){
        return service.listarFuncionarios(id);
    }


    // em excluir colocar logica no service que so torne o status da empresa como inativo e n apague diretamente do banco
    // ✅ feito
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

    // falta testar

    @GetMapping("/{id}/folhaDePagamento")
    public BigDecimal totalFolha(@PathVariable Long id){
        return service.calcularFolhaDepagamento(id);
    }

    @GetMapping("{id}/relatorioFolhaDePagamento")
    public ResponseEntity<RelatorioFolhaSalarioDTO> relatorioFolhaDePagamento(@PathVariable Long id){
        return ResponseEntity.ok(service.gerarRelatorioFolhaSalarial(id));
    }

    @GetMapping("{id}/funcionarioMaiorSalario")
    public ResponseEntity<Funcionario> funcionarioMaiorSalario(@PathVariable Long id){
        return ResponseEntity.ok(service.funcionarioMaiorSalario(id));
    }

    @GetMapping("{id}/funcionarioMenorSalario")
    public ResponseEntity<Funcionario> funcionarioMenorSalario(@PathVariable Long id){
        return ResponseEntity.ok(service.funcionarioMenorSalario(id));
    }

    @GetMapping("/{id}/mediaSalarial")
    public BigDecimal mediaSalarial(@PathVariable Long id){
        return service.mediaSalarial(id);
    }

}
