import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { PostDTO } from '../DTO/PostDTO';
import { ImageService } from '../services/image.service';
import { PostService } from '../services/post.service';
import * as $ from "jquery";
@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  public id: number;
  public postForm: FormGroup;
  public post: PostDTO;
  public selectedType:string;
  public title: string = "Create a new post";
  constructor(private _router: Router, private actRout: ActivatedRoute, public fb: FormBuilder, private _postService: PostService, public _imageService: ImageService) {
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
    this.procesarForm();
  }

  public procesarForm() {
    this.postForm = this.fb.group({
      cabecera: new FormControl(this.post.cabecera ? this.post.cabecera : '', [Validators.required]),
      contenido: new FormControl(this.post.contenido ? this.post.contenido : '', [Validators.required]),
      tipo: new FormControl(this.post.tipo ? this.post.tipo : '', [Validators.required]),
      foto: new FormControl(this.post.foto ? this.post.foto : ''),
      nombreUsuario: sessionStorage.getItem("nombreUsuario"),
      id:this.id
    });
  }
  public crearEditar() {
    if (this.id) {
      this._postService.update(this.id, this.postForm.value).subscribe(data => {
        this._imageService.imageUploadAction().subscribe();
        this._router.navigate(['/posts/']);
      });
    } else {
      this._postService.create(this.postForm.value).subscribe(data => {
        this._imageService.imageUploadAction().subscribe();
        this._router.navigate(['/posts/']);
      });
    }
  }


  public cargarComponentes(){
    this.selectedType = $("#tipo").val() + "";    
  }
}
