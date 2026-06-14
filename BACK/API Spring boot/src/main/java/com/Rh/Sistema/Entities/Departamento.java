package com.Rh.Sistema.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Departamentos")
public class Departamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToOne
    private Empresa empresa;

}
