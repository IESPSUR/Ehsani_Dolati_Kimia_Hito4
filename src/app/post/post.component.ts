import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { CommentDTO } from '../DTO/CommentDTO';
import { PostDTO } from '../DTO/PostDTO';
import { RequestDTO } from '../DTO/RequestDTO';
import { AnimalService } from '../services/animal.service';

import { AuthenticationService } from '../services/authentication.service';
import { CommentService } from '../services/comment.service';
import { ImageService } from '../services/image.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  public posts: Array<any>;
  public post: PostDTO;
  public estadoSolicitud: string = "Request";
  public commentForm: FormGroup;
  public commentData: string;
  public imagenUsu: SafeResourceUrl;
  public imagenTemp: SafeResourceUrl;
  public id: number;
  public animal: any;
  public nombreUsuario: string;
  public imagePost: SafeResourceUrl;
  public imagePostUser: SafeResourceUrl;
  public opcionSeleccionado: string;

  constructor(private _animalService: AnimalService, private actRout: ActivatedRoute, private _sanitizer: DomSanitizer, private _postService: PostService, private _commentService: CommentService, public _authService: AuthenticationService, public _imageService: ImageService, public fb: FormBuilder, private _router: Router) {
    this.posts = [];
    this.id = this.actRout.snapshot.params['id'];
    this.nombreUsuario = this.actRout.snapshot.params['nombreUsuario'];
    this.opcionSeleccionado = "type";

  }

  ngOnInit(): void {

    if (this.id) {
      this.getImagen(this.id.toString());
      this.imagePost = this.imagenTemp;
    }
    /*
    if(this.nombreUsuario){
      this.imagePostUser=this.getImagen(this.id);
    }*/
    this.obtenerPosts(sessionStorage.getItem("nombreUsuario") || "");
    this.getImagen();
    this.imagenUsu = this.imagenTemp;
    this.commentForm = this.fb.group({
      comment: new FormControl('', [Validators.required])
    });
  }


  private obtenerPosts(nombreUsuario?: string) {
    $(".spinner").removeClass("d-none");
    if (this.id) {
      this._postService.getPost(this.id).subscribe(data => {
        $(".spinner").addClass("d-none");
        if (data.tipo == 'animal') {
          this._animalService.getAnimal(data.id).subscribe(data => {
            return this.animal = data;
          })
        }
        return this.posts.push(data);
      })
    } else {
      if (this.nombreUsuario) {
        this._postService.obtenerUserPosts(this.nombreUsuario).subscribe(data => {
          $(".spinner").addClass("d-none");
          return this.posts = data;
        })
      } else {
        if (this._router.url == "/adminPosts") {
          $(".spinnerAdmin").removeClass("d-none");
          this._postService.obtenerAdminPosts().subscribe(data => {
            $(".spinnerAdmin").addClass("d-none");
            return this.posts = data;
          })
        } else {
          this._postService.obtener(nombreUsuario).subscribe(data => {
            $(".spinner").addClass("d-none");
            return this.posts = data;
          })
        }
      }
    }
  }

  public enviar(id: number) {
    this._commentService.add(new CommentDTO(this.commentForm.value.comment, id, sessionStorage.getItem("nombreUsuario") || "")).subscribe(data => {
      return this.commentData = data;
    })
  }

  public async getImagen(nombreUsuOIdPub?: string) {
    var res = await lastValueFrom(this._imageService.viewImage(nombreUsuOIdPub ? nombreUsuOIdPub : ""));
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagenTemp = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
      if (!nombreUsuOIdPub) {
        this.imagenUsu = this.imagenTemp;
      }else{
        this.imagePost=this.imagenTemp;
      }
    }
    reader.readAsDataURL(new Blob([res]));
    

  }

  public solicitarAnimal(idPub: number) {
    this._animalService.getAnimal(idPub).subscribe(data => {
      this.animal = data;
      this._postService.solicitar(new RequestDTO(this.animal.dni, sessionStorage.getItem("nombreUsuario") || "")).subscribe();
      this.estadoSolicitud = "Requested";
    })

  }


  public esMiPost(nombreUsuario: string): boolean {
    return nombreUsuario == sessionStorage.getItem("nombreUsuario");
  }

  public existsPosts() {
    return this.posts.length > 0;
  }

  public esAdminPosts(): boolean {
    return this._router.url == "/adminPosts";
  }
}
