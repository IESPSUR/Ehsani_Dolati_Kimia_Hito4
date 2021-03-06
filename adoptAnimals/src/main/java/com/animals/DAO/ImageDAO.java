package com.animals.DAO;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.animals.models.ComentarioModel;
import com.animals.models.SolicitudAnimalModel;

@Repository
@Transactional
public class ImageDAO {

	 @PersistenceContext
	 private EntityManager entityManager ;

	   public void create(ComentarioModel comment) {
	         entityManager.persist(comment);
	    }
	
	   
	    @SuppressWarnings("unchecked")
		public List<ComentarioModel> getAll() {
	    	return (List<ComentarioModel>) entityManager.createQuery(" from comentarios").getResultList();
	    }
	   
	   public ComentarioModel getById(int id) {
	        return entityManager.find(ComentarioModel.class, id);
	    }
	   
	   @SuppressWarnings("unchecked")
	   public List<ComentarioModel> getByIdPublicacion(int id) {
		   return (List<ComentarioModel>) entityManager.createQuery(" from comentarios where publicaciones_id = "+id).getResultList();
	    }
	   

	    public void delete(ComentarioModel comment) {
	        if (entityManager.contains(comment))
	            entityManager.remove(comment);
	        else
	            entityManager.remove(entityManager.merge(comment));
	    }
}
