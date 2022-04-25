import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  /**
   * Comprueba si hay algún usuario logueado
   * @returns 
   */
   public isAuth(): boolean{
    if(sessionStorage.getItem("nombreUsuario")){
      return true;
    }else{
      return false;
    }
  }

   /**
   * Comprueba si hay algún usuario logueado y si ese usuario es admin
   * @returns 
   */
    public isAdmin(): boolean{
      if(sessionStorage.getItem("nombreUsuario") && sessionStorage.getItem("tipo")=="admin"){
        return true;
      }else{
        return false;
      }
    }
}
