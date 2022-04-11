package com.animals.models;

import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Table(name= "seguimiento")
@Data
@Entity(name="seguimiento")
public class SeguimientoModel {
	
	@ManyToOne
    @JoinColumn(name = "nombreUsuario1",foreignKey = @ForeignKey(name="USUARIO_ID_FK"))
	private UsuarioModel nombreUsuario1;
	@ManyToOne
    @JoinColumn(name = "nombreUsuario2",foreignKey = @ForeignKey(name="USUARIO_ID_FK"))
	private UsuarioModel nombreUsuario2;
	@Id
	private String fecha;


}
