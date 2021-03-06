package com.animals.DAO;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import org.springframework.stereotype.Repository;
import com.animals.models.PublicacionModel;
import com.animals.models.UsuarioModel;

@Repository
@Transactional
public class UsuarioDAO {

	 @PersistenceContext
	 private EntityManager entityManager ;

	   public UsuarioModel create(UsuarioModel user) {
	         entityManager.persist(user);
	         return user;
	    }
	   
	   @SuppressWarnings("unchecked")
		public List<UsuarioModel> getAllForAdmin() {
	    	return (List<UsuarioModel>) entityManager.createQuery(" from usuarios where tipo != 'admin'").getResultList();
	    }
	   
	    @SuppressWarnings("unchecked")
		public List<UsuarioModel> getAll() {
	    	return (List<UsuarioModel>) entityManager.createQuery(" from usuarios").getResultList();
	    }
	   
	   public UsuarioModel getByNombreUsuario(String nombreUsuario) {
	        return entityManager.find(UsuarioModel.class, nombreUsuario);
	    }
	  
	   
	   public UsuarioModel update(UsuarioModel user) {
	        return entityManager.merge(user);
	    }

	    public void delete(UsuarioModel user) {
	        if (entityManager.contains(user))
	            entityManager.remove(user);
	        else
	            entityManager.remove(entityManager.merge(user));
	    }
	    
	   /* @SuppressWarnings("unchecked")
		public List<UsuarioModel> getFotoFollowings(String nombreUsuario) {
			   return (List<UsuarioModel>) entityManager.createQuery(" from seguimiento s, usuarios u where s.nombreUsuario1 = u.nombreUsuario and s.nombreUsuario1="+nombreUsuario).getResultList();
	    }*/
	    
	    
}
