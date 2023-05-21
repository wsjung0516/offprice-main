import { NgModule } from "@angular/core";
import { PhoneNumberDirective } from 'src/app/core/directives/phone-number.directive';

@NgModule({
  declarations: [PhoneNumberDirective],
  imports: [],
  exports: [PhoneNumberDirective],
})
export class UserProfileModule {}