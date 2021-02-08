import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profil } from '../modeles/Profil';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private profilUrl = environment.apiUrl+'/admin/profils';

  constructor(private http: HttpClient) { }

  // fonction permettant de lister les profils
  getProfils():Observable<Profil[]>{
      return this.http.get<Profil[]>(this.profilUrl).pipe(map(
          theProfils=>{
            console.log(theProfils);
            return theProfils;
          }
        )
        )
        
  }
}
