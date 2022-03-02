import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly URL_API = environment.utilityUrl + 'category/';
  public user;

  constructor(private http: HttpClient, public utilitiesConfigString: UtilitiesConfigString) {
    this.user = this.utilitiesConfigString.ls.get('user');
  }

  listAllCategories(): Promise<any> {
    return this.http.get(this.URL_API).toPromise();
  }

  listAllCategoryByType(type: string): Promise<any> {
    const URL_API = `${this.URL_API}?inst_id=${this.user.instId}&cate_type=${type}`;
    return this.http.get(URL_API).toPromise();
  }

  listCategoriesWithPagination(paginator: any): Promise<any> {
    return this.http.get(paginator.next).toPromise();
  }

  saveCategory(category: any): Promise<any> {
    return this.http.post(this.URL_API, category).toPromise();
  }

  updateCategory(category: any): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    const URL_API = `${this.URL_API}${category.id}/`;
    return this.http.put(URL_API, category, httpOptions).toPromise();
  }

  deleteCategory(cateId): Promise<any> {
    const URL_API = `${this.URL_API}${cateId}/`;
    return this.http.delete(URL_API).toPromise();
  }

}
