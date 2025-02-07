import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { AuthGuard } from './auth/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, 
    AppComponent,
    LoginComponent,
    OverviewComponent
  ],
  // bootstrap: [AppComponent] // Uncomment to bootstrap the app
})
export class AppModule { }