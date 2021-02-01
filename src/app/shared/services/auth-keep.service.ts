import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthKeepService implements CanActivate {

    constructor(
        private auth: AuthenticationService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {

        console.log('on teste bien si on est connecté', this.auth.isConnected);
        if (this.auth.isConnected) {
            this.router.navigate(['/article']);
            return false;
        } else {
            return true;
        }

    }
}
