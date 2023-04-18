import { EstadosServicios } from './estados-servicios';
import { EstadosSolServicio } from './estados-sol-servicio';

export interface Municipios{
    idmunicipio: number, nombre: string
}
export interface RetirosCreadosPor{
    apellidos: string,
    idtercero: number,
    nombres: string,
    numerotercero: number,
    idservicio: number,
}
export interface SolicitudesCreadasPor{
    apellidos: string,
    idtercero: number,
    nombres: string,
    numerotercero: number,
}
export interface Motivosretiro {
    idmotivoretiro: number;
    nombre:         string;
    descripcion:    null;
}
export interface Estadosretiro {
    idestadoretiro: number;
    nombre:         string;
    descripcion:    null;
}



export interface RespontEstSolServyEstadoServ {
    code: number,
    msg: string,
    estadossolservicio:[EstadosSolServicio],
    estadosservicios:[EstadosServicios],
    municipios:[Municipios],
    retiroscreadospor:[RetirosCreadosPor], 
    solicitudescreadaspor: [SolicitudesCreadasPor],
    estadosretiros:        Estadosretiro[];
    motivosretiros:        Motivosretiro[];
}


