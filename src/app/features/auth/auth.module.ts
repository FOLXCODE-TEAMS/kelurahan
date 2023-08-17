import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { RegisterComponent } from './register/register.component';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { FcSelectOptionModule } from '@shared/components/fc-select-option/fc-select-option.module';

@NgModule({
  declarations: [AuthComponent, LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    PasswordModule,
    SharedModule,
    FcDatepickerModule,
    FcInputTextModule,
    FcInputNumberModule,
    FcSelectOptionModule,
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AuthModule {}
