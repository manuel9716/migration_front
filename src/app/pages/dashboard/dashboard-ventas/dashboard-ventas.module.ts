import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Route, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule, FlexModule } from "@angular/flex-layout";
//Component
import { DashboardVentasComponent } from "./home/dashboard-ventas.component";

//Template

//Material
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
//Component
import { HistorialSolMunicipioComponent } from "./historial-sol-municipio/historial-sol-municipio.component";
import { HistorialEstadoSolicitudesComponent } from "./historial-estado-solicitudes/historial-estado-solicitudes.component";
import { VentasDiariasMunicipioComponent } from "./ventas-diarias-municipio/ventas-diarias-municipio.component";

const RutesModule: Route[] = [
	{ path: "", component: DashboardVentasComponent },
	{
		path: "historialestados",
		component: HistorialEstadoSolicitudesComponent,
	},
	{ path: "historialsolicitudes", component: HistorialSolMunicipioComponent },
	{
		path: "ventasdiariasmuncipios",
		component: VentasDiariasMunicipioComponent,
	},
];

@NgModule({
	declarations: [
		DashboardVentasComponent,
		HistorialEstadoSolicitudesComponent,
		HistorialSolMunicipioComponent,
		VentasDiariasMunicipioComponent,
	],
	imports: [
		//AdditionalModels
		CommonModule,
		RouterModule.forChild(RutesModule),
		FormsModule,
		ReactiveFormsModule,
		FlexModule,
		FlexLayoutModule,

		//MaterialModels
		MatToolbarModule,
		MatCardModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatCheckboxModule,
		MatMomentDateModule,
		MatFormFieldModule,
		MatRadioModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatProgressBarModule,
		MatTableModule,
	],
	providers: [{ provide: MAT_DATE_LOCALE, useValue: "es-GB" }],
})
export class DashboardVentasModule {}
