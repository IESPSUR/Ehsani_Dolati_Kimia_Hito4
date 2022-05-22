package com.animals.models;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name= "chat")
@Entity(name="chat")
public class ChatModel {
	@ManyToOne
    @JoinColumn(name = "usuarioOrigen",foreignKey = @ForeignKey(name="USUARIO_ID_ORIGEN_FK"))
	private UsuarioModel usuarioOrigen;
	@ManyToOne
    @JoinColumn(name = "usuarioDestinatario",foreignKey = @ForeignKey(name="USUARIO_ID_DEST_FK"))
	private UsuarioModel usuarioDestinatario;
	@Column
	private String mensaje;
	@Id
	private String fecha= dataformatter() ;
	
	private String dataformatter(){
		Date now = new Date();
		String pattern = "yyyy-MM-dd H:m:s";
		SimpleDateFormat formatter = new SimpleDateFormat(pattern);
		return formatter.format(now);

	}

}
