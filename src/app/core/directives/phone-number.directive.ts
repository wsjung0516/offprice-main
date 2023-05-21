import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneNumber]'
})
export class PhoneNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initalValue = this.el.nativeElement.value;

    this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (this.el.nativeElement.value.length === 3 || this.el.nativeElement.value.length === 7) {
      this.el.nativeElement.value += '-';
    }
    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}