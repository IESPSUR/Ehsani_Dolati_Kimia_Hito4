import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentDTO } from '../DTO/CommentDTO';

@Injectable({
  providedIn: 'root'
})
export class CommentService {


  protected endpointObtener:string = environment.url_back + '/listarComentariosPorPublicacion/';
  protected endpointAdd:string = environment.url_back + '/crearComentario/';
  protected endpointDelete:string = environment.url_back + '/borrarComentario/';

  constructor(private http:HttpClient ) {
  }

  obtener(idPost:number): Observable<any>{
    return this.http.get(this.endpointObtener+idPost);
  }

  add(comment:CommentDTO):Observable<any>{
    return this.http.post(this.endpointAdd,comment);
  }

  delete(id:number):Observable<any>{
    return this.http.delete(this.endpointDelete+id);
  }
}
