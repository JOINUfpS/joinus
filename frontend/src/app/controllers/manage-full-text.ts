import {PublicationService} from '../services/publication/publication.service';
import {PublicationAdapter} from '../adapters/implementation/publication/publication.adapter';
import {PublicationModel} from '../models/publication/publication.model';

export class ManageFullText {

  public publication: PublicationModel;

  constructor(private publicationService: PublicationService,
              private publicationAdapter: PublicationAdapter) {
  }

  sendFullText(email, publId): Promise<any> {
    return this.publicationService.sendFullRequest(this.publicationAdapter.sendFullText(email, publId));
  }
}
