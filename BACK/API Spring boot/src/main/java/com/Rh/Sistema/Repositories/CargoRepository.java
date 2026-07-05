package com.Rh.Sistema.Repositories;

import com.Rh.Sistema.Entities.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CargoRepository extends JpaRepository<Cargo, Long> {
    List<Cargo> findByEmpresaIdAndExcluidoFalse(Long empresaId);

    long countByEmpresaId(Long empresaId);
}
