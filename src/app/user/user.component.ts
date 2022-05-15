import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { FollowDTO } from '../DTO/FollowDTO';
import { UserDTO } from '../DTO/UserDTO';
import { AdoptionRequestsService } from '../services/adoption-requests.service';
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
  public file: File;
  public adoptedAnimals: Array<any>;
  public respuestaImagen: any;

  constructor(private _adoptionService: AdoptionRequestsService, private _sanitizer: DomSanitizer, public _imageService: ImageService, private _followService: FollowsService, private _userService: UserService, private _router: Router, private actRout: ActivatedRoute, public _authService: AuthenticationService) {
    this.nombreUsuario = this.actRout.snapshot.params['nombreUsuario'];
  }

  ngOnInit(): void {
    if (this._router.url == "/myProfile") {
      this.obtenerUsuarios(sessionStorage.getItem("nombreUsuario") || "");
      this.getImagen();
    } else if (this._router.url == "/users/" + this.nombreUsuario) {
      this.obtenerUsuarios(this.nombreUsuario);
      this.getImagen(this.nombreUsuario);
    } else if (this._router.url == "/animalsAdopted/" + this.nombreUsuario) {
      this.getAdoptedAnimals();
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

  public deleteAccount() {
    this._userService.delete().subscribe(data => {
      sessionStorage.removeItem("nombreUsuario");
      this._router.navigate(['/login/']);
    });

  }

  public async getImagen(nombreUsuOIdPub?: string) {
    var res = await lastValueFrom(this._imageService.viewImage(nombreUsuOIdPub ? nombreUsuOIdPub : ""));
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagenTemp = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
      if (!nombreUsuOIdPub) {
        this.imagenUsu = this.imagenTemp;
      }
    }
    
    reader.readAsDataURL(new Blob([res]));
    

  }


  public cambiarImagen(event: Event) {
    this.actualizarImagen(event);
    this.getImagen();
    window.location.reload();
  }

  public async actualizarImagen(event: Event) {
    this.file = this._imageService.onImageUpload(event);
    await lastValueFrom(this._userService.update(new UserDTO("", "", "", "", "", "", "", sessionStorage.getItem("nombreUsuario") + "_" + this.file.name, "", 0)));
    await lastValueFrom(this._imageService.imageUploadAction());
  }

  public getAdoptedAnimals() {
    this._adoptionService.getAdoptedAnimals().subscribe(data => {
      this.adoptedAnimals = data;
    });
  }
}