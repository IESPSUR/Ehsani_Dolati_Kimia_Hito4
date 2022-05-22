import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnimalDTO } from '../DTO/AnimalDTO';
import { ChatDTO } from '../DTO/ChatDTO';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  protected endpointGetChatRoom:string = environment.url_back + '/listarMensajesChatRoom/';
  protected endpointGetChatRooms:string = environment.url_back + '/listarUsuarioChatRooms/';
  protected endpointCrearChatRoom:string = environment.url_back + '/crearChatRoom/';

  constructor(private http:HttpClient) { }

  getChatRoom(user1:string,user2:string): Observable<any>{
    return this.http.get(this.endpointGetChatRoom+user1 +"/"+user2);
  }

  getChatRooms(user:string): Observable<any>{
    return this.http.get(this.endpointGetChatRooms+user);
  }

  crearChatRoom(chat:ChatDTO): Observable<any>{
    return this.http.post(this.endpointCrearChatRoom,chat);
  }

}
