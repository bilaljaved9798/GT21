import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { UserbetService } from '../../Services/userbet-service';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';
import { StorageService } from '../../Services/storage-service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-user-bet',
  imports: [CommonModule, MatDialogActions],
  templateUrl: './all-user-bet.html',
  styleUrl: './all-user-bet.css',
})
export class AllUserBet {
  allUserBets: any={};
  constructor(private userbetService: UserbetService,private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AllUserBet>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private storage: StorageService,
    private auth: AuthService,
    private router: Router,) {}
  ngOnInit() {
    const info = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    const userId = info?.user?.id;
    this.getAllUserBets(userId);
  }
 getAllUserBets(userId: string) {
    this.userbetService.getAllUserBets(userId).subscribe(res => {
      this.allUserBets = res;
      this.cdr.markForCheck();
    });
 }  
}
