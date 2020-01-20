import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ViewProfileComponent } from './components/profiles/view-profile/view-profile.component';
import { ManageProfileComponent } from './components/profiles/manage-profile/manage-profile.component';
import { EditProfileComponent } from './components/profiles/edit-profile/edit-profile.component';
import { AddProfileComponent } from './components/profiles/add-profile/add-profile.component';
import { HomeComponent } from './components/home/home.component';
import { BrowseComponent } from './components/browse/browse.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { SingChannelComponent } from './components/sing-channel/sing-channel.component';
import { DetailPageComponent } from './components/detail-page/detail-page.component';
import { PaymentOptionComponent } from './components/payment-option/payment-option.component';
import { PayPerViewComponent } from './components/pay-per-view/pay-per-view.component';
import { EasyVideoComponent } from './components/easy-video/easy-video.component';
import { SearchVideoComponent } from './components/search-video/search-video.component';
import { TrailerVideoComponent } from './components/trailer-video/trailer-video.component';
import { AccountSettingComponent } from './components/account-setting/account-setting.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { BillingDetailsComponent } from './components/billing-details/billing-details.component';
import { PaidVideoComponent } from './components/paid-video/paid-video.component';
import { CastAndCrewComponent } from './components/cast-and-crew/cast-and-crew.component';
import { GenreVideoComponent } from './components/genre-video/genre-video.component';
import { SubscriptionSuccessComponent } from './components/subscription-success/subscription-success.component';
import { StaticComponent } from './components/static/static.component';
import { PopUpVideoComponent } from './components/pop-up-video/pop-up-video.component';


const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'view-profiles', component: ViewProfileComponent },
  { path: 'manage-profiles', component: ManageProfileComponent },
  { path: 'edit-profile/:id', component: EditProfileComponent },
  { path: 'add-profile', component: AddProfileComponent },
  { path: 'home/:id', component: HomeComponent },
  { path: 'browse/:id', component: BrowseComponent },
  { path: 'channels', component: ChannelsComponent},
  { path: 'channel/:id', component: SingChannelComponent},
  { path: 'title/:title/:id', component: DetailPageComponent},
  { path: 'title/:title', component: DetailPageComponent},
  { path: 'payment-option/:id', component: PaymentOptionComponent},
  { path: 'pay-per-view/:id', component: PayPerViewComponent},
  { path: 'video/:id', component: EasyVideoComponent},
  { path: 'search/:id', component: SearchVideoComponent},
  { path: 'trailer_video/:id', component: TrailerVideoComponent},
  { path: 'account-setting/:id', component: AccountSettingComponent},
  { path: 'edit-account/:id', component: EditAccountComponent},
  { path: 'change-password/:id', component: ChangePasswordComponent},
  { path: 'delete-account/:id', component: DeleteAccountComponent},
  { path: 'subscriptions/:id', component: SubscriptionComponent},
  { path: 'invoice/:id', component: InvoiceComponent},
  { path: 'billing-details/:id', component: BillingDetailsComponent },
  { path: 'payment-details', component: PaidVideoComponent},
  { path: 'writer/:id', component:CastAndCrewComponent},
  { path: 'actor/:id', component: CastAndCrewComponent},
  { path: 'director/:id', component: CastAndCrewComponent},
  { path: 'genre_video/:id', component: GenreVideoComponent},
  { path: 'subscription-success', component: SubscriptionSuccessComponent},
  { path: 'page/:id', component: StaticComponent },
  { path: 'popupVideo/:id', component: PopUpVideoComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
