import {Component} from '@angular/core';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html'
})
export class AboutUsComponent {

  constructor(public utilitiesConfigString: UtilitiesConfigString,
              public location: Location) {
  }
}
