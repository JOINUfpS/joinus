import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {AuthorPublicationModel} from '../../../models/publication/author-publication.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorPublicationAdapter implements Adapter<AuthorPublicationModel> {

  adaptList(list: any): AuthorPublicationModel[] {
    const array = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): AuthorPublicationModel {
    return new AuthorPublicationModel(
      item.id,
      item.author_name,
      item.author_photo,
    );
  }

  adaptListToSend(list: any): AuthorPublicationModel[] {
    const array = [];
    list.forEach(item => {
      array.push(this.adaptObjectSend(item));
    });
    return array;
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id ? item.id : null,
      author_name: item.authorName,
      author_photo: item.authorPhoto
    };
  }

  public adaptResponseToListAuthorPublicationModel(listUserFiltred: any[]): AuthorPublicationModel[] {
    const listAuthorPublicationModel = [];
    listUserFiltred.forEach(userSuggest => {
      listAuthorPublicationModel.push(
        new AuthorPublicationModel(userSuggest.id, userSuggest.user_name, userSuggest.user_photo));
    });
    return listAuthorPublicationModel;
  }

}
