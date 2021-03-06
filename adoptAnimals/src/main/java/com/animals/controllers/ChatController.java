package com.animals.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.animals.DAO.ChatDAO;
import com.animals.models.ChatModel;
import com.animals.models.ComentarioModel;



@RestController
public class ChatController {

	@Autowired 
	ChatDAO chatDao;
    @MessageMapping("/resume")
    @SendTo("/start/initial")
    public String chat(ChatModel msg) {
        System.out.println(msg.getUsuarioOrigen());
        System.out.println(msg.getUsuarioDestinatario());
        chatDao.create(msg);
        return msg.getUsuarioOrigen().getNombreUsuario() +","+ msg.getUsuarioDestinatario().getNombreUsuario() +","+ msg.getMensaje() +","+ msg.getFecha();
    }
    
    
    @GetMapping("/listarUsuarioChatRooms/{nombreUsuario}")
	@ResponseBody
	public List<ChatModel> listarUsuarioChatRooms(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario.equals("")) {
			throw new NotFoundException();
		}
		return chatDao.getChatRooms(nombreUsuario);
	}
    
    @GetMapping("/listarMensajesChatRoom/{nombreUsuario1}/{nombreUsuario2}")
	@ResponseBody
	public List<ChatModel> listarComentario(@PathVariable String nombreUsuario1,@PathVariable String nombreUsuario2) throws NotFoundException {
		if (nombreUsuario1.equals("")||nombreUsuario2.equals("")) {
			throw new NotFoundException();
		}
		return chatDao.getChatRoom(nombreUsuario1,nombreUsuario2);
	}
    
    @PostMapping("/crearChatRoom/")
	@ResponseBody
	public ChatModel listarComentario(@RequestBody ChatModel chat) throws NotFoundException {
		return chatDao.create(chat);
	}
}