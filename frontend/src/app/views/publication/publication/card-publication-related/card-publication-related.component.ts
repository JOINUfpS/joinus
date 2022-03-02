import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PublicationModel} from '../../../../models/publication/publication.model';
import {v4 as uuid} from 'uuid';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {UserModel} from '../../../../models/user/user.model';
import {MenuItem} from 'primeng/api';
import {PublicationAdapter} from '../../../../adapters/implementation/publication/publication.adapter';
import {PublicationService} from '../../../../services/publication/publication.service';
import {privacyOptions} from '../../../../utilities/types';
import {CreateEditPublicationComponent} from '../create-edit-publication/create-edit-publication.component';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {Router} from '@angular/router';
import {ConstString} from '../../../../utilities/string/const-string';

@Component({
  selector: 'app-card-publication-related',
  templateUrl: './card-publication-related.component.html'
})
export class CardPublicationRelatedComponent implements OnInit {

  @Input() indexPublication: number;
  @Input() publication: PublicationModel;
  @Output() eventDelete = new EventEmitter<number>();
  user: UserModel;
  privacyOptions: MenuItem[];
  publAmountInterest: number;
  publAmountShared: number;
  isLoading = false;
  responsiveOptions;
  isLoadingInterest = false;
  publDescription: string;
  labelSeeDescription: string;
  @ViewChild('modalCreateEditPublication', {static: false}) modalCreateEditPublication: CreateEditPublicationComponent;
  @ViewChild('htmlInputElement') htmlInputElement: ElementRef;

  constructor(private messagerService: MessagerService,
              public utilitiesString: UtilitiesConfigString,
              private publicationAdapter: PublicationAdapter,
              private publicationService: PublicationService,
              private router: Router) {
    this.user = this.utilitiesString.ls.get('user');
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
    this.formPrivacyOptions();
    this.seeMore();
    this.publAmountInterest = this.publication?.publInterestedList.length;
    this.publAmountShared = this.publication?.publAmountShared;
  }

  changePrivacy(option: string): void {
    this.publication.publPrivacy = option === privacyOptions.PRIVADO;
    this.publicationService.updatePublication(this.publicationAdapter.adaptObjectSend(this.publication))
      .then(res => {
        if (!res.status) {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      });

  }

  formPrivacyOptions(): void {
    this.privacyOptions = [
      {
        label: 'Privada',
        icon: 'bi bi-lock',
        disabled: this.publication?.publPrivacy,
        command: (_ => this.changePrivacy(privacyOptions.PRIVADO))
      },
      {
        label: 'Pública',
        icon: 'bi bi-globe',
        disabled: !this.publication?.publPrivacy,
        command: (_ => this.changePrivacy(privacyOptions.PUBLICO))
      },
    ];
  }

  seeDescription(): void {
    if (this.labelSeeDescription === ConstString.SEE_MORE) {
      this.seeLess();
    } else {
      this.seeMore();
    }
  }

  seeMore(): void {
    this.publDescription = this.publication?.publDescription.trim();
    if (this.publication?.publDescription.length > 500) {
      this.publDescription = this.publication?.publDescription.slice(0, 500);
      this.publDescription = this.publDescription + '...';
      this.labelSeeDescription = ConstString.SEE_MORE;
    }
  }

  seeLess(): void {
    this.publDescription = this.publication?.publDescription.slice(0);
    this.labelSeeDescription = ConstString.SEE_LEST;
  }

  seeProfile(idUser: uuid): void {
    if (idUser !== null) {
      this.router.navigate(['perfil', idUser]).then();
    }
  }

}
