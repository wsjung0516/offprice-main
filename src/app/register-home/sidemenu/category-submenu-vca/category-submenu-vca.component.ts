import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import {
  CdkMenuItemRadio,
  CdkMenuItemCheckbox,
  CdkMenuGroup,
  CdkMenu,
  CdkMenuTrigger,
  CdkMenuItem,
  CdkMenuBar,
} from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import {
  Categories1,
  Category,
  Group,
  Prod,
  tProducts,
} from 'src/app/core/constants/data-define';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
// import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { Subject, take, takeUntil } from 'rxjs';

/** @title Google Docs Menu Bar. */
// @UntilDestroy()
@Component({
  selector: 'app-category-submenu-vca',
  // exportAs: ,
  styleUrls: ['category-submenu-vca.component.scss'],
  templateUrl: 'category-submenu-vca.component.html',
  standalone: true,
  imports: [
    CommonModule,
    CdkMenuBar,
    CdkMenuItem,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuGroup,
    CdkMenuItemCheckbox,
    CdkMenuItemRadio,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CategorySubmenuVcaComponent,
      multi: true,
    },
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySubmenuVcaComponent implements ControlValueAccessor, AfterViewInit, OnDestroy, OnChanges {
  @Input() selected_category: string;
  @Input() set reset_category_submenu( value: boolean ) {
    if( value ) {
      this.selected_category = '1';
    }
  }
  categories: Category[] = [];
  buttonWidth = 40;
  scrollDistance = 200;
  scrollOffset = 0;
  category = '1';
  tgroups: Group[] = [];
  tproducts = tProducts;
  onChange: any = () => {};
  onTouch: any = () => {};
  unsubscribe = new Subject<void>();
  unsubscribe$ = this.unsubscribe.asObservable();
  // Women
  @ViewChild('Tops', { static: true }) topsTemplate: TemplateRef<any>;
  @ViewChild('Bottoms', { static: true }) bottomsTemplate: TemplateRef<any>;
  @ViewChild('Dresses', { static: true }) dressesTemplate: TemplateRef<any>;
  @ViewChild('Outerwear', { static: true }) outerwearTemplate: TemplateRef<any>;
  @ViewChild('Activewear', { static: true }) activewearTemplate: TemplateRef<any>;
  @ViewChild('Jumpsuits', { static: true }) jumpsuitsTemplate: TemplateRef<any>; 
  @ViewChild('Swimwear', { static: true }) swimwearTemplate: TemplateRef<any>; 
  @ViewChild('Plussize', { static: true }) plussizeTemplate: TemplateRef<any>; 
  @ViewChild('Sweaters', { static: true }) sweatersTemplate: TemplateRef<any>; 
  @ViewChild('Lingerie', { static: true }) lingerieTemplate: TemplateRef<any>; 
  @ViewChild('Loungewear', { static: true }) loungewearTemplate: TemplateRef<any>; 
  @ViewChild('Suits', { static: true }) suitsTemplate: TemplateRef<any>; 
  @ViewChild('Partywear', { static: true }) partywearTemplate: TemplateRef<any>;
  // Men
  @ViewChild('m_Activewear', { static: true }) m_activewearTemplate: TemplateRef<any>; 
  @ViewChild('m_Jeans', { static: true }) m_jeansTemplate: TemplateRef<any>; 
  @ViewChild('m_Outerwear', { static: true }) m_outerwearTemplate: TemplateRef<any>;
  @ViewChild('m_Casual', { static: true }) m_casualTemplate: TemplateRef<any>; 
  @ViewChild('m_Shorts', { static: true }) m_shortsTemplate: TemplateRef<any>; 
  @ViewChild('m_Sweater', { static: true }) m_sweaterTemplate: TemplateRef<any>; 
  @ViewChild('m_Swimwear', { static: true }) m_swimwearTemplate: TemplateRef<any>; 
  @ViewChild('m_Tops', { static: true }) m_topsTemplate: TemplateRef<any>;

  // Kids
  @ViewChild('k_Girls', { static: true }) k_girlsTemplate: TemplateRef<any>; 
  @ViewChild('k_Boys', { static: true }) k_boysTemplate: TemplateRef<any>; 


  menuTemplates: { [key: string]: TemplateRef<any> };

  // private storageItemSubscription: Subscription | undefined;
  constructor(
    private viewContainerRef: ViewContainerRef,
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService,
    // private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef
  ) {
    this.menuTemplates = {
      // Women
      Tops: this.topsTemplate,
      Bottoms: this.bottomsTemplate,
      Dresses: this.dressesTemplate,
      Outerwear: this.outerwearTemplate,
      Activewear: this.activewearTemplate,
      Jumpsuits: this.jumpsuitsTemplate,
      Swimwear: this.swimwearTemplate,
      Plussize: this.plussizeTemplate,
      Sweaters: this.sweatersTemplate,
      Lingerie: this.lingerieTemplate,
      Loungewear: this.loungewearTemplate,
      Suits: this.suitsTemplate,
      Partywear: this.partywearTemplate,
      // Men
      m_Activewear: this.m_activewearTemplate,
      m_Jeans: this.m_jeansTemplate,
      m_Outerwear: this.m_outerwearTemplate,
      m_Casual: this.m_casualTemplate,
      m_Shorts: this.m_shortsTemplate,
      m_Sweater: this.m_sweaterTemplate,
      m_Swimwear: this.m_swimwearTemplate,
      m_Tops: this.m_topsTemplate,
      // Kids
      k_girls: this.k_girlsTemplate,
      k_boys: this.k_boysTemplate,
      // other templates...
    };
  }
  ngAfterViewInit() {
    this.sharedMenuObservableService.category1$
      .pipe(
        takeUntil(this.unsubscribe$)
        // untilDestroyed(this)
        )
      .subscribe((id) => {
        // console.log(id);
        this.category = id;
        this.tgroups = this.getGroupIdsByCategoryId();
        this.cd.detectChanges();
      });

    this.categories = Categories1;
  }

  getProducts(): Prod[] {
    return this.tproducts.filter((group) => group.categoryId === this.category);
  }
  // getGoups(): tGroups[] {
  //   return this.tgroups.filter(group => group.categoryId === this.category);
  // }
  getGroupIdsByCategoryId(): Group[] {
    let groupObjects: { [groupId: string]: Prod } = {};

    for (let prod of tProducts) {
      if (
        prod.categoryId === this.category &&
        !(prod.groupId in groupObjects)
      ) {
        groupObjects[prod.groupId] = prod;
      }
    }

    let groups: Group[] = [];

    for (let groupId in groupObjects) {
      groups.push({
        id: groupObjects[groupId].groupId,
        key: groupObjects[groupId].key,
        value: groupObjects[groupId].value,
      });
    }

    return groups;
  }
  getTemplate(groupId: string): TemplateRef<any> {
    let ret: TemplateRef<any>;
    if (this.category === '1') { // Women
      // women
      if (groupId === '1') {
        ret = this.topsTemplate;
      } else if (groupId === '2') {
        ret = this.bottomsTemplate;
      } else if (groupId === '3') {
        ret = this.dressesTemplate;
      } else if (groupId === '4') {
        ret = this.outerwearTemplate;
      } else if (groupId === '5') {
        ret = this.activewearTemplate;
      } else if (groupId === '6') {
        ret = this.jumpsuitsTemplate;
      } else if (groupId === '7') {
        ret = this.swimwearTemplate;
      } else if (groupId === '8') {
        ret = this.plussizeTemplate;
      } else if (groupId === '9') {
        ret = this.sweatersTemplate;
      } else if (groupId === '10') {
        ret = this.lingerieTemplate;
      } else if (groupId === '11') {
        ret = this.loungewearTemplate;
      } else if (groupId === '12') {
        ret = this.suitsTemplate;
      } else if (groupId === '13') {
        ret = this.partywearTemplate;
      } 
      // else if (groupId === '14') {
      //   ret = this.dummyTemplate;
      // }

    } else if( this.category === '2' ) { // Men
      if (groupId === '1') {
        ret = this.m_activewearTemplate;
      } else if (groupId === '2') {
        ret = this.m_jeansTemplate;
      } else if (groupId === '3') {
        ret = this.m_outerwearTemplate;
      } else if (groupId === '4') {
        ret = this.m_casualTemplate;
      } else if (groupId === '5') {
        ret = this.m_shortsTemplate;
      } else if (groupId === '6') {
        ret = this.m_sweaterTemplate;
      } else if (groupId === '7') {
        ret = this.m_swimwearTemplate;
      } else if (groupId === '8') {
        ret = this.m_topsTemplate;
      }

    } else if( this.category === '3' ) { // Kids
      if (groupId === '1') {
        ret = this.k_girlsTemplate;
      } else if (groupId === '2') {
        ret = this.k_boysTemplate;
      }
    }
    return ret;
  }
  getItemList(groupId: string) {
    return this.tproducts.filter(
      (item) => item.groupId === groupId && item.categoryId === this.category
    );
  }
  // createMenu(key: string) {
  //   const menuItems = this.tgroups.map((group) => group.key === key);
  //   this.viewContainerRef.clear();
  //   this.viewContainerRef.createEmbeddedView(this.menuTemplate, {
  //     $implicit: menuItems,
  //   });
  // }
  onSelect(category: any) {
    // console.log('onSelect', category);
    this.selected_category = category.key;
    this.onChange(this.selected_category);
  }
  ngOnChanges() {
    // console.log('ngOnChanges', this.selected_category);
    this.onChange(this.selected_category);
  }
  writeValue(value: any): void {
    // this.categories = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
