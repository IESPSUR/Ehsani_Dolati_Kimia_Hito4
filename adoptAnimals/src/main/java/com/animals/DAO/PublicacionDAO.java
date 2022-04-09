package com.animals.DAO;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import org.springframework.stereotype.Repository;
import com.animals.models.PublicacionModel;

@Repository
@Transactional
public class PublicacionDAO {

	 @PersistenceContext
	 private EntityManager entityManager ;

	   public void create(PublicacionModel post) {
	         entityManager.persist(post);
	    }
	
	   
	    @SuppressWarnings("unchecked")
		public List<PublicacionModel> getAll() {
	    	return (List<PublicacionModel>) entityManager.createQuery(" from publicaciones").getResultList();
	    }
	   
	   public PublicacionModel getById(int id) {
	        return entityManager.find(PublicacionModel.class, id);
	    }
	   
	   public void update(PublicacionModel post) {
	        entityManager.merge(post);
	    }

	    public void delete(PublicacionModel post) {
	        if (entityManager.contains(post))
	            entityManager.remove(post);
	        else
	            entityManager.remove(entityManager.merge(post));
	    }
}
