import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList, AngularFireObject  } from '@angular/fire/database';
import { gestionSolicitudes } from '../model/Solicitudes/gestion-solicitudes-fb';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FireBaseGestionSolicitudesApiService {
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.itemsRef = db.list('userEnGestion');
    // this.items = db.list('items').valueChanges();
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

   }
   //Escuchar cambios 
   escucharCambiosGestiionSolicitudes(){
    // this.itemsRef = this.db.list('items');
    return this.itemsRef.snapshotChanges(['child_added', 'child_removed'])

   }
   escucharCambiosLista(){
    // this.itemsRef = this.db.list('items');
    return this.itemsRef.stateChanges(['child_added', 'child_removed'])

   }
   // Guardar Registros de Servicios tomados 
   guardaRegistroGestionSolicitudes(gestionServicio:gestionSolicitudes){
    return this.itemsRef.push(gestionServicio)

   }

   // Remover Registros de Servicios tomados 
   removerRegistroGestionSolicitudes(key: string){
    this.itemsRef.remove(key)
   }

   // Actualizar Registros de Servicios tomados 
   actualizarRegistroGestionSolicitudes(key: string, gestionServicio:gestionSolicitudes){
    this.itemsRef.update(key, gestionServicio)
   }

}
