import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {SecurityService} from '../../services/security/security.service';
import {catchError, filter, switchMap, take} from 'rxjs/internal/operators';
import {SecurityAdapter} from '../../adapters/implementation/security/security.adapter';
import {ConstString} from '../../utilities/string/const-string';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private isExpired = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private readonly token: string;


  constructor(private route: Router,
              private utilitiesConfigString: UtilitiesConfigString,
              private securityAdapter: SecurityAdapter,
              private securityService: SecurityService,
              private constString: ConstString) {

    this.token = this.utilitiesConfigString.ls.get('token');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.token) {
      request = this.addToken(request, this.token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401 &&
          error.error.errors[0].detail === this.constString.EXPIRED_TOKEN) {
          return this.handle401Error(request, next);
        } else if (error instanceof HttpErrorResponse && error.status === 400 &&
          error.error.errors[0].detail === this.constString.UNAUTHORIZED_USER ||
          error instanceof HttpErrorResponse && error.error.errors[0].detail === this.constString.INVALID_TOKEN) {
          this.handle400Error();
        }
        return throwError(error);
      })
    );
  }

  addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.utilitiesConfigString.ls.get('token');
      return this.securityService.refreshToken(this.securityAdapter.adaptRefreshToken(token)).pipe(
        switchMap(res => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.data.access_token);
          this.utilitiesConfigString.ls.set('token', res.data.access_token);
          return next.handle(this.addToken(request, res.data.access_token));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }

  private handle400Error(): void {
    if (!this.isExpired) {
      this.isExpired = true;
      this.utilitiesConfigString.ls.removeAll();
      this.route.navigate(['iniciar-sesion']);
      this.isExpired = false;
      this.isRefreshing = false;
    }
  }

}
