import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginDTO } from '../DTO/LoginDTO';
import { UserDTO } from '../DTO/UserDTO';
@Injectable({
  providedIn: 'root'
})
export class UserService {
 
 

  protected endpointListar:string = environment.url_back + '/listarUsuarios/';
  protected endpointLogin:string = environment.url_back + '/getByNombreUsuarioIfCorrectPassAndExists/';
  protected endpointCrear:string = environment.url_back + '/crearUsuario/';
  protected endpointDelete:string = environment.url_back + '/borrarUsuarios/';
  protected endpointUpdate:string = environment.url_back + '/editarUsuario/';

  
  constructor(private http:HttpClient) {
  }

  obtenerUsuarios(): Observable<any>{
      return this.http.get(this.endpointListar);
  }
  obtenerParaLogin(user:LoginDTO): Observable<any>{
      return this.http.post(this.endpointLogin,user);
  }
  addUser(user:UserDTO): Observable<any>{
    user.tipo="usuario";
    user.deleted= 0;
    user.foto="defaultPhoto.png";
    return this.http.post(this.endpointCrear,user);
  }

  obtenerUsuario(nombreUsuario: String): Observable<any> {
    return this.http.get(this.endpointListar+nombreUsuario);
  }


  delete(): Observable<any>{
    return this.http.delete(this.endpointDelete+sessionStorage.getItem("nombreUsuario"));
  }

  update(user:UserDTO):Observable<any>{
    return this.http.put(this.endpointUpdate+ sessionStorage.getItem("nombreUsuario"), user);
  }
}
