import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {ConfirmAccountService} from './confirm-account.service';
import {ConfirmationAccountModel} from '../../models/security/confirmation-account.model';
import {ConfirmationAccountAdapter} from '../../adapters/implementation/security/confirmation-account.adapter';


describe('ConfirmAccountService', () => {
  let service: ConfirmAccountService;
  let httpTestingController: HttpTestingController;
  let confirmAccountAdapter: ConfirmationAccountAdapter;
  const url = `${environment.securityUrl}confirm_account/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfirmAccountService, UtilitiesConfigString, HttpClient]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ConfirmAccountService);
    confirmAccountAdapter = TestBed.inject(ConfirmationAccountAdapter);
  });

  it('should be confirming account', () => {
    expect(service).toBeTruthy();
  });

  it('Should be create confirming account', () => {

    const confirmationAccount = new ConfirmationAccountModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      'paolapajaro@ufps.edu.co',
      'Joinus.2021',
      'FORZAR_CAMBIO_CONTRASEÑA',
      new Date());

    const confirmationAdapted = confirmAccountAdapter.adaptObjectSend(confirmationAccount);

    service.confirmAccount(confirmationAdapted).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}confirming_account/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

});
