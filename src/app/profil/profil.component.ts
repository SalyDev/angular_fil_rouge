import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Profil } from '../modeles/Profil';
import { UserService } from '../_services/user.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2'
import { AlertService } from '../_services/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../modeles/User';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  private profilUrl = environment.apiUrl+'/admin/profils';
  profils:Profil[] = [];
  libelleUpdated:string;
  addNewPs:boolean;
  profilForm: FormGroup;
  users:User[] = [];
  isShowDetails: boolean = false;
  searchKey :string;
  constructor(private userService:UserService, public activatedRoute:ActivatedRoute, private alertService: AlertService) { }

  @ViewChild(MatSort) sort: MatSort;

  // pagination de la table des profils
  dataSourceOne: MatTableDataSource<Profil[]>;
  displayedColumnsOne: string[] = ['libelle', '$$edit'];
  @ViewChild('TableOnePaginator', {static: true}) tableOnePaginator: MatPaginator;

  // pagination de la table des users
  dataSourceTwo: MatTableDataSource<User[]>;
  displayedColumnsTwo: string[] = ['avatar','nom'];
  @ViewChild('TableTwoPaginator', {static: true}) tableTwoPaginator: MatPaginator;

  
  ngOnInit(): void {
    this.getProfils();
  }

  getProfils(){
    return this.userService.get(this.profilUrl).subscribe(
        profils => {
          this.profils = profils;
          this.dataSourceOne = new MatTableDataSource(profils);
          this.dataSourceOne.sort = this.sort;
          this.dataSourceOne.paginator = this.tableOnePaginator;
        },
        error => console.log(error),
    );
  }
  
  onArchiveProfil(id:number){
    const url = this.profilUrl+'/'+id;
    this.alertService.confirmDeleting('Etes-vous sur de supprimer cet profil?').then((result) => {
      if (result.isConfirmed) {
        this.userService.archive(url).subscribe(() => this.getProfils());
        Swal.fire(
          'Profil archivé!',
        )
      }
    })
    this.getProfils();
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter(){
    this.dataSourceOne.filter = this.searchKey.trim().toLocaleLowerCase();
  }

    // on reiniliatise à undefined la valeur du libelleUpdated lorsqu'on clik sur le edit button
  onInitInput(){
    this.libelleUpdated = undefined;
  }

  onEdit(id)
  {
    // si la valeur du libellé a changé
    const url = this.profilUrl+'/'+id;
    if(this.libelleUpdated){
      this.userService.update(url, {
        "libelle":this.libelleUpdated
        })
        .subscribe(successmsg=>{
          console.log(successmsg);
          this.getProfils();
      },
      error => console.log(error)
      );
    }
  }

  // detection de modification du libellé
  changeLibelle(event){
    this.libelleUpdated = event.target.value;
  }

  addPs(){
    this.addNewPs = true;
    this.profilForm = new FormGroup({
      "libelle": new FormControl('', Validators.required)
    })
  }

   onSubmitForm(){
    const body = {
              "libelle": this.profilForm.get('libelle').value
              };
    this.userService.add(this.profilUrl,body).subscribe(
      successResponse => {
        this.getProfils();
        console.log(successResponse)
      },
      error => console.log(error)
    );
  }

  onCancelAdding(){
    this.addNewPs = false;
  }

// afficher les users d'un profil
  showUserOfProfil(id){
    this.isShowDetails = true;
    const url = this.profilUrl+'/'+id+'/users';
    this.userService.get(url).subscribe(
      (users) =>{
        this.users = users;
        console.log(this.users);
        this.dataSourceTwo = new MatTableDataSource(users);
        this.dataSourceTwo.paginator = this.tableTwoPaginator;
      },
      (error) => console.log(error)
    )
  }

  closeDetails(){
    this.isShowDetails = false;
  }
}
