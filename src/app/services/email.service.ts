import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  protected endpointCrearEnviarEmailBorrarUsu:string = environment.url_back + '/crearEnviarEmailBorrarUsu/';
  protected endpointCrearEnviarEmail:string = environment.url_back + '/crearEnviarEmail/';
  protected endpointCrearEnviarEmailRequest:string = environment.url_back + '/crearEnviarEmailRequest/';
  

  constructor(private http:HttpClient ) {
  }

  createSendEmail(emailDetails:any): Observable<any>{
    return this.http.post(this.endpointCrearEnviarEmail,emailDetails);
  }

  createSendEmailRequest(emailDetails:any): Observable<any>{
    return this.http.post(this.endpointCrearEnviarEmailRequest,emailDetails);
  }

  createSendEmailRequestBorrarUsu(emailDetails:any): Observable<any>{
    return this.http.post(this.endpointCrearEnviarEmailBorrarUsu,emailDetails);
  }

}
