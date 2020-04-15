import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import  {Place} from "../place.model";
import {SegmentChangeEventDetail} from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  constructor(private placesService:PlacesService, private authService:AuthService) { }

  loadedPlaces:Place[];
  relevantPlaces:Place[];
  listedLoadedPlaces:Place[];
  private placesSub:Subscription;

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    })
  }

  ngOnDestroy(){
    this.placesSub.unsubscribe();
  }

  onFilterUpdate(event:CustomEvent<SegmentChangeEventDetail>){
    if(event.detail.value === "all"){
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }else{
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId);
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

}
