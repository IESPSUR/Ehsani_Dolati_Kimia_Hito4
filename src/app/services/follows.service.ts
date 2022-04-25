import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FollowDTO } from '../DTO/FollowDTO';

@Injectable({
  providedIn: 'root'
})
export class FollowsService {
  protected endpointGetFollowers: string = environment.url_back + '/listarFollowers/';
  protected endpointFollow: string = environment.url_back + '/crearSeguimiento/';
  protected endpointUnFollow: string = environment.url_back + '/borrarSeguimiento/';
  protected endpointFollowers:string = environment.url_back + '/listarFollowers/';
  protected endpointFollowings:string = environment.url_back + '/listarFollowings/';
  constructor(private http: HttpClient) { }

  follow(userFollow:FollowDTO): Observable<any> {
    return this.http.post(this.endpointFollow, userFollow );
  }

  followers(nombreUsuario:string) : Observable<any>{
    return this.http.get(this.endpointFollowers+nombreUsuario);
  }
  followings(nombreUsuario:string) : Observable<any>{
    return this.http.get(this.endpointFollowings+nombreUsuario);
  }

  unFollow(nombreUserFollow:string,nombreUserFollowed:string): Observable<any> {
    return this.http.delete(this.endpointUnFollow + nombreUserFollow + "/" + nombreUserFollowed );
  }
}
