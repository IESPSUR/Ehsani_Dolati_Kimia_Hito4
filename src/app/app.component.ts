import { Component, Sanitizer } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { ImageService } from './services/image.service';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AdopcionAnimales';
  public imagenUsu:SafeResourceUrl;

  constructor(private _imageService:ImageService,private _sanitizer:DomSanitizer,public _authService: AuthenticationService, private _router: Router) {
    this.getImagen();

   }

  /**
   * Borrar la información del usuario de la sesión para hacer un logout
   */
  public logout(){
    sessionStorage.removeItem("nombreUsuario");
    sessionStorage.removeItem("tipo");
    this._router.navigate(['/login/']);

  }
  ngOnInit(){
    this.getImagen();
  }

  public getImagen() {
    this._imageService.viewImage().subscribe(res=>{
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenUsu = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
      }
      reader.readAsDataURL(new Blob([res]));
    });
   
  }


 /* public cambiarActiveItem(e:Event){
    $("#sideBar nav-link").removeClass("active");
    $(this).addClass("active");
  }*/

  
}
