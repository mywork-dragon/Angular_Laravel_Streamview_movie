import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';

/** Services */
import { ApiService } from './services/api.service';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './services/loader.intercepter';
import { RouterExtService } from './services/router-ext.service';

/** Components */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { ViewProfileComponent } from './components/profiles/view-profile/view-profile.component';
import { ManageProfileComponent } from './components/profiles/manage-profile/manage-profile.component';
import { EditProfileComponent } from './components/profiles/edit-profile/edit-profile.component';
import { AddProfileComponent } from './components/profiles/add-profile/add-profile.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { BrowseComponent } from './components/browse/browse.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { SingChannelComponent } from './components/sing-channel/sing-channel.component';
import { DetailPageComponent } from './components/detail-page/detail-page.component';
import { PaymentOptionComponent } from './components/payment-option/payment-option.component';
import { PayPerViewComponent } from './components/pay-per-view/pay-per-view.component';
import { EasyVideoComponent } from './components/easy-video/easy-video.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { CardComponent } from './components/card/card.component';
import { PaidVideoComponent } from './components/paid-video/paid-video.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { CastCrewsComponent } from './components/cast-crews/cast-crews.component';
import { CastAndCrewComponent } from './components/cast-and-crew/cast-and-crew.component';
import { SpamVideosComponent } from './components/spam-videos/spam-videos.component';
import { SearchVideoComponent } from './components/search-video/search-video.component';
import {Player} from './components/player/player.component';
import { TrailerVideoComponent } from './components/trailer-video/trailer-video.component';
import { AccountSettingComponent } from './components/account-setting/account-setting.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { BillingDetailsComponent } from './components/billing-details/billing-details.component';
import { GenreVideoComponent } from './components/genre-video/genre-video.component';
import { SubscriptionSuccessComponent } from './components/subscription-success/subscription-success.component';
import { StaticComponent } from './components/static/static.component';
import { PopUpVideoComponent } from './components/pop-up-video/pop-up-video.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
    LoginComponent,
    ViewProfileComponent,
    ManageProfileComponent,
    EditProfileComponent,
    AddProfileComponent,
    LoaderComponent, 
    HomeComponent,
    RegisterComponent,
    BrowseComponent,
    ChannelsComponent,
    SingChannelComponent,
    DetailPageComponent,
    PaymentOptionComponent,
    PayPerViewComponent,
    EasyVideoComponent,
    InvoiceComponent,
    CardComponent,
    PaidVideoComponent,
    SubscriptionComponent,
    CastCrewsComponent,
    CastAndCrewComponent,
    SpamVideosComponent,
    SearchVideoComponent,
    Player,
    TrailerVideoComponent,
    AccountSettingComponent,
    ChangePasswordComponent,
    EditAccountComponent,
    DeleteAccountComponent,
    BillingDetailsComponent,
    StaticComponent,
    GenreVideoComponent,
    SubscriptionSuccessComponent,
    PopUpVideoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    SlickCarouselModule
  ],
  providers: [
    ApiService,
    LoaderService,
    RouterExtService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
