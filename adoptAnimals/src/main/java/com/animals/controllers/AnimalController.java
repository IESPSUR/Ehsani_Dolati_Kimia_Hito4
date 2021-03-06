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

import com.animals.DAO.AnimalDAO;
import com.animals.DAO.PublicacionDAO;
import com.animals.models.AnimalModel;
import com.animals.models.ComentarioModel;


@RestController
public class AnimalController {
	@Autowired
	AnimalDAO animalDao;
	@Autowired
	PublicacionDAO postDao;
	@GetMapping("/listarAnimal/{id}")
	@ResponseBody
	public AnimalModel listarAnimal(@PathVariable int id ) {
		return animalDao.getAnimalPost(id);
	}
	
	@PostMapping("/createAnimal")
	@ResponseBody
	public AnimalModel createAnimal( @RequestBody AnimalModel animal ) {
		animal.setDeleted("0");
		if(animal.getPublicaciones_id()==null) {
			animal.setPublicaciones_id(postDao.getById(postDao.getRowNumber()));
		}
		return animalDao.create(animal);
	}
	
	@PutMapping("/updateAnimal/{id}")
	@ResponseBody
	public void updateAnimal(@PathVariable int id , @RequestBody AnimalModel animal) {
		 animalDao.update(animalDao.getAnimalPost(id).copyData(animal));
	}

	
	@DeleteMapping("/deleteAnimal/{dni}")
	@ResponseBody
	public void borrarPublicacion(@PathVariable String dni) throws NotFoundException {
		if (dni.equals("")) {
			throw new NotFoundException();
		}
		animalDao.delete(animalDao.getAnimalByDNI(dni));
	}
}
