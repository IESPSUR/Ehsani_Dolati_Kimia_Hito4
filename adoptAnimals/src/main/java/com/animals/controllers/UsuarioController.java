package com.animals.controllers;


import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import javax.xml.bind.DatatypeConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.animals.DAO.PublicacionDAO;
import com.animals.DAO.UsuarioDAO;
import com.animals.models.UsuarioModel;

@RestController
public class UsuarioController {
	@Autowired
	UsuarioDAO userDao;
	

	@GetMapping("/listarUsuarios")
	@ResponseBody
	public List<UsuarioModel> listarUsuarios() {
		return userDao.getAllForAdmin();
	}
	
	@GetMapping("/listarUsuarios/{nombreUsuario}")
	@ResponseBody
	public UsuarioModel listarUsuario(@PathVariable String nombreUsuario) {
		return userDao.getByNombreUsuario(nombreUsuario);
	}

	/**
	 * Consulta de login y comprueba la contraseña recibida del front
	 * @param user
	 * @return
	 * @throws NotFoundException
	 */
	@PostMapping("/getByNombreUsuarioIfCorrectPassAndExists")
	@ResponseBody
	public UsuarioModel getByNombreUsuarioIfCorrectPassAndExists(@RequestBody UsuarioModel user) throws NotFoundException {
		UsuarioModel usuarioEncontrado = userDao.getByNombreUsuario(user.getNombreUsuario());
		String hashPass="";
		try {
			//Convirtiendo la contraseña recibida del front en hash MD5 para 
			//comparar con la contraseña existente en la base de datos
			MessageDigest md = MessageDigest.getInstance("MD5");
		    md.update(user.getContrasenia().getBytes());
		    byte[] digest = md.digest();
		    hashPass = DatatypeConverter
		      .printHexBinary(digest).toUpperCase();
		        
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if(usuarioEncontrado!=null && hashPass.equals(usuarioEncontrado.getContrasenia().toUpperCase())) {
			return usuarioEncontrado;
		}else {
			return null;
		}
	}

	@DeleteMapping("/borrarUsuarios/{nombreUsuario}")
	@ResponseBody
	public void borrarUsuario(@PathVariable String nombreUsuario) throws NotFoundException {
		if (nombreUsuario == "") {
			throw new NotFoundException();
		}
		userDao.delete(userDao.getByNombreUsuario(nombreUsuario));
		
	}

	@PutMapping("/editarUsuario/{nombreUsuario}")
	@ResponseBody
	public UsuarioModel editarUsuario(@PathVariable String nombreUsuario, @RequestBody UsuarioModel user)  {
		if(user.getNombreUsuario()=="") {
			userDao.getByNombreUsuario(nombreUsuario).setFoto(user.getFoto());
			return userDao.update(userDao.getByNombreUsuario(nombreUsuario));
		}else {
			return userDao.update(userDao.getByNombreUsuario(nombreUsuario).copyData(user));
		}
	}
	
	@PostMapping("/crearUsuario")
	@ResponseBody
	public UsuarioModel crearUsuario(@RequestBody UsuarioModel user) {
		try {
			//Convirtiendo la contraseña recibida del front en hash MD5 para 
			//comparar con la contraseña existente en la base de datos
			MessageDigest md = MessageDigest.getInstance("MD5");
		    md.update(user.getContrasenia().getBytes());
		    byte[] digest = md.digest();
		    user.setContrasenia(DatatypeConverter
				      .printHexBinary(digest).toUpperCase());
		        
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return userDao.create(user);
	}
	
	


}
