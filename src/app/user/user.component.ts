import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from 'src/app/core/models/user.model';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  of,
  skip,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CreateUserComponent } from './create-user/create-user.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogService } from '@ngneat/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    CreateUserComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = [
    // 'user_id',
    'first_name',
    'last_name',
    'email',
    'gender',
    'zipcode',
    // 'created_at',
    // 'address1',
    // 'address2',
    // 'phone_no',
    // 'subscribe',
    'action',
  ];
  displayedTitle: string[] = [
    // 'Id',
    'FirstName',
    'LastName',
    'Email',
    'Gender',
    'Zipcode',
    // 'CreatedAt',
    // 'Address1',
    // 'Address2',
    // 'PhoneNo',
    // 'Subscribe',
    'Action',
  ];
  categoryColumns: string[] = [
    'first_name',
    'last_name',
    'email',
    'zipcode',
  ];

  dataSource: MatTableDataSource<User>;
  selectedValue: FormControl;
  searchValue: FormControl;
  users: User[] = [];
  user: User;
  pageSize = 20;
  length = 100;
  disabled = false;
  mode: string;
  refreshObservable = new Subject();
  oldWhere: any[] = [];
  oldOrderBy: {} = {};

  // userForm: FormGroup;
  userForm = new FormGroup({
    selectedValue: new FormControl(''),
    searchValue: new FormControl(''),
    gender: new FormControl(''),
  });
  private dialog = inject(DialogService);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.users);
  }
  ngOnInit(): void {
    // this.gridClass = `grid ${getNumofCols(2)} gap-2 pt-2`;
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.getConditionalUserLength();
      this.makeSortNWhereCondition().subscribe((data: any) => {
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
        this.getConditionalUserLength();
      })
    })
  }
  private getConditionalUserLength() {
    this.userService.getConditionalUserLength(this.oldWhere).subscribe((users: User[]) => {
      this.paginator.length = users.length;
      // console.log('this.old where, length', this.oldWhere,this.paginator.length);
    })
  }
  getUser(id: string) {
    this.userService.getUser(id).subscribe((data: any) => {
      console.log(data);
    });
  }
  onCreatedUser() {
    const dialogRef = this.dialog
      .open(CreateUserComponent, {
        data: {
          user: resetUser,
          disabled: false,
          mode: 'Create',
        },
      })
      .afterClosed$.subscribe((data: any) => {
        if (data) {
          this.refreshObservable.next({}); // trigger the observable for updating the table}
        }
      });
    // console.log('onCreatedUser', this.userForm.value);
  }
  onUpdatedUser(user: User) {
    // this.user-profile.user_id = user-profile.user_id;
    const dialogRef = this.dialog
      .open(CreateUserComponent, {
        data: {
          user: user,
          disabled: false,
          mode: 'Update',
        },
      })
      .afterClosed$.subscribe((data: any) => {
        if (data) {
          this.refreshObservable.next({}); // trigger the observable for updating the table
        }
      });

    // this.cdr.detectChanges();
  }
  onDeletedUser(user: User) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Delete User',
          message: `Are you sure you want to delete [${user.first_name} ${user.last_name}]?`,
        },
      })
      .afterClosed$.subscribe((data: any) => {
        if (data) {
          this.userService.deleteUser(user.user_id).subscribe((data: any) => {
            this.refreshObservable.next({}); // trigger the observable for updating the table
          });
        }
      });
  }
  onDisplayUser(user: User) {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: {
        user: user,
        disabled: true,
        mode: '',
      },
    });
  }
  resetSearch() {
    this.oldOrderBy = null;
    this.oldWhere = null;
  }
  private makeWhereObservable(): Observable<any> {
    let tmpArray: any[] = [];
    const selectedValue$ = this.userForm.get('selectedValue').valueChanges.pipe(
      startWith('first_name'),
      tap(() => {
        this.paginator.pageIndex = 0; // reset the page index when the selected value is changed.
      })
    );
    const searchValue$ = this.userForm
      .get('searchValue')
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      );
    //
    const gender$ = this.userForm
      .get('gender')
      .valueChanges.pipe(startWith('None'));

    return combineLatest([selectedValue$, searchValue$, gender$]).pipe(
      untilDestroyed(this),
      map(([selectedValue, searchValue, gender]) => {
        tmpArray = [];
        if (gender !== 'None') {
          tmpArray.push({ gender: gender });
        }
        tmpArray.push({ [selectedValue]: searchValue });
        return { where: tmpArray };
      })
    );
  }

  private makeSortNWhereCondition(): Observable<any> {
    const where$ = this.makeWhereObservable();
    let where: any[] = [];
    let orderBy: {} = null;
    // this.refreshObservable.pipe(startWith({}))
    return merge(
      this.sort.sortChange,
      this.paginator.page,
      where$,
      this.refreshObservable
    ).pipe(
      untilDestroyed(this),
      skip(1),
      startWith({}),
      switchMap((data: any) => {
        // where event is triggered.
        if (data.where && data.where.length > 0) {
          where = [...this.makeWhereCondition(data.where)]; // make where condition
          this.oldWhere = where;
          // where = {[column]: {contains: value}}
        } else {
          if (this.oldWhere && this.oldWhere.length > 0) {
            // if there is old where condition
            where = this.oldWhere; // keep the old where condition
          } else {
            where = null;
          }
        }
        // sort event is triggered.
        if (data.active && data.direction) {
          orderBy = { [data.active]: data.direction };
          this.oldOrderBy = orderBy;
        } else {
          if (Object.keys(this.oldOrderBy).length > 0) {
            // if there is old order
            orderBy = this.oldOrderBy; // keep the old order
          } else {
            orderBy = { created_at: 'desc' };
          }
        }
        // console.log ('where, orderBy', where, orderBy);
        return this.userService.getUsers(
          this.paginator.pageIndex * this.paginator.pageSize,
          this.paginator.pageSize,
          orderBy,
          where
        );
      })
    );
  }

  makeWhereCondition(whereData: any[]) {
    let whereArray: { [x: string]: { contains: any } }[] = [];
    let where = {};
    whereData.forEach((data) => {
      const column = Object.keys(data);
      column.forEach((col, idx) => {
        const value = data[col];
        // console.log('column',  value, idx);
        if (col === 'gender') {
          where = { gender: value };
          // where = { gender: {contains: value }};
        } else {
          where = { [col]: { contains: value } };
        }
        whereArray.push(where);
      });
    });
    // const where = {[column]: {contains: value}};
    return whereArray;
  }
}
export const resetUser: User = {
  user_id: '1', // string 1
  first_name: '', // string 'John'
  last_name: '', // string 'John'
  email: '', // string ''
  bod: null, // Date,
  gender: '', // string,
  zipcode: '', // string,
  phone_no: '', // string,
  address1: '', // string,
  address2: '', // string,
  point: 0, // number,
  status: '', // string,
  created_at: null, // Date,
  subscribe: null, // boolean,
};
