import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { authGuard } from './core/guards/auth.guard';

import { RedirectPage } from './pages/redirect/redirect.page';
import { LoginPage } from './pages/auth/login.page';
import { SignupPage } from './pages/auth/signup.page';

import { EventsPage } from './pages/events/events.page';
import { EventFormPage } from './pages/events/event-form.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: RedirectPage },
  { path: 'login', component: LoginPage },
  { path: 'signup', component: SignupPage },

  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', component: EventsPage },
      { path: 'new', component: EventFormPage },
      { path: 'edit/:id', component: EventFormPage },
    ],
  },

  { path: '**', redirectTo: '' },
];
