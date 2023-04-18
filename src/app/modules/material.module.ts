import { NgModule } from '@angular/core'

import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
   imports: [
      MatButtonModule,
      MatToolbarModule,
      MatIconModule,
      MatFormFieldModule,
      MatCheckboxModule,
      MatInputModule,
      MatSelectModule,
      MatDialogModule,
      MatTableModule,
      MatPaginatorModule,
      MatDatepickerModule,
      MatSnackBarModule

   ],
   exports: [
      MatButtonModule,
      MatToolbarModule,
      MatIconModule,
      MatFormFieldModule,
      MatCheckboxModule,
      MatInputModule,
      MatSelectModule,
      MatDialogModule,
      MatTableModule,
      MatPaginatorModule,
      MatDatepickerModule,
      MatSnackBarModule
    
   ]
})

export class MaterialModude { }