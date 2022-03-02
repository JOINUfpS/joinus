import {Component} from '@angular/core';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent {

  constructor(public utilitiesString: UtilitiesConfigString,
              public location: Location) {
  }
}
