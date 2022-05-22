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

  constructor(private _sanitizer: DomSanitizer, private _imageService: ImageService, public _router: Router, private _followService: FollowsService, private actRout: ActivatedRoute) {
    this.nombreUsuario = this.actRout.snapshot.params['nombreUsuario'];
    this.imagesUsus=[];
  }

  ngOnInit(): void {
    this.title = "Followings";

    if (this.nombreUsuario) {
      if (this._router.url == "/users/" + this.nombreUsuario + "/followings") {
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
    this.getImagesUsuFollows();
  }

  public followings(nombreUsuario?: string) {
    this._followService.followings(nombreUsuario ? nombreUsuario : sessionStorage.getItem("nombreUsuario") || "").subscribe(data => {
    this.users = data;
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
    return this.imagesUsus.findIndex(i=>i.nombreUsuario==nombreUsu);
  }

  public esMiPerfil(nombreUsuario: string) {
    return nombreUsuario == sessionStorage.getItem("nombreUsuario");
  }
}
