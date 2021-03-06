package com.animals.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.animals.DAO.ComentarioDAO;
import com.animals.models.ComentarioModel;

@RestController
public class ComentarioController {
	@Autowired
	ComentarioDAO commentDao;

	@GetMapping("/listarComentarios")
	@ResponseBody
	public List<ComentarioModel> listarComentarios() {
		return commentDao.getAll();
	}

	@GetMapping("/listarComentarios/{id}")
	@ResponseBody
	public ComentarioModel listarComentario(@PathVariable int id) throws NotFoundException {
		if (id==0) {
			throw new NotFoundException();
		}
		return commentDao.getById(id);
	}
	
	@GetMapping("/listarComentariosPorPublicacion/{id}")
	@ResponseBody
	public List<ComentarioModel> listarComentariosPorPublicacion(@PathVariable int id) throws NotFoundException {
		if (id==0) {
			throw new NotFoundException();
		}
		return commentDao.getByIdPublicacion(id);
	}

	@DeleteMapping("/borrarComentario/{id}")
	@ResponseBody
	public void borrarComentario(@PathVariable int id) throws NotFoundException {
		if (id == 0) {
			throw new NotFoundException();
		}
		commentDao.delete(commentDao.getById(id));
	}

	
	@PostMapping("/crearComentario")
	@ResponseBody
	public ComentarioModel crearComentario(@RequestBody ComentarioModel comment) {
		return commentDao.create(comment);
	}

}
