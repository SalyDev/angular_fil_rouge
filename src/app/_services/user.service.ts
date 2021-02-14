import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../modeles/User';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2'
import { catchError } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private userUrl = environment.apiUrl+'/admin/users';

  constructor(private http : HttpClient) {}

  //fonction permettant de recuperer la liste des elements dans la BD
  get(url:string):Observable<any[]>
  {
    return this.http.get<any[]>(url);
  }

  //fonction pour l'update d'un utilisateur
  update(url:string, body:any):Observable<any>{
      return this.http.put<any>(url, body);
  }

  // fonction permettant d'archiver
    archive(url){
      return this.http.delete(url);
    }

  // fonction permettant d'ajouter un nouvel utilisateur et aussi de modifier un user
  add(url:string, body:any):Observable<any>{
    return this.http.post<any>(url, body).pipe(
      // catchError(this.handleError)
    );
  }


  // fonction permettant de voir les details d'un user
  view(url:string):Observable<any>{
    return this.http.get<any>(url);
  }


// fonction pour la gestion des ereurs
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error.detail}`);

      return error.error.detail;
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }


   // fonction pour la suppression d'un element d'un tableau
   removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }


  addChip(event: MatChipInputEvent, tableau: any[]): void {
    const input = event.input;
    const value = event.value;

    // Ajout d'une new competence chips
    if (tableau.indexOf(value) == -1) {
      if ((value || '').trim()) {
        tableau.push(value);
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  

 
}
