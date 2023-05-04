import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sizes } from 'src/app/core/constants/data-define';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-select-size',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap">
      <ng-container *ngFor="let size of sizes">
        <button
          #buttonRef
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ 
            'bg-blue-200': size.category === 'US',
            'bg-green-200': size.category === 'KR'
           }"
          (click)="selectSize(size)"
        >
          {{ size.key }}
        </button>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .box-size {
        width: auto;
        height: 2.5rem;
        margin: 0.25rem;
        padding: 0.5rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        background-color: #2962ff;
        color: white;
      }
      .bg-green-200 {
        background-color: #bbf7d0;
      }
      .bg-blue-200 {
        background-color: #bfdbfe;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSizeComponent {
  sizes = Sizes;
  selected_size = '';
  @ViewChildren('buttonRef') buttonRefs!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  constructor(
    private SharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService
  ) {}
  ngOnInit() {
    this.SharedMenuObservableService.reset_size$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.reset();
      });
  }

  selectSize(size: any) {
    // console.log('selectSize', size);
    const value = { key: 'size', value: size.key };
    this.selected_size = size.key;
    this.SharedMenuObservableService.input_keyword.next(size.key);
    // this.SharedMenuObservableService.size.next(size.key);
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
    if (size.key === 'All') {
      this.reset();
    }
  }
  reset() {
    // console.log('reset size', this.buttonRefs);
    this.buttonRefs.get(0)?.nativeElement.click();
  }
}
