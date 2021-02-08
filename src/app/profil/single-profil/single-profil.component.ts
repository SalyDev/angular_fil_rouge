import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Profil } from 'src/app/modeles/Profil';
import { environment } from 'src/environments/environment';
import { UserService } from '../../_services/user.service';


@Component({
  selector: 'app-single-profil',
  templateUrl: './single-profil.component.html',
  styleUrls: ['./single-profil.component.css']
})

export class SingleProfilComponent implements OnInit {
  profilForm:FormGroup;
  public profil:Profil;
  
  constructor(
    private userService: UserService, private Activatedrouter:ActivatedRoute, 
    private formBuilder:FormBuilder, private router:Router){}
    
    private id = this.Activatedrouter.snapshot.params["id"];
    profilUrl = environment.apiUrl+'/admin/profils/'+this.id;

  ngOnInit(): void {
    this.userService.view(this.profilUrl).subscribe(profil=>{
      this.profilForm = this.formBuilder.group({
        "libelle":[profil.libelle, Validators.required]
      })
      this.profil = profil;
    });
  }

  onSubmitForm(){
    this.userService.update(this.profilUrl, {
      "libelle":this.profilForm.get('libelle').value
      })
      .subscribe(successmsg=>{
        this.router.navigate(['default/profils']);
        console.log(successmsg);
      
    },
    error => console.log(error)
    );
    
  }

  onCancelUpdate(){
    this.router.navigate(['default/profils']);
  }
}
