import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OtherMarketServices } from '../../../Services/other-market-services';
import { StorageService } from '../../../Services/storage-service';

@Component({
  selector: 'app-even-odd',
  imports: [CommonModule],
  templateUrl: './even-odd.html',
  styleUrl: './even-odd.css',
})

export class EvenOdd {
 @Input() eventId!: string;
 @Input() marketId!: string
  marketbooks: any=[];
  constructor(private otherMarketServices: OtherMarketServices,private storage: StorageService) {}

  ngOnInit() {
    this.otherMarketServices.GetEvenOdd(this.eventId).subscribe((data) => {
      this.marketbooks = data;
    });
  }
}
