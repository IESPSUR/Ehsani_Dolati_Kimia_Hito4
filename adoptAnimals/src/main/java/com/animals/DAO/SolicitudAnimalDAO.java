package com.animals.DAO;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.animals.models.AnimalModel;
import com.animals.models.SeguimientoModel;
import com.animals.models.SolicitudAnimalModel;

@Repository
@Transactional
public class SolicitudAnimalDAO {

	@Autowired
	PublicacionDAO pubDAO;
	@Autowired
	AnimalDAO animalDAO;

	@PersistenceContext
	private EntityManager entityManager;

	public void create(SolicitudAnimalModel request) {
		entityManager.persist(request);
	}

	@SuppressWarnings("unchecked")
	public List<SolicitudAnimalModel> getAll() {
		Session session = entityManager.unwrap(Session.class);
        Filter filter = session.enableFilter("deletedPostFilter");
        filter.setParameter("isDeleted", "0");
        List<SolicitudAnimalModel> lista =(List<SolicitudAnimalModel>) entityManager.createQuery(" from solicitudAnimal").getResultList();
        session.disableFilter("deletedPostFilter");
		return lista;
	}
	
	@SuppressWarnings("unchecked")
	public List<SolicitudAnimalModel> getAllForAdmin() {
		return entityManager.createQuery(" from solicitudAnimal where deleted ='0'").getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<SolicitudAnimalModel> getSolicitudesDeUnUsuario(String nombreUsuario) {
		Session session = entityManager.unwrap(Session.class);
        Filter filter = session.enableFilter("deletedPostFilter");
        filter.setParameter("isDeleted", "0");
        List<SolicitudAnimalModel> lista = (List<SolicitudAnimalModel>) entityManager.createQuery(" from solicitudAnimal s where s.animalesDNI in ("
				+ "select a.DNI from usuarios u , publicaciones p , animales a where u.nombreUsuario = p.nombreUsuario and p.id = a.publicaciones_id and u.nombreUsuario= '"
				+ nombreUsuario + "'" + "and estado='pendiente')").getResultList();
        session.disableFilter("deletedPostFilter");
		return lista;
	}

	@SuppressWarnings("unchecked")
	public List<SolicitudAnimalModel> getSolicitud(String nombreUsuario, String animalesDNI, String fecha) {
		Session session = entityManager.unwrap(Session.class);
        Filter filter = session.enableFilter("deletedPostFilter");
        filter.setParameter("isDeleted", "0");
        List<SolicitudAnimalModel> lista = (List<SolicitudAnimalModel>) entityManager.createQuery(" from solicitudAnimal WHERE nombreUsuario = '"
				+ nombreUsuario + "' and animalesDNI= '" + animalesDNI + "' and fecha= '" + fecha + "'")
				.getResultList();
        session.disableFilter("deletedPostFilter");
		return lista;
	}

	public void delete(String nombreUsuario, String animalesDNI, String fecha) {
		if (getSolicitud(nombreUsuario, animalesDNI, fecha).size() > 0) {
			entityManager.createNativeQuery(
					"UPDATE solicitudAnimal SET deleted=true,estado='rechazada' WHERE nombreUsuario = '" + nombreUsuario
							+ "' and animalesDNI= '" + animalesDNI + "' and fecha= '" + fecha + "'")
					.executeUpdate();
		}

	}
	
	public void deleteByUsu(String nombreUsuario) {
			entityManager.createNativeQuery(
					"UPDATE solicitudAnimal SET deleted=true WHERE nombreUsuario = '" + nombreUsuario
							+ "'")
					.executeUpdate();
		

	}

	public void responderSolicitud(String respuesta, SolicitudAnimalModel solicitud) {
		if (getSolicitud(solicitud.getNombreUsuario().getNombreUsuario(), solicitud.getAnimalesDNI().getDNI(),
				solicitud.getFecha()).size() > 0) {
			if (respuesta.equals("yes")) {
				respuesta = "aceptada";
				entityManager
						.createNativeQuery("update solicitudAnimal set estado ='" + respuesta
								+ "' , deleted=1 where nombreUsuario ='"
								+ solicitud.getNombreUsuario().getNombreUsuario() + "' and animalesDNI ='"
								+ solicitud.getAnimalesDNI().getDNI() + "' and fecha ='" + solicitud.getFecha() + "';")
						.executeUpdate();

				pubDAO.delete(pubDAO.getById(
						animalDAO.getAnimalByDNI(solicitud.getAnimalesDNI().getDNI()).getPublicaciones_id().getId()));

			} else {
				respuesta = "rechazada";
				entityManager.createNativeQuery(
						"update solicitudAnimal set estado ='" + respuesta + "' where nombreUsuario ='"
								+ solicitud.getNombreUsuario().getNombreUsuario() + "' and animalesDNI ='"
								+ solicitud.getAnimalesDNI().getDNI() + "' and fecha ='" + solicitud.getFecha() + "';")
						.executeUpdate();

			}
		}

		
	}
	@SuppressWarnings("unchecked")
	public List<SolicitudAnimalModel> getAcceptedAnimals() {
		Session session = entityManager.unwrap(Session.class);
        Filter filter = session.enableFilter("deletedPostFilter");
        filter.setParameter("isDeleted", "1");
        List<SolicitudAnimalModel> lista=  (List<SolicitudAnimalModel>) entityManager.createQuery(
				" from solicitudAnimal s where estado = 'aceptada'")
				.getResultList();
		session.disableFilter("deletedPostFilter");
		return lista;
		/*return (List<AnimalModel>) entityManager.createQuery(
				" from publicaciones p , solicitudAnimal s, animales a where p.id=a.publicaciones_id and s.animalesDNI = a.DNI and p.nombreUsuario = '"
						+ nombreUsuario + "' and estado = 'aceptada' and p.deleted = '1' and s.deleted = '1'")
				.getResultList();*/

	}
}
