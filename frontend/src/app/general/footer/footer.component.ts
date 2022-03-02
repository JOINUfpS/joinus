import {Component} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  date = new Date();
  readonly urlConductNorms = 'https://studentsprojects.cloud.ufps.edu.co/asn_balancing/api_gateway/asn_file/files/api/file/get_object/d156117d-9353-4aad-ac9b-1d03e9965526/';

}
