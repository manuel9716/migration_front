import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// RXJS
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
// Env
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class ApiService {

	constructor(private http: HttpClient) { }

	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/x-www-form-urlencoded'
		})
	};

	
	private handleError(error: HttpErrorResponse) {
		if (error.status === 0) {
			console.error('An error occurred:', error.error);
		} else {
			console.error(`Backend returned code ${error.status}, body was: `, error.error.msg);
		}
		return throwError('Something bad happened; please try again later.');
	}
	

	login(json) {
		return this.http.post(
			environment.apiUrl + 'login',
			"json=" + JSON.stringify(json),
			this.httpOptions
		)
	};

	getInfoUser() {
		return this.http.get(
			'https://ipapi.co/json/'
		)
	};

	getEmpresa(token) {
		return this.http.post(
			environment.apiUrl + 'empresas/view',
			"authorization=" + token,
			this.httpOptions
		)
	};

	importFacturacionBloque(file, token) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('token', token);
		return this.http.post(
			environment.apiUrl + 'importfacturacionbloque',
			formData
		)
	};

	importEstadosCuentas(file, token) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('token', token);
		return this.http.post(
			environment.apiUrl + 'importestadoscuentas',
			formData
		)
	};

	topBarSearch(json, token) {
		return this.http.post(
			environment.apiUrl + 'topbarsearch',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};




	// PLANES

	getPlanes(filters, token) {
		return this.http.post(
			environment.apiUrl + 'planes/list',
			"filters=" + JSON.stringify(filters) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getFullPlanes(filters, token) {
		return this.http.post(
			environment.apiUrl + 'planes/listfull',
			"filters=" + JSON.stringify(filters) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getPlan(id, token) {
		return this.http.post(
			environment.apiUrl + 'planes/view/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createPlan(json, token) {
		return this.http.post(
			environment.apiUrl + 'planes/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editPlan(json, token) {
		return this.http.post(
			environment.apiUrl + 'planes/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deletePlan(id, token) {
		return this.http.post(
			environment.apiUrl + 'planes/delete/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	getTecnologiasPlanes(token) {

		let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};	

		return this.http.get(
			`${environment.apiUrl}tecnologiasplanes/list`,
			httpHeaders
		).pipe(
			catchError(this.handleError)
		);
	};


	// SOLICITUDES TERCERO

	getEstadosTiposSolTercero(token) {
		return this.http.post(
			environment.apiUrl + 'solicitudestercero/statusandtypes',
			"authorization=" + token,
			this.httpOptions
		)
	};

	getSolicitudesTerceroByCriteria(criteria, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudestercero/listbycriteria',
			"json=" + JSON.stringify(criteria) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getSolicitudesTercero(token) {
		return this.http.post(
			environment.apiUrl + 'solicitudestercero/list',
			"authorization=" + token,
			this.httpOptions
		)
	};

	getSolicitudesByTercero(id, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudestercero/listbytercero/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	getSolicitudTercero(id, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudestercero/view/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	changeStatusSolTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudestercero/changestatus',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	createSolTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudestercero/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};


	// ESTADOS SOL TERCERO

	getEstadosSolTercero(token) {
		return this.http.post(
			environment.apiUrl + 'estadossoltercero/list',
			"authorization=" + token,
			this.httpOptions
		)
	};

	createEstadoSolTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'estadossoltercero/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editEstadoSolTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'estadossoltercero/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteEstadoSolTercero(id, token) {
		return this.http.post(
			environment.apiUrl + 'estadossoltercero/delete/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};


	// TIPOS SOL TERCERO
	getTiposSolTercero(token) {
		return this.http.post(
			environment.apiUrl + 'tipossoltercero/list',
			"authorization=" + token,
			this.httpOptions
		)
	};

	createTipoSolTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'tipossoltercero/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editTipoSolTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'tipossoltercero/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteTipoSolTercero(id, token) {
		return this.http.post(
			environment.apiUrl + 'tipossoltercero/delete/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};


	// TERCEROS

	searchTerceroByCriteria(json, token) {
		return this.http.post(
			environment.apiUrl + 'terceros/searchbycriteria',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	searchTerceroByProperty(json, token) {
		return this.http.post(
			environment.apiUrl + 'terceros/searchbyproperty',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	viewTercero(id, token) {
		return this.http.post(
			environment.apiUrl + 'terceros/view/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'terceros/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'terceros/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getEntitiesTerceros(token) {
		return this.http.post(
			environment.apiUrl + 'terceros/entitiesterceros',
			"authorization=" + token,
			this.httpOptions
		)
	};

	getServCuadrillaByTercero(idTercero, token) {
		return this.http.post(
			environment.apiUrl + 'terceros/servicioscuadrillabytercero/' + idTercero,
			"authorization=" + token,
			this.httpOptions
		)
	};



	// ACUERDOS DE PAGO TERCEROS

	listAcuerdosPagoTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagosterceros/list',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getAcuerdosPagoTercero(id, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagosterceros/listoftercero/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createAcuerdoPagoTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagosterceros/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editAcuerdoPagoTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagosterceros/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteAcuerdoPagoTercero(id, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagosterceros/delete/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	deleteMultipleAcuerdoPagoTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagosterceros/deletemultiple',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};




	// DIRECCIONES

	getDirEntities(token) {
		return this.http.post(
			environment.apiUrl + 'direcciones/getentities',
			"authorization=" + token,
			this.httpOptions
		)
	};

	createDireccion(json, token) {
		return this.http.post(
			environment.apiUrl + 'direcciones/create2',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editDireccion(json, token) {
		return this.http.post(
			environment.apiUrl + 'direcciones/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getDireccionesTercero(id, token) {
		return this.http.post(
			environment.apiUrl + 'direcciones/listofterceros/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	viewDireccion(idDireccion, token) {
		return this.http.post(
			environment.apiUrl + 'direcciones/view/' + idDireccion,
			"authorization=" + token,
			this.httpOptions
		)
	};

	setDireccionPpal(idDireccion, token) {
		return this.http.post(
			environment.apiUrl + 'direcciones/setmainaddress/' + idDireccion,
			"authorization=" + token,
			this.httpOptions
		)
	};

	deleteDireccion(idDireccion, token) {
		return this.http.post(
			environment.apiUrl + 'direcciones/delete/' + idDireccion,
			"authorization=" + token,
			this.httpOptions
		)
	};



	// ACTIVIADES SOL CLIENTE
	getActividadesSolTercero(id, token) {
		return this.http.post(
			environment.apiUrl + 'activiadessoltercero/listbysolicitud/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createActSolTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'activiadessoltercero/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};



	// TIPOS ACT SOL TERCEROS
	getTiposActTercero(token) {
		return this.http.post(
			environment.apiUrl + 'tiposacttercero/list',
			"authorization=" + token,
			this.httpOptions
		)
	};


	//SERVICIOS

	getServicios(token) {
		return this.http.post(
			environment.apiUrl + 'servicios/list',
			"authorization=" + token,
			this.httpOptions
		)
	};


	getServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/view',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	infoEstadoActivacion(idServicio, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/infoestadoactivacion/' + idServicio,
			"authorization=" + token,
			this.httpOptions
		)
	};




	updateEstadoActivacionServicios(token) {
		return this.http.post(
			environment.apiUrl + 'servicios/updateestadoactivacionservicios/',
			"authorization=" + token,
			this.httpOptions
		)
	};

	getServiciosTercero(json, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/listbytercero',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	createServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	createServicioCuadrilla(json, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/createcuadrilla',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};


	deleteServicioCuadrilla(idServicio, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/deletecuadrilla/' + idServicio,
			"authorization=" + token,
			this.httpOptions
		)
	};


	searchServicioByCriteria(filters, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/searchserviciobycriteria',
			"json=" + JSON.stringify(filters) + "&authorization=" + token,
			this.httpOptions
		)
	};

	checkIp(json, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/checkip',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getServicioscuadrillas(token) {
		return this.http.post(
			environment.apiUrl + 'servicios/getcuadrillas',
			"authorization=" + token,
			this.httpOptions
		)
	};


	getServiciosInactivos(json, token) {
		return this.http.post(
			environment.apiUrl + 'servicios/getinactivos',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	updateEstadosActivacionServicios(token) {
		return this.http.post(
			environment.apiUrl + 'servicios/updateestadoactivacionservicios',
			"authorization=" + token,
			this.httpOptions
		)
	};



	// ESTADOS SERVICIOS

	getEstadosServicios(token) {
		return this.http.post(
			environment.apiUrl + 'estadosservicios/list',
			"authorization=" + token,
			this.httpOptions
		)
	};


	// CONTACTOS SERVICIOS

	getContatosServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'contactosservicios/listofservicio/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createContactoServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'contactosservicios/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editContactoServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'contactosservicios/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteContactoServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'contactosservicios/delete/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};


	// CONVENIOS SERVICIOS

	listConveniosServicios(token) {
		return this.http.post(
			environment.apiUrl + 'conveniosservicios/list',
			"authorization=" + token,
			this.httpOptions
		)
	};

	getConveniosServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'conveniosservicios/listofservicio/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createConvenioServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'conveniosservicios/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editConvenioServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'conveniosservicios/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteMultipleConvenioServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'conveniosservicios/deletemultiple',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteConvenioServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'conveniosservicios/delete/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};


	// ACUERDOS DE PAGO SERVICIO

	getAcuerdosPagoServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagoservicios/listofservicio/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createAcuerdoPagoServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagoservicios/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editAcuerdoPagoServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagoservicios/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteAcuerdoPagoServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'acuerdospagoservicios/delete/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};



	// EXCEPCIONES SERVICIO

	listExcepcionesServicios(token) {
		return this.http.post(
			environment.apiUrl + 'excepcionesservicios/list',
			"authorization=" + token,
			this.httpOptions
		)
	};

	getExcepcionesServicios(id, token) {
		return this.http.post(
			environment.apiUrl + 'excepcionesservicios/listofservicio/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createExcepcionServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'excepcionesservicios/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editExcepcionServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'excepcionesservicios/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};


	deleteMultipleExcepcionServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'excepcionesservicios/deletemultiple',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteExcepcionServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'excepcionesservicios/delete/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};


	// SOLICITUDES DE SERVICIOS

	getAllSolicitudesServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudesservicio/list',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getEntitiesListSolicitudesServicio(token) {
		return this.http.post(
			environment.apiUrl + 'solicitudesservicio/entitiestolist',
			"authorization=" + token,
			this.httpOptions
		)
	};


	getSolicitudesServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudesservicio/listbyservicio/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	getSolicitudServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudesservicio/view/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	getEntitiesSolServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudesservicio/entitiestocreate/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createSolServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'solicitudesservicio/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	// OPERACIONES SERVICIO

	infoOperacionesServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'operacionesservicios/info/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	checkSolServicioAndEntities(id, token) {
		return this.http.post(
			environment.apiUrl + 'operacionesservicios/checksolservicioandentities/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	getOperacionesServicio(id, token) {
		return this.http.post(
			environment.apiUrl + 'operacionesservicios/listbysolicitud/' + id,
			"authorization=" + token,
			this.httpOptions
		)
	};

	createOperacionesServicio(json, token) {
		return this.http.post(
			environment.apiUrl + 'operacionesservicios/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};


	// RETIROS

	listRetiros(json, token) {
		return this.http.post(
			environment.apiUrl + 'retiros/list',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	createRetiro(json, token) {
		return this.http.post(
			environment.apiUrl + 'retiros/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	changeEstadoRetiro(json, token) {
		return this.http.post(
			environment.apiUrl + 'retiros/changeestado',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteRetiro(idRetiro, token) {
		return this.http.post(
			environment.apiUrl + 'retiros/delete/' + idRetiro,
			"authorization=" + token,
			this.httpOptions
		)
	};

	datatoFilteroRetiro(token)  {
		var json={}
		return this.http.post(
			environment.apiUrl + 'retiros/datatofilter',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};
	getMotivosRetiro(token){
		var json={}
		return this.http.post(
			environment.apiUrl + 'motivosretiros/list',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	}
	getEstadosRetiro(token){
		var json={}
		return this.http.post(
			environment.apiUrl + 'estadosretiros/list',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	}



	// SUSPENSIONES

	listSuspensiones(token) {
		return this.http.post(
			environment.apiUrl + 'suspensiones/list',
			"authorization=" + token,
			this.httpOptions
		)
	};

	createSuspension(json, token) {
		return this.http.post(
			environment.apiUrl + 'suspensiones/create',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	deleteSuspension(idSuspension, token) {
		return this.http.post(
			environment.apiUrl + 'suspensiones/delete/' + idSuspension,
			"authorization=" + token,
			this.httpOptions
		)
	};

	// LABORES

	getLaboresByTipoOpServicio(idTipoOpServicio, token) {
		return this.http.post(
			environment.apiUrl + 'labores/listoftipoopserv/' + idTipoOpServicio,
			"authorization=" + token,
			this.httpOptions
		)
	};

	// LABORES OP
	getLaboresOpByCuadrilla(json, token) {
		return this.http.post(
			environment.apiUrl + 'laboresop/laboresbycuadrilla',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	editLaboresOp(json, token) {
		return this.http.post(
			environment.apiUrl + 'laboresop/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	qualifyLaboresOp(json, token) {
		return this.http.post(
			environment.apiUrl + 'laboresop/qualify',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	validateDocumentsLaboresOp(json, token) {
		return this.http.post(
			environment.apiUrl + 'laboresop/validatedocuments',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getListEstadosValidacionDocumentoLabores(token) {
		return this.http.post(
			environment.apiUrl + 'estadosdocumentos/list',
			"authorization=" + token,
			this.httpOptions
		)
	};

	editarEstadosValidacionDocumentoLabores(token,json) {
		return this.http.post(
			environment.apiUrl + 'laboresop/validatedocuments',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};


	// ESTADOS LABORES
	getEstadosLabores(token) {
		return this.http.post(
			environment.apiUrl + 'estadoslabores/list',
			"authorization=" + token,
			this.httpOptions
		)
	};
	getEstadosLaborePenidentes(token, idLaborOp) {
		return this.http.post(
			environment.apiUrl + 'laboresop/getestadosdocumentosbylabor/'+idLaborOp,
			"authorization=" + token,
			this.httpOptions
		)
	};

	// DESPLAZAMIENTOS CUADRILLAS

	getDesplazamientosByCuadrilla(json, token) {
		return this.http.post(
			environment.apiUrl + 'desplazamientoscuadrillas/desplazamientosbycuadrilla',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	qualifyDesplazamientoCuadrilla(json, token) {
		return this.http.post(
			environment.apiUrl + 'desplazamientoscuadrillas/qualify',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};
	getDesplazamientos(json, token) {
		return this.http.post(
			environment.apiUrl + 'desplazamientos/list',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};
	editarDesplazamientosCuadrilla (json, token) {
		return this.http.post(
			environment.apiUrl + 'desplazamientoscuadrillas/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	// Casos Especiales

	editCasoEspecial(json, token) {
		return this.http.post(
			environment.apiUrl + 'casosespeciales/edit',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	getCasosEspecialesByCuadrilla(json, token) {
		return this.http.post(
			environment.apiUrl + 'casosespeciales/casosbycuadrilla',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	qualifyCasoEpecial(json, token) {
		return this.http.post(
			environment.apiUrl + 'casosespeciales/qualify',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};


	// AGENDA


	getAgendaByCriteria(json, token) {
		return this.http.post(
			environment.apiUrl + 'agenda/searchbycriteria',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	cancelAgenda(json, token) {
		return this.http.post(
			environment.apiUrl + 'agenda/cancel',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	// USUARIOS

	editPermisosUsuarios(json, token) {
		return this.http.post(
			environment.apiUrl + 'usuarios/editpermisos',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	copyPermisosUsuarios(json, token) {
		return this.http.post(
			environment.apiUrl + 'usuarios/copypermisos',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};


	GetPermisosUsuariosByTercero(idTercero, token) {
		return this.http.post(
			environment.apiUrl + 'usuarios/getpermisosbytercero/' + idTercero,
			"authorization=" + token,
			this.httpOptions
		)
	};

	// ESTADOS CUENTAS

	listEstadosCuentas(json, token) {
		return this.http.post(
			environment.apiUrl + 'estadoscuentas/list',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	// FACTURACIÓN BLOQUE

	listFacturacionBloque(json, token) {
		return this.http.post(
			environment.apiUrl + 'facturacionbloque/list',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	// Dashboard Retiros

	estadosSOlictudServicioYEstadosservicios(token) {
		var json = { token: 'token' }
		return this.http.post(
			environment.apiUrl + 'retiros/dashboarddata',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)

	};
	departamentosOBtener(token: string) {
		var json = { token: 'token' }
		return this.http.post(
			environment.apiUrl + 'departamentos/list',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	};

	 municipiosOtener(token: string, idDpto: string ) {
		var json = { token: 'token' }
		return this.http.post(
			environment.apiUrl + 'municipios/listbydepartamento/'+idDpto,
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)

	}

	getRetirosDashboard(token: string, data){
		var json = data
		return this.http.post(
			environment.apiUrl + 'retiros/dashboard',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)


	}
	getFiltroMunicipiosRetirosDashboard(token: string, data){
		var json = data
		return this.http.post(
			environment.apiUrl + 'retiros/municipiosbydata',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	}	
	getFiltroUltimos4mesesRetirosDashboard(token: string, data){
		var json = data
		return this.http.post(
			environment.apiUrl + 'retiros/getdatabylast4months',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	}

	getEstadisticasDeTiempo(token: string, data){
		var json = data
		return this.http.post(
			environment.apiUrl + 'retiros/promedios',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	}

	tomarGestionSolicitudes(token: string, data){
		var json = data
		return this.http.post(
			environment.apiUrl + 'solicitudesservicio/claimsolicitud',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	}
	terminarGestionSolicitudes(token: string, data){
		var json = data
		return this.http.post(
			environment.apiUrl + 'solicitudesservicio/releasesolicitud',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	}

	// Dashboard Labores
	dashboardbycuadrilla(token: string, data){
		var json = data
		return this.http.post(
			environment.apiUrl + 'laboresop/dashboardbycuadrilla',
			"json=" + JSON.stringify(json) + "&authorization=" + token,
			this.httpOptions
		)
	}

	// Transacciones

	generateTransaccionesByDia(formData: FormData, token: string) {
		let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};	

		return this.http.post(`${environment.apiUrl}transacciones/generatetransaccionesbydia`, formData, httpHeaders)
		.pipe(catchError(this.handleError));
	}

	// Celulares Cuadrillas

	listCelularesCuadrilla(formData: FormData, token: string) {
		let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};	

		return this.http.post(`${environment.apiUrl}celularescuadrilla/list`, formData, httpHeaders)
		.pipe(catchError(this.handleError));
	}

	createCelularesCuadrilla(formData: FormData, token: string) {
		let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};	

		return this.http.post(`${environment.apiUrl}celularescuadrilla/create`, formData, httpHeaders)
	}

	deleteCelularesCuadrilla(idCelularCuadrilla: number, token: string) {
		let httpHeaders = {headers: new HttpHeaders({'Authorization':  `Bearer ${token}`})};	

		return this.http.delete(`${environment.apiUrl}celularescuadrilla/delete/${idCelularCuadrilla}`, httpHeaders)
		.pipe(catchError(this.handleError));
	}
	


}