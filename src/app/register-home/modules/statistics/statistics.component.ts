import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SoldRecordsComponent } from '../../core/components/sold-records/sold-records.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    SoldRecordsComponent,
    MatTabsModule,

  ],
  templateUrl: './statistics.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent {
  tabs = ['Sold Record', 'Second', 'Third'];

}
