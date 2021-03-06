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
import com.animals.DAO.SeguimientoDAO;
import com.animals.models.SeguimientoModel;

@RestController
public class SeguimientoController {
	@Autowired
	SeguimientoDAO followDao;

	@GetMapping("/listarSeguimientos")
	@ResponseBody
	public List<SeguimientoModel> listarSeguimientos() {
		return followDao.getAll();
	}

	@GetMapping("/listarFollowings/{nombreUsuario}")
	@ResponseBody
	public List<SeguimientoModel> listarFollowings(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario == "") {
			throw new NotFoundException();
		}
		return followDao.getFollowings(nombreUsuario);
	}
	
	@GetMapping("/listarFollowers/{nombreUsuario}")
	@ResponseBody
	public List<SeguimientoModel> listarFollowers(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario == "") {
			throw new NotFoundException();
		}
		return followDao.getFollowers(nombreUsuario);
	}
	
	@GetMapping("/listarFollowersNotification/{nombreUsuario}")
	@ResponseBody
	public List<SeguimientoModel> listarFollowersNotification(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario == "") {
			throw new NotFoundException();
		}
		return followDao.getFollowersNotification(nombreUsuario);
	}

	@DeleteMapping("/borrarSeguimiento/{nombreUsuario1}/{nombreUsuario2}")
	@ResponseBody
	public void borrarSeguimiento(@PathVariable String nombreUsuario1 , @PathVariable String nombreUsuario2 ) throws NotFoundException {
		if (nombreUsuario1 == "" || nombreUsuario2 == "" ) {
			throw new NotFoundException();
		}
		followDao.delete(nombreUsuario1,nombreUsuario2);
	}

	
	@PostMapping("/crearSeguimiento")
	@ResponseBody
	public void crearSeguimiento(@RequestBody SeguimientoModel follow) {
		followDao.create(follow);
	}

}
