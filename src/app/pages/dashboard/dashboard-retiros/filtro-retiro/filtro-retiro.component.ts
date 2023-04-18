import { Component, EventEmitter, OnInit, ViewChild, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

//Servicios 
import { VarsService } from 'src/app/services/vars.service';

//Matrial 
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

//Model
import { Municipios, RespontEstSolServyEstadoServ, RetirosCreadosPor, SolicitudesCreadasPor } from 'src/app/model/retiros/respont-est-sol-servy-estado-serv';
import { EstadosServicios } from 'src/app/model/retiros/estados-servicios';
import { EstadosSolServicio } from 'src/app/model/retiros/estados-sol-servicio';

//Template 
import { SelectMunicipioDialog } from 'src/app/templates/select-municipios-dialog/select-municipio-dialog';
import { ServiciosData } from 'src/app/pages/servicios/list-servicios/list-servicios.component';
import { SelectTerceroDialog } from 'src/app/templates/select-tercero-dialog/select-tercero-dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-filtro-retiro',
  templateUrl: './filtro-retiro.component.html',
  styleUrls: ['./filtro-retiro.component.css'],
  animations: fuseAnimations
})


export class FiltroRetiroComponent implements OnInit {
  //Configuraciones generales user 
  user = this._vars.user.source['value'];
  // Seleccion de Tabs
  selected;
  //Salida de datos 
  @Output() emitirDatoGraficos = new EventEmitter<any>();
  consultaG = [{ name: "", value: 0 }];
  //Filtros Recibidos 
  estadosRetiros = [];
  motivosRetiros = [];
  estadosServicios: EstadosServicios[];
  estadosSolServicios: EstadosSolServicio[];
  municipios: Municipios[];
  retiroscreadospor: RetirosCreadosPor[];
  solicitudescreadaspor: SolicitudesCreadasPor[];


  // Otros datos funcionamiento 
  deparatemntos;
  municipiosSeleccionados = [];
  solCreadaPorUser = [];
  retiroCreadoPorUser = [];
  dataParaGraficos = [];
  isGraficaData = true;
  checkedDataGrafic: boolean;
  cargando = false;
  dataPie;
  contRetiros = 0;

  //Variables de Carga Graficas
  graficaEstadosRetiros;
  graficaMotivosRetiros;
  graficaEstadosSolicitudes;
  graficaEstadoActivacionServicio;
  graficaSolicitudCreadoPor;
  graficaRetiroCreadoPor;
  graficaMunicipiosSolicitudes;
  graficaMunicipiosSolicitudesSinProgramacion;



  // estadisticas
  estadisticasGeneralesTiempos = false;
  datosGraficasEstadisticas = [];

  cuentaMunicipiosVsVariable = 0;
  filtrosPor = [
    // 'Estado solicitud',
    // 'Estado servicio',
    { value: 1, descripcion: 'Motivo retiro' },
    { value: 2, descripcion: 'Estado retiro' },

    //Opciones Solicitudes y servicios 
    { value: 5, descripcion: 'Estado solicitud' },
    { value: 6, descripcion: 'Estado activación servicio' },

    //Opción Municipios
    { value: 3, descripcion: 'Solicitudes por municipios' },
    { value: 4, descripcion: 'Solic. sin programación x municipios' },

    //creados por 
    { value: 7, descripcion: 'Retiros programado por' },
    { value: 8, descripcion: 'Solicitides programadas por' },

  ];

  municipiosselect: any[] = [];
  itemsvsVariable: any[] = [];

  displayedColumns: string[] = ['idestado', 'idmotivo', 'fecharetiro', 'fechacreacion',
    'numeroservicio', 'plan', 'nombrestercero', 'municipio',
    'estadosolicitudservicio'
    //  'observaciones'
  ];
  dataSource: MatTableDataSource<ServiciosData>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // Formulario graficos
  formConsulta = this._fb.group(
    {
      tipoBusquedaForm: ['',],

    }
  )

