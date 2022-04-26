package com.animals.models;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Where;

import lombok.Data;

@Where(clause = "deleted = false")
@Table(name= "solicitudAnimal")
@Data
@Entity(name="solicitudAnimal")
public class SolicitudAnimalModel {
	
	@ManyToOne
    @JoinColumn(name = "animalesDNI",foreignKey = @ForeignKey(name="ANIMAL_ID_FK"))
	private AnimalModel animalesDNI;
	@ManyToOne
    @JoinColumn(name = "nombreUsuario",foreignKey = @ForeignKey(name="USUARIO_ID_FK"))
	private UsuarioModel nombreUsuario;
	
	@Id
	private String fecha = dataformatter();
	@Column
	private String estado;
	@Column
	private String deleted;

	private String dataformatter(){
		Date now = new Date();
		String pattern = "yyyy-MM-dd H:m:s";
		SimpleDateFormat formatter = new SimpleDateFormat(pattern);
		return formatter.format(now);

	}

}
