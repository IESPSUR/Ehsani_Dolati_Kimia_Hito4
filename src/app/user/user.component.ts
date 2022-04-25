import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FollowDTO } from '../DTO/FollowDTO';
import { UserDTO } from '../DTO/UserDTO';
import { AuthenticationService } from '../services/authentication.service';
import { FollowsService } from '../services/follows.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public users: Array<UserDTO>;
  public user: UserDTO;
  public nombreUsuario: string;
  public estadoSeguimiento: string = "Follow";
  public imagenUsu: SafeResourceUrl;
  public imagenTemp: SafeResourceUrl;
  public file:File;
  
  constructor(private _sanitizer: DomSanitizer,public _imageService: ImageService,private _followService: FollowsService, private _userService: UserService, private _router: Router, private actRout: ActivatedRoute, public _authService: AuthenticationService) {
    this.nombreUsuario = this.actRout.snapshot.params['nombreUsuario'];
  }

  ngOnInit(): void {
    if (this._router.url == "/myProfile") {
      this.obtenerUsuarios(sessionStorage.getItem("nombreUsuario") || "");
      this.getImagen();
    } else if (this._router.url == "/users/" + this.nombreUsuario) {
      this.obtenerUsuarios(this.nombreUsuario);
    } else {
      this.obtenerUsuarios();
    }
  }


  private obtenerUsuarios(nombreUsuario?: String) {
    if (nombreUsuario) {
      this._userService.obtenerUsuario(nombreUsuario).subscribe(data => {
        return this.user = data;
      })
    } else {
      this._userService.obtenerUsuarios().subscribe(data => {
        return this.users = data;
      })
    }

  }

  public esMiPerfil(nombreUsuario: string) {
    return nombreUsuario == sessionStorage.getItem("nombreUsuario");
  }

  public follow(nombreUsuario: string) {
    if (this.estadoSeguimiento == "UnFollow") {
      this._followService.unFollow(sessionStorage.getItem("nombreUsuario") || "", nombreUsuario).subscribe(data => {
        this.estadoSeguimiento = "Follow";
      })
    } else {
      this._followService.follow(new FollowDTO(sessionStorage.getItem("nombreUsuario") || "", nombreUsuario)).subscribe(data => {
        this.estadoSeguimiento = "UnFollow";
      })
    }

  }

  public deleteAccount(){
    this._userService.delete().subscribe(data => {
     sessionStorage.removeItem("nombreUsuario");
     this._router.navigate(['/login/']);
    });
    
  }


  public getImagen(idPub?: number, nombreUsu?: string): any {
    this._imageService.viewImage(idPub ? idPub : 0, nombreUsu ? nombreUsu : "").subscribe(
      res => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
           this.imagenUsu = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
           if(!nombreUsu && !idPub){
            this.imagenUsu = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
           }
        }
        reader.readAsDataURL(new Blob([res]));
      }
    );
      return this.imagenUsu;
  }


  public cambiarImagen(event:Event){
    this.file = this._imageService.onImageUpload(event);
    
    this._userService.update(new UserDTO("","","","","","","",this.file.name,"",0)).subscribe(data => {
      this._imageService.imageUploadAction().subscribe();
      this.getImagen();
     
    });
  }
}