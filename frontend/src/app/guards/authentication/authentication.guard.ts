import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private utilitiesConfigString: UtilitiesConfigString,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.utilitiesConfigString.ls.get('token')){
      this.router.navigate(['iniciar-sesion']);
      return false;
    }
    return true;
  }

}
