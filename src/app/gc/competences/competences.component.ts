import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Competence } from 'src/app/modeles/Competence';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/_services/alert.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.css']
})
export class CompetencesComponent implements OnInit {
  
  competenceUrl = environment.apiUrl+'/admin/competences'

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('PaginatorOne', {static: true}) paginatorOne: MatPaginator;
  listDataOne: MatTableDataSource<any>;
  obs: Observable<any>;

  @ViewChild('PaginatorTwo', {static: true}) paginatorTwo: MatPaginator;
  listDataTwo: MatTableDataSource<any>;
  obsTwo: Observable<any>;

  searchKey :string;
  constructor(private userService: UserService, private changeDetectorRef: ChangeDetectorRef, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getCompletCompetences();
    this.getIncompletCompetences();
  }

  getCompletCompetences(){
    const url = this.competenceUrl+"/complet";
    this.userService.get(url).subscribe(
      competences => {
        this.listDataOne = new MatTableDataSource(competences);
        this.changeDetectorRef.detectChanges();
        this.listDataOne.sort = this.sort;
        this.listDataOne.paginator = this.paginatorOne;
        this.obs = this.listDataOne.connect();
      },
      () => {
        this.alertService.showProgressSpinner();
        this.alertService.showErrorMsg('Désolé, une erreur est survenue du serveur')
      }
    )
  }

  getIncompletCompetences(){
    const url = this.competenceUrl+"/incomplet";
    this.userService.get(url).subscribe(
      competences => {
        this.listDataTwo = new MatTableDataSource(competences);
        // this.changeDetectorRef.detectChanges();
        this.listDataTwo.sort = this.sort;
        this.listDataTwo.paginator = this.paginatorTwo;
        this.obsTwo = this.listDataTwo.connect();
      },
      () => {
        this.alertService.showProgressSpinner();
        this.alertService.showErrorMsg('Désolé, une erreur est survenue du serveur');
      }
    )
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter(){
    this.listDataOne.filter = this.searchKey.trim().toLocaleLowerCase();
    this.listDataTwo.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  // fonction pour la suppression d'une competence
  onDeleteCompetence(id: number){
    const url = this.competenceUrl+'/'+id;
    this.alertService.confirmDeleting('Etes-vous de vouloir supprimer cette compétence').then((result) => {
      if (result.isConfirmed) {
        this.userService.archive(url).subscribe(() => this.getCompletCompetences());
        Swal.fire(
          'Compétence supprimée avec succès!',
        )
      }
    })
  }
}
