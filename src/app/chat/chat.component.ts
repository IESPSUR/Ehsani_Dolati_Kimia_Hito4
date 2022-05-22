import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ChatDTO } from '../DTO/ChatDTO';
import { ChatService } from '../services/chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ImageService } from '../services/image.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageUserPost } from '../DTO/ImagenUserPost';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  title = 'WebSocketChatRoom';
  messages: Array<ChatDTO>=[];
  disabled = true;
  public newmessage: string;
  public userDest:string;
  private stompClient:any;
  public chatRooms:Array<any>;
  public chatRoom:ChatDTO;
  public conversation:Array<any>;
  public imagenTemp:SafeResourceUrl;
  public imagenUsu:SafeResourceUrl;
  public imagenesUsus:Array<ImageUserPost>;
  public usuarioDestActual:string;
  public usuarioConectado: string = sessionStorage.getItem("nombreUsuario")||"";

  constructor(private _sanitizer: DomSanitizer,private _imageService:ImageService,private _chatService:ChatService, public _router: Router,private actRout: ActivatedRoute) { 
    this.usuarioDestActual = this.actRout.snapshot.params['usuarioDest'];
    this.chatRooms=[];
    this.imagenesUsus=[];
  }

  ngOnInit() {
    this.connect();
    if (this._router.url == "/chat/"+this.usuarioDestActual) {
      this.crearChatRoom();
      this._router.navigate(['/chat/']);
    }
    this.getAllChatRooms();
    
   
  }



  setConnected(connected: boolean) {
    this.disabled = !connected;
    if (connected) {
      this.messages = [];
    }
  }

  async getAllChatRooms(){
    this._chatService.getChatRooms(sessionStorage.getItem("nombreUsuario") || "").subscribe(data => {
      data.forEach((chat:any) => {
        if(!this.existeChatRoom(chat.usuarioDestinatario.nombreUsuario)){
          this.chatRooms.push(chat);
          this.getImagen(chat.usuarioDestinatario.nombreUsuario==this.usuarioConectado?chat.usuarioOrigen.nombreUsuario:chat.usuarioDestinatario.nombreUsuario,true);
        }
      });
      this.selectDestinatario(this.chatRooms[0]);
      this.getImagen(this.usuarioDestActual);
      this.getChatRoom();
    })
  }

  getChatRoom(){
    this._chatService.getChatRoom(sessionStorage.getItem("nombreUsuario") || "", this.usuarioDestActual).subscribe(data => {
      this.conversation = data;
    })
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/chat');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame:string) {
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe('/start/initial', function (hello:any) {
        console.log(hello.body);
        _this.showMessage(hello.body);
      });
    });
  }

  sendMessage() {
    this.stompClient.send(
      '/current/resume',
      {},
      JSON.stringify(new ChatDTO(sessionStorage.getItem("nombreUsuario")||"",this.usuarioDestActual,this.newmessage))
    );
    this.newmessage = "";
  }                                                                                                                                                                                               

  showMessage(message:string) {
    var msg:Array<string>= message.split(",");
    this.conversation.push(new ChatDTO(msg[0],msg[1],msg[2],msg[3]));
  }

  public isMyMessage(message:any){
    if(message.usuarioOrigen==sessionStorage.getItem("nombreUsuario")){
      return  true
    }else if(message.usuarioOrigen.nombreUsuario==sessionStorage.getItem("nombreUsuario")){
      return true;
    }else{
      return false;
    }
  }

  public selectChatRoom(chatRoom:any){
    this.chatRoom=chatRoom;
    this.selectDestinatario(this.chatRoom);
    this.getImagen(this.usuarioDestActual);
    /* $(".chatroom").removeClass("active");
    $(".chatroom").filter($(".chatroom .name[]")).addClass("active");*/
    this.getChatRoom();
  }

  public crearChatRoom(){
    this._chatService.crearChatRoom(new ChatDTO(sessionStorage.getItem("nombreUsuario")||"",this.usuarioDestActual,"Hi, welcome to my chatroom!")).subscribe();
  }

  public existeChatRoom(usuDest:string){
    return this.chatRooms.find(c=>c.usuarioDestinatario.nombreUsuario==usuDest||c.usuarioOrigen.nombreUsuario==usuDest );
  }

  selectDestinatario(chatroom:any){
    if(chatroom.usuarioDestinatario.nombreUsuario== sessionStorage.getItem("nombreUsuario") || ""){
      this.usuarioDestActual=chatroom.usuarioOrigen.nombreUsuario;
    }else{
      this.usuarioDestActual=chatroom.usuarioDestinatario.nombreUsuario;
    }
  }

  public async getImagen(nombreUsuOIdPub?: string,chatrooms?:boolean) {
    var res = await lastValueFrom(this._imageService.viewImage(nombreUsuOIdPub ? nombreUsuOIdPub : ""));
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagenTemp = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
      if (!chatrooms) {
        this.imagenUsu = this.imagenTemp;
      }else{
        this.imagenesUsus.push(new ImageUserPost(nombreUsuOIdPub||"",this.imagenTemp));
      }

    }
    
    reader.readAsDataURL(new Blob([res]));
    

  }


  public buscarPosImagen(nombreUsu: string): number {
    if(this.imagenesUsus.length>0){
      return this.imagenesUsus.findIndex(i => i.nombreUsuario == nombreUsu);
    }else{
      return -1;
    }
  }
}
