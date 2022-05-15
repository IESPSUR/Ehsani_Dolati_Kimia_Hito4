package com.animals.models;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@SQLDelete(sql = "UPDATE animales SET deleted=true WHERE DNI = ?")
@Where(clause = "deleted = false")
@Table(name= "animales")
@Data
@Entity(name="animales")
@NoArgsConstructor
@AllArgsConstructor
public class AnimalModel {
	
	public AnimalModel(String DNI) {
		this.DNI= DNI;
	}
	public AnimalModel(String DNI,PublicacionModel publicaciones_id) {
		this.DNI= DNI;
		this.publicaciones_id= publicaciones_id;
	}
	@Id
	@Column(name = "DNI")
	private String DNI;
	@Column
	private Date fechaNacimiento;
	@Column
	private String nombre;
	@Column
	private String raza;
	@Column
	private String sexo;
	@Column
	private String ubicacion;
	@ManyToOne
    @JoinColumn(name = "publicaciones_id",foreignKey = @ForeignKey(name="PUBLICACION_ID_FK"))
	private PublicacionModel publicaciones_id;
	@Column
	private String deleted;

	public String getDNI() {
		return this.DNI;
	}
	

	public AnimalModel copyData(AnimalModel newAnimal) {
		this.publicaciones_id= newAnimal.publicaciones_id;
		this.DNI=newAnimal.DNI;
		this.fechaNacimiento=newAnimal.fechaNacimiento;
		this.ubicacion=newAnimal.ubicacion;
		this.nombre=newAnimal.nombre;
		this.raza=newAnimal.raza;
		this.sexo=newAnimal.sexo;
		this.deleted="0";
		return this;

		
	}

}
