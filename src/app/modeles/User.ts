import { Profil } from "./Profil";
import { Profilsortie } from "./Profilsortie";

export class User 
{
    id: number;
    email: string;
    roles:string;
    prenom: string;
    password:string;
    profil:Profil;
    nom:string;
    avatar : string;
    token: string;
    genre:string;
    adresse?:string;
    telephone?:string;
    type:string;
    profilsortie: Profilsortie;
}
