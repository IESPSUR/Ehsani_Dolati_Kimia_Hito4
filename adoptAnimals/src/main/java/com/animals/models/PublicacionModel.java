package com.animals.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name= "publicaciones")
@Data
@SQLDelete(sql = "UPDATE publicaciones SET deleted=true WHERE id = ?")
@Where(clause = "deleted = false")
@Entity(name="publicaciones")
@NoArgsConstructor
@AllArgsConstructor
public class PublicacionModel {
	
	public PublicacionModel(int id) {
		this.id= id;
	}
	
	
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
	@Column
	private String deleted;
	@ManyToOne
    @JoinColumn(name = "nombreUsuario",foreignKey = @ForeignKey(name="USUARIO_ID_FK"))
	private UsuarioModel nombreUsuario;
	
	public PublicacionModel copyData(PublicacionModel newPost) {
		if(newPost.id!=0) {
			this.id=newPost.id;
		}
		this.cabecera=newPost.cabecera;
		this.foto=newPost.foto;
		this.contenido=newPost.contenido;
		this.nombreUsuario=newPost.nombreUsuario;
		this.tipo=newPost.tipo;
		this.deleted="0";
		return this;

		
	}


}
