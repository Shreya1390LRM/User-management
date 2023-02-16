import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Data } from '../Helpers/data.interface';
import { RecycleApiService } from '../Helpers/recycleapi';
import { UserApiService } from '../Helpers/user-api.service';

@Component({
  selector: 'app-recycle-bin',
  templateUrl: './recycle-bin.component.html',
  styleUrls: ['./recycle-bin.component.css'],
})
export class RecycleBinComponent implements OnInit {
   data: Data[] = [];
  // @Input() data: any[] = [];
  constructor(
    private toastr: ToastrService,
    private _UserApiService: UserApiService,
    private _recycleApiService: RecycleApiService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.getdeletedUser();
    
  }
  getdeletedUser() {
    this._UserApiService.getdeletedUser().subscribe((res) => {
      this.data = res;
      console.log('get :', res);
    });
  }
  deleted(user) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to permanently delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._recycleApiService
          .deleteUserFromRecyclebin(user)
          .subscribe((res) => {
            console.log(res);
            this.getdeletedUser();
            this.restoreRecycle(user);
            Swal.fire(
              'Deleted!',
              'User has been deleted permanently...',
              'success'
            );
          });
      } else {
        Swal.fire('Cancel!','Your Record is safe.','success');
      }
    });
  }

  delete(userData) {
    this._recycleApiService
      .deleteUserFromRecyclebin(userData)
      .subscribe((res) => {
        console.log(res);
        this.getdeletedUser();
        this.restoreRecycle(userData);
      });
  }

  restoreRecycle(userData) {
    this._recycleApiService.postrecycledUser(userData).subscribe((res) => {
      console.log('res: ', res);
      // this.toastr.success('User Restored Successfully..');
    });
  }

  delrest(userData) {
    let id = userData.id;
    this.restoreRecycle(userData);
    this.delete(id);
    console.log('test');
    this.ngOnInit();
  }
}
