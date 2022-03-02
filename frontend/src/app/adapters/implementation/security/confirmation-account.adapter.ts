import {Injectable} from '@angular/core';
import {ConfirmationAccountModel} from '../../../models/security/confirmation-account.model';
import {AdapterWriteOnly} from '../../abstract/adapter-write-only';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationAccountAdapter implements AdapterWriteOnly<ConfirmationAccountModel> {

  adaptObjectReceive(item: any): ConfirmationAccountModel {
    return new ConfirmationAccountModel(
      item.id,
      item.user_email,
      item.temporal_password,
      item.account_status,
      item.created_date
    );
  }

  adaptObjectSend(confirmation: any): any {
    return {
      user_email: confirmation.userEmail,
      temporal_password: confirmation.temporalPassword,
      user_password: confirmation.newPassword,
      account_status: 'CONFIRMADO'
    };
  }
}
