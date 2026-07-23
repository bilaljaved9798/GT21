import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogActions, MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { AccountService } from '../../Services/account-service';
import { StorageService } from '../../Services/storage-service';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookPopup } from '../book-popup/book-popup';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stack-popup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    MatIconModule,
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatCard,
    MatCardTitle,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './stack-popup.html',
  styleUrl: './stack-popup.css',
})
export class StackPopup {
 form!: FormGroup;
 constructor(
  public dialogRef: MatDialogRef<StackPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: AccountService,
    private storage: StorageService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {

    this.form = this.fb.group({

  SimpleBtn1: [''],
  SimpleBtn2: [''],
  SimpleBtn3: [''],
  SimpleBtn4: [''],
  SimpleBtn5: [''],
  SimpleBtn6: [''],
  SimpleBtn7: [''],
  SimpleBtn8: [''],
  SimpleBtn9: [''],
  // SimpleBtn10: [''],
  // SimpleBtn11: [''],
  // SimpleBtn12: [''],

  MutipleBtn1: [''],
  MutipleBtn2: [''],
  MutipleBtn3: [''],
  MutipleBtn4: [''],
  MutipleBtn5: [''],
  MutipleBtn6: [''],
  MutipleBtn7: [''],
  MutipleBtn8: [''],
  MutipleBtn9: ['']
  // MutipleBtn10: [''],
  // MutipleBtn11: [''],
  // MutipleBtn12: ['']

});

    this.load();
  }

  load() {
    const result = this.storage.get<any>('userInfo')?.user?.result;

  if (!result) return;

  this.form.patchValue({
    SimpleBtn1: result.simpleBtn1,
    SimpleBtn2: result.simpleBtn2,
    SimpleBtn3: result.simpleBtn3,
    SimpleBtn4: result.simpleBtn4,
    SimpleBtn5: result.simpleBtn5,
    SimpleBtn6: result.simpleBtn6,
    SimpleBtn7: result.simpleBtn7,
    SimpleBtn8: result.simpleBtn8,
    SimpleBtn9: result.simpleBtn9,
    // SimpleBtn10: result.simpleBtn10,
    // SimpleBtn11: result.simpleBtn11,
    // SimpleBtn12: result.simpleBtn12,

    MutipleBtn1: result.mutipleBtn1,
    MutipleBtn2: result.mutipleBtn2,
    MutipleBtn3: result.mutipleBtn3,
    MutipleBtn4: result.mutipleBtn4,
    MutipleBtn5: result.mutipleBtn5,
    MutipleBtn6: result.mutipleBtn6,
    MutipleBtn7: result.mutipleBtn7,
    MutipleBtn8: result.mutipleBtn8,
    MutipleBtn9: result.mutipleBtn9
    // MutipleBtn10: result.MutipleBtn10,
    // MutipleBtn11: result.MutipleBtn11,
    // MutipleBtn12: result.MutipleBtn12
  });
}

save(){

    // if(this.form.invalid)
    //   return;

    this.service.updateBetSlipKeys(this.form.value)
      .subscribe({
        next:()=>{
          this.dialogRef.close(true);
          this.auth.logout();
          this.router.navigate(['/']);
        }
      });
  }

}

