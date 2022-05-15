import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  uploadedImage: File;
  dbImage: any;
  postResponse: any;
  successResponse: string;


  protected endpointUploadImage: string = environment.url_back + '/upload/image/';
  protected endpointGetImage: string = environment.url_back + '/get/image/';


  public onImageUpload(event: any):File {
    return this.uploadedImage = event.target.files[0];
  }


  imageUploadAction(idPub?: string): Observable<any> {
    if (this.uploadedImage != null) {
      const imageFormData = new FormData();
      imageFormData.append('image', this.uploadedImage, (idPub ? idPub : sessionStorage.getItem("nombreUsuario")) + "_" + this.uploadedImage.name);
      return this.http.post(this.endpointUploadImage, imageFormData);
    } else {
      return new Observable;
    }
  }

  viewImage(nombreUsuOIdPub?: string): Observable<any> {
    return this.http.get(this.endpointGetImage + (nombreUsuOIdPub != "" ? nombreUsuOIdPub : sessionStorage.getItem("nombreUsuario")), {
      responseType: 'blob'
    });
  }


}

