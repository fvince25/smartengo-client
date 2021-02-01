import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(
        private auth: AuthenticationService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {

        if (!this.auth.isConnected) {
            this.router.navigate(['/connexion']);
            return false;
        } else {
            return true;
        }

    }
}