  // fORMULARIOS DE FILTROS
  formRetirosFiltros = this._fb.group(
    {
      //Formato fecha 
      fiSolicitud: ['',],
      ffSolicitud: ['',],
      fiActInicial: ['',],
      ffActInicial: ['',],
      fiCreacionRetiros: ['',],
      ffCreacionRetiros: ['',],
      fiRetiroFisico: ['',],
      ffRetiroFisico: ['',],
      fiRetiro: ['',],
      ffRetiro: ['',],
      //Array
      arrEstadosRetiro: ['',],
      arrEstadosServicio: ['',],
      arrEstadosSolicitud: ['',],
      arrMotivosRetiro: ['',],
      arrMunicipio: ['',],

      //Penientes
      arrSolCreadaPor: ['',],
      arrRetiroCreadoPor: ['',],

      //option 
      FiltroFecha: ['',],
      verGrafica: ['',],

    }
  )

  constructor(
    private _vars: VarsService,
    private _fb: FormBuilder,
    public _dialog: MatDialog,
    private _api: ApiService,
    private _snackBar: MatSnackBar,
    private _router: Router,
  ) {
  

    if (this.user['permisos']['dashboard'] == undefined || !this.user['permisos']['dashboard']['retiros']) {
      this._router.navigate(['/'])
    }
  }

  ngOnInit(): void {
    this.obtenrDatosParaFiltro();
    this.obtenerDepartamentos();
  }

  obtenrDatosParaFiltro() {
    this._api.estadosSOlictudServicioYEstadosservicios(this.user["token"]).subscribe((response: RespontEstSolServyEstadoServ) => {
      if (response.code == 200) {
        this.municipios = response.municipios;
        this.retiroscreadospor = response.retiroscreadospor;
        this.solicitudescreadaspor = response.solicitudescreadaspor;
        this.estadosServicios = response.estadosservicios;
        this.estadosSolServicios = response.estadossolservicio;
        this.estadosRetiros = response.estadosretiros;
        this.motivosRetiros = response.motivosretiros;
        
      }
    }
    );

  }

  FiltroIndicadores(BusquedaGeneral) {
    this._api.getEstadisticasDeTiempo(this.user["token"], BusquedaGeneral).subscribe((respont) => {
      var obj = Object.getOwnPropertyNames(respont['data']);
      var obje=[
        'Programación de retiros vs fecha desactivación ',
        'Creación solicitud vs fecha desactivación programada en retiros.',
        'Creacion solicitud vs fecha creación en programación en retiros.',
        'Creación  solicitud vs fecha de retiro físico.(fecha modificacion)',
        'Creación en programación retiros vs fecha de retiro físico (modificación)'
      ];

      var items = []

      obj.forEach((name, index) => {

        var item = {
          name: obje[index],
          value: respont['data'][name],
        }
        items.push(item);
      });
      this.consultaG = items;
    });
  }
  selectTodo(formGrup: FormGroup, control: string, items: any[], id: string) {
    let itemsSlect = this._vars.selectTodo(formGrup, control, items, id);
    this.formRetirosFiltros.controls[control].setValue(itemsSlect);
  }
  getEstadoRetiro(idEstado) {
    return this.estadosRetiros.find(estado => estado['idestadoretiro'] == idEstado);
  }

  getMotivoRetiro(idMotivo) {
    return this.motivosRetiros.find(motivo => motivo['idmotivoretiro'] == idMotivo);
  }
  obtenerDepartamentos() {
    this._api.departamentosOBtener(this.user["token"]).subscribe((response) => {
      if (response['code'] == 200) {
        this.deparatemntos = response['data']
      }
    });
  }

