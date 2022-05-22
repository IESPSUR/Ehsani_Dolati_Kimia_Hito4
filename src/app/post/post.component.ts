import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { CommentDTO } from '../DTO/CommentDTO';
import { ImageUserPost } from '../DTO/ImagenUserPost';
import { ImagePost } from '../DTO/ImagePost';
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
export class PostComponent implements OnInit, AfterViewInit {

  public posts: Array<any>;
  public postsMostrados: Array<any>;
  public postsTemporal: Array<any>;
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
  public postsImages: Array<ImagePost>;
  public usersPostsImages: Array<ImageUserPost>;
  public cont: number = 0;

  constructor(private _animalService: AnimalService, private actRout: ActivatedRoute, private _sanitizer: DomSanitizer, private _postService: PostService, private _commentService: CommentService, public _authService: AuthenticationService, public _imageService: ImageService, public fb: FormBuilder, public _router: Router) {
    this.posts = [];
    this.postsMostrados = [];
    this.postsTemporal = [];
    this.postsImages = [];
    this.usersPostsImages = [];
    this.id = this.actRout.snapshot.params['id'];
    this.nombreUsuario = this.actRout.snapshot.params['nombreUsuario'];
    this.opcionSeleccionado = "type";
  }

  ngAfterViewInit() {
    $("#selecttype").val("type");
    this.opcionSeleccionado = "type";
  }

  ngOnInit(): void {
    this.obtenerPosts(sessionStorage.getItem("nombreUsuario") || "");
    if (this._authService.isAuth()) {
      this.getImagen();
    }
    this.imagenUsu = this.imagenTemp;
    this.commentForm = this.fb.group({
      comment: new FormControl('', [Validators.required])
    });
  }


  add2LinesPosts() {
    var i: number = this.postsMostrados.length;
    var cont: number = 0;
    while (cont <= 2 && this.postsTemporal[i]) {
      this.postsMostrados.push(this.postsTemporal[i]);
      if (!this.existsImagePost(this.postsTemporal[i].id)) {
        this.getImagen(this.postsTemporal[i].id + "");
      }
      if (!this.existsImagePostUser(this.postsTemporal[i].nombreUsuario.nombreUsuario)) {
        this.getImagen(this.postsTemporal[i].nombreUsuario.nombreUsuario);
      }
      cont++;
      i++;
    }
  }

  private existsImagePostUser(nombreUsuario: string) {
    return this.usersPostsImages.find(im => im.nombreUsuario == nombreUsuario);
  }
  private existsImagePost(idPost: number) {
    return this.postsImages.find(im => im.id == idPost);
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
        this.posts.push(data);
        this.getImagen(this.id.toString());
        this.getImagen(this.posts.filter(post => post.id == this.id)[0].nombreUsuario.nombreUsuario);
        // this.imagePost = this.imagenTemp;
        return this.posts;
      })

    } else {
      if (this.nombreUsuario) {
        this._postService.obtenerUserPosts(this.nombreUsuario).subscribe(data => {
          $(".spinner").addClass("d-none");
          this.posts = data;
          return this.posts;
        })
      } else {
        if (this._router.url == "/adminPosts") {
          $(".spinnerAdmin").removeClass("d-none");
          this._postService.obtenerAdminPosts().subscribe(data => {
            $(".spinnerAdmin").addClass("d-none");
            this.posts = data;
            this.postsTemporal = this.posts;
            this.add2LinesPosts();
            return this.posts;
          })
        } else if(this._authService.isAdmin()){
          this._postService.obtener().subscribe(data => {
            $(".spinner").addClass("d-none");
            this.posts = data;
            return this.posts;
          })
        }else{
          this._postService.obtener(nombreUsuario).subscribe(data => {
            $(".spinner").addClass("d-none");
            this.posts = data;
            return this.posts;
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
      } else {
        if (this.id) {
          if (nombreUsuOIdPub.match(/^[0-9]+$/)) {
            this.imagePost = this.imagenTemp;
          } else {
            this.imagePostUser = this.imagenTemp;
          }
        } else {
          this.imagePost = this.imagenTemp;
          if (nombreUsuOIdPub.match(/^[0-9]+$/)) {
            if (!this.existsImagePost(parseInt(nombreUsuOIdPub))) {
              this.postsImages.push(new ImagePost(parseInt(nombreUsuOIdPub), this.imagePost));
            }
          } else {
            if (!this.existsImagePostUser(nombreUsuOIdPub)) {
              this.usersPostsImages.push(new ImageUserPost(nombreUsuOIdPub, this.imagePost));
            }
          }
        }

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

  public buscarPosImagen(idPost: number): number {
    var i = this.postsImages.findIndex(post => post.id == idPost);
    return i;
  }

  public buscarPosUserImagen(nombreUsuario: string): number {
    var i = this.usersPostsImages.findIndex(post => post.nombreUsuario == nombreUsuario);
    return i;
  }

  public cambiartipoMostrar() {
    this.postsMostrados = [];
    this.postsTemporal = this.posts.filter(post => post.tipo == this.opcionSeleccionado);
    this.add2LinesPosts();
  }

  public borrarPost(id:number){
    this._postService.deletePost(id).subscribe(data=>{
      this._router.navigate(['/posts/']);
    });
  }

}



