import {HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {ArticleService} from '../services/article.service';
import {AuthenticationService} from '../services/authentication.service';


@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private article: ArticleService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        this.article.isBusy = true;
        const token = localStorage.getItem('jwtToken');

        if (token) {

            const authRquest = req.clone({
                headers: req.headers.set('authorization', token)
            });

            return next.handle(authRquest);

        } else {

            return next.handle(req);

        }
    }
}
