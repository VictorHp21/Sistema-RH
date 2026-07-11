package com.Rh.Sistema.DTOs;

public record EmpresaPreviewDTO(
        Long id,

        String nome,

        String cnpj,

        String logoUrl,

        String corPrincipal,

        String corPrincipalClara,

        String corPrincipalEscura,

        String corSecundaria
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