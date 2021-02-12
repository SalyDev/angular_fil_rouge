import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Promo } from '../modeles/Promo';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { MyDataSource } from './my-data-source';
import pdfMake from "pdfmake/build/pdfmake";
import { from } from 'rxjs';
import { of } from 'rxjs';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { MatSort } from '@angular/material/sort';
import { CustomValidatorsService } from '../_services/custom-validators.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.css']
})
export class PromosComponent implements OnInit {
  promos: Promo[] = [];
  private promoUrl = environment.apiUrl + '/admin/promos';
  isShownApprenantEnAttente = false;
  isShownApprenantInPromo = false;
  listApprenants: any[] = [];
  apprenantsEnAttente: any[] = [];
  promoTitle: string;
  apprenantsInPromo: any[] = [];
  isChargeCsvFile: boolean = false;
  apprenants: string;
  promoId: number;
  ds: any;
  body: FormData;


  @ViewChild('PromoPaginator') promoPaginator: MatPaginator;
  obs: Observable<any>;
  listData: MatTableDataSource<any>;
  searchKey: string;

  // pagination des apprenants ayant deja rejoint la promo
  @ViewChild('StudentInPromoPaginator') studentInPromoPaginator: MatPaginator;
  displayedColumnsOne: string[] = ['avatar','prenom', 'nom', 'action'];
  dataSourceOne: MatTableDataSource<any>;

  // pagination des apprenants en attente
  @ViewChild('WaitingStudentsPaginator') waitingStudentsPaginator: MatPaginator;
  displayedColumnsTwo: string[] = ['email', 'relance'];
  dataSourceTwo: MatTableDataSource<any>; 


  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: string[] = [];
  btnLibelle: string;

  constructor(private userService: UserService, private changeDetectorRef: ChangeDetectorRef, private alertService: AlertService, private customValidatorsService: CustomValidatorsService) { }

  csvControl = new FormControl();
  
  ngOnInit(): void {
    this.getPromos();

   


    this.csvControl.setValidators([Validators.required, this.customValidatorsService.requiredFileType(['ods','csv','xlsx','xls'])]);
    // this.getPagini();
  }

