import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentDTO } from '../DTO/CommentDTO';
import { PostDTO } from '../DTO/PostDTO';
import { AuthenticationService } from '../services/authentication.service';
import { CommentService } from '../services/comment.service';
import { ImageService } from '../services/image.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  public comments: Array<any>;
  private id: number;
  public post: any;
  public commentForm: FormGroup;
  public commentData: any;
  public imagenUsu: SafeResourceUrl;
  public imagenTemp: SafeResourceUrl;
  public imagenUserPost: SafeResourceUrl;
  public commentsImages: Array<SafeResourceUrl>;


  constructor(private _sanitizer: DomSanitizer, public _imageService: ImageService, public fb: FormBuilder, private _postService: PostService, private _commentService: CommentService, private actRout: ActivatedRoute, private _router: Router, public _authService: AuthenticationService) {
    this.comments = [];
    this.commentsImages=[];
    this.id = this.actRout.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      comment: new FormControl('', [Validators.required])
    });
    this.obtenerComentarios();
    this.obtenerPost();
    this.getImagen();

  }

  getImagesUsuComments() {
    this.comments.forEach(comment => {
      this.getImagen(comment.nombreUsuario.nombreUsuario, true);
    });
  }

  private obtenerComentarios() {
    this._commentService.obtener(this.id).subscribe(data => {
      this.comments = data;
      this.getImagesUsuComments();
      return this.comments;
    })
  }

  public obtenerPost() {
    this._postService.getPost(this.id).subscribe(data => {
      this.post = data;
      this.getImagen(this.post.nombreUsuario.nombreUsuario);
      return this.post;
    })
  }
  public borrarComentario(id: number) {
    this._commentService.delete(id).subscribe();
    this.comments.splice(this.comments.findIndex(c => c.id == id), 1);
  }

  public esMiComentario(nombreUsuComment: string): boolean {
    return nombreUsuComment == sessionStorage.getItem("nombreUsuario");
  }


  public enviar(id: number) {
    this._commentService.add(new CommentDTO(this.commentForm.value.comment, id, sessionStorage.getItem("nombreUsuario") || "")).subscribe(data => {
      this.commentData = data;
      this.comments.push(this.commentData);
      this.getImagen(this.commentData.nombreUsuario.nombreUsuario, true);
        })
  }


  public getImagen(nombreUsuOIdPub?: string, commentImage?: boolean): any {
    this._imageService.viewImage(nombreUsuOIdPub ? nombreUsuOIdPub : "").subscribe(
      res => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenTemp = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
          if (!nombreUsuOIdPub) {
            this.imagenUsu = this.imagenTemp;
          } else {
            if (commentImage) {
              this.commentsImages.push(this.imagenTemp);
            } else {
              this.imagenUserPost = this.imagenTemp;
            }
          }
        }
        reader.readAsDataURL(new Blob([res]));
      }
    );
    return this.imagenTemp;
  }

  public existsComments() {
    return this.comments.length > 0;
  }
}
