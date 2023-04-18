import { Component, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

export interface TercerosData {
	idtercero: number;
	numerotercero: number;
	nombres: string;
	apellidos: string;
	identificacion: string;
 }

@Component({
	selector: 'dialog-overview-example-dialog',
	templateUrl: './search-topbar-dialog.html',
})
export class SearchTopMenuDialog {


	displayedColumns: string[] = ['idtercero', 'numerotercero', 'nombres', 'apellidos', 'identificacion', 'actions'];
	dataSource: MatTableDataSource<TercerosData>;
	terceroSearch: string;

	@ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
	@ViewChild(MatSort,{static: true}) sort: MatSort;


	constructor(
		public dialogRef: MatDialogRef<SearchTopMenuDialog>,
		@Inject(MAT_DIALOG_DATA) public data,
		private _router: Router,
	) {
		if (this.data.searchConfig.entity == "terceros") {
			this.dataSource = new MatTableDataSource(this.data["results"]);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
	}


	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	selectTercero(row){
		this._router.navigate(['/tercero/' + row.idtercero])
		this.dialogRef.close();
	}
}

