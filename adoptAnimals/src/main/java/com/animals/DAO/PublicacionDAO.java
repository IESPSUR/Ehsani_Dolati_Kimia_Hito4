package com.animals.DAO;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import org.springframework.stereotype.Repository;

import com.animals.models.ComentarioModel;
import com.animals.models.PublicacionModel;

@Repository
@Transactional
public class PublicacionDAO {

	@PersistenceContext
	private EntityManager entityManager;

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
	
	public void deletePostsUsu(String nombreUsu) {
		entityManager.createNativeQuery("update publicaciones set deleted=true where nombreUsuario= '"+nombreUsu+"'").executeUpdate();
	}

	@SuppressWarnings("unchecked")
	public List<PublicacionModel> getPostsFotosFollowings(String nombreUsuario) {
		return (List<PublicacionModel>) entityManager.createQuery(
				" from publicaciones where nombreUsuario in (select nombreUsuario2 from seguimiento where nombreUsuario1='"
						+ nombreUsuario + "')")
				.getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<PublicacionModel> getAdminPosts() {
		return (List<PublicacionModel>) entityManager.createQuery(
				" from publicaciones where nombreUsuario in (select nombreUsuario from usuarios where tipo='admin')")
				.getResultList();
	}

	public PublicacionModel getAnimalInfo(String DNIAnimal) {
		return (PublicacionModel) entityManager
				.createQuery(" from publicaciones where id = (select publicaciones_id from animales where DNI = '"
						+ DNIAnimal + "')")
				.getResultList().get(0);
	}

	@SuppressWarnings("unchecked")
	public List<PublicacionModel> getUserPosts(String nombreUsuario) {
		return (List<PublicacionModel>) entityManager
				.createQuery(" from publicaciones where nombreUsuario ='" + nombreUsuario + "'").getResultList();

	}

	public void updatePhotoPostById(String foto, int id) {
		entityManager.createNativeQuery("update publicaciones set foto= '" + foto + "' where id =" + id)
				.executeUpdate();
	}
	
	
	public int getRowNumber() {
		return Integer.parseInt(entityManager.createNativeQuery("select count(*) from publicaciones;")
				.getResultList().get(0).toString());

	}

}
