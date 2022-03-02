import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EnumLevelMessage} from '../../../messenger/enum-level-message.enum';
import {ProjectModel} from '../../../models/user/project.model';
import {ConfirmationService} from 'primeng/api';
import {ProjectAdapter} from '../../../adapters/implementation/user/project.adapter';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {UsersService} from '../../../services/user/user.service';
import {MessagerService} from '../../../messenger/messager.service';
import {UserAdapter} from '../../../adapters/implementation/user/user.adapter';
import {ConstString} from '../../../utilities/string/const-string';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {

  projectAbstract: string;
  labelSeeAbstract: string;
  userSession: UserModel;
  @Input() projectModel: ProjectModel;
  @Input() indexUserProject: number;
  @Output() eventDeleteProject = new EventEmitter<number>();
  @Output() eventEditProject = new EventEmitter<number>();

  constructor(private confirmationService: ConfirmationService,
              private userService: UsersService,
              private userProjectAdapter: ProjectAdapter,
              private userAdapter: UserAdapter,
              private utilitiesConfigString: UtilitiesConfigString,
              private messagerService: MessagerService) {
    this.userSession = this.utilitiesConfigString.ls.get('user');
  }

  ngOnInit(): void {
    this.seeDescription();
  }

  deleteProject(): void {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar el proyecto seleccionado?',
      accept: () => {
        this.removeProjectUser();
        const bodyUserProjects = this.userProjectAdapter.adaptArrayObjectSend(this.userSession.userProjects);
        this.userService.partialUserUpdate(bodyUserProjects, this.userSession.id)
          .then(response => {
            this.utilitiesConfigString.ls.set('user', this.userAdapter.adaptObjectReceive(response.data));
            this.eventDeleteProject.emit(this.indexUserProject);
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Proyecto eliminado con éxito.');
          });
      }
    });
  }

  editProject(): void {
    this.eventEditProject.emit(this.indexUserProject);
  }

  updateInfoAfterChange(): void {
    this.userSession = this.utilitiesConfigString.ls.get('user');
  }

  private removeProjectUser(): void {
    this.userSession.userProjects.splice(this.indexUserProject, 1);
  }

  seeDescription(): void {
    if (this.labelSeeAbstract === ConstString.SEE_MORE) {
      this.seeLess();
    } else {
      this.seeMore();
    }
  }

  seeLess(): void {
    this.projectAbstract = this.projectModel?.abstract.slice(0);
    this.labelSeeAbstract = ConstString.SEE_LEST;
  }

  seeMore(): void {
    this.projectAbstract = this.projectModel?.abstract.trim();
    if (this.projectModel?.abstract.length > 300) {
      this.projectAbstract = this.projectModel?.abstract.slice(0, 300);
      this.projectAbstract = this.projectAbstract + '...';
      this.labelSeeAbstract = ConstString.SEE_MORE;
    }
  }

}
