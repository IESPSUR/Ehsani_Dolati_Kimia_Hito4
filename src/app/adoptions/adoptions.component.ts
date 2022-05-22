import { Component, OnInit } from '@angular/core';
import { AdoptionRequestsService } from '../services/adoption-requests.service';

@Component({
  selector: 'app-adoptions',
  templateUrl: './adoptions.component.html',
  styleUrls: ['./adoptions.component.css']
})
export class AdoptionsComponent implements OnInit {
  public adoptions:Array<any>;
  constructor(private _adoptionService: AdoptionRequestsService) { }

  ngOnInit(): void {
    this.getAllAdoptions();
  }

  public getAllAdoptions(){
    this._adoptionService.getAllAdoptedAnimals().subscribe(res=>{
      this.adoptions=res;
    });
  }

}
