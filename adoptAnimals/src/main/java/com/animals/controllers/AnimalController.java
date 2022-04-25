package com.animals.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.animals.DAO.AnimalDAO;
import com.animals.models.AnimalModel;


@RestController
public class AnimalController {
	@Autowired
	AnimalDAO animalDao;
	
	@GetMapping("/listarAnimal/{id}")
	@ResponseBody
	public AnimalModel listarAnimal(@PathVariable int id ) {
		return animalDao.getAnimalPost(id);
	}
}
