import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MessagerService} from '../../messenger/messager.service';
import {Router} from '@angular/router';
import {ConstString} from '../../utilities/string/const-string';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private messagerService: MessagerService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = this.validateError(error, errorMessage);
        }
        if (errorMessage.trim() !== '') {
          this.messagerService.showToast(EnumLevelMessage.ERROR, errorMessage);
        }
        return throwError(error);
      })
    );
  }

  private validateError(error, errorMessage: string): string {
    switch (error.status) {
      case 0:
      case 500:
        errorMessage = ConstString.ERROR_REQUEST;
        break;
      case 400:
        if (error.error.errors[0].detail !== undefined) {
          errorMessage = error.error.errors[0].detail;
        } else {
          errorMessage = ConstString.ERROR_FIELD;
        }
        break;
      case 401:
        this.router.navigate(['iniciar-sesion']);
        break;
      case 404:
        if (error.error.errors !== undefined) {
          if (error.error.errors[0].detail === ConstString.USER_NOT_FOUND || error.error.errors[0].detail === ConstString.USER_NOT_EXIST) {
            errorMessage = ConstString.MESSAGE_USER_NOT_FOUND;
          } else {
            this.router.navigate(['pagina-no-encontrada']);
          }
        }
        break;
      default:
        if (error.error.errors !== undefined) {
          errorMessage = error.error.errors[0].detail;
        }
    }
    return errorMessage;
  }
}
