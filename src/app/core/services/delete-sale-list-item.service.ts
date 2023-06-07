import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SaleListService } from "src/app/register-home/sale-list/sale-list.service";
import { SharedMenuObservableService } from "./shared-menu-observable.service";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { SaleList } from "../models/sale-list.model";
import { concatMap, from, switchMap } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { DialogService } from "@ngneat/dialog";
@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class DeleteSaleListItemService {
  constructor(
    private saleListService: SaleListService,
    private dialog: DialogService,
    private snackBar: MatSnackBar,
    private sharedMenuObservableService: SharedMenuObservableService
  ) { }
  delete(saleList: SaleList | string) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Sales List',
        message: 'Are you sure, you want to remove?',
      },
    });
    let saleListId: string;
    if (typeof saleList === 'string') {
      saleListId = saleList;
    } else {
      saleListId = saleList.sale_list_id;
    }
    confirmDialog.afterClosed$.subscribe((result: any) => {
      if (result === true) {
        this.saleListService
          .deleteSaleList(saleListId)
          .pipe(
            switchMap((data: SaleList) => {
              // Delete images from Google Cloud Storage
              const urls = data.image_urls.split(',');
              return from(urls).pipe(
                concatMap((url: string) => {
                  const fileName = url.match(/.*\/(.+\..+)/)[1];
                  // console.log('fileName---', fileName);
                  return this.saleListService.deleteImageFromBucket(fileName);
                })
              );
            }),
            untilDestroyed(this)
          )
          .subscribe(
            (data: any) => {
              // console.log('deleted---', data);
              this.sharedMenuObservableService.resultDeleteSaleListItem.next(
                saleListId
              );
              this.snackBar.open('Deleted Successfully', 'Close', {
                duration: 2000,
              });
              // To refresh the table.
              this.sharedMenuObservableService.refreshData.next('');

              // this.refreshObservable.next();
            },
            (error: any) => {
              this.snackBar.open(
                'Deleting is failed because this item is reserved already by someone',
                'Close',
                {}
              );
            }
          );
      }
    });
  }
}