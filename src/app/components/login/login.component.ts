import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import axios from 'axios';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

  export class LoginComponent {

    validData = false;

    userLogin: FormGroup;

    constructor(
      private userAuthService: UserService,
      private router: Router,
      private fb: FormBuilder
    ) {
      this.userLogin = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
      });
    }

    get email() {
      return this.userLogin.get('email');
    }

    get password() {
      return this.userLogin.get('password');
    }

    login() {
      axios.post("http://localhost:4000/auth/admin", this.userLogin.value)
        .then((res) => {
          console.log(res);
          if (res.data && res.data.status === "success") {
            // Assuming email and token are returned in the response
            const { email, token } = res.data;
            this.userAuthService.userLoggedIn(email, token);
            this.router.navigate(['chart']);
          } else {
            // Handle unexpected response status
            console.error("Unexpected response:", res);
            // Set appropriate error flag or message
            this.validData = false; // Or handle the error as needed
          }
        })
        .catch((err) => {
          console.error(err);
          // Set appropriate error flag or message
          this.validData = true; // Or handle the error as needed
        });
    }

    }






