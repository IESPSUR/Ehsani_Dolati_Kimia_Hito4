package com.animals.controllers;

import java.util.List;

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

import com.animals.DAO.UsuarioDAO;
import com.animals.models.UsuarioModel;

@RestController
public class UsuarioController {
	@Autowired
	UsuarioDAO userDao;

	@GetMapping("/listarUsuarios")
	@ResponseBody
	public List<UsuarioModel> listarUsuarios() {
		return userDao.getAll();
	}

	@GetMapping("/listarUsuarios/{nombreUsuario}")
	@ResponseBody
	public UsuarioModel listarUsuario(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario == "") {
			throw new NotFoundException();
		}
		return userDao.getByNombreUsuario(nombreUsuario);
	}

	@DeleteMapping("/borrarUsuario/{nombreUsuario}")
	@ResponseBody
	public void borrarUsuario(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario == "") {
			throw new NotFoundException();
		}
		userDao.delete(userDao.getByNombreUsuario(nombreUsuario));
	}

	@PutMapping("/editarUsuario/{nombreUsuario}")
	@ResponseBody
	public void editarUsuario(@PathVariable String nombreUsuario, @RequestBody UsuarioModel user)  {
		
		userDao.update(userDao.getByNombreUsuario(nombreUsuario).copyData(user));
	}
	
	@PostMapping("/crearUsuario")
	@ResponseBody
	public void crearUsuario(@RequestBody UsuarioModel user) {
		userDao.create(user);
	}

}
