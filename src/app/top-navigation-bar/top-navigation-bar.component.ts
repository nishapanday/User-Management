import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-top-navigation-bar',
  templateUrl: './top-navigation-bar.component.html',
  styleUrls: ['./top-navigation-bar.component.css'],
})
export class TopNavigationBarComponent implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private authservice: AuthServiceService
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.authservice.logoutUser();
  }
}
