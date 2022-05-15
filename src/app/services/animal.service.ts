import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnimalDTO } from '../DTO/AnimalDTO';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  protected endpointGetAnimal:string = environment.url_back + '/listarAnimal/';
  protected endpointUpdateAnimal:string = environment.url_back + '/updateAnimal/';
  protected endpointCreateAnimal:string = environment.url_back + '/createAnimal/';
  protected endpointDeleteAnimal:string = environment.url_back + '/deleteAnimal/';

  constructor(private http:HttpClient) { }

  getAnimal(idPost:number): Observable<any>{
    return this.http.get(this.endpointGetAnimal+idPost);
  }

  updateAnimal(idPost:number, animal:AnimalDTO): Observable<any>{
    return this.http.put(this.endpointUpdateAnimal+idPost,animal);
  }

  createAnimal(animal:AnimalDTO): Observable<any>{
    return this.http.post(this.endpointCreateAnimal,animal);
  }

  delete(dni :string): Observable<any>{
    return this.http.delete(this.endpointDeleteAnimal+dni);
  }

}
