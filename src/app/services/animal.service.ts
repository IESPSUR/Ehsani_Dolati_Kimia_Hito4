import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  protected endpointGetAnimal:string = environment.url_back + '/listarAnimal/';

  constructor(private http:HttpClient) { }

  getAnimal(idPost:number): Observable<any>{
    return this.http.get(this.endpointGetAnimal+idPost);
  }
}
