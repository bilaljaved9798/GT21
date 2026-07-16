import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MarketService } from '../../Services/marketservice';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-popup',
  standalone: true,
  imports: [ CommonModule, MatIconButton, MatIconModule],
  templateUrl: './book-popup.html',
  styleUrls: ['./book-popup.css'],
})
export class BookPopup {
  bookData: any;

  constructor(
     public dialogRef: MatDialogRef<BookPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private marketService: MarketService,private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.marketService
      .showCompletedUserBetsFancyIN(
        this.data.marketBookId,
        this.data.selectionId
      )
      .subscribe(res => {
        this.bookData = res;
        this.cd.detectChanges();
      });

  }

  close(): void {
    this.dialogRef.close();
  }

}
