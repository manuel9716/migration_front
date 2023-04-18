import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NodeApiService {

  API_URL = 'http://45.230.33.14:4001/api'

  constructor(private http: HttpClient) { }

  getConsultaColumnas(column: string){
    return this.http.get(`${this.API_URL}/listarFechaPrueba?column=${column}`);
  }

  getConsultaDatos(indexInicio: number, indexFinal: number){
    return this.http.get(`${this.API_URL}/listarconIndex?indexInicio=${indexInicio}&indexFinal=${indexFinal}`);
  }
}
