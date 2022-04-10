import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserModel} from '../../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './card-user.component.html'
})
export class CardUserComponent {

  @Input() user: UserModel;
  @Input() optionAssignRole: boolean;
  @Output() eventEmitterAssignRole = new EventEmitter<{ user: UserModel }>();

  constructor(public utilitiesString: UtilitiesConfigString) {
  }

  assignRole(): void {
    this.eventEmitterAssignRole.emit({user: this.user});
  }

}
