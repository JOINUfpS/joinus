import {Injectable} from '@angular/core';


@Injectable()
export class UtilitiesList {

  static replaceTextFieldArrayAny(array: any[], key: string, oldText: string, newText: string): Array<any> {
    array.forEach(item => {
      item[key] = item[key].replace(oldText, newText);
    });
    return array;
  }

}
