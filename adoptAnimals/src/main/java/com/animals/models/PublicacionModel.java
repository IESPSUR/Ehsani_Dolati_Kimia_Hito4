package com.animals.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Table(name= "publicaciones")
@Data
@Entity(name="publicaciones")
public class PublicacionModel {
	
	@Id
	private int id;
	@Column
	private String cabecera;
	@Column
	private String foto;
	@Column
	private String contenido;
	@Column
	private String tipo;
	@ManyToOne
    @JoinColumn(name = "nombreUsuario",foreignKey = @ForeignKey(name="USUARIO_ID_FK"))
	private UsuarioModel nombreUsuario;
	
	public PublicacionModel copyData(PublicacionModel newPost) {
		this.id=newPost.id;
		this.cabecera=newPost.cabecera;
		this.foto=newPost.foto;
		this.contenido=newPost.contenido;
		this.nombreUsuario=newPost.nombreUsuario;
		return this;

		
	}


}
