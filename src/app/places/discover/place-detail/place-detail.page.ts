import { Component, OnInit, OnDestroy } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { PlacesService } from '../../places.service';
import {Place} from "../../place.model";
import { Subscription } from 'rxjs';
import { BookingService } from '../../../bookings/booking.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit,OnDestroy {
  place:Place;
  isBookable = false;
  private placeSub:Subscription;
  constructor(
    private route:ActivatedRoute,
    private navCtrl:NavController,
    private modalCtrl:ModalController,
    private placesService:PlacesService,
    private actionSheetCtrl:ActionSheetController,
    private bookingService:BookingService,
    private loadingController:LoadingController,
    private router:Router,
    private authService:AuthService,
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/offers');
        return;
      }

    this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
      })
    });
  }

  ngOnDestroy(){
    this.placeSub.unsubscribe();
  }

  async onBookPlace(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose an action',
      buttons: [{
        text: 'Select Date',
        icon: 'date',
        handler: () => {
         this.openBookingModal('select');
        }
      }, {
        text: 'Random Date',
        icon: 'date',
        handler: () => {
         this.openBookingModal('random');
        }
      }, {
        text: 'Cancel',
        role:'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

 async openBookingModal(mode:'select' | 'random'){
    const modal = await this.modalCtrl.create({
      component:CreateBookingComponent,
      componentProps:{
        selectedPlace:this.place,
        selectedMode:mode
      },
    });
    
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if(data.role === 'confirm'){

      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      await loading.present();

      this.bookingService.addBooking(
        this.place.id,
        this.place.title,
        this.place.imageUrl,
        data.bookingData.firstName,
        data.bookingData.lastName,
        data.bookingData.guestNumber,
        data.bookingData.startDate,
        data.bookingData.endDate,
      ).subscribe(async () => {
        await this.loadingController.dismiss();
        this.router.navigate(['/bookings'])
      });
    }

    return await modal.onDidDismiss();
  }
}
