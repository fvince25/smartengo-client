import {HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {ArticleService} from '../services/article.service';
import {AuthenticationService} from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class ResponseInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private article: ArticleService,
        private auth: AuthenticationService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(

            tap(event => {

                if (event instanceof HttpResponse) {

                    this.article.isBusy = false;

                    if (event.body['status']) {

                        if (event.body['status'] == 2) {

                            this.auth.isConnected = false;
                            localStorage.removeItem('jwtToken');
                            this.article.currentArticle = null;
                            alert('Tentative de fraude');
                            this.router.navigate(['/connexion']);

                        }
                        if (event.body['status'] == 1) {

                            alert('Erreur Technique');

                        }
                        if (event.body['status'] == 3) {

                            alert('Les informations saisies sont incorrectes');

                        }
                    }
                }
            })
        )

    }
}
