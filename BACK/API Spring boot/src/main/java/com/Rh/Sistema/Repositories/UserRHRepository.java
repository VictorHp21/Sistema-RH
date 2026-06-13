package com.Rh.Sistema.Repositories;

import com.Rh.Sistema.Entities.Empresa;
import com.Rh.Sistema.Entities.UserRH;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRHRepository extends JpaRepository<UserRH, Long> {
}
