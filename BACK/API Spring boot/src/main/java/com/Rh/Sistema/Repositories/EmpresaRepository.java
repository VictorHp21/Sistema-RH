package com.Rh.Sistema.Repositories;

import com.Rh.Sistema.Entities.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
}
