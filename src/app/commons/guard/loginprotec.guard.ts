import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class LoginprotecGuard implements CanActivate {

  constructor(private _router: Router, private _storage: Storage) { }

  async canActivate():  Promise<boolean> {

    return await this._storage.get('bitwanUser').then(
      (val) => {
        if (val) {
          this._router.navigate(['/dashboard']) ;
          return false
                  
        } else {
        return true 
        }
      }
    )
  }
}
