import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';
import { ErrorPageComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users',
    component: UserListComponent,
    // canActivate: [authGuard]
    canActivate: [permissionGuard],
    data: { permission: 'READ' }
  },
  {
    path: 'users/new',
    component: UserFormComponent,
    // canActivate: [authGuard]
    canActivate: [permissionGuard],
    data: { permission: 'CREATE' }
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    // canActivate: [authGuard]
    canActivate: [permissionGuard],
    data: { permission: 'UPDATE' }
  },
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  { path: '404', component: ErrorPageComponent },
  {
    path: '**',
    redirectTo: '/404'
  }
];