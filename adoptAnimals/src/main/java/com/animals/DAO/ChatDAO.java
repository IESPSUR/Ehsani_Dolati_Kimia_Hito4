package com.animals.DAO;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.animals.models.AnimalModel;
import com.animals.models.ChatModel;
import com.animals.models.PublicacionModel;
import com.animals.models.UsuarioModel;

@Repository
@Transactional
public class ChatDAO {

	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public List<ChatModel> getChatRoom(String user1, String user2) {
		return (List<ChatModel>) entityManager.createQuery(" from chat where (usuarioOrigen = '" + user1 + "' or usuarioOrigen= '" + user2 + "') and (usuarioDestinatario= '" + user1 + "' or usuarioDestinatario='" + user2 + "') order by fecha" ).getResultList();
	}

	public ChatModel create(ChatModel mensaje) {
		entityManager.persist(mensaje);
		return mensaje;
	}

	@SuppressWarnings("unchecked")
	public List<ChatModel> getChatRooms(String user) {
		return (List<ChatModel>) entityManager.createQuery(" from chat where usuarioOrigen = '" + user + "' or usuarioDestinatario= '" + user + "' " ).getResultList();
	}

}
