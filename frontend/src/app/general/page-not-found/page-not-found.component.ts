import {Component} from '@angular/core';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {ConstString} from '../../utilities/string/const-string';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {

  constructor(public utilitiesString: UtilitiesConfigString,
              public constString: ConstString) {
  }

}
