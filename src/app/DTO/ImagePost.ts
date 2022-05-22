import { SafeResourceUrl } from "@angular/platform-browser";

export class ImagePost{
    constructor(
    public id: number,
    public image: SafeResourceUrl) {
  }
}