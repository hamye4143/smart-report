import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { ErrorToastrComponent } from '../../components/notification/error-toastr/error-toastr.component';
import { InfoToastrComponent } from '../../components/notification/info-toastr/info-toastr.component';
import { SuccessToastrComponent } from '../../components/notification/success-toastr/success-toastr.component';
enum ToastPositionTypes {
  bottomCenter = 'toast-bottom-center',
  bottomRight = 'toast-bottom-right',
  bottomLeft = 'toast-bottom-left',
  topCenter = 'toast-top-center',
  topRight = 'toast-top-right',
  topLeft = 'toast-top-left'
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public toastrPositionTypes: typeof ToastPositionTypes = ToastPositionTypes;
  public toastrPosition: string = this.toastrPositionTypes.topRight;
  public timeOut = 3000;
  public toastrLink: string = 'https://github.com/scttcper/ngx-toastr';

  constructor(
    private snackBar: MatSnackBar,
    private toastrService: ToastrService) { }

  public openSnackBar(message: string) {
    this.snackBar.open(message, '닫기', {
      duration: 1500,
      panelClass: ["custom-style"]
    });
  }

  public setToastrPosition(position: string): void {
    this.toastrPosition = position;
  }

  public showSuccess(): void {
    this.toastrService.show(
      null,
      null,
      {
        positionClass: this.toastrPosition,
        toastComponent: SuccessToastrComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }

  public showErrorToastr(): void {
    // this.toastrService.error('Hello world!', 'Toastr fun!');
    this.toastrService.show(
      null,
      null,
      {
        positionClass: this.toastrPosition,
        toastComponent: ErrorToastrComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }

  public showInfoToastr(): void {
    this.toastrService.show(
      null,
      null,
      {
        positionClass: this.toastrPosition,
        toastComponent: InfoToastrComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }
}
