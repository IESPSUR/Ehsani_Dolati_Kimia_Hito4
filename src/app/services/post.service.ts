import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostDTO } from '../DTO/PostDTO';
import { RequestDTO } from '../DTO/RequestDTO';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  protected endpointFollowingsPost: string = environment.url_back + '/listarPostsFollowings/';
  protected endpointPosts: string = environment.url_back + '/listarPublicaciones/';
  protected endpointAdminPosts: string = environment.url_back + '/listarAdminPosts/';
  protected endpointAnimalInfo: string = environment.url_back + '/getAnimalInfo/';
  protected endpointSolicitar: string = environment.url_back + '/crearSolicitud/';
  protected endpointUpdate: string = environment.url_back + '/editarPublicacion/';
  protected endpointCreate: string = environment.url_back + '/crearPublicacion/';
  protected endpointGetPost: string = environment.url_back + '/listarPublicaciones/';
  protected endpointGetUserPosts: string = environment.url_back + '/listarPublicacionesUsuario/';

  constructor(private http: HttpClient) {
  }

  obtener(nombreUsuario?: string): Observable<any> {
    if (nombreUsuario == "") {
      return this.http.get(this.endpointPosts);
    } else {
      return this.http.get(this.endpointFollowingsPost + nombreUsuario);
    }
  }
  obtenerUserPosts(nombreUsuario: string): Observable<any> {
    return this.http.get(this.endpointGetUserPosts + nombreUsuario);
  }

  obtenerAdminPosts(): Observable<any> {
    return this.http.get(this.endpointAdminPosts);
  }

  getAnimalInfo(DNI: string): Observable<any> {
    return this.http.get(this.endpointAnimalInfo + DNI);
  }

  solicitar(solicitud: RequestDTO): Observable<any> {
    return this.http.post(this.endpointSolicitar, solicitud);

  }

  update(id: number, post: PostDTO): Observable<any> {
    return this.http.put(this.endpointUpdate + id, post);
  }

  create(post: PostDTO): Observable<any> {
    return this.http.post(this.endpointCreate, post);
  }

  getPost(id: number): Observable<any> {
    return this.http.get(this.endpointGetPost + id);
  }
}
