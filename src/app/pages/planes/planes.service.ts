import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// Env
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class PlanesService {
	
	constructor(
		private _http: HttpClient
	) { }

    httpOptions = {
        headers: new HttpHeaders(
            {'Content-Type':  'application/x-www-form-urlencoded'}
        )
    };
	
	
    listPlanesByMunicipios(token: string, idMunicipio){
		return this._http.post(
			`${environment.apiUrl}planes/listbymunicipio/${idMunicipio}`,
			`authorization=${token}`,
			this.httpOptions
		)
	}


	listPlanes(token: string, filters){
		return this._http.post(
			`${environment.apiUrl}planes/list`,
			`filters=${JSON.stringify(filters)}&authorization=${token}`,
			this.httpOptions
		)
	}

	associateMunicipio(token: string, data: FormData) {
		let httpHeaders = {headers: new HttpHeaders(
			{'Authorization':  `Bearer ${token}`}
		)};
		return this._http.post(`${environment.apiUrl}planes/associatemunicipio`, data, httpHeaders)
	}

	desassociateMunicipio(token: string, idPlanMunicipio) {
		let httpHeaders = {headers: new HttpHeaders(
			{'Authorization':  `Bearer ${token}`}
		)};
		return this._http.delete(`${environment.apiUrl}planes/desassociatemunicipio/${idPlanMunicipio}`, httpHeaders)
	}


	

		
}
		
	
