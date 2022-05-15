import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AdopcionAnimales';

  constructor(public _authService: AuthenticationService, private _router: Router) { }

  /**
   * Borrar la información del usuario de la sesión para hacer un logout
   */
  public logout(){
    sessionStorage.removeItem("nombreUsuario");
    sessionStorage.removeItem("tipo");
    this._router.navigate(['/login/']);

  }

  
}
