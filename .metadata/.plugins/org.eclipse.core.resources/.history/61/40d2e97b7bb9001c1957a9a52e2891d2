package com.animals.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Table(name= "comentarios")
@Data
@Entity(name="comentarios")
public class ComentarioModel {
	
	@Id
	private int id;
	@Column
	private String cabecera;
	@ManyToOne
    @JoinColumn(name = "publicacion_id",foreignKey = @ForeignKey(name="PUBLICACION_ID_FK"))
	private PublicacionModel publicacion_id;
	@ManyToOne
    @JoinColumn(name = "nombreUsuario",foreignKey = @ForeignKey(name="USUARIO_ID_FK"))
	private UsuarioModel nombreUsuario;
	
	


}
