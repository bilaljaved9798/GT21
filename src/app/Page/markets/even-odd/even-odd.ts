import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-even-odd',
  imports: [CommonModule],
  templateUrl: './even-odd.html',
  styleUrl: './even-odd.css',
})

export class EvenOdd {
 @Input() eventId!: string;
 @Input() marketId!: string
  marketboos: any=[];
}
