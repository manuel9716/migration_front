import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

//Back1 = Nodejs
//Back2 = .Net

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  servidor='http://45.230.33.14:4235/api/'

  constructor(private servicio:HttpClient) { }
  

  Migration(){
    return this.servicio.get(this.servidor + 'migration')
  }
}
