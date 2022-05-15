package com.animals.models;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;

@Table(name= "seguimiento")
@Data
@Entity(name="seguimiento")
public class SeguimientoModel {
	
	@ManyToOne
    @JoinColumn(name = "nombreUsuario1",foreignKey = @ForeignKey(name="USUARIO_ID_FK"))
	private UsuarioModel nombreUsuario1;
	@ManyToOne
    @JoinColumn(name = "nombreUsuario2",foreignKey = @ForeignKey(name="USUARIO_ID2_FK"))
	private UsuarioModel nombreUsuario2;

	@Id
	private String fecha = dataformatter() ;
	
	private String dataformatter(){
		Date now = new Date();
		String pattern = "yyyy-MM-dd H:m:s";
		SimpleDateFormat formatter = new SimpleDateFormat(pattern);
		return formatter.format(now);

	}


}
