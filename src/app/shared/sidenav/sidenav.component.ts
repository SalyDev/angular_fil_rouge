import { Component, OnInit } from '@angular/core';
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

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getTheUser();
  }

  getTheUser(){
    this.authService.getUserInfos().subscribe(
      user => {
        this.email = user.email;
        this.nom = user.prenom+' '+user.nom;
        this.avatar = user.avatar;
      },
      error => {
        console.log(error);
      }
    )
  }

}
