package com.Rh.Sistema.Repositories;

import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.UserRH;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRHRepository extends JpaRepository<UserRH, Long> {

    Optional<UserRH> findByEmail(String email);

     /*Optional<UserRH> findByEmailAndEmpresaId(
            String email
    );
    */
}
