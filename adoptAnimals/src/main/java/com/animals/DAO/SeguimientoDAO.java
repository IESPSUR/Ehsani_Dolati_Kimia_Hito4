package com.animals.DAO;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.animals.models.SeguimientoModel;

@Repository
@Transactional
public class SeguimientoDAO {

	 @PersistenceContext
	 private EntityManager entityManager ;

	   public void create(SeguimientoModel follow) {
	         entityManager.persist(follow);
	    }
	
	   
	    @SuppressWarnings("unchecked")
		public List<SeguimientoModel> getAll() {
	    	return (List<SeguimientoModel>) entityManager.createQuery(" from seguimiento").getResultList();
	    }
	   
	    @SuppressWarnings("unchecked")
		public List<SeguimientoModel> getFollowings(String nombreUsuario1 ) {
	        return entityManager.createNativeQuery("select s.nombreUsuario2 from seguimiento s where s.nombreUsuario1 = '" + nombreUsuario1 + "'" ).getResultList();
	    }
	   
	   	@SuppressWarnings("unchecked")
		public List<SeguimientoModel> getFollowers(String nombreUsuario2 ) {
	       return entityManager.createNativeQuery("select s.nombreUsuario1 from seguimiento s where s.nombreUsuario2 = '" + nombreUsuario2 + "'").getResultList();
	    }
	   	
	    @SuppressWarnings("unchecked")
		public List<SeguimientoModel> getFollow(String nombreUsuario1 , String nombreUsuario2 ) {
	        return entityManager.createQuery(" from seguimiento where nombreUsuario1 = '"+nombreUsuario1 +"' and nombreUsuario2 = '" + nombreUsuario2+"'").getResultList();
	    }

	    public void delete(String nombreUsuario1 , String nombreUsuario2) {
	        if (getFollow(nombreUsuario1, nombreUsuario2).size()>0)
		    	 entityManager.	createQuery("delete from seguimiento where nombreUsuario1 = '"+nombreUsuario1 +"' and nombreUsuario2 = '" + nombreUsuario2+"'").executeUpdate();
	    }
}
