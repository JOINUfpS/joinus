import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ListConversationComponent} from './list-conversation/list-conversation.component';


export const routes: Routes = [
  {path: '', component: ListConversationComponent}
];

export const ChatRoutes: ModuleWithProviders<any> = RouterModule.forChild(routes);
