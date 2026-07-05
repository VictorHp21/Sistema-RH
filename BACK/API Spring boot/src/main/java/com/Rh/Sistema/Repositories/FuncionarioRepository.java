package com.Rh.Sistema.Repositories;

import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    long countByEmpresaId(Long empresaId);

    List<Funcionario> findByEmpresaId(Long empresaId);

}
