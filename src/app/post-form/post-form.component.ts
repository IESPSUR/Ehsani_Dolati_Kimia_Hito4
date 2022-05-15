import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { PostDTO } from '../DTO/PostDTO';
import { ImageService } from '../services/image.service';
import { PostService } from '../services/post.service';
import { AnimalService } from '../services/animal.service';

import * as $ from "jquery";
import { AnimalDTO } from '../DTO/AnimalDTO';
@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  public id: number;
  public postForm: FormGroup;
  public post: PostDTO;
  public selectedType: string;
  public animal: any = null;
  public title: string = "Create a new post";

  constructor(private _router: Router, private actRout: ActivatedRoute, public fb: FormBuilder, private _animalService: AnimalService, private _postService: PostService, public _imageService: ImageService) {
    this.id = this.actRout.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit your post";
    }
  }

  ngOnInit(): void {
    if (this.id) {
      this.obtenerPost();
    } else {
      this.procesarForm();
    }
  }


  private async obtenerPost() {
    var service = this._postService.getPost(this.id);
    this.post = await lastValueFrom(service);
    this.selectedType = this.post.tipo;
    if (this.post.tipo == 'animal') {
      this.animal = await lastValueFrom(this._animalService.getAnimal(this.id));
    }
    this.procesarForm();
  }

  public procesarForm() {
      this.postForm = this.fb.group({
        cabecera: new FormControl(this.post ? this.post.cabecera : '', [Validators.required]),
        contenido: new FormControl(this.post ? this.post.contenido : '', [Validators.required]),
        tipo: new FormControl(this.selectedType, [Validators.required]),
        foto: new FormControl(),
        nombreUsuario: sessionStorage.getItem("nombreUsuario"),
        id: this.id ? this.id: null
      });
      if(this.post.tipo=="animal"){
        this.procesarFormAnimal();
      }
  }


  public crearEditar() {
     //formateando el nombre de la imagen del post
    if (this.postForm.value.foto != null) {
      this.postForm.value.foto = this.postForm.value.foto.split("\\")[2];
    }

    if (this.id) {
      this.edit();
    } else {
      this.crearPost();
      this._router.navigate(['/posts/']);
    }
  }

  private async edit() {
   
    await lastValueFrom(this._postService.update(this.id, this.postForm.value));
    this._imageService.imageUploadAction(this.id + "").subscribe();
    if (this.post.tipo == 'animal' && this.postForm.value.tipo == "animal") {
      await lastValueFrom(this._animalService.updateAnimal(this.id, new AnimalDTO(this.postForm.value.dni, this.postForm.value.fechaNacimiento, this.postForm.value.nombre, this.postForm.value.raza, this.postForm.value.sexo, this.postForm.value.ubicacion, this.id)));
    } else if (this.post.tipo == 'animal' && this.postForm.value.tipo == "noticia") {
      this._animalService.delete(this.animal.dni).subscribe(data => {
      });
    }
    if (this.post.tipo == 'noticia' && this.postForm.value.tipo == "animal") {
      this._animalService.createAnimal(new AnimalDTO(this.postForm.value.dni, this.postForm.value.fechaNacimiento, this.postForm.value.nombre, this.postForm.value.raza, this.postForm.value.sexo, this.postForm.value.ubicacion, this.id)).subscribe(data => {
      });
    }

    this._router.navigate(['/posts/' + this.id]);
  }

  public cargarComponentes() {
    this.selectedType = $("#tipo").val() + "";
    //Si ha seleccionado post de tipo animal, cargamos los inputs de animal y los formcontrolles de ese
    if(this.selectedType=='animal'){
      this.procesarFormAnimal();
    }
    
  }


  public procesarFormAnimal() {
      this.postForm.addControl('dni',new FormControl(this.animal ? this.animal.dni : '', [Validators.required]));
      this.postForm.addControl('nombre',new FormControl(this.animal ? this.animal.dni : '', [Validators.required]));
      this.postForm.addControl('fechaNacimiento',new FormControl(this.animal ? this.animal.fechaNacimiento : '', [Validators.required]));
      this.postForm.addControl('raza',new FormControl(this.animal ? this.animal.raza : '', [Validators.required]));
      this.postForm.addControl('sexo',new FormControl(this.animal ? this.animal.sexo : '', [Validators.required]));
      this.postForm.addControl('ubicacion',new FormControl(this.animal ? this.animal.ubicacion : '', [Validators.required]));
}

public async crearPost(){
    await lastValueFrom(this._postService.create(this.postForm.value));
    this._imageService.imageUploadAction("0").subscribe();
    if (this.selectedType == "animal") {
      this._animalService.createAnimal(new AnimalDTO(this.postForm.value.dni, this.postForm.value.fechaNacimiento, this.postForm.value.nombre, this.postForm.value.raza, this.postForm.value.sexo, this.postForm.value.ubicacion, this.id)).subscribe(data => {
      });
    }
}
}
