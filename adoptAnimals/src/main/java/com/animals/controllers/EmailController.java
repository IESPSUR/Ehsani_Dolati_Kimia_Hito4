package com.animals.controllers;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import javax.mail.internet.MimeMessage;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.context.Context;

import com.animals.DAO.AnimalDAO;
import com.animals.DAO.PublicacionDAO;
import com.animals.DTO.DeleteUserInformEmail;
import com.animals.DTO.SolicitudAnimalEmailModel;
import com.animals.DTO.contactModel;
import com.animals.models.AnimalModel;
import com.animals.models.ComentarioModel;

@RestController
public class EmailController {
	@Autowired
	SpringTemplateEngine templateEngine;

	@Autowired
	private JavaMailSender sender;

	@PostMapping("/crearEnviarEmail")
	@ResponseBody
	public contactModel crearEnviarEmail(@RequestBody contactModel emailDetails) throws Exception {

		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
				StandardCharsets.UTF_8.name());

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("nombre", emailDetails.getNombre());
		model.put("titulo", emailDetails.getTitulo());
		model.put("mensaje", emailDetails.getMensaje());
		model.put("correo", emailDetails.getCorreo());

		Context context = new Context();
		context.setVariables(model);
		String html = templateEngine.process("contactEmail", context);

		try {
			helper.setTo("kimia.ehsani.dolati.al@iespoligonosur.org");
			helper.setText(html, true);
			helper.setSubject("Email contact from MyAdoption");
		} catch (javax.mail.MessagingException e) {
			e.printStackTrace();
		}
		sender.send(message);

		return emailDetails;

	}

	@PostMapping("/crearEnviarEmailRequest")
	@ResponseBody
	public SolicitudAnimalEmailModel crearEnviarEmailRequest(@RequestBody SolicitudAnimalEmailModel emailDetails)
			throws Exception {

		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
				StandardCharsets.UTF_8.name());

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("propietario", emailDetails.getPropietario());
		model.put("animalDNI", emailDetails.getDniAnimal());		
		if (emailDetails.getRespuesta().equals("yes")) {
			model.put("res", "accepted");
		} else {
			model.put("res", "rejected");

		}
		Context context = new Context();
		context.setVariables(model);
		String html = templateEngine.process("requestAnimalEmail", context);

		try {
			helper.setTo(emailDetails.getCorreoDeUsu());
			helper.setText(html, true);
			helper.setSubject("MyAdoption notifications");
		} catch (javax.mail.MessagingException e) {
			e.printStackTrace();
		}
		sender.send(message);

		return emailDetails;

	}
	
	
	@PostMapping("/crearEnviarEmailBorrarUsu")
	@ResponseBody
	public DeleteUserInformEmail crearEnviarEmailBorrarUsu(@RequestBody DeleteUserInformEmail emailDetails)
			throws Exception {

		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
				StandardCharsets.UTF_8.name());

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("nombreUsuario", emailDetails.getNombreUsuario());
		model.put("mensaje", emailDetails.getMensajeAdmin());		
		
		Context context = new Context();
		context.setVariables(model);
		String html = templateEngine.process("deleteUserInformEmail", context);

		try {
			helper.setTo(emailDetails.getCorreoDeUsu());
			helper.setText(html, true);
			helper.setSubject("MyAdoption notifications");
		} catch (javax.mail.MessagingException e) {
			e.printStackTrace();
		}
		sender.send(message);

		return emailDetails;

	}

}
