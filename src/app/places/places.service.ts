import { Injectable } from '@angular/core';
import {Place} from "./place.model";
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import {take,map,tap,delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
   new Place(
     'p1',
     'Jammu',
     'City of Temples',
     'https://cdn.s3waas.gov.in/s3979d472a84804b9f647bc185a877a8b5/uploads/2018/03/2018030319.jpg',
     123.08,
     new Date('2019-01-01'),
     new Date('2019-12-31'),
     'u1'
   ),
   new  Place(
    'p2',
    'Kashmir',
    'Crown of India',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nanga_parbat%2C_Pakistan_by_gul791.jpg/220px-Nanga_parbat%2C_Pakistan_by_gul791.jpg',
    134.00,
    new Date('2019-01-01'),
    new Date('2019-12-31'),
    'u2'
  ),
  new  Place(
    'p3',
    'Pune',
    'Oxford of India',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nanga_parbat%2C_Pakistan_by_gul791.jpg/220px-Nanga_parbat%2C_Pakistan_by_gul791.jpg',
    132.00,
    new Date('2019-01-01'),
    new Date('2019-12-31'),
    'u3'
  ),
  ]);

 

  constructor(private authService:AuthService) { }

  get places(){
    return this._places.asObservable();
  }

  getPlace(id:string){
    return this.places.pipe(take(1),
    map(places => {
      return {...places.find(p => p.id === id)}
    }));
  }


  addPlace(title:string,description:string,price:number,dateFrom:Date,dateTo:Date){
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://cdn.s3waas.gov.in/s3979d472a84804b9f647bc185a877a8b5/uploads/2018/03/2018030319.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
    );

    return this.places.pipe(take(1),delay(1000),tap(places => {
        this._places.next(places.concat(newPlace));
    }))
  }

  updatePlace(placeId:string, title:string, description:string){
    return this.places.pipe(take(1),delay(1000),tap(places => {
      const updatedPlaceIndex = places.findIndex(p => p.id === placeId);
      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
      );
      this._places.next(updatedPlaces);
    }))
  }
}
