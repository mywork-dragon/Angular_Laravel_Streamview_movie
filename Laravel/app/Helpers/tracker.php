<?php

use App\Helpers\Helper;

use App\UserTrack;
use App\SubCategory;
use App\CastCrew;
use App\Moderator;
 function change_web_url_to_cdn($url='')
        {
           if(envfile('CDN_SUB_DOMAIN_URL') && strpos($url, 'digitaloceanspaces.com') !== false){
            $folder=getenv('DO_SPACES_FOLDER');
            $url=envfile('CDN_SUB_DOMAIN_URL')."/$folder/".basename($url);
             return $url;
           }
            return $url;
        }
function moderator($moderator_id){
    $Moderator = Moderator::find($moderator_id);
    if($Moderator){
       return $Moderator->name; 
    }else{
      return '';  
    }
}

    function category($ids){
    $sub='';
    if($ids !="0"){
    $sub_category = SubCategory::whereIn('id', explode(',', $ids))->get();
    foreach ($sub_category as $key => $value) {
        if($key==0){
            $sub.=$value->name;
        }else{
            $sub.=", ".$value->name;
        }
         
        }
        }
        return $sub;
    }

    function shwoCastAndCrews($ids, $object=false){
        // return $ids;
    $data='';
    $obj=[];
    if($ids !="0" && is_array(json_decode($ids))){
    $CastCrew = CastCrew::select('id', 'name')->whereIn('id',  json_decode($ids))->get();
    foreach ($CastCrew as $key => $value) {
        if($object){
            $d=[];
            $d['id']=$value->id;
            $d['name']=$value->name;
            $obj[]=$d;
            continue;
        }
        if($key==0){
            $data.=$value->name;
        }else{
            $data.=", ".$value->name;
        }
         
        }
        }
        if($object){
          return $obj;  
        }
        return $data;
    }



function user_track($title) {

    $ip_address = $_SERVER['REMOTE_ADDR'];

    $details = array();

    if($ip_address && $ip_address != '::1') {

        $check_user = $track_user = UserTrack::where('ip_address' , $ip_address)->first();

        if(!$check_user) {

            $details = json_decode(file_get_contents("http://ipinfo.io/{$ip_address}/json"));

            $track_user = new UserTrack;

            $track_user->view = 1;

        }

        $track_user->ip_address = $ip_address;

        $track_user->HTTP_USER_AGENT = $_SERVER['HTTP_USER_AGENT'] ? $_SERVER['HTTP_USER_AGENT']: ""; 
        $track_user->REQUEST_TIME = $_SERVER['REQUEST_TIME'] ? $_SERVER['REQUEST_TIME']: ""; 
        $track_user->REMOTE_ADDR = $_SERVER['REMOTE_ADDR'] ? $_SERVER['REMOTE_ADDR']: ""; 
        
        $track_user->view = $track_user->view + 1;

        if($details) {

            $latitude = $longitude = "";

            if(isset($details->loc)) {
                $locations = explode(',', $details->loc);

                $latitude = $locations[0];
                $longitude = $locations[1];
            
            }

            $track_user->city  = isset($details->city) ? $details->city : "";
            $track_user->region  = isset($details->region) ? $details->region : "";
            $track_user->country  = isset($details->country) ? $details->country : "";
            $track_user->latitude  = $latitude ? $latitude : "";
            $track_user->longitude  = $longitude ? $longitude : "";
            $track_user->others = isset($details->org) ? $details->org : "";
        
        }

        $track_user->save();

        if($track_user) {

            if(\Setting::get('track_user_mail')) {

                $email_data = $track_user;
                $subject = $title;
                $page = "emails.new-user";
                $email = \Setting::get('track_user_mail');
                $result = Helper::send_email($page,$subject,$email,$email_data);

            }
        }
        
    }

}




