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
  private id:number;
  public post:any;
  public commentForm: FormGroup;
  public commentData: any;
  public imagenUsu: SafeResourceUrl;
  public imagenTemp: SafeResourceUrl;


  constructor(private _sanitizer: DomSanitizer, public _imageService: ImageService , public fb: FormBuilder,private _postService: PostService,private _commentService: CommentService, private actRout: ActivatedRoute, private _router: Router,public _authService: AuthenticationService) {
    this.comments= [];
    this.id= this.actRout.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      comment: new FormControl('', [Validators.required])
    });
    this.obtenerComentarios();
    this.obtenerPost();
    this.getImagen();
    
  }

 
  private obtenerComentarios() {
    this._commentService.obtener(this.id).subscribe(data => {
        return this.comments = data;
    })
  }

  public obtenerPost(){
    this._postService.getPost(this.id).subscribe(data => {
      return this.post = data;
  })
  }
  public borrarComentario(id:number){
    this._commentService.delete(id).subscribe();
    this.comments.splice(this.comments.findIndex( c=> c.id==id),1);
  }

  public esMiComentario(nombreUsuComment:string):boolean{
    return nombreUsuComment == sessionStorage.getItem("nombreUsuario");
  }


  public enviar(id: number) {
    this._commentService.add(new CommentDTO(this.commentForm.value.comment, id, sessionStorage.getItem("nombreUsuario") || "")).subscribe(data => {
       this.commentData = data;
       this.comments.push(this.commentData);
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
  
}
