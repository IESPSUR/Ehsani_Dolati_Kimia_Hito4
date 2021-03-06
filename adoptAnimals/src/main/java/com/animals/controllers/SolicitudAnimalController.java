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

import com.animals.DAO.SolicitudAnimalDAO;
import com.animals.models.AnimalModel;
import com.animals.models.SolicitudAnimalModel;

@RestController
public class SolicitudAnimalController {
	@Autowired
	SolicitudAnimalDAO requestDao;

	@GetMapping("/listarSolicitudes")
	@ResponseBody
	public List<SolicitudAnimalModel> listarSolicitudes() {
		List<SolicitudAnimalModel> lista=  requestDao.getAllForAdmin();
		return lista;
	}

	@GetMapping("/listarSolicitudesDeUnUsuario/{nombreUsuario}")
	@ResponseBody
	public List<SolicitudAnimalModel> listarSolicitudesDeUnUsuario(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario == "") {
			throw new NotFoundException();
		}
		return requestDao.getSolicitudesDeUnUsuario(nombreUsuario);
	}
	

	@DeleteMapping("/borrarSolicitudAnimal/{nombreUsuario}/{animalesDNI}/{fecha}")
	@ResponseBody
	public void borrarSolicitud(@PathVariable String nombreUsuario , @PathVariable String animalesDNI, @PathVariable String fecha ) throws NotFoundException {
		if (nombreUsuario == "" || animalesDNI == "" || fecha == "" ) {
			throw new NotFoundException();
		}
		requestDao.delete(nombreUsuario,animalesDNI,fecha);
	}

	@DeleteMapping("/borrarSolicitudAnimalUsu/{nombreUsuario}")
	@ResponseBody
	public void borrarSolicitudAnimalUsu(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario == ""  ) {
			throw new NotFoundException();
		}
		requestDao.deleteByUsu(nombreUsuario);
	}
	
	@PostMapping("/crearSolicitud")
	@ResponseBody
	public void crearSolicitud(@RequestBody SolicitudAnimalModel requestAnimal) {
		requestAnimal.setDeleted("0");
		requestAnimal.setEstado("pendiente");
		requestDao.create(requestAnimal);
	}
	
	@PutMapping("/responderSolicitud/{respuesta}")
	@ResponseBody
	public void responderSolicitud(@PathVariable String respuesta , @RequestBody SolicitudAnimalModel solicitud ) throws NotFoundException {
		if (respuesta == "" ) {
			throw new NotFoundException();
		}
		requestDao.responderSolicitud(respuesta, solicitud);
	}
	
	
	@GetMapping("/listarAnimalesAceptados/")
	@ResponseBody
	public List<SolicitudAnimalModel> listarAnimal() {
		return requestDao.getAcceptedAnimals();
	}

}
