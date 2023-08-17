import { Location } from '@angular/common';
import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@features/auth/services/auth.service';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css'],
})
export class CustomerAddComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        this.submit();
      },
    },
  ];

  registerForm: FormGroup;
  constructor(
    private layoutService: LayoutService,
    private authService: AuthService,
    private location: Location,
    private messageService: MessageService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Customer',
      icon: '',
      showHeader: true,
    });
    // init form
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('asdqwe123'), // default password
      address: new FormControl(''),
      phone_no: new FormControl(''),
      customer: new FormGroup({
        note: new FormControl(''),
      }),
    });
  }
  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.registerForm.valid) {
      this.actionButtons[0].loading = true;
      if (this.registerForm.value.customer.note === '') {
        this.registerForm.patchValue({
          customer: {
            note: '-',
          },
        });
      }
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.actionButtons[0].loading = false;
          this.location.back();
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer added successfully',
          });
        },
        error: (err) => {
          this.actionButtons[0].loading = false;

          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: err.error.message,
          });
        },
      });
    } else {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'error',
        detail: 'Please check your input',
      });
    }
  }
}
