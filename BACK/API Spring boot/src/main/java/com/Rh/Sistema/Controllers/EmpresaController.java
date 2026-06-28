package com.Rh.Sistema.Controllers;

import com.Rh.Sistema.DTOs.EmpresaPreviewDTO;
import com.Rh.Sistema.DTOs.RelatorioFolhaSalarioDTO;
import com.Rh.Sistema.Entities.Departamento;
import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.Funcionario;
import com.Rh.Sistema.Entities.UserRH;
import com.Rh.Sistema.Services.EmpresaService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/empresa")
public class EmpresaController {

    private final EmpresaService service;

    public EmpresaController (EmpresaService service){
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Empresa>cadastrarEmpresa(@RequestParam String nome,
                                                   @RequestParam String cnpj,
                                                   @RequestParam Boolean status,
                                                   @RequestParam(required = false) MultipartFile logo){
        Empresa empresa = service.cadastrarEmpresa(nome, cnpj, status, logo);
        return ResponseEntity.ok(empresa);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> buscarEmpresaPorId(@PathVariable Long id){
        return service.buscarEmpresaId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }


    @GetMapping("/{id}/funcionarios")
    public List<Funcionario> listarFuncionarios(@PathVariable Long id){
        return service.listarFuncionarios(id);
    }

    @GetMapping("/{id}/departamentos")
    public List<Departamento> listarDepartamentos(@PathVariable Long id){
        return service.listarDepartamentos(id);
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

    @GetMapping("/user/{email}")
    public ResponseEntity<EmpresaPreviewDTO> empresaDoUsuario(@PathVariable String email){
        return ResponseEntity.ok(service.empresaDoUsuario(email));
    }

}
