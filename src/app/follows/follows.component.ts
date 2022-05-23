import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { ImageUserPost } from '../DTO/ImagenUserPost';
import { FollowsService } from '../services/follows.service';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-follows',
  templateUrl: './follows.component.html',
  styleUrls: ['./follows.component.css']
})
export class FollowsComponent implements OnInit {

  public users = Array<any>();
  public nombreUsuario: string;
  public follower: boolean;
  public title: string;
  public imagesUsus: Array<ImageUserPost>;
  public errorNotFoundFollowing:string;
  public errorNotFoundFollowers:string;

  constructor(private _sanitizer: DomSanitizer, private _imageService: ImageService, public _router: Router, private _followService: FollowsService, private actRout: ActivatedRoute) {
    this.nombreUsuario = this.actRout.snapshot.params['nombreUsuario'];
    this.imagesUsus=[];
    if (this._router.url == "/users/" + this.nombreUsuario + "/followings" || this._router.url=="/myProfile/followings") {
      this.title = "Followings";
      this.errorNotFoundFollowing="There is no followings";
    } else {
      this.title = "Followers";
      this.errorNotFoundFollowers="There is no followers";
    }
  }

  ngOnInit(): void {
    this.title = "Followings";

    if (this.nombreUsuario) {
      if (this._router.url == "/users/" + this.nombreUsuario + "/followings" || this._router.url=="/myProfile/followings") {
        this.followings(this.nombreUsuario);
        this.follower = false;
        this.title = "Followings";
      } else {
        this.follower = true;
        this.followers(this.nombreUsuario);
        this.title = "Followers";
      }
    } else {
      if (this._router.url == "/myProfile/followers") {
        this.followers();
        this.follower = true;
        this.title = "Followers";
      } else {
        this.follower = false;
        this.followings();
        this.title = "Followings";
      }
    }

  }

  getImagesUsuFollows() {
    this.users.forEach(user => {
      this.getImagen(user, true);
    });
  }
  public async followers(nombreUsuario?: string) {
    var service = this._followService.followers(nombreUsuario ? nombreUsuario : sessionStorage.getItem("nombreUsuario") || "");
    this.users = await lastValueFrom(service);
    if(this.users.length>0){
      this.errorNotFoundFollowers="";
    }
    this.getImagesUsuFollows();
  }

  public followings(nombreUsuario?: string) {
    this._followService.followings(nombreUsuario ? nombreUsuario : sessionStorage.getItem("nombreUsuario") || "").subscribe(data => {
    this.users = data;
    if(this.users.length>0){
      this.errorNotFoundFollowing="";
    }
    this.getImagesUsuFollows();

    })
  }

  public unFollow(nombreUsuario: string) {
    this._followService.unFollow(sessionStorage.getItem("nombreUsuario") || "", nombreUsuario).subscribe(data => {
      this.users.splice(this.users.findIndex((u) => u.nombreUsuario == nombreUsuario), 1);
    })
  }

  public getImagen(nombreUsu?: string, commentImage?: boolean): any {
    this._imageService.viewImage(nombreUsu ? nombreUsu : "").subscribe(
      res => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          var image = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
          this.imagesUsus.push(new ImageUserPost(nombreUsu||"",image));
        }
        reader.readAsDataURL(new Blob([res]));
      }
    );
  }


  public buscarImageIndice(nombreUsu:string):number{
    if (this._router.url == "/users/" + this.nombreUsuario + "/followings") {
      this.errorNotFoundFollowing="";
    }else{
      this.errorNotFoundFollowers="";
    }
    return this.imagesUsus.findIndex(i=>i.nombreUsuario==nombreUsu);
  }

  public esMiPerfil(nombreUsuario: string) {
    return nombreUsuario == sessionStorage.getItem("nombreUsuario");
  }
}
