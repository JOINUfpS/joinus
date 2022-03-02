import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {ConstModules} from '../../utilities/string/security/const-modules';

@Injectable({
  providedIn: 'root'
})
export class InstitutionGuard implements CanActivate {

  constructor(private utilitiesConfigString: UtilitiesConfigString,
              private constModules: ConstModules,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permissions = this.utilitiesConfigString.ls.get('permissions');
    const exist = permissions.find(element => element.moduName === this.constModules.INSTITUTIONS);
    if (!exist) {
      this.router.navigate(['']);
    } else {
      return true;
    }
  }

}
