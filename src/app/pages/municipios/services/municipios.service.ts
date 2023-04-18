import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// Env
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class MunicipiosService {
	
	constructor(
		private _http: HttpClient
	) { }
	
	
	private handleError(error: HttpErrorResponse) {
		if (error.status === 0) {
			console.error('An error occurred:', error.error);
		} else {
			console.error(`Backend returned code ${error.status}, body was: `, error.error.msg);
		}
		return throwError('Something bad happened; please try again later.');
	}
	
		
	listDepartamentos(token: string) {
		let httpOptions = {headers: new HttpHeaders({'Content-Type':  'application/x-www-form-urlencoded'})};	
	
		return this._http.post(
			`${environment.apiUrl}departamentos/list`,
			"authorization=" + token,
			httpOptions
		)
		
	}

	listMunicipiosByDepartamento(token: string, $idDepartamento){
		let httpOptions = {headers: new HttpHeaders({'Content-Type':  'application/x-www-form-urlencoded'})};
		return this._http.post(
			environment.apiUrl + 'municipios/listbydepartamento/'+ $idDepartamento,
			"authorization=" + token,
			httpOptions
		)
	}


	getMunicipiosById(token: string, idMunicipio) {
		let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};
		return this._http.get(`${environment.apiUrl}municipios/getbyid/${idMunicipio}`, httpHeaders)
		.pipe(catchError(this.handleError));
	}


	getBarriosByMunicipio(token: string, idMunicipio) {
		let httpOptions = {headers: new HttpHeaders({'Content-Type':  'application/x-www-form-urlencoded'})};
		return this._http.post(
			environment.apiUrl + 'barrios/listbymunicipio/'+ idMunicipio,
			"authorization=" + token,
			httpOptions
		) 
	}

	editBarrio(token: string, data: FormData) {
		let httpHeaders = {headers: new HttpHeaders(
			{'Authorization':  `Bearer ${token}`}
		)};
		return this._http.post(`${environment.apiUrl}barrios/edit`, data, httpHeaders)
	}

	createBarrio(token: string, data: FormData) {
		let httpHeaders = {headers: new HttpHeaders(
			{'Authorization':  `Bearer ${token}`}
		)};
		return this._http.post(`${environment.apiUrl}barrios/create`, data, httpHeaders)
	}

	deleteBarrio(token: string, idBarrio) {
		let httpHeaders = {headers: new HttpHeaders(
			{'Authorization':  `Bearer ${token}`}
		)};
		return this._http.delete(`${environment.apiUrl}barrios/delete/${idBarrio}`, httpHeaders)
	}



	// listEstadosTransacciones(token: string) {
	// 	let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};
				
	// 	return this._http.get(`${environment.apiUrl}estadostransacciones/list`, httpHeaders)
	// 	.pipe(catchError(this.handleError));
	// }
		
}
		
	
