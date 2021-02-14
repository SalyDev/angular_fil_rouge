import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../modeles/User';
import { UserService } from '../_services/user.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AlertService } from '../_services/alert.service';
import Swal from 'sweetalert2'
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['prenom','nom','profil','actions'];
  private userUrl = environment.apiUrl+'/admin/users';
  public users:User[] = [];
  currentUserEmail:string;
  constructor(private userService:UserService, private alertService: AlertService, private authService: AuthService) { }
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey :string;
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    return this.userService.get(this.userUrl).subscribe(users => {
      this.authService.getUserInfos().subscribe(
        user => {
          this.currentUserEmail = user.email;
          // on enleve l'user connecté sur la liste des users
          // this.users = users.filter(item => item.email !== this.currentUserEmail);
          this.users = users;
          this.listData = new MatTableDataSource(this.users);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
        },
        () => {
          this.alertService.showErrorMsg('Désolé, une erreur est survenue du serveur');
        }
      );
    });
  }

  onArchiveUser(id:number){
      const url = this.userUrl+'/'+id;
      this.alertService.confirmDeleting('Etes-vous sûr de supprimer cet utilisateur?').then((result) => {
        if (result.isConfirmed) {
          this.userService.archive(url).subscribe(() => this.getUsers());
          Swal.fire(
            'Utilisateur archivé!',
          )
        }
      })
      this.getUsers();
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }
}
