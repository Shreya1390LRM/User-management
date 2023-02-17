import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { eventListeners } from '@popperjs/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Action } from '../Helpers/action.enum';
import { Data } from '../Helpers/data.interface';
import { MustMatch } from '../Helpers/must.watch.validators';
import { OrderBy } from '../Helpers/orderBy.pipe';
import { UserApiService } from '../Helpers/user-api.service';
import { Data1 } from '../Helpers/user.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [OrderBy],
})
export class ProductComponent implements OnInit {
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  addForm: FormGroup;
  searchText: string;
  userModelObj: Data = new Data1();
  submitted: boolean = false;
  @ViewChild('content') elcontent: any;
  modalRef: any;
  templist = [];
  deleteduser: any;
  order: string = '';
  buttonText: string = '';
  dbop: Action;
  userData: Data[] = [];
  @Output() myoutput : EventEmitter<any> = new EventEmitter();
  deletedData: Data[] = [];
  badgeCount: number;
  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _UserApiService: UserApiService,
    private spinner: NgxSpinnerService,
    private router : Router

  ) {
    this.getAllUsers();
    this.getdeletedUser();
    this.badgeCount = 0;
  }
  ngOnInit(): void {
    this.setFormState();
    this.getAllUsers();
  }
  displayedColumns = [
    'TITLE',
    'FIRST NAME',
    'LAST NAME',
    'DOB',
    'EMAIL',
    'ACTIONS',
  ];
  // code here to sort data of table
  sortByCol(name: string) {
    if (this.templist.length > 0) {
      if (this.templist.indexOf(name) !== -1) {
        console.log('alreday includes name');
        this.templist.pop();
      } else {
        console.log('not  includes name');
        this.templist.push(name);
      }
    } else {
      this.templist.push(name);
    }

    this.order = this.templist.join();
    console.log(name, this.order);
  }

  setFormState() {
    this.buttonText = 'Save';
    this.dbop = Action.create;
    this.addForm = new FormGroup(
      {
        id: new FormControl(0),
        title: new FormControl('', Validators.required),
        FirstName: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(10),
          ])
        ),
        LastName: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(10),
          ])
        ),
        Email: new FormControl(
          '',
          Validators.compose([Validators.required, Validators.email])
        ),
        DOB: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
            ),
          ])
        ),
        Password: new FormControl(
          '',
          Validators.compose([Validators.required, Validators.maxLength(8)])
        ),
        confirmPassword: new FormControl(
          '',
          Validators.compose([Validators.required, Validators.maxLength(8)])
        ),
        AcceptTerms: new FormControl(false, Validators.requiredTrue),
      },
      MustMatch('Password', 'confirmPassword')
    );
  }

  addUser() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    switch (this.dbop) {
      // code here to add data to database
      case Action.create:
        this.userModelObj.title = this.addForm.value.title;
        this.userModelObj.FirstName = this.addForm.value.FirstName;
        this.userModelObj.LastName = this.addForm.value.LastName;
        this.userModelObj.Email = this.addForm.value.Email;
        this.userModelObj.DOB = this.addForm.value.DOB;
        this.userModelObj.AcceptTerms = this.addForm.value.AcceptTerms;
        this._UserApiService.addUsers(this.userModelObj).subscribe((res) => {
          console.log(res);
          this.toastr.success('User Added Successfully..');
          this.addForm.reset();
          // this.postDeletedUsertoRecycle(this.userData);
          this.getAllUsers();
          this.cancel();
        });
        break;
      // code here to update data to database
      case Action.Update:
        this._UserApiService.updateUser(this.addForm.value).subscribe((res) => {
          this.toastr.success('User Updated Successfully..');
          this.getAllUsers();
          this.cancel();
        });
        break;
    }
  }

  cancel() {
    this.submitted = false;
    this.addForm.reset({
      id: 0,
      title: '',
      FirstName: '',
      LastName: '',
      Email: '',
      DOB: '',
      Password: '',
      confirmPassword: '',
      AcceptTerms: false,
    });
    this.modalRef.close();
  }
  openXl(content: any) {
    this.modalRef = this.modalService.open(content, { size: 'xl' });
  }
  // edit method
  edit(id: number) {
    this.modalRef = this.modalService.open(this.elcontent, { size: 'xl' });
    this.buttonText = 'Update';
    this.dbop = Action.Update;

    let user = this.userData.find((u: Data) => u.id === id);
    this.addForm.patchValue(user);
    this.addForm.controls['FirstName'].setValue(user.FirstName);
    this.addForm.controls['LastName'].setValue(user.LastName);
    this.addForm.controls['Email'].setValue(user.Email);
    this.addForm.controls['DOB'].setValue(user.DOB);
    this.addForm.controls['title'].setValue(user.title);
    this.addForm.controls['AcceptTerms'].setValue(false);
  }

  // code here to delete data to database
  delete(user) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let userId = user.id;
        this._UserApiService.deleteUser(userId).subscribe((res) => {
          console.log(res);
          this.postDeletedUsertoRecycle(user);
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          // this.toastr.success('User Deleted Successfully..');
        });
      } else {
        Swal.fire('Cancel!', 'Your Record is safe.', 'success');
      }
    });
    this.badgeCount++;
  }

  // code here to add deleted data to recyclebin in  database
  postDeletedUsertoRecycle(userData) {
    this._UserApiService.postdeletedUser(userData).subscribe((res) => {
      console.log('res: ', res);
    });
    this.getdeletedUser();
    this.ngOnInit();
  }
  getAllUsers() {
    this._UserApiService.getUsers().subscribe((res: Data[]) => {
      this.userData = res;
    });
  }
  //onTableDataChange and onTableSizeChange for pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getAllUsers();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAllUsers();
  }
  //code to get deleted user
  getdeletedUser() {
    this._UserApiService.getdeletedUser().subscribe((res) => {
      this.deletedData = res;
      console.log('get :', res);
    });
  }
  clearCount() {
    this.badgeCount = 0;
  }
  sendData(){
    this.myoutput.emit(this.deletedData);
    // this.router.navigate[('/recyclebin')];
    this.clearCount();
  }
}
