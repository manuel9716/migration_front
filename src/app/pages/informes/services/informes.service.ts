import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class InformesService {
	API_URL = "http://45.230.33.14:4001/api";

	constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
		if (error.status === 0) {
			console.error('An error occurred:', error.error);
		} else {
			console.error(`Backend returned code ${error.status}, body was: `, error.error.msg);
		}
		return throwError('Something bad happened; please try again later.');
	}

	getDesplazamientosPorCuadrillaSencillo(
		fechaDesde: string,
		fechaHasta: string
	) {
		return this.http
			.get(
				`${this.API_URL}/SQLquery?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`
			)
			.pipe(catchError(this.handleError));
	}
}
