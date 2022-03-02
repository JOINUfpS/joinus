import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {ProjectModel} from '../../../models/user/project.model';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../../utilities/string/const-string';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ProjectAdapter implements Adapter<ProjectModel> {

  constructor(private datePipe: DatePipe) {
  }

  adaptList(listProject: Array<ProjectModel>): ProjectModel[] {
    const array: Array<any> = [];
    listProject.forEach(project => {
      array.push(this.adaptObjectReceive(project));
    });
    return array;
  }

  adaptObjectReceive(project: any): ProjectModel {
    return new ProjectModel(
      project.id,
      project.title,
      project.abstract,
      project.start_date,
      project.end_date,
      project.link !== null ? project.link : ''
    );
  }

  adaptArrayObjectSend(userProjects: ProjectModel[]): any {
    const arrayUserProjects: any = [];
    userProjects.forEach(project => {
      arrayUserProjects.push(this.adaptObjectSend(project));
    });
    return {user_projects: arrayUserProjects};
  }

  adaptObjectSend(userProjectModel: ProjectModel): any {
    return {
      id: userProjectModel.id,
      title: userProjectModel.title,
      abstract: userProjectModel.abstract,
      start_date: userProjectModel.startDate,
      end_date: userProjectModel.endDate,
      link: userProjectModel.link ? userProjectModel.link : null
    };
  }

  adaptNewProject(valuesFormNewProject: any): ProjectModel {
    return new ProjectModel(
      uuid(),
      valuesFormNewProject.userProjectTitle,
      valuesFormNewProject.userProjectAbstract,
      typeof valuesFormNewProject.userProjectStartDate === ConstString.TYPE_STRING ?
        valuesFormNewProject.userProjectStartDate : this.datePipe.transform(valuesFormNewProject.userProjectStartDate, 'MM/yyyy'),
      typeof valuesFormNewProject.userProjectEndDate === ConstString.TYPE_STRING ?
        valuesFormNewProject.userProjectEndDate : this.datePipe.transform(valuesFormNewProject.userProjectEndDate, 'MM/yyyy'),
      valuesFormNewProject.userProjectLink !== null ? valuesFormNewProject.userProjectLink : ''
    );
  }

  adaptAddProject(projectsOldUsers: Array<ProjectModel>, projectNewUser: any): ProjectModel[] {
    let updateProjects: Array<any> = [];
    updateProjects = updateProjects.concat(projectsOldUsers);
    updateProjects.unshift(projectNewUser);
    return updateProjects;
  }

  updateProject(indexProject: number, userProjects: Array<ProjectModel>, projectEditedAdapted: any): ProjectModel[] {
    userProjects[indexProject] = projectEditedAdapted;
    return userProjects;
  }

}
