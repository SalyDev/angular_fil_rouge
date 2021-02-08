import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../modeles/User';
import { UserService } from '../_services/user.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['prenom','nom','email','profil','genre','actions'];
  // opened = false;
  private adminUrl = environment.apiUrl+'/admin/admins';
  public admins:User[] = [];
  constructor(private userService:UserService) { }
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey :string;
  ngOnInit(): void {
    this.getAdmins();
  }

  getAdmins(){
    return this.userService.get(this.adminUrl).subscribe(admins => {
      this.admins = admins;
      this.listData = new MatTableDataSource(this.admins);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });

    
  }

  onArchiveAdmin(id:number){
      const url = environment.apiUrl+'/admin/users/'+id;
      this.userService.archive(url).subscribe(data => {
      this.getAdmins();
      });
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  // onUpdate(id){
  //   // this.ad 
  //   // const dialogConfig = new MatDialogConfig();
  //   // dialogConfig.disableClose = true;
  //   // dialogConfig.autoFocus = true;
  //   // dialogConfig.width = "60%";
  //   // this.dialog.open(SingleUserComponent, dialogConfig);
  // }

}
