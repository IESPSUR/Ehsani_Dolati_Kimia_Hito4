package com.animals.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.animals.DAO.PublicacionDAO;
import com.animals.DAO.UsuarioDAO;
import com.animals.models.PublicacionModel;
import com.animals.models.UsuarioModel;
import com.animals.services.StorageService;

import responses.ServeFileResponse;

@RestController
public class ImageController {

	@Autowired
	UsuarioDAO userDao;
	@Autowired
	PublicacionDAO postDao;
	private final StorageService storageService;

	@Autowired
	public ImageController(StorageService storageService) {
		this.storageService = storageService;
	}

	/*
	 * @GetMapping("/") public String listUploadedFiles(Model model) throws
	 * IOException {
	 * 
	 * model.addAttribute("files", storageService.loadAll().map( path ->
	 * MvcUriComponentsBuilder.fromMethodName(ImageController.class, "serveFile",
	 * path.getFileName().toString()).build().toUri().toString())
	 * .collect(Collectors.toList()));
	 * 
	 * return "uploadForm"; }
	 */

	@GetMapping("/get/image/{nombreUsuNumberPub:.+}")
	@ResponseBody
	public ResponseEntity<Resource> serveFile(@PathVariable String nombreUsuNumberPub) {
		Resource file = null;
		// Si la imagen es del pefil del usuario, sino (si es de una publicación)
		if (!Pattern.compile("^[0-9]+$").matcher(nombreUsuNumberPub).matches()) {
			file = storageService.loadAsResource(userDao.getByNombreUsuario(nombreUsuNumberPub).getFoto());
		} else {
			file = storageService.loadAsResource(postDao.getById(Integer.parseInt(nombreUsuNumberPub)).getFoto());
		}
		ArrayList<String> tipoImagen = new ArrayList<String>();
		tipoImagen.add("image/png");

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.put("Content-Type", tipoImagen);
		List<Resource> lista = new ArrayList<Resource>();
		lista.add(file);
		lista.add(file);
		
		//ServeFileResponse response = new ServeFileResponse(0, nombreUsuNumberPub, null, null, null);
		//response.setList(lista);
		return ResponseEntity.ok().headers(httpHeaders).body(file);

	}

	@GetMapping("/get/followingsImage/{nombreUsu:.+}")
	@ResponseBody
	public ResponseEntity<List<Resource>> servefollowingsImages(@PathVariable String nombreUsu) {
		Resource file = null;
		// Si la imagen es del pefil del usuario, sino (si es de una publicación)
		if (!Pattern.compile("^[0-9]+$").matcher(nombreUsu).matches()) {
			file = storageService.loadAsResource(userDao.getByNombreUsuario(nombreUsu).getFoto());
		} else {
			file = storageService.loadAsResource(postDao.getById(Integer.parseInt(nombreUsu)).getFoto());
		}
		ArrayList<String> tipoImagen = new ArrayList<String>();
		tipoImagen.add("image/png");
		List<Resource> images = new ArrayList<Resource>();
		images.add(file);
		images.add(file);
		images.add(file);

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.put("Content-Type", tipoImagen);

		return ResponseEntity.ok().headers(httpHeaders).body(images);

	}

	@PostMapping("/upload/image/")
	public String handleFileUpload(@RequestParam("image") MultipartFile file) {
		String filename= StringUtils.cleanPath(file.getOriginalFilename());
		// Si la imagen es del pefil del usuario, sino (si es de una publicación)
		if (!Pattern.compile("^[0-9]+$").matcher(file.getOriginalFilename().split("_")[0]).matches()) {
			UsuarioModel userToUpdate = new UsuarioModel(file.getOriginalFilename().split("_")[0]);
			userToUpdate.copyData(userDao.getByNombreUsuario(file.getOriginalFilename().split("_")[0]));
			userToUpdate.setFoto(file.getOriginalFilename());
			userDao.update(userToUpdate);
		} else {
			if (!file.getOriginalFilename().split("_")[0].equals("0")) {
				PublicacionModel postToUpdate = new PublicacionModel(
						Integer.parseInt(file.getOriginalFilename().split("_")[0]));
				postToUpdate.copyData(postDao.getById(Integer.parseInt(file.getOriginalFilename().split("_")[0])));
				postToUpdate.setFoto(file.getOriginalFilename());
				postDao.update(postToUpdate);
			}else {
				filename= (postDao.getRowNumber()) +"_"+ file.getOriginalFilename().split("_")[1];
			}
		}

		return storageService.store(file, filename);
	}

	/*
	 * @ExceptionHandler(StorageFileNotFoundException.class) public
	 * ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc)
	 * { return ResponseEntity.notFound().build(); }
	 */

}