import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// Env
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class TransaccionesService {
	
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
	
		
	listTransacciones(formData: FormData, token: string) {
		let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};	

		return this._http.post(`${environment.apiUrl}transacciones/list`, formData, httpHeaders)
		.pipe(catchError(this.handleError));
	}


	listConveniosPago(token: string) {
		let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};
	
		return this._http.get(`${environment.apiUrl}conveniospago/list`, httpHeaders)
		.pipe(catchError(this.handleError));
	}


	listEstadosTransacciones(token: string) {
		let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};
				
		return this._http.get(`${environment.apiUrl}estadostransacciones/list`, httpHeaders)
		.pipe(catchError(this.handleError));
	}
		
}
		
	
