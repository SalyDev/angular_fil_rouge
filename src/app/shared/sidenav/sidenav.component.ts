import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modeles/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  panelOpenState = false;
  email:string;
  nom:string;
  avatar:string;
  user: User;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getTheUser();
    this.authService.connectedUserObs.subscribe(user => this.user = user);
  }

  getTheUser(){
    this.authService.getUserInfos().subscribe(
      user => {
        this.authService.nexUser(user);
      },
      error => {
        console.log(error);
      }
    )
  }

  


}
