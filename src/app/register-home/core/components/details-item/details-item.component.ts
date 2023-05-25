import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
// import { UserSaleList } from 'src/app/register-home/core/models/user-sale-list.model';
import { HtmlContentComponent } from 'src/app/core/utils/html-content/html-content.component';
// import { HtmlContentComponent } from 'src/app/register-home/core/utils/html-content-old/html-content.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogRef } from '@ngneat/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

export interface Data {
  data: Partial<UserSaleList>;
}
@Component({
  selector: 'app-details-item',
  standalone: true,
  imports: [
    CommonModule,
    HtmlContentComponent,
    ConfirmDialogComponent,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './details-item.component.html',
  styles: [
    `
      mat-card-content {
        padding: 0 !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsItemComponent implements OnInit, AfterViewInit {
  item: any;
  selectedImage = '';
  ref: DialogRef<Data> = inject(DialogRef);

  constructor(private cd: ChangeDetectorRef) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.item = { ...this.ref.data.data };
    this.cd.detectChanges();
  }
  onClose(): void {
    this.ref.close();
  }
}
