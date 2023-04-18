import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from "@ionic/storage";
import { EstadosRetiros } from '../model/retiros/estados-retiros';
import { MotivosRetiros } from '../model/retiros/motivos-retiros';
import { FormGroup } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class VarsService {

	// Global Vars
	public geografias: object[] = [
		{ id: 1, name: 'Rural' },
		{ id: 2, name: 'Urbano' }
	];

	public tiposPlanes: object[] = [
		{ id: 1, name: 'Residencial' },
		{ id: 2, name: 'Pymes' },
		{ id: 3, name: 'Corporativo' },
		{ id: 4, name: 'Dedicado' }
	];

	public tiposServicios: object[] = [
		{ id: 1, name: 'Internet' },
		{ id: 2, name: 'Datos' }
	];

	public clasesOpServicio: object[] = [
		{ idClaseOperacionServicio: 1, nombre: 'Agendar', descripcion: '' },
		{ idClaseOperacionServicio: 2, nombre: 'Reagendar', descripcion: '' },
		{ idClaseOperacionServicio: 3, nombre: 'Escalar', descripcion: '' },
		{ idClaseOperacionServicio: 4, nombre: 'A revisión', descripcion: '' },
		{ idClaseOperacionServicio: 5, nombre: 'Finalizar', descripcion: '' },
	];


	/* public estadosRetiros: EstadosRetiros[] = [
		{ idestadoretiro: 1, nombre: 'Pendiente', descripcion: '' },
		{ idestadoretiro: 2, nombre: 'Desinstalado', descripcion: '' },
		{ idestadoretiro: 3, nombre: 'Dirección Errada', descripcion: '' },
		{ idestadoretiro: 4, nombre: 'Duplicado', descripcion: '' },
		{ idestadoretiro: 5, nombre: 'Perdido', descripcion: '' },
		{ idestadoretiro: 6, nombre: 'Sin Acceso', descripcion: '' },
	]; */

	/* public motivosRetiros: MotivosRetiros[] = [
		{ idmotivoretiro: 1, nombre: 'En mora', descripcion: '' },
		{ idmotivoretiro: 2, nombre: 'Cambio de residencia - Misma ciudad sin cobertura', descripcion: '' },
		{ idmotivoretiro: 3, nombre: 'Cambio de residencia - Otra ciudad', descripcion: '' },
		{ idmotivoretiro: 4, nombre: 'Competencia', descripcion: '' },
		{ idmotivoretiro: 5, nombre: 'Suspensión temporal', descripcion: '' },
		{ idmotivoretiro: 6, nombre: 'Suspensión temporal incumplida', descripcion: '' },
		{ idmotivoretiro: 7, nombre: 'Fallecimiento titular', descripcion: '' },
		{ idmotivoretiro: 8, nombre: 'Soporte técnico - Mala señal', descripcion: '' },
		{ idmotivoretiro: 9, nombre: 'Soporte técnico - No llamaron', descripcion: '' },
		{ idmotivoretiro: 10, nombre: 'Soporte técnico - No vinieron o se demoraron', descripcion: '' },
		{ idmotivoretiro: 11, nombre: 'Soporte técnico - Vinieron y siguió igual', descripcion: '' },
		{ idmotivoretiro: 12, nombre: 'Servicio al cliente - Teléfono de bitwan no funciona bien', descripcion: '' },
		{ idmotivoretiro: 13, nombre: 'Servicio al cliente - Chat de bitwan no funciona bien', descripcion: '' },
		{ idmotivoretiro: 14, nombre: 'Servicio al cliente - Faltó claridad en la venta', descripcion: '' },
		{ idmotivoretiro: 15, nombre: 'Sin dinero', descripcion: '' },
		{ idmotivoretiro: 16, nombre: 'No es posible contactar al cliente', descripcion: '' },
		{ idmotivoretiro: 17, nombre: 'Otro', descripcion: '' },
		{ idmotivoretiro: 18, nombre: 'Sin Motivo', descripcion: '' },
		{ idmotivoretiro: 19, nombre: 'Cambio de residencia - Otro país', descripcion: '' },
		{ idmotivoretiro: 20, nombre: 'Cambio de residencia - Ya tiene bitwan', descripcion: '' },
		{ idmotivoretiro: 21, nombre: 'Cierre local comercial', descripcion: '' },
		{ idmotivoretiro: 22, nombre: 'No quiere/necesita el servicio', descripcion: '' },
		{ idmotivoretiro: 23, nombre: 'Servicio al cliente - Mala atención', descripcion: '' },
	];*/

	// Behavior Subjects Vars
	private userBS = new BehaviorSubject<object>(null);
	user = this.userBS.asObservable();

	public getProp = (obj, key) => key.split('.').reduce( (o, x) => (typeof o == "undefined" || o === null) ? o : o[x], obj);

	constructor(private storage: Storage) { }

	setUser(data) {
		this.userBS.next(data);
		(data) ? this.storage.set("bitwanUser", data) : this.storage.set("bitwanUser", null)
	}

	getPermisos(permisos) {
		if (permisos) {
			permisos = JSON.parse(permisos);
			let obj: object = {};
			permisos.forEach(el => {
				let split = el.split('.');
				if (!obj.hasOwnProperty(split[0])) { obj[split[0]] = {}; }
				if (!obj[split[0]].hasOwnProperty(split[1])) { obj[split[0]][split[1]] = {}; }
				if (!obj[split[0]][split[1]].hasOwnProperty(split[2])) { obj[split[0]][split[1]][split[2]] = {}; }
				obj[split[0]][split[1]][split[2]] = true;
			});
			return obj;
		} else {
			return null;
		}
	}

	selectTodo(formGrup: FormGroup, control: string, items: any[], id: string): any[] {
		let dat = [];
		if (!formGrup.controls[control].value || !formGrup.controls[control].value.includes(undefined) ) {
			let data: [any] =["SLT"]
			data.forEach(element => {
				if (element == "SLT") {
					if (data.length - 1 == items.length) {
						formGrup.controls[control].setValue([])
					} else {
						items.forEach(element2 => {
							dat.push(element2[id]);
						});
						dat.push("SLT")
						// retur formGrup.controls[control].setValue(dat);
					}
				}
			});
			return dat;

		}else{

			return [];
			
		}
		
	}





}