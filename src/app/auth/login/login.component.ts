import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      axios.post('https://4b4e321292fe47bc9ca77a1372a820e1.api.mockbin.io/', { email, password })
        .then(response => {
          console.log('Login successful', response);
          const token = response.data.token;
          const role = response.data.role;
          if(response.data.login && token){
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            this.router.navigate(['/dashboard/overview']);
          }
        })
        .catch(error => {
          console.error('Login failed', error);
        });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
