<?php
/**********
 |
 | Used for UI functions
 |
 | @created Ranjitha
 | 
 | @edited Ranjitha
 |
 ***********/
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Helpers\Helper;
use Setting;
class UIController extends Controller
{
    public function upload_video()
    {
        return view('admin.videos.upload')->with('page' , '')->with('sub_page' , "");
    }
    public function video_notification() {        
        $help_id = $admin_video_id = 1;
    	$email_data['name'] = "STREAMHASH";
        $email_data['help_link'] = Setting::get('ANGULAR_SITE_URL')."page/".$help_id;
        $email_data['play_video_link'] = $email_data['wishlist_link'] = Setting::get('ANGULAR_SITE_URL')."video/".$admin_video_id;
    	$email_data['banner_image'] = "http://staging.botfingers.com/uploads/images/video_47_002.png";
        $recent_videos = Helper::recently_added($web = NULL , $skip = 0, $take = 12, $admin_video_id);
        $data = [];
        foreach ($recent_videos as $key => $recent_video_details) {
            $recent_video_data['default_image'] = $recent_video_details->default_image;
            $recent_video_data['video_link'] = Setting::get('ANGULAR_SITE_URL')."video/".$recent_video_details->admin_video_id;
            array_push($data, $recent_video_data);
        }
        $email_data['recent_videos'] = $data;
        // dd($data);
    	$email_data['content'] = "When a mysterious disaster turns the country into a war zone, a young lawyer heads west with his future father-in-law to find his pregnant fiancée";
        return view('emails.video_notification')->with('email_data' , $email_data);
    }
}