  public ObtenrMunicipioDialog(): void {
    const dialogRef = this._dialog.open(SelectMunicipioDialog, {
      width: '50%',
      data: this.deparatemntos,
    });
    // -----  Recibir data -----
    dialogRef.afterClosed().subscribe(
      (resultado: []) => {
        if (resultado) {
          this.municipiosSeleccionados = resultado
          var data = [];
          resultado.forEach((e) => {
            data.push(e['idmunicipio']);
          });
          this.formRetirosFiltros.controls.arrMunicipio.setValue(data)
          this._snackBar.open("Filtros de municipios Agregados.", 'Cerrar', { duration: 2000 });
        }
      }
    );
  }



  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public borrarFiltro(): void {
    this.formRetirosFiltros.reset();
    this.formRetirosFiltros.controls.arrEstadosRetiro.setValue([]);
    this.formRetirosFiltros.controls.arrEstadosServicio.setValue([]);
    this.formRetirosFiltros.controls.arrEstadosSolicitud.setValue([]);
    this.formRetirosFiltros.controls.arrMotivosRetiro.setValue([]);
    this.formRetirosFiltros.controls.arrMunicipio.setValue([]);
    this.formRetirosFiltros.controls.arrSolCreadaPor.setValue([]);
    this.formRetirosFiltros.controls.arrRetiroCreadoPor.setValue([]);
    this.isGraficaData = true;
    this.dataPie= [];
    this.contRetiros=0;
    this.dataParaGraficos = [];
    this.dataSource = null;
    this.municipiosSeleccionados = [];
    this.solCreadaPorUser = [];
    this.retiroCreadoPorUser = [];
    this.consultaG = [
      { name: '', value: 0 },
    ]
  }
  removeMunicipio(elemto): void {
    const index = this.municipiosSeleccionados.indexOf(elemto);
    if (index >= 0) {
      this.municipiosSeleccionados.splice(index, 1);
    }
    if (index >= 0) {
      this.formRetirosFiltros.controls.arrMunicipio.value.splice(index, 1);
    }
  }
  removeRetiroCreadoPOr(elemto) {
    const index = this.retiroCreadoPorUser.indexOf(elemto);
    if (index >= 0) {
      this.retiroCreadoPorUser.splice(index, 1);
    }

    if (index >= 0) {
      this.formRetirosFiltros.controls.arrRetiroCreadoPor.value.splice(index, 1);
    }
  }
  removeSolicitudesCreadoPOr(elemto) {
    const index = this.solCreadaPorUser.indexOf(elemto);
    if (index >= 0) {
      this.solCreadaPorUser.splice(index, 1);
    }
    if (index >= 0) {
      this.formRetirosFiltros.controls.arrSolCreadaPor.value.splice(index, 1);
    }
  }

  ObtenrTercero(nombreboton: string) {
    const dialogRef = this._dialog.open(SelectTerceroDialog, {
      width: '90%',
      data: this.deparatemntos,
    });
    // -----  Recibir data -----
    dialogRef.afterClosed().subscribe(
      (resultado) => {
        if (resultado) {
          var index = this.solCreadaPorUser.indexOf(resultado);
          var index2 = this.retiroCreadoPorUser.indexOf(resultado);
          var data = [];
          if (nombreboton == 'Solicitudes') {

            if (index <= 0) {
              this.solCreadaPorUser.forEach((e) => {
                data.push(e['idtercero'])
              });
              data.push(resultado['idtercero'])
            }
            this.formRetirosFiltros.controls.arrSolCreadaPor.setValue(data);
            this.solCreadaPorUser.push(resultado);
          } else if (nombreboton == 'Retiros') {

            if (index2 <= 0) {
              this.retiroCreadoPorUser.forEach((e) => {
                data.push(e['idtercero'])
              });
              data.push(resultado['idtercero'])
            }
            this.formRetirosFiltros.controls.arrRetiroCreadoPor.setValue(data);
            this.retiroCreadoPorUser.push(resultado);
          }
          this._snackBar.open("Filtros Agregados.", 'Cerrar', { duration: 2000 });
        }
      }
    );



  }



