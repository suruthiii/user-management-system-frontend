import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'users', 
    component: UserListComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'users/new', 
    component: UserFormComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'users/edit/:id', 
    component: UserFormComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];