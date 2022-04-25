import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
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
  public estadoSolicitud:string= "Request";
  public commentForm: FormGroup;
  public commentData: string;
  public imagenUsu: SafeResourceUrl;
  public imagenTemp: SafeResourceUrl;
  public id:number;
  public animal:any;
  public nombreUsuario:string;
  public imagePost:SafeResourceUrl;
  public imagePostUser:SafeResourceUrl;


  constructor(private _animalService: AnimalService,private actRout: ActivatedRoute,private _sanitizer: DomSanitizer, private _postService: PostService, private _commentService: CommentService, public _authService: AuthenticationService, public _imageService: ImageService, public fb: FormBuilder,private _router: Router) {
    this.posts = [];
    this.id= this.actRout.snapshot.params['id'];
    this.nombreUsuario= this.actRout.snapshot.params['nombreUsuario'];

  }

  ngOnInit(): void {
  
    /*if(this.id){
      this.imagePost=this.getImagen(this.id);
    }
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


  private obtenerPosts(nombreUsuario?:string) {
    if(this.nombreUsuario){
      this._postService.obtenerUserPosts(this.nombreUsuario).subscribe(data => {
        return this.posts = data;
      })

    }else{
    if(this._router.url == "/adminPosts" ){
      this._postService.obtenerAdminPosts().subscribe(data => {
        return this.posts = data;
      })
    }else{
    this._postService.obtener(nombreUsuario).subscribe(data => {
      return this.posts = data;
    })
  }}
  }

  public enviar(id: number) {
    this._commentService.add(new CommentDTO(this.commentForm.value.comment, id, sessionStorage.getItem("nombreUsuario") || "")).subscribe(data => {
      return this.commentData = data;
    })
  }

  public getImagen(idPub?: number, nombreUsu?: string): any {
    this._imageService.viewImage(idPub ? idPub : 0, nombreUsu ? nombreUsu : "").subscribe(
      res => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
           this.imagenTemp = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
           if(!nombreUsu && !idPub){
            this.imagenUsu = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
           }
        }
        reader.readAsDataURL(new Blob([res]));
      }
    );
      return this.imagenTemp;
  }

  public solicitarAnimal(idPub:number){
    this._animalService.getAnimal(idPub).subscribe(data => {
       this.animal = data;
      this._postService.solicitar(new RequestDTO(this.animal.dni,sessionStorage.getItem("nombreUsuario")||"")).subscribe();
      this.estadoSolicitud="Requested";
    })

  }


  public esMiPost(nombreUsuario:string):boolean{
    return nombreUsuario== sessionStorage.getItem("nombreUsuario");
  }

}
