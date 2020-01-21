<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Settings;
use App\Category;
use App\SubCategory;
use DB;
class ViewController extends Controller
{
    public function index() {
        $settings = Settings::get();
        $backgroundImage = '';
        $site_logo = '';
        foreach( $settings as $key=>$value) {
            if($value->key == 'site_logo') {
                $site_logo = $value->value;
            }
            if($value->key == 'home_page_bg_image') {
                $backgroundImage = $value->value;
            }
        };
        return view('view.index')->with('site_logo', $site_logo)->with('backgroundImage', $backgroundImage);
    }
    public function browse(Request $request) {
        $settings = Settings::get();
        $backgroundImage = '';
        $site_logo = '';
        foreach( $settings as $key=>$value) {
            if($value->key == 'site_logo') {
                $site_logo = $value->value;
            }
        };
        $skip=$request->skip ? $request->skip:0;
        $take=$request->take ? $request->take:9;
        $title = '';
        $videos = [];
        $sub_category = [];
     //   if ($request->key && is_numeric($request->key)) {
            $category_obj = Category::where('id', 8)->first();
            $title = $category_obj->name;
            $sub_categories  = SubCategory::where('category_id', 8)->get();
            if (!empty($sub_categories)) {
                foreach ($sub_categories as $item) {                    
                    $sub_videos = sub_category_videos($item->id, WEB, $skip, $take, 3);
                    $chunk = $sub_videos->chunk(1);
                    $vid = [];
                    foreach ($chunk as $val) {
                        $group = [];
                        foreach ($val as $data) {
                            $group = displayFullDetails($data->admin_video_id, 3);
                        }
                        $vid['videos'][] = $group;
                        $vid['id'] = $item->id;
                    }
                    $videos[$item->name] = $vid;
                    $sub_category[$item->name] = $item->id;
                }
            } else {
                $response_array = ['success'=>false, 'error_messages'=>tr('category_not_found')];
                return response()->json($response_array, 200);
            }
            $response_array = ['title'=> $title,'data'=>$videos, 'success'=>true, 'sub_category'=>array_chunk($sub_category, 8, true)];
        return view('view/browse')->with('site_logo', $site_logo)->with('videos', $videos)->with('sub_category', array_chunk($sub_category, 8, true));
    }
    public function detail(Request $request) {
        $settings = Settings::get();
        $backgroundImage = '';
        $site_logo = '';
        foreach( $settings as $key=>$value) {
            if($value->key == 'site_logo') {
                $site_logo = $value->value;
            }
            if($value->key == 'home_page_bg_image') {
                $backgroundImage = $value->value;
            }
        };
        $id = $request->id;
        $data = displayFullDetails($id, 3);
        return view('view.detail')->with('site_logo', $site_logo)->with('data', $data);
    }
}
