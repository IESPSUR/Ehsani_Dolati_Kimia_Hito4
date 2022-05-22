import { SafeResourceUrl } from "@angular/platform-browser";

export class ImageUserPost{
    constructor(
    public nombreUsuario: string,
    public image: SafeResourceUrl) {
  }
}