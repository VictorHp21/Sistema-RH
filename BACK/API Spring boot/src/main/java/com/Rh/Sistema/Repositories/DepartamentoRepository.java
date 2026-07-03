package com.Rh.Sistema.Repositories;


import com.Rh.Sistema.Entities.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {

    List<Departamento> findByEmpresaIdAndStatusTrue(Long empresaId);
}
