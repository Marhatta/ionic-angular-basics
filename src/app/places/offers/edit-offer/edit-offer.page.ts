import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../../place.model';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place:Place;
  form:FormGroup;
  private placeSub:Subscription;

  constructor(private route:ActivatedRoute,private navCtrl:NavController,private placesService:PlacesService, private router:Router, private loadingController:LoadingController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/offers');
        return;
      }

      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        
      this.form = new FormGroup({
        title:new FormControl(this.place.title,{
          updateOn:'blur',
          validators:[Validators.required]
        }),
        description:new FormControl(this.place.description,{
          updateOn:'blur',
          validators:[Validators.required,Validators.maxLength(180)]
        }),
      })
      })
    })
  }

  ngOnDestroy(){
    this.placeSub.unsubscribe();
  }

  async onUpdateOffer(){
    if(!this.form.valid) return;
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description)
    .subscribe(async () => {
      await this.loadingController.dismiss();
      this.router.navigate(['/places/offers']);
    }
    );
  }

}
