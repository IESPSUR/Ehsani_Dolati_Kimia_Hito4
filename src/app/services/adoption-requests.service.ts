import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestDTO } from '../DTO/RequestDTO';

@Injectable({
  providedIn: 'root'
})
export class AdoptionRequestsService {
  protected endpointGetSolicitudesUsu:string = environment.url_back + '/listarSolicitudesDeUnUsuario/';
  protected endpointResponderSolicitud:string = environment.url_back + '/responderSolicitud/';
  protected endpointGetAdoptedAnimals:string = environment.url_back + '/listarAnimalesAceptados/';
  protected endpointGetAllAdoptedAnimals:string = environment.url_back + '/listarSolicitudes/';
  protected endpointDeleteAdoptedAnimals:string = environment.url_back + '/borrarSolicitudAnimalUsu/';

  constructor(private http:HttpClient) { }

  getSolicitudesDeUnUsuario(): Observable<any>{
    return this.http.get(this.endpointGetSolicitudesUsu+sessionStorage.getItem("nombreUsuario"));
  }

  responderSolicitud(respuesta:string , solicitud:RequestDTO): Observable<any>{
    return this.http.put(this.endpointResponderSolicitud+respuesta,solicitud );
  }

  getAdoptedAnimals(): Observable<any>{
    return this.http.get(this.endpointGetAdoptedAnimals );
  }

  getAllAdoptedAnimals(): Observable<any>{
    return this.http.get(this.endpointGetAllAdoptedAnimals );
  }

  borrarSolicitud(nombreUsu:string): Observable<any>{
    return this.http.delete(this.endpointDeleteAdoptedAnimals + nombreUsu  );
  }
}
