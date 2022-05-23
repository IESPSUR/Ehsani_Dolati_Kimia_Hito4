import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, lastValueFrom } from 'rxjs';
import { PostDTO } from '../DTO/PostDTO';
import { ImageService } from '../services/image.service';
import { PostService } from '../services/post.service';
import { AnimalService } from '../services/animal.service';

import * as $ from "jquery";
import { AnimalDTO } from '../DTO/AnimalDTO';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  public id: number;
  public postForm: FormGroup = new FormGroup({
    cabecera: new FormControl(),
    contenido: new FormControl(),
    tipo: new FormControl(),
    foto: new FormControl(),
    nombreUsuario: new FormControl(),
    dni: new FormControl(),
    nombre: new FormControl(),
    fechaNacimiento: new FormControl(),
    raza: new FormControl(),
    sexo: new FormControl(),
    ubicacion: new FormControl()
  });
  public post: PostDTO;
  public selectedType: string = 'noticia';
  public animal: any = null;
  public title: string = "Create a new post";

  constructor(public _authService: AuthenticationService, private _router: Router, private actRout: ActivatedRoute, public fb: FormBuilder = new FormBuilder(), private _animalService: AnimalService, private _postService: PostService, public _imageService: ImageService) {
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


  private obtenerPost() {
    this._postService.getPost(this.id).subscribe(res => {
      this.post = res;
      this.selectedType = this.post.tipo;
      if (this.post.tipo == 'animal') {
        this.animal = this._animalService.getAnimal(this.id).subscribe(data => {
          this.animal = data;
          this.procesarForm();
        });
      } else {
        this.procesarForm();
      }
    });
  }

  public procesarForm() {
    this.postForm = this.fb.group({
      cabecera: new FormControl(this.post ? this.post.cabecera : '', [Validators.required]),
      contenido: new FormControl(this.post ? this.post.contenido : '', [Validators.required]),
      tipo: new FormControl(this.selectedType, [Validators.required]),
      foto: new FormControl(),
      nombreUsuario: sessionStorage.getItem("nombreUsuario"),
      id: this.id ? this.id : null,

      // Animal
      dni: new FormControl(this.animal ? this.animal.dni : '',this.selectedType=='animal'? [Validators.required,Validators.maxLength(7),Validators.minLength(7)]:[]),
      nombre: new FormControl(this.animal ? this.animal.dni : '', this.selectedType=='animal'? [Validators.required]:[]),
      fechaNacimiento: new FormControl(this.animal ? this.animal.fechaNacimiento : '', this.selectedType=='animal'? [Validators.required]:[]),
      raza: new FormControl(this.animal ? this.animal.raza : '', this.selectedType=='animal'? [Validators.required]:[]),
      sexo: new FormControl(this.animal ? this.animal.sexo : '', this.selectedType=='animal'? [Validators.required,this.letraSexoMal()]:[]),
      ubicacion: new FormControl(this.animal ? this.animal.ubicacion : '', this.selectedType=='animal'? [Validators.required]:[])
    }) as FormGroup;

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

  public procesarFormAnimal() {
    this.postForm.addControl('dni',new FormControl(this.animal ? this.animal.dni : '', [Validators.required,Validators.maxLength(7),Validators.minLength(7)]));
    this.postForm.addControl('nombre',new FormControl(this.animal ? this.animal.dni : '', [Validators.required]));
    this.postForm.addControl('fechaNacimiento',new FormControl(this.animal ? this.animal.fechaNacimiento : '', [Validators.required]));
    this.postForm.addControl('raza',new FormControl(this.animal ? this.animal.raza : '', [Validators.required]));
    this.postForm.addControl('sexo',new FormControl(this.animal ? this.animal.sexo : '', [Validators.required,this.letraSexoMal()]));
    this.postForm.addControl('ubicacion',new FormControl(this.animal ? this.animal.ubicacion : '', [Validators.required]));
    
}

  public cargarComponentes() {
    this.selectedType = $("#tipo").val() + "";
    //Si ha seleccionado post de tipo animal, cargamos los inputs de animal y los formcontrolles de ese
    if (this.selectedType == 'animal') {
      this.procesarFormAnimal();
    }
  }

  public async crearPost() {
    await lastValueFrom(this._postService.create(this.postForm.value));
    this._imageService.imageUploadAction("0").subscribe();
    if (this.selectedType == "animal") {
      this._animalService.createAnimal(new AnimalDTO(this.postForm.value.dni, this.postForm.value.fechaNacimiento, this.postForm.value.nombre, this.postForm.value.raza, this.postForm.value.sexo, this.postForm.value.ubicacion, this.id)).subscribe(data => {
      });
    }
  }

  private letraSexoMal(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value!='M' && control.value!='F' ? {letraSexoMal:true}:null;
    };
  }
}

