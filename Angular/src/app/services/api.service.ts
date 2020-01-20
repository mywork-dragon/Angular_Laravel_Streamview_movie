import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppGlobal } from '../app-global';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: Http) {}

  /** Get App Setting Information */
  getAppSettingInfo(): Observable<any> {
    return this.http.get(AppGlobal.apiBase + 'userApi/site_settings').pipe(map(data => data.json()));
  }

  /** Get Static Pages for footer */
  getAllPages(): Observable<any> {
    return this.http.get(AppGlobal.apiBase + 'userApi/allPages').pipe(map(data => data.json()));
  }

  /** Signin */
  signIn(SendData): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/login', SendData)
      .pipe(map(data => data.json()));
  }

  signUp(SendData): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/register', SendData)
      .pipe(map(data => data.json()));
  }

  Logout(SendData): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/logout', SendData)
      .pipe(map(data => data.json()));
  }

  /**
   *  Profile APIs
   */

  /** Get User Detail */
  getUserDetail(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/userDetails', sessionStorage).pipe(map(data => data.json()));
  }

  /** Get Profiles */
  getProfiles(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/active-profiles',  sessionStorage).pipe(map(data => data.json()));
  }

  /** Get Subscriptions */
  getSubscription(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/get-subscription', sessionStorage).pipe(map(data => data.json()));
  }

  /** Get Single Subscription */
  getSingleSubscription(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/view-sub-profile', sessionStorage).pipe(map(data => data.json()));
  }

  /** Edit Profile */
  sendProfileInfo(formData): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/edit-sub-profile', formData).pipe(map(data => data.json()));
  }

  /** Delete Profile */
  sendDeleteProfile(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/delete-sub-profile', {
      sub_profile_id: sessionStorage.profileId,
      id: sessionStorage.user_id,
      token: sessionStorage.access_token
    }).pipe(map(data => data.json()));
  }

  /** Add new profile */
  addNewProfile(formData): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/add-profile', formData).pipe(map(data => data.json()));
  }

  /** Get Active categories */
  // getActiveCategories(sessionStorage): Observable<any> {
  //   return this.http.post(AppGlobal.apiBase + 'userApi/active-categories', {
  //     sub_profile_id: sessionStorage.profileId,
  //     id: sessionStorage.user_id,
  //     token: sessionStorage.access_token
  //   }).pipe(map(data => data.json()));
  // }
  getActiveCategories(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/active-categories', sessionStorage).pipe(map(data => data.json()));
  }
  getHomeData(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase + 'userApi/home', sessionStorage).pipe(map(data => data.json()));
  }

  getVideoData(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/browse', sessionStorage).pipe(map(data => data.json()));
  }
  getAllChannels(sessionStorage): Observable<any> {
   return this.http.post(AppGlobal.apiBase+'userApi/all_channels', sessionStorage).pipe(map(data=>data.json()));
  }
  getSingleChannel(sessionStorage): Observable<any> {
  return this.http.post(AppGlobal.apiBase+'userApi/single_channel', sessionStorage).pipe(map(data=>data.json()));
  }
  AddWishList(sessionStorage):Observable<any> {
  return this.http.post(AppGlobal.apiBase+'userApi/addWishlist', sessionStorage).pipe(map(data=>data.json()));
  }
  deleteWishlist(sessionStorage):Observable<any> {
  return this.http.post(AppGlobal.apiBase+'userApi/deleteWishlist', sessionStorage).pipe(map(data=>data.json()));
  }
  likeVideo(sessionStorage):Observable<any> {
  return this.http.post(AppGlobal.apiBase+'userApi/like_video', sessionStorage).pipe(map(data=>data.json()));
  }
  dislikeVideo(sessionStorage):Observable<any> {
  return this.http.post(AppGlobal.apiBase+'userApi/dis_like_video', sessionStorage).pipe(map(data=>data.json()));
  }
  spamReasons():Observable<any> {
  return this.http.get(AppGlobal.apiBase+'userApi/spam-reasons').pipe(map(data=>data.json()));
  }
  getDetails(sessionStorage):Observable<any> {
  return this.http.post(AppGlobal.apiBase+'userApi/details', sessionStorage).pipe(map(data=>data.json()));
  }
  AddSpam(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/add_spam', sessionStorage).pipe(map(data=>data.json()));
    }
  GetGenreList(sessionStorage):Observable<any> {
      return this.http.post(AppGlobal.apiBase+'userApi/genre_list', sessionStorage).pipe(map(data=>data.json()));
  }

  getSingleVideo(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/singleVideo', sessionStorage).pipe(map(data=>data.json()));
  }

  setWatchCount(sessionStorage):Observable<any> {
    console.log("api service: ", sessionStorage);
    return this.http.post(AppGlobal.apiBase+'userApi/watchCount', sessionStorage);
  }

  ApplyCouponPpv(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/apply/coupon/ppv', sessionStorage).pipe(map(data=>data.json()));
  }

  Payppv(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/pay_ppv', sessionStorage).pipe(map(data=>data.json()));
  }
  Stripeppv(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/stripe_ppv', sessionStorage).pipe(map(data=>data.json()));
  }

  SearchVideo(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/searchVideo', sessionStorage).pipe(map(data=>data.json()));
  }

  AcitvePlan(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/active_plan', sessionStorage).pipe(map(data=>data.json()));
  }

  EmailNotification(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/email/notification', sessionStorage).pipe(map(data=>data.json()));
  }

  
  UpdateProfile(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/updateProfile', sessionStorage).pipe(map(data=>data.json()));
  }

  ChangePassword(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/changePassword', sessionStorage).pipe(map(data=>data.json()));
  }

  DeleteAccount(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/deleteAccount', sessionStorage).pipe(map(data=>data.json()));
  }

  SubscriptionIndex(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/subscription_index', sessionStorage).pipe(map(data=>data.json()));
  }
 
  PlanDetail(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/plan_detail', sessionStorage).pipe(map(data=>data.json()));
  }

  ApplyCouponSubscription(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/apply/coupon/subscription', sessionStorage).pipe(map(data=>data.json()));
  }

  ZeroPlan(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/zero_plan', sessionStorage).pipe(map(data=>data.json()));
  }

  StripePayment(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/stripe_payment', sessionStorage).pipe(map(data=>data.json()));
  }

  SubscribedPlans(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/subscribed_plans', sessionStorage).pipe(map(data=>data.json()));
  }

  CancelSubscription(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/cancel/subscription', sessionStorage).pipe(map(data=>data.json()));
  }

  AutoRenewalEnable(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/autorenewal/enable', sessionStorage).pipe(map(data=>data.json()));
  }

  PpvList(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/ppv_list', sessionStorage).pipe(map(data=>data.json()));
  }

  RedNotice(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/red-notifications', sessionStorage).pipe(map(data=>data.json()));
  }

  notifications(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/notifications', sessionStorage).pipe(map(data=>data.json()));
  }
  
  CastAndCrewVideos(sessionStorage):Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/castAndCrew_videos', sessionStorage).pipe(map(data=>data.json()));
  }

  CastCrewVideos(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase+'userApi/cast_crews/videos', sessionStorage).pipe(map(data=>data.json()));
  }

  GenreVideo(sessionStorage): Observable<any> {
    return this.http.post(AppGlobal.apiBase+ 'userApi/genre-video', sessionStorage).pipe(map(data=>data.json()));
  }

  GetPage(id): Observable<any> {
    return this.http.get(AppGlobal.apiBase+ 'userApi/getPage/'+id).pipe(map(data=>data.json()));
  }
}
