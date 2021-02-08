import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = false;  // { path: 'cms', loadChildren: () => import('./cm/cm.module').then(m => m.CmModule) },
  // { path:'cms/:id', component:SingleUserComponent },
  constructor() { }

  ngOnInit(): void {
  }

  sideBarToggler(event){
    this.sideBarOpen = !this.sideBarOpen;
  }

}
