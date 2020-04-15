import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(private authService: AuthService,private router:Router,private loadingCtrl:LoadingController) { }

  ngOnInit() {
  }

  async onLogin(){
    this.isLoading = true;
    this.authService.login();

    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true,
      keyboardClose:true,
    });
    await loading.present();

    
    setTimeout(()=>{
      this.isLoading = false;
      loading.dismiss();
      this.router.navigateByUrl('/places/discover')
    },1500);
  }

  onSwitchAuthMode(){
    this.isLogin = !this.isLogin;
  }

  onSubmit(form:NgForm){
    if(!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    console.log(email,password);

    if(this.isLogin){
      //send request for login
    } else {
      //send request for signup
    }
  }
}