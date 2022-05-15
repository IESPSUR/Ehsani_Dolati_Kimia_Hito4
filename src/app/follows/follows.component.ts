import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { UserDTO } from '../DTO/UserDTO';
import { FollowsService } from '../services/follows.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-follows',
  templateUrl: './follows.component.html',
  styleUrls: ['./follows.component.css']
})
export class FollowsComponent implements OnInit {

  public users = Array<any>();
  public nombreUsuario: string;
  public follower:boolean;
  public title:string;
  constructor(public _router: Router, private _followService: FollowsService, private actRout: ActivatedRoute) {
    this.nombreUsuario = this.actRout.snapshot.params['nombreUsuario'];
  }

  ngOnInit(): void {
    this.title="Followings";
    
      if (this.nombreUsuario) {
        if (this._router.url == "/users/" + this.nombreUsuario + "/followings") {
          this.followings(this.nombreUsuario);
          this.follower=false;
          this.title="Followings";
        } else {
          this.follower=true;
          this.followers(this.nombreUsuario);
          this.title="Followers";

        }
      } else {
        if (this._router.url == "/myProfile/followers") {
          this.followers();
          this.follower=true;
          this.title="Followers";
        } else {
          this.follower=false;
          this.followings();
          this.title="Followings";
        }
      }
    
  }

  public async followers(nombreUsuario?: string) {
    var service = this._followService.followers(nombreUsuario ? nombreUsuario : sessionStorage.getItem("nombreUsuario") || "");
    this.users = await lastValueFrom(service);
  }

  public followings(nombreUsuario?: string) {
    this._followService.followings(nombreUsuario ? nombreUsuario : sessionStorage.getItem("nombreUsuario") || "").subscribe(data => {
      return this.users = data;
    })
  }

  public unFollow(nombreUsuario: string) {
      this._followService.unFollow(sessionStorage.getItem("nombreUsuario") || "", nombreUsuario).subscribe(data => {
        this.users.splice(this.users.findIndex((u)=>u.nombreUsuario ==nombreUsuario),1);
      })
  

  }
}