  add(event: MatChipInputEvent): void {
    this.userService.addChip(event, this.emails);
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  getPromos() {
    this.userService.get(this.promoUrl).subscribe(
      promos => {
        this.promos = promos;
        this.changeDetectorRef.detectChanges();
        this.listData = new MatTableDataSource(this.promos);
        this.listData.paginator = this.promoPaginator;
        this.obs = this.listData.connect();
      }
    )
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  // fonction pour l'archivage d'une promo
  onDeletePromo(id: number) {
    const url = environment.apiUrl + '/admin/promos/' + id;
    this.alertService.confirmDeleting('Etes-vous de vouloir supprimer cette promotion').then((result) => {
      if (result.isConfirmed) {
        this.userService.archive(url).subscribe(() => this.getPromos());
        Swal.fire(
          'Promo supprimée avec succès!',
        )
      }
    })
  }

  // la liste des apprenants de la promo
  getApprenantsInPromo(id: number, promoTitle: string) {
    this.isShownApprenantEnAttente = true;
    this.isShownApprenantInPromo = true;
    this.promoId = id;
    this.promoTitle = promoTitle;
    this.apprenantsInPromo = [];
    // this.ds = new MyDataSource(this.userService, id);
    // console.log(this.ds);
    const url = environment.apiUrl + '/admin/promos/' + id;
    this.userService.view(url).subscribe(
      (promo) => {
        promo.groupes.forEach(groupe => {
          groupe.apprenants.forEach(apprenant => {
            // console.log(apprenant);
            let isContain = false;
            this.apprenantsInPromo.forEach(apprenantInPromo => {
              if (apprenantInPromo.email == apprenant.email) {
                isContain = true;
              }
            });
            if (!isContain && apprenant.hasJoinPromo) {
              this.apprenantsInPromo.push(apprenant);
            }
          });
          // console.log(this.apprenantsInPromo);
          this.dataSourceOne = new MatTableDataSource(this.apprenantsInPromo);
          // this.listData.sort = this.sort;
          this.dataSourceOne.paginator = this.studentInPromoPaginator;
        }
        
        )
        ;
      },
    )

  //   const array: any[] = [1,2,3,4,5,6,7]
  //   const simpleObservable = new Observable<any>((observer) => {

  //     // observable execution
  //     // observer.next([1,2,3,4,5,6,7])
  //     array.forEach(element => {
  //       observer.next(element);
  //     });
  //     // observer.complete()
  // })

    
    // const obsof1=of(1,2,3);
    // const promiseSource = from(new Promise<any>(resolve => resolve(array)));
    // const obsFrom5 = from(promiseSource);
    // simpleObservable.subscribe(
    //   (result) => {
    //     this.dataSourceOne = new MatTableDataSource(result);
    //     // this.listData.sort = this.sort;
    //     this.dataSourceOne.paginator = this.studentInPromoPaginator;
    //   }
    // )

    // this.userService.get(this.promoUrl).subscribe(
    //   (result) => {
    //     this.dataSourceOne = new MatTableDataSource(result);
    //     // this.listData.sort = this.sort;
    //     this.dataSourceOne.paginator = this.studentInPromoPaginator;
    //   }
    // )

    // console.log(this.apprenantsInPromo);
    // this.dataSourceOne = new MatTableDataSource(this.apprenantsInPromo);
    // this.dataSourceOne.paginator = this.studentInPromoPaginator;

    // console.log(this.dataSourceOne);
    // this.dataSourceOne = new MatTableDataSource(profils);
    // this.dataSourceOne.sort = this.sort;
    // this.dataSourceOne.paginator = this.tableOnePaginator;

    //  les apprenants en attente
    const attenteUrl = environment.apiUrl + '/admin/promos/' + id + '/apprenants/attente';
    this.userService.get(attenteUrl).subscribe(
      (apprenantsEnAttente) => {
        this.apprenantsEnAttente = apprenantsEnAttente;
        this.dataSourceTwo = new MatTableDataSource(apprenantsEnAttente);
        this.dataSourceTwo.paginator = this.waitingStudentsPaginator;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // getPagini() {
  //   const array=[1,2,3,4,5,6,7]
  //   // const obsof1=of(array);
  //   const promiseSource = from(new Promise<any>(resolve => resolve(array)));
  //   const obsFrom5 = from(promiseSource);
  //   obsFrom5.subscribe(
  //     (result) => {
  //       this.dataSourceOne = new MatTableDataSource(result);
  //       this.dataSourceOne.sort = this.sort;
  //       this.dataSourceOne.paginator = this.studentInPromoPaginator;
  //     }
  //   )
    // this.userService.get(this.promoUrl).subscribe(
    //   (result) => {
    //     this.listData = new MatTableDataSource(result);
    //         this.listData.sort = this.sort;
    //         this.listData.paginator = this.paginator;
    //   }
    // )
  // }

  // relance collectif
  onRelanceAll() {
    const url = environment.apiUrl + '/reset-password/relance/apprenants';
    this.userService.get(url).subscribe(
      (successMsg) => {
        console.log(successMsg);
        // sweet alert pour dire que les mails de relance a été envoyé
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // relance individul
  onRelanceOne(id: number) {
    const url = environment.apiUrl + '/reset-password/relance/apprenants/' + id;
    this.userService.get(url).subscribe(
      (successMsg) => {
        console.log(successMsg);
        // sweet alert pour dire que le mail de relance a été envoyé
      },
      (error) => {
        console.log(error);
        // alert : une erreur est servenue du serveur, veuillez reéssayer plus tard
      }
    )
  }

  // fonction pour l'ajout des apprenants
  onAddApprenant() {
    this.isShownApprenantInPromo = false;
  }

  // fonction pour retirer un apprenant de la promo
  onDeleteApprenantOfPromo(email: string) {
    const body =
    {
      "apprenant": email
    };

    const url = environment.apiUrl + '/admin/promos/' + this.promoId + '/apprenants';

    this.alertService.confirmDeleting('Etes-vous de vouloir supprimer cet(te) apprenant(e) de la promo?').then((result) => {
      if (result.isConfirmed) {
        this.userService.update(url, body).subscribe(() => this.getApprenantsInPromo(this.promoId, this.promoTitle));
        Swal.fire(
          'Apprenant(e) retiré(e) de la promo avec succès!',
        );
         // on reset les listes des apprenants
         this.getApprenantsInPromo(this.promoId, this.promoTitle); 
      }
    })
  }

  lines = []; //for headings
  linesR = []; // for rows
  onFileSelect(event:any) {
    const file = event.target.files[0];

    // console.log(this.csvControl.errors.requiredFileType);
// 
    // // if (event.target.files.length > 0) {


    //   //   if (file.type && file.type.indexOf('image') === -1) {
    //   //    // console.log('Type de fichier invalide.', file.type, file);
    //   //    this.isSelectedPromoAvatar = false;
    //   //    this.imgSource = '';
    //   //    this.promoAvatarMsg = '*Type de fichier invalide.';
    //   //    return;
    //   //  }

      this.csvControl.setValue(file);



      console.log(this.csvControl);
      console.log(this.csvControl.valid);
    // // }

    //File upload function
    // changeListener(files: FileList){
      // console.log(files);
      // if(files && files.length > 0) {
      //    let file : File = files.item(0); 
      //      console.log(file.name);
      //      console.log(file.size);
      //      console.log(file.type);
      //      return;
      //      //File reader method
      //      let reader: FileReader = new FileReader();
      //      reader.readAsText(file, 'UTF-8');
      //      reader.onload = (e) => {
      //       let csv: any = reader.result;
      //       let allTextLines = [];
      //       allTextLines = csv.split(/\r|\n|\r/);
           
           //Table Headings
            // let headers = allTextLines[0].split(';');
            // let data = headers;
            // let tarr = [];
            // for (let j = 0; j < headers.length; j++) {
            //   tarr.push(data[j]);
            // }
            // //Pusd headings to array variable
            // this.lines.push(tarr);
            
           
            // // Table Rows
            // let tarrR = [];
            
            // let arrl = allTextLines.length;
      //       let rows = [];
      //       for(let i = 1; i < arrl; i++){
      //       rows.push(allTextLines[i].split(';'));
           
      //       }
            
      //       for (let j = 0; j < arrl; j++) {
        
      //           tarrR.push(rows[j]);
                
      //       }
      //      //Push rows to array variable
      //       this.linesR.push(tarrR);
      //   }
      // }
    }

  // fonction pour charger un fichier csv
  onChargeCvsFile() {
    console.log('hey');
    console.log(this.isChargeCsvFile);
    // this.body = ""
    this.csvControl.setValue('');
    this.isChargeCsvFile = !this.isChargeCsvFile;
    this.btnLibelle = "Charger un fichier csv";
    this.body = new FormData();
    this.apprenants = "";
    // on reset le body => apprenant(s) à ajouter
    // console.log(this.body);
  }

  onCancelAdding() {
    this.isShownApprenantInPromo = true;
  }

  // fonction pour la soumission des apprenants à ajouter
  onSubmit() {
    this.apprenants = "";
    // ajout par emails/manuel
    if (this.emails.length != 0) {
      let formdata1 = new FormData();
      this.emails.forEach(email => {
        this.apprenants = this.apprenants + ' ' + email;
      });

      // console.log(this.apprenants);

      formdata1.append('groupes', this.apprenants);
      this.body = formdata1;
    }

    if (this.csvControl.value) {
      const formdata2 = new FormData();
      formdata2.append('file', this.csvControl.value);
      this.body = formdata2;
    }
    // console.log(body);
    const url = environment.apiUrl + '/admin/promos/' + this.promoId + '/apprenants';
    this.userService.add(url, this.body).subscribe(
      (addedStudents) => {
        console.log(addedStudents);
        addedStudents.forEach(addedStudent => {
           // on genere le pdf avec les infos et le code qr de l'apprenant
          this.generateStudentCard(addedStudent.email, addedStudent.prenom, addedStudent.nom, addedStudent.avatar);

          // on reset les listes des apprenants
          this.getApprenantsInPromo(this.promoId, this.promoTitle); 
        });

        this.isShownApprenantInPromo = true;
        // on vide les emails (chips)
        this.emails = [];
      },
      (error) => {
        console.log(error);
      }
    )
    // this.generateStudentCard(email);
  }

  // fonction pour generer la carte de l'etudiant
  generateStudentCard(email: string, prenom: string, nom: string, image: any) {
    let docDefinition =
    {
      header: [
        {
          text: 'Sonatel Academy',
          style: 'myStyle'
        }
      ],
      content: [
        {
          columns: [
            [
              {
                image: 'data:image/jpg;base64,' + image,
                fit: [100, 100],
              },
            ],
            [
              {
                text: 'Email',
                style: 'titre'
              },
              { text: email },
              { text: 'Prénom', style: 'titre' },
              { text: prenom },
              { text: 'Nom', style: 'titre' },
              { text: nom },
              [{ text: 'Code Qr', style: 'titre' }],
              [{ qr: email, fit: '100' }],
            ]
          ]
        },
      ],
      footer: [
        {
          text: 'Coding For Better Life',
          style: 'myStyle'
        }
      ],
      styles: {
        titre: {
          bold: true,
          fontSize: 14,
          color: '#3c908d',
          fontStyle: 'italic',
          margin: [0, 0, 5, 0]
        },
        myStyle: {
          fontStyle: 'italic',
          color: '#f6812a'
        }
      }
    };
    pdfMake.createPdf(docDefinition).open();
  }
}