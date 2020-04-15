import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Booking[];
  private loadedBookingsSubs:Subscription;

  constructor(private bookingService:BookingService, private loadingController:LoadingController) { }

  ngOnInit() {
    this.loadedBookingsSubs = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy(){
    this.loadedBookingsSubs.unsubscribe();
  }

  async onCancelBooking(bookingId:string,bookingItemRef:IonItemSliding){
    bookingItemRef.close();
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();
    this.bookingService.cancelBooking(bookingId).subscribe(async () => {
      await loading.dismiss();
    });
  }

}
