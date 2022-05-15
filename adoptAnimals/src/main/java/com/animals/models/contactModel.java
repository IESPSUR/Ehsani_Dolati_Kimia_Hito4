package com.animals.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class contactModel {
	private String nombre;
	private String correo;
	private String titulo;
	private String mensaje;

}
