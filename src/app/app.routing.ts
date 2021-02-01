import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import {ConnexionComponent} from './connexion/connexion.component';
import {NgModule} from '@angular/core';
import {InscriptionComponent} from './inscription/inscription.component';
import {ArticleComponent} from './article/article.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthGuardService} from './shared/services/auth-guard.service';
import {AuthKeepService} from './shared/services/auth-keep.service';

// @ts-ignore
const APP_ROUTES: Routes = [
  {path: '', redirectTo: 'connexion', pathMatch: 'full'},
  {path: 'connexion', component: ConnexionComponent, canActivate: [AuthKeepService]},
  {path: 'inscription', component: InscriptionComponent, canActivate: [AuthKeepService]},
    {
        path: 'article', children: [
            {
                path: '', component: ArticleComponent, pathMatch: 'full', canActivate: [AuthGuardService]
            },
            {
                path: ':id', component: ArticleComponent, canActivate: [AuthGuardService]
            },
            {
                path: ':id/:action', component: ArticleComponent, canActivate: [AuthGuardService]
            }

        ]
    },
    {path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES)
  ]
})
export class AppRoutingModule {
}
