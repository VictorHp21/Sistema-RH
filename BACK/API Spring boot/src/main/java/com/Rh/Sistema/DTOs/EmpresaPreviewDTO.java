package com.Rh.Sistema.DTOs;

public record EmpresaPreviewDTO(
        Long id,
        String nome,
        String logoUrl
) {
    @Override
    public Long id() {
        return id;
    }

    @Override
    public String nome() {
        return nome;
    }

    @Override
    public String logoUrl() {
        return logoUrl;
    }
}