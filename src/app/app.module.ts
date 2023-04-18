import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './main/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment'

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { LOCALE_ID } from '@angular/core';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(es);

// Dependencies
import { getSpanishPaginatorIntl } from './modules/paginator-intl';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { IonicStorageModule } from '@ionic/storage';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSpinnerModule } from "ngx-spinner";

// Modules Material 
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatPaginatorIntl,} from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialogRef } from '@angular/material/dialog';


//import { MaterialModude } from './modules/material.module';
import { TemplatesModule } from './templates/templates.module';

//Components
import { SidebarComponent } from './commons/sidebar/sidebar.component'
import { TopMenuComponent } from './commons/top-menu/top-menu.component';
import { LoginComponent } from './pages/login/login.component';

// Templates
import { LoaderFacturacionBloqueDialogModule } from './templates/loader-facturacion-bloque/loader-facturacion-bloque-dialog-module'


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = { align: "left", allowNegative: false, decimal: ",", precision: 0, prefix: "$", suffix: "", thousands: "." };

@NgModule({
  declarations: [
    // Components
    AppComponent,
    SidebarComponent,
    TopMenuComponent,
    LoginComponent,
  ],
  imports: [

    //Depedencias Generales
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    CurrencyMaskModule,
    NgxMaterialTimepickerModule.setLocale('es-co'),
    FlexModule,
    NgxSpinnerModule,
    AngularFireModule.initializeApp(environment.firebase),

    // MaterialModude,
    MatNativeDateModule,
    MatToolbarModule, 
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule, 
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    
    //Mudolos Template  4 QUe faltan por reasignar
    LoaderFacturacionBloqueDialogModule,
    TemplatesModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    { provide: MAT_DATE_LOCALE, useValue: 'es-co' },
    { provide: LOCALE_ID, useValue: "es-CO" },
    { provide: MatDialogRef, useValue: {} },

  ],
  entryComponents: [
    
  ],
  bootstrap: [AppComponent]
})


export class AppModule {

}
