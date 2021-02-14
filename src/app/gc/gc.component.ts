import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Competence } from '../modeles/Competence';
import { GroupeCompetences } from '../modeles/GroupeCompetences';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-gc',
  templateUrl: './gc.component.html',
  styleUrls: ['./gc.component.css']
})
export class GcComponent implements OnInit {

  listData: MatTableDataSource<any>;
  searchKey :string;
  panelOpenState = false;
  gcUrl = environment.apiUrl+'/admin/groupe_competences';
  listGc:GroupeCompetences[]=[];
  competences:Competence[]=[];
  displayedColumns: string[] = ['libelle','descriptif', 'competences', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;

  constructor(private userService: UserService, private alertService: AlertService) { }

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
      () => {
        this.alertService.showProgressSpinner();
        this.alertService.showErrorMsg('Désolé, une ereur est survenue du serveur')
      }
      )
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  onArchiveGc(id: number){
    const url = environment.apiUrl + '/admin/groupe_competences/' + id;
    this.alertService.confirmDeleting('Etes-vous de vouloir supprimer cette groupe de compétences').then((result) => {
      if (result.isConfirmed) {
        this.userService.archive(url).subscribe(() => this.getListGc());
        Swal.fire(
          'Groupe de compétences supprimé avec succès!',
        )
      }
    })
  }

}
