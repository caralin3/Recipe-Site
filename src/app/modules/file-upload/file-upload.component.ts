import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ImagesService } from '../../../app/core/firestore';
import { FirebaseImageModel } from '../../../app/core/firestore/images.model';
import { User } from '../../../app/core/models';
import { AppState } from '../../../app/store';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Output() getImagePath = new EventEmitter<string>();
  currentUser: Observable<User>;
  currentUserId: string;
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // Download URL
  downloadURL: Observable<string>;
  uploadedImages: string[] = [];
  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(
    private store: Store<AppState>,
    private storage: AngularFireStorage,
    private imagesService: ImagesService,
  ) {
    this.currentUser = this.store.select(appState => appState.sessionState.currentUser);
  }

  ngOnInit() {
    this.currentUser.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    // The storage path
    const path = `images/${file.name}_${new Date().getTime()}`;

    // Totally optional metadata
    const customMetadata = { uploadedOn: new Date().toISOString() };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    // Update firestore on completion
    const image: FirebaseImageModel = {
      file: file.name,
      name: file.name.slice(0, -4),
      path,
      size: 0,
      src: '',
      userId: this.currentUserId,
    }
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          image.size = snap.totalBytes;
        }
      }),
      finalize(() => {
        this.downloadURL = this.storage.ref(path).getDownloadURL();
        // The file's download URL
        this.downloadURL.subscribe(url => {
          this.uploadedImages.push(url);
          image.src = url;
          // Update firestore on completion
          this.imagesService.createImage(image);
          this.getImagePath.emit(path);
        });
      })
      );
    }

  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}
