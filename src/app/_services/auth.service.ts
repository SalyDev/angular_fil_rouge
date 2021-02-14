import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../modeles/User';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  helper = new JwtHelperService();
  public user;
  actualUser: User;
  private loginUrl = environment.apiUrl+'/login';

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  test(){
    console.log(this.loginUrl);
  }
  //fonction permettant de se connecter
  getConnection(email:string, password:string){
    return this.http.post<any>(this.loginUrl,
      {
        "email":email,
        "password":password
      }
      )
      .pipe(map(user => {
        // console.log(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
      ;
  }

  // fonction pour renvoyer l'utilisateur actuel
  public get getCurrentUser(): User{
    return this.currentUserSubject.value;
  }

  // fonction permettant la deconnexion
  getDeconnected(){
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }

   // fonction permettant de recuperer les infos du user a partir du token

   getUserInfos():Observable<any>{
    let actualUser = JSON.parse(localStorage.getItem('currentUser'));
    // let actualUserInfos:any[] = [];
    // on decode le token
    const decoded_token = this.helper.decodeToken(actualUser.token);
    console.log(decoded_token);
    const email = decoded_token['username'];
    const url = environment.apiUrl+'/admin/user/'+email;
    return this.userService.view(url);
    // console.log(this.actualUser);
  }



}
