import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../shared/services/authentication.service';
import {userReturned} from '../shared/models/userReturned.model';
import {Router} from '@angular/router';

@Component({
    selector: 'app-inscription',
    templateUrl: './inscription.component.html',
    styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {


    public registerForm: FormGroup;

    constructor(
        public fb: FormBuilder,
        public auth: AuthenticationService,
        public router: Router
    ) {
    }


    ngOnInit(): void {

        this.initForm();
    }

    MatchPassword(password: string, confirmPassword: string) {
        return (formGroup: FormGroup) => {
            const passwordControl = formGroup.controls[password];
            const confirmPasswordControl = formGroup.controls[confirmPassword];

            if (!passwordControl || !confirmPasswordControl) {
                return null;
            }

            if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
                return null;
            }

            if (passwordControl.value !== confirmPasswordControl.value) {
                confirmPasswordControl.setErrors({passwordMismatch: true});
            } else {
                confirmPasswordControl.setErrors(null);
            }
        };
    }


    initForm() {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]]
        }, {validator: this.MatchPassword('password', 'confirmPassword')});
    }


    checkPasswords(group: FormGroup) {
        console.log(group.controls.password.value === group.controls.confirmPassword.value);
        return group.controls.password.value === group.controls.confirmPassword.value;
    }

    onValidRegisterForm() {
        let userAuth = this.registerForm.value;
        console.log(userAuth);
        this.auth.signup(userAuth).subscribe((user: userReturned) => {
            this.router.navigate(['/connexion']);
        });
    }
}
