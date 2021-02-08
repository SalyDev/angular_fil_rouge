import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Competence } from '../modeles/Competence';
import { GroupeCompetences } from '../modeles/GroupeCompetences';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-gc',
  templateUrl: './gc.component.html',
  styleUrls: ['./gc.component.css']
})
export class GcComponent implements OnInit {

  listData: MatTableDataSource<any>;
  searchKey :string;
  panelOpenState = false;
  // pour mockdata
  // gcUrl = environment.mockdataUrl+'/gc';
  // pour l'api
  gcUrl = environment.apiUrl+'/admin/groupe_competences';
  listGc:GroupeCompetences[]=[];
  competences:Competence[]=[];
  displayedColumns: string[] = ['libelle','descriptif', 'competences', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getListGc();
  }

  // fonction pour lister les lister les gc
  getListGc(){
    this.userService.get(this.gcUrl).subscribe(
      listGc => {
        this.listGc = listGc;
        this.listData = new MatTableDataSource(this.listGc);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.obs = this.listData.connect();
      },
      error => console.log(error)
      )
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  onArchiveGc(){

  }

}
