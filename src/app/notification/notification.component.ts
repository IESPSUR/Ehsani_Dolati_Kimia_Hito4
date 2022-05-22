import { Component, OnInit } from '@angular/core';
import { PostDTO } from '../DTO/PostDTO';
import { FollowsService } from '../services/follows.service';
import { AdoptionRequestsService } from '../services/adoption-requests.service';

import { PostService } from '../services/post.service';
import { FollowDTO } from '../DTO/FollowDTO';
import { RequestDTO } from '../DTO/RequestDTO';
import { EmailService } from '../services/email.service';
import * as bootstrap from 'bootstrap';
import { ImageUserPost } from '../DTO/ImagenUserPost';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';
declare var $: any;
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  public opcionSeleccionado: number = 0;
  public post: PostDTO;
  public notifications: Array<any>;
  public imagesNotfs: Array<ImageUserPost>;

  constructor(private _sanitizer: DomSanitizer, private _imageService: ImageService, private _emailService: EmailService, private _postService: PostService, private _adoptReqService: AdoptionRequestsService, private _followService: FollowsService) {
    this.notifications = [];
    this.imagesNotfs = [];
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
    this.imagesNotfs=[];
    this.notifications=[];
    if (this.opcionSeleccionado == 1) {
      this._followService.followers(sessionStorage.getItem("nombreUsuario") || "").subscribe(data => {
        this.notifications = data;
        this.getImagesUsuNotf();
      })
    } else {
      this._adoptReqService.getSolicitudesDeUnUsuario().subscribe(data => {
        this.notifications = data;
        this.getImagesUsuNotf();

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

  getImagesUsuNotf() {
    this.notifications.forEach(notf => {
      if(!notf.nombreUsuario){
        this.getImagen(notf.toString(), true);
      }else{
        this.getImagen(notf.nombreUsuario.nombreUsuario, true);
      }
    });
  }

  public getImagen(nombreUsu?: string, notf?: boolean): any {
    this._imageService.viewImage(nombreUsu ? nombreUsu : "").subscribe(
      res => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          var image = this._sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
          this.imagesNotfs.push(new ImageUserPost(nombreUsu || "", image));

        }
        reader.readAsDataURL(new Blob([res]));
      }
    );
  }

  public buscarImageIndice(nombreUsu: string): number {
    return this.imagesNotfs.findIndex(i => i.nombreUsuario == nombreUsu);

  }

}
