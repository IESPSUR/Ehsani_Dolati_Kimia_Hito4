package com.animals.models;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name= "usuarios")
@SQLDelete(sql = "UPDATE usuarios SET deleted=true WHERE nombreUsuario = ?")
@Where(clause = "deleted = false")
@Data
@Entity(name="usuarios")
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioModel {
	
	public UsuarioModel(String nombreUsuario) {
		this.nombreUsuario= nombreUsuario;
	}
	
	@Id
	private String nombreUsuario;
	@Column(name= "DNI")
	private String dni;
	@Column(name= "contraseña")
	private String contrasenia;
	@Column
	private String nombre;
	@Column
	private String apellido;
	@Column
	private String correo;
	@Column
	private Date fechaNacimiento;
	@Column
	private String foto;
	@Column
	private String tipo;
	@Column
	private String deleted;


	public UsuarioModel copyData(UsuarioModel newUser) {
		this.apellido=newUser.apellido;
		this.dni=newUser.dni;
		this.nombreUsuario=newUser.nombreUsuario;
		this.contrasenia=newUser.contrasenia;
		this.nombre=newUser.nombre;
		this.correo=newUser.correo;
		this.fechaNacimiento=newUser.fechaNacimiento;
		this.foto=newUser.foto;
		this.tipo=newUser.tipo;
		this.deleted=newUser.deleted;
		return this;

		
	}


}
