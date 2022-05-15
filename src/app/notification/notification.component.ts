import { Component, OnInit } from '@angular/core';
import { PostDTO } from '../DTO/PostDTO';
import { FollowsService } from '../services/follows.service';
import { AdoptionRequestsService } from '../services/adoption-requests.service';

import { PostService } from '../services/post.service';
import { FollowDTO } from '../DTO/FollowDTO';
import { RequestDTO } from '../DTO/RequestDTO';
import { EmailService } from '../services/email.service';
import * as bootstrap from 'bootstrap';
declare var $ :any;
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  public opcionSeleccionado: number = 0;
  public post: PostDTO;
  public notifications: Array<any>;
  public adopciones: Array<any>;

  constructor(private _emailService: EmailService, private _postService: PostService, private _adoptReqService: AdoptionRequestsService, private _followService: FollowsService) {
    this.notifications = [];
  }

  ngOnInit(): void {
  }

  public follow(nombreUsuario: string) {
    this._followService.follow(new FollowDTO(sessionStorage.getItem("nombreUsuario") || "", nombreUsuario)).subscribe(data => {
      return this.post = data;
    })
    this.notifications.splice(this.notifications.findIndex(n => n == nombreUsuario), 1);

  }

  public getAnimalSolicitado(DNI: string) {
    this._postService.getAnimalInfo(DNI).subscribe(data => {
      return this.post = data;
    })
  }

  public obtenerLista() {

    if (this.opcionSeleccionado == 1) {
      this._followService.followers(sessionStorage.getItem("nombreUsuario") || "").subscribe(data => {
        return this.notifications = data;
      })
    } else {
      this._adoptReqService.getSolicitudesDeUnUsuario().subscribe(data => {
        return this.notifications = data;
      })
    }
  }

  public responderSolicitud(res: string, dniAnimal: string, usu: string, fecha: string) {
    this._adoptReqService.responderSolicitud(res, new RequestDTO(dniAnimal, usu, fecha)).subscribe()
    var posSolicitud = this.notifications.findIndex(n => n.animalesDNI.dni == dniAnimal && n.nombreUsuario.nombreUsuario == usu && n.fecha == fecha);
    this._emailService.createSendEmailRequest({ correoDeUsu: this.notifications[posSolicitud].nombreUsuario.correo, respuesta: res, dniAnimal: dniAnimal, propietario: this.notifications[posSolicitud].animalesDNI.publicaciones_id.nombreUsuario.nombreUsuario }).subscribe(res => {
      $('#modalEmail').modal('show');
      setTimeout(function () {
        $('#modalEmail').modal('hide');
      }, 3000);
    });
    this.notifications.splice(posSolicitud, 1);
  }


}
