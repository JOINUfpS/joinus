import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigTables {

  rowsPerPage = [10, 20, 50, 100, 200];
  rowCount = 10;
  paginator = true;

}
