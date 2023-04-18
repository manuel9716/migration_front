import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { VarsService } from "src/app/services/vars.service";
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _varservice: VarsService, private _router: Router, private _storage: Storage) {

  }

  async canActivate(): Promise<boolean> {
    return await this._storage.get('bitwanUser').then(
      (val) => {
        if (val) {
          return true
        } else {
          this._router.navigate(['/login']);
          return false
        }
      }
    )
  }



}
