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
import com.animals.DAO.PublicacionDAO;
import com.animals.models.PublicacionModel;

@RestController
public class PublicacionController {
	@Autowired
	PublicacionDAO postDao;

	@GetMapping("/listarPublicaciones")
	@ResponseBody
	public List<PublicacionModel> listarPublicaciones() {
		return postDao.getAll();
	}

	@GetMapping("/listarPublicaciones/{id}")
	@ResponseBody
	public PublicacionModel listarPublicacion(@PathVariable int id) throws NotFoundException {
		if (id==0) {
			throw new NotFoundException();
		}
		return postDao.getById(id);
	}
	
	@GetMapping("/listarPublicacionesUsuario/{nombreUsuario}")
	@ResponseBody
	public List<PublicacionModel>  listarPublicacionesUsuario(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario=="") {
			throw new NotFoundException();
		}
		return postDao.getUserPosts(nombreUsuario);
	}

	@GetMapping("/listarAdminPosts/")
	@ResponseBody
	public List<PublicacionModel> getAdminPosts() throws NotFoundException {
		return postDao.getAdminPosts();
	}
	
	@DeleteMapping("/borrarPublicacion/{id}")
	@ResponseBody
	public void borrarPublicacion(@PathVariable int id) throws NotFoundException {
		if (id == 0) {
			throw new NotFoundException();
		}
		postDao.delete(postDao.getById(id));
	}

	@PutMapping("/editarPublicacion/{id}")
	@ResponseBody
	public void editarPublicacion(@PathVariable int id, @RequestBody PublicacionModel post)  {
		postDao.update(postDao.getById(id).copyData(post));
	}
	
	@PostMapping("/crearPublicacion")
	@ResponseBody
	public void crearPublicacion(@RequestBody PublicacionModel post) {
		postDao.create(post);
	}
	
	@GetMapping("/listarPostsFollowings/{nombreUsuario}")
	@ResponseBody
	public List<PublicacionModel> getPostsFollowings(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario=="") {
			throw new NotFoundException();
		}
		return postDao.getPostsFotosFollowings(nombreUsuario);
	}
	
	@GetMapping("/getAnimalInfo/{DNI}")
	@ResponseBody
	public PublicacionModel getAnimalInfo(@PathVariable String DNI) throws NotFoundException {
		if (DNI=="") {
			throw new NotFoundException();
		}
		return postDao.getAnimalInfo(DNI);
	}
	

}
