import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  users: Observable<any>;
  closeModal: string;
  editForm: FormGroup;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.users = this.firestore.collection('users').valueChanges();

    this.editForm = this.fb.group({
      email: [''],
      name: [''],
      number: [''],
    });
  }

  openEdit(content, user) {
    this.editForm.patchValue({
      email: user.email,
      name: user.name,
      number: user.number,
    });
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (res) => {
          this.closeModal = `Closed with: ${res}`;
        },
        (res) => {
          this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
        }
      );
  }

  onSave() {
    this.firestore
      .collection('users')
      .doc(this.editForm.value.email)
      .update(this.editForm.value)
      .then(() => {
        this.toastr.success('User successfully updated!');
      })
      .catch((error) => {
        // The user probably doesn't exist.
        this.toastr.error('Error updating user: ');
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openSweetalert(email) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      console.log(' kjbk');
      if (result.isConfirmed) {
        this.firestore
          .collection('users')
          .doc(email)
          .delete()
          .then(() => {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          })
          .catch((error) => {
            Swal.fire('Deleted!', 'Your file has not been deleted.');
          });
        //   Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  // showToaster() {
  //   this.toastr.success("Hello, I'm the toastr message.");
  // }
}
