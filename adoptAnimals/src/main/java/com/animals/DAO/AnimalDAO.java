package com.animals.DAO;


import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.animals.models.AnimalModel;



@Repository
@Transactional
public class AnimalDAO {

	 @PersistenceContext
	 private EntityManager entityManager ;

	public AnimalModel getAnimalPost(int id) {
		   return (AnimalModel) entityManager.createQuery(" from animales where publicaciones_id = "+id).getResultList().get(0);
	}

	  
}