  buscarDatosDB() {
    this.cargando = true;
    //Validar datos iniciales 
    if (this.formRetirosFiltros.controls.fiSolicitud.value > this.formRetirosFiltros.controls.ffSolicitud.value
      || this.formRetirosFiltros.controls.fiActInicial.value > this.formRetirosFiltros.controls.ffActInicial.value
      || this.formRetirosFiltros.controls.fiCreacionRetiros.value > this.formRetirosFiltros.controls.ffCreacionRetiros.value
      || this.formRetirosFiltros.controls.fiRetiroFisico.value > this.formRetirosFiltros.controls.ffRetiroFisico.value
      || this.formRetirosFiltros.controls.fiRetiro.value > this.formRetirosFiltros.controls.ffRetiro.value || this.formRetirosFiltros.valid == false) {

      if (this.formRetirosFiltros.valid == false) {
        this._snackBar.open("Algunas de las fechas que introdujiste nos válida", "ok", { duration: 5000, })
      }
      if (this.formRetirosFiltros.controls.fiSolicitud.value > this.formRetirosFiltros.controls.ffSolicitud.value
      ) {
        this.formRetirosFiltros.controls.fiSolicitud.setErrors(Validators.required)
        this.formRetirosFiltros.controls.ffSolicitud.setErrors(Validators.required)
        this._snackBar.open("Corregir, fecha de solicitud final es mayor a la inicial o no ingreso fechas", "ok", { duration: 5000, })
      }
      if (this.formRetirosFiltros.controls.fiActInicial.value > this.formRetirosFiltros.controls.ffActInicial.value
        || (this.formRetirosFiltros.controls.fiActInicial.value == null || this.formRetirosFiltros.controls.ffActInicial.value == null)) {
        this.formRetirosFiltros.controls.fiActInicial.setErrors(Validators.required)
        this.formRetirosFiltros.controls.ffActInicial.setErrors(Validators.required)
        this._snackBar.open("Corregir, fecha de activacion final es mayor a la inicial o no ingreso fecha", "ok", { duration: 5000 })
      }
      if (this.formRetirosFiltros.controls.fiCreacionRetiros.value > this.formRetirosFiltros.controls.ffCreacionRetiros.value
        || (this.formRetirosFiltros.controls.fiCreacionRetiros.value == null || this.formRetirosFiltros.controls.ffCreacionRetiros.value == null)) {
        this.formRetirosFiltros.controls.fiCreacionRetiros.setErrors(Validators.required)
        this.formRetirosFiltros.controls.ffCreacionRetiros.setErrors(Validators.required)
        this._snackBar.open("Corregir, fecha de creación de retiros final es mayor a la inicial o no ingreso fecha", "ok", { duration: 5000 })
      }
      if (this.formRetirosFiltros.controls.fiRetiroFisico.value > this.formRetirosFiltros.controls.ffRetiroFisico.value
        || (this.formRetirosFiltros.controls.fiRetiroFisico.value == null || this.formRetirosFiltros.controls.ffRetiroFisico.value == null)) {
        this.formRetirosFiltros.controls.fiRetiroFisico.setErrors(Validators.required)
        this.formRetirosFiltros.controls.ffRetiroFisico.setErrors(Validators.required)
        this._snackBar.open("Corregir, fecha de retiro fisico final es mayor a la inicial o no ingreso fecha", "ok", { duration: 5000 })
      }
      if (this.formRetirosFiltros.controls.fiRetiro.value > this.formRetirosFiltros.controls.ffRetiro.value
        || (this.formRetirosFiltros.controls.fiRetiro.value == null || this.formRetirosFiltros.controls.ffRetiro.value == null)) {
        this.formRetirosFiltros.controls.fiRetiro.setErrors(Validators.required)
        this.formRetirosFiltros.controls.ffRetiro.setErrors(Validators.required)
        this._snackBar.open("Corregir, fecha de retiro final es mayor a la inicial o no ingreso fecha", "ok", { duration: 5000 })
      }
      this.cargando = false;
    } else {
      var obj = this.formRetirosFiltros.value

      obj.fiSolicitud = this.convertirFecha(obj.fiSolicitud);
      obj.ffSolicitud = this.convertirFecha(obj.ffSolicitud);
      obj.fiActInicial = this.convertirFecha(obj.fiActInicial);
      obj.ffActInicial = this.convertirFecha(obj.ffActInicial);
      obj.fiCreacionRetiros = this.convertirFecha(obj.fiCreacionRetiros);
      obj.ffCreacionRetiros = this.convertirFecha(obj.ffCreacionRetiros);
      obj.fiRetiroFisico = this.convertirFecha(obj.fiRetiroFisico);
      obj.ffRetiroFisico = this.convertirFecha(obj.ffRetiroFisico);
      obj.fiRetiro = this.convertirFecha(obj.fiRetiro);
      obj.ffRetiro = this.convertirFecha(obj.ffRetiro);
      this.FiltroIndicadores(obj);
      this._api.getRetirosDashboard(this.user["token"], obj).subscribe((respont) => {
        if (respont['code'] == 200) {
          this.dataSource = new MatTableDataSource(respont["data"]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataParaGraficos = respont["data"];          
          this.contRetiros = 0;
          this.dataParaGraficos.forEach(element => {
            if (element.idretiro != null) {
              this.contRetiros++
            }
          });

          this.graficar();
          if (this.dataParaGraficos.length > 0) {
            this.isGraficaData = false;
          } else {
            this.checkedDataGrafic = false;
            this.isGraficaData = true;
            this._snackBar.open("No hay retiros para mostrar", 'Cerrar', { duration: 5000 });
          }
        } else {
          this._snackBar.open("No se pudieron cargar los retiros, comprobar conexión.", 'Cerrar', { duration: 3000 });
          this._router.navigate(['/'])
        }
        this.cargando = false;
      });
    }

  }

  convertirFecha(fechaValue) {
    if (fechaValue) {
      let d = new Date(fechaValue);
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }
    return ''
  }
  llenarvariablesParaGraficar() {

  }


  graficar() {
    if (this.formConsulta.controls.tipoBusquedaForm.value == '') {
      this.dataPie = this.filtrar(this.motivosRetiros, this.dataParaGraficos, 'idmotivoretiro', 'idmotivoretiro');
      this.formConsulta.controls.tipoBusquedaForm.setValue(1)
    }
    if (this.formConsulta.controls.tipoBusquedaForm.value == 1) {
      this.dataPie = this.filtrar(this.motivosRetiros, this.dataParaGraficos, 'idmotivoretiro', 'idmotivoretiro');
    }
    if (this.formConsulta.controls.tipoBusquedaForm.value == 2) {
      this.dataPie = this.filtrar(this.estadosRetiros, this.dataParaGraficos, 'idestadoretiro', 'idestadoretiro');
    }
    if (this.formConsulta.controls.tipoBusquedaForm.value == 3) {
      this.dataPie = this.municipiosVsRetiros();
    }
    if (this.formConsulta.controls.tipoBusquedaForm.value == 4) {
      this.dataPie = this.municipiosVsSolicitudesTerminacionDeContrato();
    }
    if (this.formConsulta.controls.tipoBusquedaForm.value == 5) {
      this.dataPie = this.filtrarEstadoServicio();
    }
    if (this.formConsulta.controls.tipoBusquedaForm.value == 6) {
      this.dataPie = this.filtrarEstadoActivacion();
    }
    if (this.formConsulta.controls.tipoBusquedaForm.value == 7) {
      this.dataPie = this.retiroCreadoPor();
    }
    if (this.formConsulta.controls.tipoBusquedaForm.value == 8) {
      this.dataPie = this.solicitudescreadasPorFiltro();
    }
  }
  municipiosVsRetiros() {
    var municipios = new Set();
    var contar: any[] = [];
    this.dataParaGraficos.forEach(retiro => {
      municipios.add(retiro['municipio'])
    });
    municipios.forEach(municipio => {
      var item = {
        name: municipio,
        value: 0,
      }
      this.dataParaGraficos.forEach(retiro => {
        if (retiro['municipio'] == municipio && retiro['idretiro'] != null) {
          item.value++
        }
      });
      contar.push(item);
    });
    return contar

  }

  municipiosVsSolicitudesTerminacionDeContrato() {
    var municipios = new Set();
    var contar: any[] = [];
    this.dataParaGraficos.forEach(retiro => {
      municipios.add(retiro['municipio'])
    });
    municipios.forEach(municipio => {
      var item = {
        name: municipio,
        value: 0,
      }
      this.dataParaGraficos.forEach(retiro => {
        if (retiro['municipio'] == municipio && retiro['idretiro'] == null) {
          item.value++
        }
      });
      if (item.value > 0) {
        contar.push(item);
      }
    });
    return contar

  }

  filtrar(flitrosSlect, lista, textcamoComparacionData, textComparacion) {
    this.cargando = true;
    var contar = [];
    let bus = this.filtro2(lista, textcamoComparacionData);


    bus.forEach((value: any) => {
      var estado;
      //estado=flitrosSlect[value] ;
      value != null ? estado = flitrosSlect[value - 1] : estado = { [textComparacion]: null, nombre: 'N/A', descripcion: '' };
      // if(estado['nombre'] !='Sin Motivo' ){
      // }
      var item = {
        name: estado.nombre,
        value: 0,
      };

      item.name = estado.nombre;
      for (let j = 0; j < lista.length; j++) {
        const elData = lista[j];
        if (estado[textComparacion] == elData[textcamoComparacionData]) {
          if (elData[textcamoComparacionData] != null) {
            item.value++
          } else {

          }
        }
      }
      if (value == null && textComparacion == textcamoComparacionData) {
        // item.name = 'Sin Motivo';
        // contar.push(item);
      } else if (item.value > 0) {
        contar.push(item);
      }
    });
    this.cargando = false;
    return contar;
  }

  filtrarEstadoServicio() {
    var colecction = new Set();
    var contar: any[] = [];
    this.dataParaGraficos.forEach(retiro => {
      colecction.add(retiro['nombreestadosolicitudservicio'])
    });
    colecction.forEach(nombreestadosolicitudservicio => {
      var item = {
        name: nombreestadosolicitudservicio,
        value: 0,
      }
      this.dataParaGraficos.forEach(retiro => {
        if (retiro['nombreestadosolicitudservicio'] == nombreestadosolicitudservicio) {
          item.value++
        }
      });
      if (item.value > 0) {
        contar.push(item);
      }
    });
    return contar
  }
  filtrarEstadoActivacion() {
    var colecction = new Set();
    var contar: any[] = [];
    this.dataParaGraficos.forEach(retiro => {
      colecction.add(retiro['estadoactivacion'])
    });
    colecction.forEach(estadoactivacion => {
      var item = {
        name: estadoactivacion == "1" ? 'Activos' : 'Inactivos',
        value: 0,
      }
      this.dataParaGraficos.forEach(retiro => {
        // if (retiro['municipio'] == municipio && retiro['idretiro'] == null) {
        //   item.value++
        // }       
        if (retiro['estadoactivacion'] == estadoactivacion) {
          item.value++
        }
      });
      if (item.value > 0) {
        if (item.value == 1) {
          item.name = item.name.slice(2, -1);
          item.name = item.name[0].toUpperCase() + item.name.slice(1);
        }
        contar.push(item);
      }
    });
    return contar
  }
  filtro2(lista: [], textcamoComparacionData,) {
    var listaRevisada = new Set();
    lista.forEach(element => {
      listaRevisada.add(element[textcamoComparacionData])
      // listaRevisada.add({ [textComparacion]: element[textcamoComparacionData], nombre: nombreItem, descripcion: '' })
    });
    return listaRevisada
  }

  CargandoGraficos() {
    this.cargando = true;

    this.graficar();

    this.cargando = false;

  }

  retiroCreadoPor() {
    var colecction = new Set();
    var contar: any[] = [];
    this.dataParaGraficos.forEach(retiro => {
      colecction.add(retiro['idtercerocuadrilla'])
    });
    colecction.forEach(idtercerocuadrilla => {
      var item = {
        name: idtercerocuadrilla == null ? 'No Data' : idtercerocuadrilla,
        value: 0,
      }
      this.dataParaGraficos.forEach(retiro => {
        if (retiro['idtercerocuadrilla'] == idtercerocuadrilla && item.name != 'No Data') {
          item.value++
        }
        if (retiro['idtercerocuadrilla'] == idtercerocuadrilla && retiro['idtercerocuadrilla'] == item.name) {
          item.name = retiro['nombrescuadrilla'] + retiro['apellidoscuadrilla']
        }
      });
      if (item.value > 0) {
        contar.push(item);
      }
    });
    return contar

  }

  solicitudescreadasPorFiltro() {
    var colecction = new Set();
    var contar: any[] = [];
    this.dataParaGraficos.forEach(retiro => {
      colecction.add(retiro['idterceroempleadosolicitud'])
    });
    colecction.forEach(idterceroempleadosolicitud => {
      var item = {
        name: idterceroempleadosolicitud == null ? 'No Data' : idterceroempleadosolicitud,
        value: 0,
      }
      this.dataParaGraficos.forEach(retiro => {
        if (retiro['idterceroempleadosolicitud'] == idterceroempleadosolicitud && item.name != 'No Data') {
          item.value++
        }
        if (retiro['idterceroempleadosolicitud'] == idterceroempleadosolicitud && retiro['idterceroempleadosolicitud'] == item.name) {
          item.name = retiro['nombresempleadosolicitud'] + retiro['apellidosempleadosolicitud']
        }
      });
      if (item.value > 0) {
        contar.push(item);
      }
    });
    return contar
  }


}
