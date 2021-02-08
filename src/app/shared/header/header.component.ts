import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggle: EventEmitter<any> = new EventEmitter();
  constructor(private authService: AuthService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  toggleSideBar(){
    this.toggle.emit();
  }

  // fonction pour la deconnexion
  loggout(){
    this.alertService.confirmDeleting("Etes-vous sur de quitter l'application?").then((result) => {
      if (result.isConfirmed) {
        this.authService.getDeconnected();
        Swal.fire(
          'A bientot!',
        )
      }
    })
  }

}
