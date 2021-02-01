import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {userRegister} from '../models/userRegister.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {userReturned} from '../models/userReturned.model';
import {HttpClient} from '@angular/common/http';
import {userLogin} from '../models/userLogin.model';
import {JwtToken} from '../models/jwtToken.model';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    public userAuth: userRegister;
    public user: userReturned;

    public userSession: {
        idUser: number;
        role: string;
        sessionUsername: string
    } = {
        idUser: 0,
        role: '',
        sessionUsername: ''
    };

    public isConnected: boolean = false;

    constructor(public http: HttpClient) {
        if(localStorage.getItem('jwtToken')) {
            this.isConnected = true;
        } else {
            this.isConnected = false;
        }

        this.userSession.sessionUsername = localStorage.getItem('sessionUsername');
        this.userSession.idUser = parseInt(localStorage.getItem('idUser'));
        this.userSession.role = localStorage.getItem('role');

    }


    public signup(userReg: userRegister): Observable<userReturned> {
        return this.http.post<userReturned>('/api/auth/signup', userReg);

    }

    public signin(credentials: { email: string, password: string }): Observable<any> {

        return this.http.post<any>('/api/auth/signin', credentials).pipe(
            tap((responseCredentials: any) => {

                if (responseCredentials.status != 3 &&  responseCredentials.status != 1) {
                    localStorage.setItem('jwtToken', responseCredentials.token);
                    localStorage.setItem('idUser', responseCredentials.idUser);
                    localStorage.setItem('sessionUsername', responseCredentials.sessionUsername);
                    localStorage.setItem('role', responseCredentials.role);

                    this.userSession.idUser = responseCredentials.idUser;
                    this.userSession.sessionUsername = responseCredentials.sessionUsername;
                    this.userSession.role = responseCredentials.role;
                    this.isConnected = true;
                }


            })
        );

    }


}
