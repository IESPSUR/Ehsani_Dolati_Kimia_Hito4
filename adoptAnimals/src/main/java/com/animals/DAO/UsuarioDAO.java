package com.animals.DAO;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

import com.animals.models.UsuarioModel;

@Repository
@Transactional
public class UsuarioDAO {

	 @PersistenceContext
	 private EntityManager entityManager ;

	   public void create(UsuarioModel user) {
	         entityManager.persist(user);
	    }
	
	   
	    @SuppressWarnings("unchecked")
		public List<UsuarioModel> getAll() {
	    	return (List<UsuarioModel>) entityManager.createQuery(" from usuarios").getResultList();
	    }
	   
	   public UsuarioModel getByNombreUsuario(String nombreUsuario) {
	        return entityManager.find(UsuarioModel.class, nombreUsuario);
	    }
	   
	   public void update(UsuarioModel user) {
	        entityManager.merge(user);
	    }

	    public void delete(UsuarioModel user) {
	        if (entityManager.contains(user))
	            entityManager.remove(user);
	        else
	            entityManager.remove(entityManager.merge(user));
	    }
}