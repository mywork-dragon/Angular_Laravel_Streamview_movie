<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\ContactUS;
Use Mail;
class ContactUSController extends Controller
{
   /**
    * Show the application dashboard.
    *
    * @return \Illuminate\Http\Response
    */
   public function contactUS()
   {
       return view('guest.contactUS');
   }
       /** * Show the application dashboard. * * @return \Illuminate\Http\Response */
       public function contactUSPost(Request $request) 
       {
        $this->validate($request, [ 'name' => 'required', 'email' => 'required|email', 'message' => 'required' ]);
        ContactUS::create($request->all()); 
        Mail::send('guest.email',
           array(
               'name' => $request->get('name'),
               'email' => $request->get('email'),
               'user_message' => $request->get('message')
           ), function($message)
       {
           $message->from('webmaster@flashington.com');
           $message->to('craigb@entangledweb.com', 'Admin')->subject('Feedback');
       });
        return back()->with('success', 'Thanks for contacting us!'); 
       }
    }
