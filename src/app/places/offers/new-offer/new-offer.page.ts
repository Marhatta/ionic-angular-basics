import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form:FormGroup;

  constructor(private placesService:PlacesService, private router:Router, private loadingCtrl:LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      description:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required,Validators.maxLength(180)]
      }),
      price:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required,Validators.min(1)]
      }),
      dateFrom:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      dateTo:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      })
    });
  }



  async onCreateOffer(){
    if(!this.form.valid) return;
    const {title, description,price,dateFrom,dateTo} = this.form.value;

    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.placesService.addPlace(title,description,+price,new Date(dateFrom),new Date(dateTo))
      .subscribe(async () => {
        this.form.reset();
        await loading.dismiss();
        this.router.navigate(['/places/offers']);
      })
  }
}
