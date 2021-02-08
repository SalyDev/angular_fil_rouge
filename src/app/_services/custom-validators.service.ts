import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }

  // fonction pour la validation d'un fichier
  requiredFileType(types:string[]) {
    
    return function (control: FormControl) {
      const file = control.value;
      console.log(file);
      if (file) {
        const decoupage = file.name.split('.');
        const extension = (decoupage[decoupage.length - 1]).toLocaleLowerCase();
        console.log(extension);
        if(types.indexOf(extension)==-1){
          return {
                requiredFileType: true
              };
        }
        return null;
      }
      // // si le file est null (pdf,et autres)
      // return {
      //   requiredFileType: true
      // };

    };
  }
  
}
