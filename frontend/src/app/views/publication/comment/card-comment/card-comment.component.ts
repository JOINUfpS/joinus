import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {UserModel} from '../../../../models/user/user.model';
import {MenuItem} from 'primeng/api';
import {PublicationModel} from '../../../../models/publication/publication.model';
import {PublicationAdapter} from '../../../../adapters/implementation/publication/publication.adapter';
import {PublicationService} from '../../../../services/publication/publication.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {Router} from '@angular/router';
import {ConstString} from '../../../../utilities/string/const-string';

@Component({
  selector: 'app-card-comment',
  templateUrl: './card-comment.component.html'
})
export class CardCommentComponent implements OnInit {

  @Input() comment: any;
  @Input() menuButton: boolean;
  @Input() publication: PublicationModel;
  user: UserModel;
  items: MenuItem[];
  focus;
  publComment: string;
  editingComment = false;
  commContent: string;
  labelSeeComment: string;

  constructor(public utilitiesString: UtilitiesConfigString,
              private publicationAdapter: PublicationAdapter,
              private publicationService: PublicationService,
              private messagerService: MessagerService,
              private router: Router) {
    this.user = this.utilitiesString.ls.get('user');
    this.menuButton = false;
  }

  ngOnInit(): void {
    this.formMenu();
    this.seeMore();
  }

  private formMenu(): void {
    this.items = [
      {
        label: 'Editar',
        command: (_ => this.showEditComment())
      },
      {
        label: 'Eliminar',
        command: (_ => this.deleteComment())
      },
    ];
  }

  private showEditComment(): void {
    this.editingComment = true;
    this.publComment = this.comment?.comm_content;
  }

  viewProfileUser(): void {
    this.router.navigate(['perfil', this.comment?.comm_user_id]).then();
  }

  editComment(): void {
    const comments: any = this.publication.publComment;
    comments.find(item => item.id === this.comment.id).comm_content = this.publComment.trim();
    this.publication.publComment = comments;
    this.editingComment = false;
    this.commContent = this.publComment.trim();
    this.publicationService.partialUpdatePublication(this.publicationAdapter.addOrEditCommentAdapter(this.publication))
      .then(response => {
        this.validateStatusResponse(response);
      });
  }

  private deleteComment(): void {
    const comments: any = this.publication.publComment;
    comments.splice(comments.findIndex(c => c.id === this.comment.id), 1);
    this.publication.publComment = comments;
    this.publicationService.partialUpdatePublication(this.publicationAdapter.addOrEditCommentAdapter(this.publication))
      .then(response => {
        this.validateStatusResponse(response);
      });
  }

  private validateStatusResponse(response: any): void {
    if (!response.status) {
      this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
    }
  }

  seeCompleteContent(): void {
    if (this.labelSeeComment === ConstString.SEE_MORE) {
      this.seeLess();
    } else {
      this.seeMore();
    }
  }

  private seeMore(): void {
    this.commContent = this.comment?.comm_content.trim();
    if (this.comment?.comm_content.length > 100) {
      this.commContent = this.comment?.comm_content.slice(0, 100);
      this.commContent = this.commContent + '...';
      this.labelSeeComment = ConstString.SEE_MORE;
    }
  }

  private seeLess(): void {
    this.commContent = this.comment?.comm_content.slice(0);
    this.labelSeeComment = ConstString.SEE_LEST;
  }
}
