import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { filter, tap, takeUntil, Subject, from, switchMap, toArray, map } from 'rxjs';
import { Sizes } from 'src/app/register-home/core/constants/data-define';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';


// @UntilDestroy()
@Component({
  selector: 'app-size-scale-vca',
  standalone: true,
  imports: [
CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './size-scale-vca.component.html',
  styles: [`
    .margin-top {
      margin-top: -0px;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SizeScaleVcaComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SizeScaleVcaComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
  form = this.fb.group({
    sizes: this.fb.array([]),
  });
  onChange: any = () => {};
  onTouch: any = () => {};
  destroy = new Subject();
  destroy$ = this.destroy.asObservable();
  sizesScale: {key:string, value:string}[] = Sizes;
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sizes.valueChanges.pipe(
      takeUntil(this.destroy$),
      switchMap((value: {scale: object, ratio: string}[]) => {
        return from(value).pipe(
          filter((val: {scale: any, ratio: string}) => val.scale !== '' && val.ratio !== ''),
          // filter((val: {scale: string, ratio: string}) => val.scale !== null && val.ratio !== null),
          map((val: {scale: any, ratio: string}) => {
            return {
              scale: val.scale.key,
              ratio: val.ratio,
            };
          }),
          toArray(),
        );
      }),
    )
    .subscribe((value) => {
      // console.log('value 2', value);
      if( value.length > 0) {
        this.onChange(value);

      }
    });

  }
  ngAfterViewInit(): void {
    this.addsize();
    this.cd.detectChanges();

  }

  get sizes() {
    return this.form.controls['sizes'] as FormArray;
  }
  get formGroupArray(): FormGroup[] {
    return (this.form.get('sizes') as FormArray).controls as FormGroup[];
  }
  addsize() {
    const sizeForm = this.fb.group({
      ratio: ['', Validators.required],
      scale: ['', Validators.required],
    });
    this.sizes.push(sizeForm);
  }

  deletesize(sizeIndex: number) {
    this.sizes.removeAt(sizeIndex);
  }
  writeValue(value: any): void {
    // this.priceRange = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }
}
