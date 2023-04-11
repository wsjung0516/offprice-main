import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMaterial } from 'src/app/core/constants/data-define';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule],
  template: `
    <div class="flex_wrap">
      <ng-container *ngFor="let material of materials">
        <button
          #buttonRef
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: material.key === selected_material }"
          (click)="selectValue(material)"
        >
          {{ material.key }}
        </button>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .flex_wrap {
        display: flex;
        flex-wrap: wrap;
      }

      .box-size {
        width: auto;
        padding: 0.5rem;
        height: 2rem;
        margin: 0.25rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        background-color: #2962ff;
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialComponent implements OnInit {
  selected_material = '';
  materials: typeof EMaterial = EMaterial;
  @ViewChildren('buttonRef') buttonRefs!: QueryList<
    ElementRef<HTMLButtonElement>
  >;
  constructor(
    private SharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService
  ) {}
  ngOnInit() {
    this.SharedMenuObservableService.reset_material$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.reset();
      });
  }
  selectValue(material: any) {
    const value = { key: 'material', value: material.key };
    this.selected_material = material.key;
    this.SharedMenuObservableService.material.next(material.key);
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
  }
  reset() {
    this.buttonRefs.get(0)?.nativeElement.click();
  }
}
