import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  isProgressVisible: boolean;
  signupForm: FormGroup;
  firebaseErrorMessage: string;
  closeModal: string;

  constructor(
    private router: Router,
    private authservice: AuthServiceService,
    private afAuth: AngularFireAuth,
    private modalService: NgbModal
  ) {
    this.isProgressVisible = false;
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    if (this.authservice.userLoggedIn) {
      // if the user's logged in, navigate them to the login (NOTE: don't use afAuth.currentUser -- it's never null)
      this.router.navigate(['/home']);
    }

    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  signup() {
    if (this.signupForm.invalid)
      // if there's an error in the form, don't submit it
      return;

    this.isProgressVisible = true;
    this.authservice
      .signupUser(this.signupForm.value)
      .then((result) => {
        if (result == null)
          // null is success, false means there was an error
          this.router.navigate(['/home']);
        else if (result.isValid == false)
          this.firebaseErrorMessage = result.message;

        this.isProgressVisible = false; // no matter what, when the auth service returns, we hide the progress indicator
      })
      .catch(() => {
        this.isProgressVisible = false;
      });
  }

  triggerModal(content) {
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
