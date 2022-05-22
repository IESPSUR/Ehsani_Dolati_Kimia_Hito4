package com.animals.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeleteUserInformEmail {
	private String correoDeUsu;
	private String mensajeAdmin;
	private String nombreUsuario;
}
