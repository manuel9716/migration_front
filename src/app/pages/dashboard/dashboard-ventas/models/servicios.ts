import { Moment } from "moment"

export interface Service {
     fechaSolicitud: Moment	
     municipio: string	
     departamento: string
     fechaActivacion :string|Moment
     estadoOperacion: string	
     estadoRetiro: string

    /* constructor(fechaSolicitud: Moment, municipio: string, departamento: string, fechaActivacion :string|Moment, estadoOperacion: string, estadoRetiro: string){
        this.fechaSolicitud = fechaS
    } */
}