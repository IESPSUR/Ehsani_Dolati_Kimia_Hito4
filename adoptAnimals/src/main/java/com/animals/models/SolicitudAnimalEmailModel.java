package com.animals.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SolicitudAnimalEmailModel {
	private String correoDeUsu;
	private String respuesta;
	private String dniAnimal;
	private String propietario;
}