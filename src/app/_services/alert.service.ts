import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private userService: UserService) { }

  // fonction pour la confirmation d'un archivage
  confirmDeleting(msg){
    return Swal.fire({
      title: msg,
      // text: "La confirmation menera à son archivage!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: 'accent',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    })
  }

}
