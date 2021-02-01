import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {ConnexionComponent} from './connexion/connexion.component';
import {RouterModule} from '@angular/router';
import {InscriptionComponent} from './inscription/inscription.component';
import {loginRegisterModule} from './shared/components/LoginRegister/loginRegister.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from './shared/services/authentication.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './shared/interceptors/auth.interceptor';
import {ArticleComponent} from './article/article.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './shared/modules/material/material.module';
import {FontawesomeModule} from './shared/modules/fontawesome/fontawesome.module';
import {ArticleService} from './shared/services/article.service';
import {ResponseInterceptor} from './shared/interceptors/response.interceptor';
import {PipesModule} from './shared/pipes/pipes.module';
import {DateService} from './shared/services/date.service';
import {StringService} from './shared/services/string.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {MiscService} from './shared/services/misc.service';


@NgModule({
    declarations: [
        AppComponent,
        ConnexionComponent,
        InscriptionComponent,
        ArticleComponent,
        PageNotFoundComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        loginRegisterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        FontawesomeModule,
        PipesModule
    ],
    providers: [
        AuthenticationService,
        ArticleService,
        DateService,
        StringService,
        MiscService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResponseInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
