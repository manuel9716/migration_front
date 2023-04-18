import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './commons/guard/auth.guard';
import { LoginprotecGuard } from './commons/guard/loginprotec.guard';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' ,  canActivate: [AuthGuard],  },
  { path: 'dashboard', loadChildren: ()=>import('src/app/pages/dashboard/dashboard.module').then(m => m.DashboardModule),  canActivate: [AuthGuard], data:{title: 'Dashboard'} },

  { path: 'login', component: LoginComponent, canActivate: [LoginprotecGuard], data:{title: 'Dashboard'} },
  
  { path: 'planes', loadChildren: () => import('src/app/pages/planes/list/list-planes.module').then(m => m.ListPlanesModule), canActivate: [AuthGuard], data:{title: 'Planes'} },
  { path: 'plan', loadChildren: () => import('src/app/pages/planes/create-edit/create-edit-planes.module').then(m=>m.CreateEditPlanesModule), canActivate: [AuthGuard], data:{title: 'Crear Planes'}},
  { path: 'plan/:id', loadChildren: () => import('src/app/pages/planes/create-edit/create-edit-planes.module').then(m=>m.CreateEditPlanesModule), canActivate: [AuthGuard], data:{title: 'Editar Planes'} },

  { path: 'solicitudes-tercero', loadChildren: ()=> import('src/app/pages/solicitudes-tercero/list-sol-tercero/list-sol-tercero.module').then(m=>m.ListSolTerceroModule) , canActivate: [AuthGuard], data:{title: 'Solicitudes Terceros'} },
  { path: 'solicitud-tercero', loadChildren:()=> import('src/app/pages/solicitudes-tercero/create-edit-sol-tercero/create-edit-sol-tercero.module').then(m=> m.CreateEditSolTerceroModule) , canActivate: [AuthGuard], data:{title: 'Crear Solicitudes Terceros'}},
  { path: 'solicitud-tercero/:identificacion', loadChildren:()=> import('src/app/pages/solicitudes-tercero/create-edit-sol-tercero/create-edit-sol-tercero.module').then(m=> m.CreateEditSolTerceroModule), canActivate: [AuthGuard], data:{title: 'Editar Solicitudes Terceros'}},
  { path: 'solicitud-tercero/view/:id', loadChildren: ()=> import('src/app/pages/solicitudes-tercero/view/view-sol-tercero.module').then(m=> m.ViewSolTerceroModule), canActivate: [AuthGuard],  data:{title: 'Ver Tercero'} },

  { path: 'servicios', loadChildren: ()=> import('src/app/pages/servicios/list-servicios/list-servicios.module').then(m=> m.ListServiciosModule), canActivate: [AuthGuard],  data:{title: 'Servicios'} },
  { path: 'servicio',loadChildren: ()=>import('src/app/pages/servicios/create-servicio/create-servicio.module').then(m=> m.CreateServicioModule), canActivate: [AuthGuard], data:{title: 'Servicio'} },
  { path: 'servicio/:id', loadChildren:()=> import('src/app/pages/servicios/view/view-servicio.module').then(m=>m.ViewServicioModule), canActivate: [AuthGuard] , data:{title: 'Servicio'} },
  { path: 'servicio/:id/:tab', loadChildren:()=> import('src/app/pages/servicios/view/view-servicio.module').then(m=>m.ViewServicioModule), canActivate: [AuthGuard] , data:{title: 'Servicio'} },

  { path: 'terceros', loadChildren: ()=> import('src/app/pages/terceros/list-terceros/list-terceros.module').then(m=>m.ListTercerosModule), canActivate: [AuthGuard],  data:{title: 'Terceros'} },
  { path: 'tercero', loadChildren: ()=> import('src/app/pages/terceros/view-tercero/view-tercero.module').then(m=> m.ViewTerceroModule), canActivate: [AuthGuard],   data:{title: 'Terceros'} },
  { path: 'tercero/:id', loadChildren: ()=> import('src/app/pages/terceros/view-tercero/view-tercero.module').then(m=> m.ViewTerceroModule), canActivate: [AuthGuard],  data:{title: 'Terceros'} },
  { path: 'tercero/:id/:tab', loadChildren: ()=> import('src/app/pages/terceros/view-tercero/view-tercero.module').then(m=> m.ViewTerceroModule), canActivate: [AuthGuard] ,  data:{title: 'Terceros'}},

  { path: 'solicitud-servicio/crear/:id', loadChildren: ()=> import('src/app/pages/solicitudes-servicio/create-edit-sol-servicio/create-edit-sol-servicio.module').then(m=> m.CreateEditSolServicioModule), canActivate: [AuthGuard],  data:{title: 'Solicitud de Servicio'} },
  { path: 'solicitud-servicio/ver/:id', loadChildren: ()=> import('src/app/pages/solicitudes-servicio/view-sol-servicio/view-sol-servicio.module').then(m=> m.ViewSolServicioModule), canActivate: [AuthGuard] ,  data:{title: 'Ver Solicitud de Servicio'}},
  
  { path: 'agenda', loadChildren: ()=>import("src/app/pages/agenda/agenda.module").then(m => m.AgendaModule), canActivate: [AuthGuard],   data:{title: 'Agenda'}},

  // { path: 'operacion-servicio/crear/:id', component: CreateEditOpServiciosComponent },

  { path: 'validar-labores', loadChildren: ()=>import('src/app/pages/calificar-procesos/calificar-procesos.module').then(m=>m.CalificarProcesosModule), canActivate: [AuthGuard],  data:{title: 'Validar Labores'}},

  { path: 'lista-solicitudes-servicios',loadChildren: ()=> import('src/app/pages/list-all-solicitudes-servicios/list-all-solicitudes-servicios.module').then(m=>m.ListAllSolicitudesServiciosModule), canActivate: [AuthGuard],  data:{title: 'Solicitudes de Servicio '} },

  { path: 'retiros', loadChildren: () =>import('src/app/pages/list-retiros/list-retiros.module').then(m=>m.ListRetirosModule), canActivate: [AuthGuard],  data:{title: 'Retiros'},  },

  { path: 'suspensiones', loadChildren: ()=>import('src/app/pages/list-suspensiones/list-suspensiones.module').then(m=> m.ListSuspensionesModule), canActivate: [AuthGuard],  data:{title: 'Suspenciones'}},

  { path: 'convenios-servicios', loadChildren: ()=> import('src/app/pages/list-convenios-servicios/list-convenios-servicios.module').then(m=> m.ListConveniosServiciosModule), canActivate: [AuthGuard],   data:{title: 'Convenios'}},

  { path: 'excepciones-servicios', loadChildren: ()=> import('src/app/pages/list-excepciones-servicios/list-excepciones-servicios.module').then(m=>m.ListExcepcionesServiciosModule), canActivate: [AuthGuard],  data:{title: 'Excepciones'} },

  { path: 'acuerdos-pago-terceros', loadChildren: ()=> import('src/app/pages/list-acuerdos-pago-terceros/list-acuerdos-pago-terceros.module').then(m=> m.ListAcuerdosPagoTercerosModule), canActivate: [AuthGuard],  data:{title: 'Acuerdo de Pago'}  },

  { path: 'facturacion-bloque', loadChildren: ()=> import('src/app/pages/list-facturacion-bloque/list-facturacion-bloque.module').then(m=> m.ListFacturacionBloqueModule), canActivate: [AuthGuard],  data:{title: 'Facturación en Bloque'} },

  { path: 'estados-cuentas', loadChildren: ()=> import('src/app/pages/list-estados-cuentas/list-estados-cuentas.module').then(m=>m.ListEstadosCuentasModule), canActivate: [AuthGuard],  data:{title: 'Estados de Cuentas'}},
  
  { path: 'transacciones', loadChildren: ()=> import('src/app/pages/transacciones/transacciones.module').then(m=>m.TransaccionesModule), canActivate: [AuthGuard],  data:{title: 'Transacciones'}},
  
  { path: 'municipios', loadChildren: ()=> import('src/app/pages/municipios/municipios.module').then(m=>m.ListMunicipiosModule), canActivate: [AuthGuard],  data:{title: 'Municipios'}},

  { path: 'informes', loadChildren: ()=> import('src/app/pages/informes/informes.module').then(m=>m.InformesModule), canActivate: [AuthGuard],  data:{title: 'Informes'}},
  
  {path: '**', redirectTo: '/dashboard', canActivate: [AuthGuard]}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // scrollPositionRestoration: 'enabled',
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

