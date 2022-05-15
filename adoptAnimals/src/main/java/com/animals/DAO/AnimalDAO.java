package com.animals.DAO;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.animals.models.AnimalModel;
import com.animals.models.PublicacionModel;
import com.animals.models.UsuarioModel;

@Repository
@Transactional
public class AnimalDAO {

	@PersistenceContext
	private EntityManager entityManager;

	public AnimalModel getAnimalPost(int id) {
		return (AnimalModel) entityManager.createQuery(" from animales where publicaciones_id = " + id).getResultList()
				.get(0);
	}

	public AnimalModel getAnimalByDNI(String dni) {
		return entityManager.find(AnimalModel.class, dni);
	}

	public AnimalModel create(AnimalModel animal) {
		entityManager.persist(animal);
		return animal;
	}

	public void update(AnimalModel animal) {
		entityManager.merge(animal);
	}

	public void delete(AnimalModel animal) {
		if (entityManager.contains(animal))
			entityManager.remove(animal);
		else
			entityManager.remove(entityManager.merge(animal));
	}

}
