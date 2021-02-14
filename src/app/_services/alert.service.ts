import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private userService: UserService) { }

  // fonction pour la confirmation d'un archivage
  confirmDeleting(msg: string) {
    return Swal.fire({
      title: msg,
      // text: "La confirmation menera à son archivage!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3dbdd5',
      cancelButtonColor: '#FF5722',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    })
  }

  // fonction permettant d'afficher un msg d'ereur en alert
  showErrorMsg(msg: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: msg,
    })
  }

  // fonction permettant d'afficher un msg de succes
  showMsg(msg: string){
    Swal.fire({
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 1500
    })
  }

  // fonction permettant d'afficher un progress spinner sous forme d'alert
  showProgressSpinner(){
    Swal.fire('Veuillez patienter')
    Swal.showLoading()
  }

}
