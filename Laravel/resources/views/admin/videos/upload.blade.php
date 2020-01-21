@extends('layouts.admin')
@section('title', tr('add_video'))
@section('content-header', tr('add_video'))
@section('styles')
    <link rel="stylesheet" href="{{asset('assets/css/wizard.css')}}">
    <link rel="stylesheet" href="{{asset('assets/css/jquery.jbswizard.min.css')}}">
    <link rel="stylesheet" href="{{asset('assets/css/style.css')}}">
    <link rel="stylesheet" href="{{asset('admin-css/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css')}}">
    <link rel="stylesheet" href="{{asset('assets/css/imgareaselect-default.css')}}">
    <link rel="stylesheet" href="{{asset('assets/css/jquery.awesome-cropper.css')}}">
    <link rel="stylesheet" href="{{asset('admin-css/plugins/iCheck/all.css')}}">
    <!-- <link rel="stylesheet" href="{{asset('assets/css/jquery.Jcrop.css')}}"> -->
    <!-- <link rel="stylesheet" href="{{asset('assets/css/style-example.css')}}"> -->
    <style type="text/css">
        .container-narrow {
          margin: 150px auto 50px auto;
          max-width: 728px;
        }
        canvas{
            width: 100%;
            height: auto;
        }
        span.select2-container{
            width:100% !important;
        }
        .example-wizard.panel {
    border: 0px solid white;
    padding: 20px;
    display: inline-block;
}
        .select2-container--default .select2-selection--multiple .select2-selection__choice {
            margin-bottom: 10px;
            width: 30%;
        }
        .select2-container .select2-search--inline {
            border: 1px solid #d2d6df !important;
            width: 30%;
        }
    </style>
@endsection
@section('content')  
@include('notification.notify')
@if(envfile('QUEUE_DRIVER') != 'redis') 
 <div class="alert alert-warning">
    <button type="button" class="close" data-dismiss="alert">×</button>
        {{tr('warning_error_queue')}}
</div>
@endif
@if(checkSize())
 <div class="alert alert-warning">
    <button type="button" class="close" data-dismiss="alert">×</button>
        {{tr('max_upload_size')}} <b>{{ini_get('upload_max_filesize')}}</b>&nbsp;&amp;&nbsp;{{tr('post_max_size')}} <b>{{ini_get('post_max_size')}}</b>
</div>
@endif
@if(Setting::get('ffmpeg_installed') == FFMPEG_NOT_INSTALLED) 
 <div class="alert alert-warning">
    <button type="button" class="close" data-dismiss="alert">×</button>
        {{tr('ffmpeg_warning_notes')}}
</div>
@endif
    <div>
        <div class="main-content">
            <button class="btn btn-primary" data-toggle="modal" data-target="#myModal" style="display: none" id="error_popup">popup</button>
           <!-- popup -->
           <div class="modal fade error-popup" id="myModal" role="dialog">
               <div class="modal-dialog">
                   <div class="modal-content">
                       <div class="modal-body">
                           <div class="media">
                               <div class="media-left">
                                   <img src="{{asset('images/warning.jpg')}}" class="media-object" style="width:60px">
                               </div>
                               <div class="media-body">
                                   <h4 class="media-heading">Information</h4>
                                   <p id="error_messages_text"></p>
                               </div>
                           </div>
                           <div class="text-right">
                               <button type="button" class="btn btn-primary top" data-dismiss="modal">Okay</button>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
            <div id="example">
                <div class="example-wizard panel panel-primary">
                    <div class="">
                        <!-- Example Wizard START -->
                        <div id="j-bs-wizard-example">
                            <form method="post" enctype="multipart/form-data" id="upload_video_form" action="{{route('admin.videos.save')}}">
                                <div class="tab-content">
                                    <!-- tab1 -->
                                    <div role="tabpanel" class="tab-pane fade in active" id="first">
                                        <h3 class="bg bg-primary" style="width:300px; padding: 10px;" >{{tr('video_details')}}</h3>
                                        <p class="note-sec">{{tr('note')}}: <span class="asterisk"><i class="fa fa-asterisk"></i></span> {{tr('mandatory_field_notes')}}
                                        <input type="hidden" name="admin_video_id" id="admin_video_id" value="{{$model->id}}">
                                           <!--  <a href="#" data-toggle="tooltip" title="Hooray!" data-placement="right">Note</a> -->
                                        </p>
                                        <ul class="form-style-7">
                                            <li class="height-54">
                                                <label for="reviews">{{tr('msg')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span></label>
                                                <div class="publish">
                                                    <div class="radio radio-primary radio-inline">
                                                        <input type="radio" class="search-type"  checked id="tmdb" value="1" name="tmdb"   >
                                                        <label for="tmdb"> {{tr('tmdb')}} </label>
                                                    </div>
                                                    <div class="radio radio-primary radio-inline">
                                                        <input type="radio" class="search-type" id="custom" value="0" name="tmdb"   >
                                                        <label for="custom"> {{tr('custom')}} </label>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <label for="title">{{tr('title')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span> </label>
                                                @if(!$model->id)
                                                 <button style="float: right; position: absolute; right: 3%;" title="Click to search on {{tr('tmdb')}}" type="button" class="btn btn-primary btn-sm" id="tmdb_btn">Search {{tr('tmdb')}}</button>
                                                @endif
                                                <input required type="text" name="title" maxlength="100" maxlength="255" value="{{$model->title}}" id='title'>
                                            </li>
                                            <li style="clear: both;">
                                                <label for="age">{{tr('age')}} <span class="asterisk1"><i class="fa fa-asterisk1"></i></span></label>
                                                <input type="text" name="age" maxlength="3" value="{{$model->age}}" id='age'>
                                            </li>
                                            <li>
                                                <label for="duration">{{tr('trailer_duration')}} <span class="asterisk1"><i class="fa fa-asterisk1"></i></span>(hh:mm:ss)</label>
                                                <input type="text" name="trailer_duration" maxlength="8" data-inputmask="'alias': 'hh:mm:ss'" data-mask value="{{$model->trailer_duration}}" id="trailer_duration">
                                            </li>
                                            <li>
                                                <label for="duration">{{tr('main_video_duration')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span>(hh:mm:ss)</label>
                                                <input type="text" name="duration" maxlength="8" data-inputmask="'alias': 'hh:mm:ss'" data-mask value="{{$model->duration}}" id="duration">
                                            </li>
                                            <li class="height-54">
                                                <label for="reviews">{{tr('ratings')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span></label>
                                                <div class="starRating">
                                                    <input id="rating5" type="radio" name="ratings" value="5" @if($model->ratings == 5) checked @endif>
                                                    <label for="rating5">5</label>
                                                    <input id="rating4" type="radio" name="ratings" value="4" @if($model->ratings == 4) checked @endif>
                                                    <label for="rating4">4</label>
                                                    <input id="rating3" type="radio" name="ratings" value="3" @if($model->ratings == 3) checked @endif>
                                                    <label for="rating3">3</label>
                                                    <input id="rating2" type="radio" name="ratings" value="2" @if($model->ratings == 2) checked @endif>
                                                    <label for="rating2">2</label>
                                                    <input id="rating1" type="radio" name="ratings" value="1" @if($model->ratings == 1) checked @endif>
                                                    <label for="rating1">1</label>
                                                </div>
                                            </li>
                                            <li id="time_li" style="display: none;width: 98%;">
                                                <label for="time">{{tr('publish_time')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span></label>
                                                <input type="text" name="publish_time" id="datepicker" value="{{$model->publish_time}}" readonly>
                                            </li> 
                                            <li>
                                                <label for="description">{{tr('description')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span></label>
                                                <textarea id="description" name="description" rows="4">{{$model->description}}</textarea>
                                            </li>
                                            <li>
                                              <label for="details">{{tr('details')}} <span class="asterisk1"><i class="fa fa-asterisk1"></i></span></label>
                                                <textarea name="details" rows="4" id='details'>{{$model->details}}</textarea>
                                            </li> 
                                              <li style="display:none;"  class="actors-list">
                                                <label for="actors">Actors </label>
                                                <select id="actors" name="actors[]" class="select2" multiple>
                                                    @foreach($actors as $act)
                                                        <option value="{{$act->id}}" @if( $model->actors !="0" && is_array(json_decode($model->actors, true)) && in_array($act->id, json_decode($model->actors, true))) selected @endif>{{$act->name}}</option>
                                                    @endforeach
                                                </select>
                                            </li> 
                                             <li style="display:none;"  class="directors-list">
                                                <label for="directors">Directors </label>
                                                <select id="directors" name="directors[]" class="select2" multiple>
                                                    @foreach($directors as $direc)
                                                        <option value="{{$direc->id}}" @if( $model->directors !="0" &&  is_array(json_decode($model->directors, true)) && in_array($direc->id, json_decode($model->directors, true))) selected @endif>{{$direc->name}}</option>
                                                    @endforeach
                                                </select>
                                            </li> 
                                            <li style="display:none;"  class="writers-list">
                                                <label for="writers">Writers </label>
                                                <select id="writers" name="writers[]" class="select2" multiple>
                                                    @foreach($writers as $writer)
                                                        <option value="{{$writer->id}}" @if( $model->writers !="0" &&  is_array(json_decode($model->writers, true)) && in_array($writer->id, json_decode($model->writers, true))) selected @endif>{{$writer->name}}</option>
                                                    @endforeach
                                                </select>
                                            </li> 
                                            <li>
                                                <label>{{tr('category')}}</label>
                                                    <select class="form-control" onchange="displaySubCategory(this.value);" name="category_id" id="category_id">
                                                    @foreach($categories as $category)
                                                        <option {{ ($category->id == $model->category_id) ? 'selected' : '' }} value="{{ $category->id }}">{{ $category->name }}</option>
                                                    @endforeach
                                                    </select>
                                            </li>
                                            <li>
                                                <!-- onchange="saveSubCategory(this.value, {{ REQUEST_STEP_3 }} )" -->
                                                <label>{{tr('sub_category')}}</label>
                                                <select multiple   class="form-control select2" name="sub_category_id[]" id="sub_category">
                                                </select>
                                            </li>
                                            <li>
                                                <label>Moderator  <span class="asterisk"><i class="fa fa-asterisk"></i></span></label>
                                                <select class="form-control" required name="moderator_id" >
                                                    <option value=""></option>
                                                    @foreach($moderators as $mod)
                                                    <option {{ ($mod->id == $model->moderator_id ) ? 'selected' : '' }} value="{{ $mod->id }}">{{ $mod->name }}</option>
                                                @endforeach
                                                </select>
                                            </li>
                                            <li class="height-54">
                                                <label for="reviews">{{tr('publish_type')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span></label>
                                                <div class="publish">
                                                    <div class="radio radio-primary radio-inline">
                                                        <input type="radio" id="now" value="{{PUBLISH_NOW}}" name="publish_type" onchange="checkPublishType(this.value)" {{($model->id) ?  (($model->status) ? "checked" : '' ) : 'checked' }} >
                                                        <label for="now"> {{tr('now')}} </label>
                                                    </div>
                                                    <div class="radio radio-primary radio-inline">
                                                        <input type="radio" id="later" value="{{PUBLISH_LATER}}" name="publish_type" onchange="checkPublishType(this.value)" {{($model->id) ?  ((!$model->status) ? "checked" : '' ) : '' }} >
                                                        <label for="later"> {{tr('later')}} </label>
                                                    </div>
                                                </div>
                                            </li> 
                                            <li class="height-54">
                                                <label for="reviews">Release Date</label>
                                                <div class="publish">
                                                    <input type="date" class="form-control" id="release_date" name="release_date" value="{{ ( $model->release_date !='0000-00-00' && $model->release_date !='') ? $model->release_date:'' }}">
                                                </div>
                                            </li>
                                        </ul>
                                        <div class="clearfix"></div>
                                        <br>
                                    </div>
                                    <input type="hidden" name="tmd_actors" id="tmd-actors">
                                    <input type="hidden" name="tmd_directors" id="tmd-directors">
                                    <input type="hidden" name="tmd_writers" id="tmd-writers">
                                    <input type="hidden" name="tmd_genre" id="tmd-genre">
                                    <input type="hidden" name="alternative_titles" id="alternative_titles">
                                     @include('tab4')
                                    <!-- tab4 -->
                                </div>
                                <input type="hidden" name="timezone" value="{{ Auth::guard('admin')->user()->timezone }}">
                            </form>
                        </div>
                        <!-- Example Wizard END -->
                    </div>
                </div>
            </div>
        </div>
    </div> 
    <div class="overlay">
        <div id="loading-img"></div>
    </div>
<!-- Modal -->
<div id="data-modal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Movies</h4>
      </div>
      <div class="modal-body">
       <table class="table table-bordered">
    <thead>
      <tr>
        <th>#</th>
        <th>Thumbnail</th>
        <th>Movie Title</th>
        <th>Release Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="movie-data">
    </tbody>
  </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
@endsection
@section('scripts')
    <script src="{{asset('admin-css/plugins/bootstrap-datetimepicker/js/moment.min.js')}}"></script> 
    <script src="{{asset('admin-css/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js')}}"></script> 
    <script src="{{asset('admin-css/plugins/iCheck/icheck.min.js')}}"></script>
    <script src="{{asset('assets/js/jquery.jbswizard.min.js')}}"></script>
    <script src="{{asset('assets/js/jbswizard.js')}}"></script>
    <script src="{{asset('admin-css/plugins/jquery.form.js')}}"></script>
    <script src="{{asset('assets/js/jquery.awesome-cropper.js')}}"></script>
    <script src="{{asset('assets/js/jquery.imgareaselect.js')}}"></script>
    <script>
        $(document).ready(function () {
        });
    </script> 
    <script>
        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();   
        });
        function makeSelected(){ // function is working in js/video-upload.js
            @if($model->sub_category_id )
            var e='{{ $model->sub_category_id}}';
            $('#sub_category').val(e.split(','));
            @endif
        }
    </script>
    <script type="text/javascript">
        var banner_image = "{{$model->is_banner}}";
        var cat_url = "{{ url('select/sub_category')}}";
        var step3 = "{{REQUEST_STEP_3}}";
        var sub_cat_url = "{{ url('select/genre')}}";
        var final = "{{REQUEST_STEP_FINAL}}";
        var video_id = "{{$model->id}}";
        var genreId = "{{$model->genre_id}}";
        var video_type = "{{$model->video_type}}";
        var view_video_url = "{{url('admin/view/video')}}?id=";
    </script>
    <script src="{{asset('assets/js/upload-video.js')}}"></script>
    <script type="text/javascript">
        // $('.multipleSelect').select2();
        $('#datepicker').datetimepicker({
            minTime: "00:00:00",
            minDate: moment(),
            autoclose:true,
            format:'dd-mm-yyyy hh:ii',
        });
        $('.manual_video_upload').show();
        $('.others').hide();
        $("#video_upload").change(function(){
            $(".manual_video_upload").show();
            $(".others").hide();
        });
        $("#youtube").change(function(){
            $(".others").show();
            $(".manual_video_upload").hide();
        });
        $("#other_link").change(function(){
            $(".others").show();
            $(".manual_video_upload").hide();
        });
        function trailerVideoUpload(value, autoload_status) {
            // On initialization, show others videos section
            if (value == 1) {
                $("#upload_trailer").show();
                $("#other_trailer_video").val("");
                $(".other_trailer").hide();
            }
            // if ((value == 1 || value == 3)) 
                // $('#other_trailer_video').val('').removeAttr('required');
            if ((value == 2 || value == 3)) {
                $("#other_trailer_video").val("");
                if(("{{$model->video_type_trailer}}" == value) || ("{{$model->video_type_trailer}}" == value)) {
                    $("#other_trailer_video").val("{{ change_web_url_to_cdn($model->trailer_video) }}");
                }
                 $("#upload_trailer").hide();
                $(".other_trailer").show();
            }
           show_upload_location(); 
        }
        function show_upload_location(){
            
        }
        function videoUploadType(value, autoload_status) {
            // On initialization, show others videos section
            $(".others").show();
            $("#other_video").attr('required', true);
            if (autoload_status == 0) {
                $("#video").attr('required', true);
            }
            $(".manual_video_upload").hide();
            $("#other_video").val("{{ change_web_url_to_cdn($model->video) }}");
            if (value == "{{VIDEO_TYPE_UPLOAD}}") {
                $("#other_video").val("");
                $(".manual_video_upload").show();
                $(".others").hide();
                $("#other_video").attr('required', false);
                // If admin editing the video means remove the required fields for video & trailer video (If already in VIDEO_TYPE_UPLOAD)
                @if($model->video_type == VIDEO_TYPE_UPLOAD)
                    $("#video").attr('required', false);
                @endif
            }
            if ((value == "{{VIDEO_TYPE_OTHER}}" || value == "{{VIDEO_TYPE_YOUTUBE}}") && autoload_status == 0) {
                $("#other_video").val("");
                if(("{{$model->video_type}}" == value) || ("{{$model->video_type}}" == value)) {
                    $("#other_video").val("{{ change_web_url_to_cdn($model->video) }}");
                }
                $("#video").attr('required', false);
            }
          show_upload_location();
        }
$(document).on('click','#tmdb_btn',function(){
    var title=$('#title').val();
if($('#tmdb').is(':checked') && title !=''){
    $('#tmdb_btn').text('Searching...');
 $.ajax({
    type:'POST',
    url:'{{ url("admin/videos/search")}}',
    data: {title:title},
    success: function(data){
         $('#tmdb_btn').text('Search TMDB');
        var results=data.results;
        var html='';
        if( results.length > 0){
            $.each(results, function(i, val){
                var poster= val.poster_path !=null ? 'https://image.tmdb.org/t/p/w200'+val.poster_path :'{{ url("images/default.png") }}';
                html+=" <tr>\
                    <td>"+(i+1)+"</td>\
                    <td><img class='img-thumbnail' src='" + poster +"' width=100 height=100></td>\
                    <td>"+val.title+"</td>\
                    <td>"+val.release_date+"</td>\
                    <td><button type='button' id='"+val.id+"' class='btn get-movie-data btn-sm btn-primary'>Select</button></td>\
                  </tr>\
                  ";
            });
            $('#movie-data').html(html);
        }else{
           $('#movie-data').html("<tr><td class='text-center' colspan='5'>No data found</td></tr>"); 
        }
        $('#data-modal').modal('show');
    },
    error: function(){
        alert('Something wrong with request');
         $('#tmdb_btn').text('Search TMDB');
    },
 });
}
});
$(document).on('change','.search-type',function(){
    if(parseInt(this.value)==1){
        $('#tmdb_btn').show();
         $('input#default_img').val('');
          $('img#default_img').attr('src','{{url("images/default.png")}}');
           @if(!$model->id)
          $('.actors-list, .directors-list, .writers-list, .genre-list').hide();
             @endif
    }else{
        $('#duration,#description,#poster,input#default_img').val('');  
        $('#description').text('');
        $('.starRating input').prop('checked',false);
        $('#tmdb_btn').hide();
         $('img#default_img').attr('src','{{url("images/default.png")}}');
        $('.actors-list, .directors-list, .writers-list, .genre-list').show();
        $('#youtube_t_option').prop('checked',false);
        // $('#other_trailer_video').val('').removeAttr('required');
        $('#upload_t_option').prop('checked',true).change();
    }
   });
 @if($model->id)
$('.actors-list, .directors-list, .writers-list, .genre-list').show();
 @endif
$(document).on('click','.get-movie-data',function(){
    $(this).text('Wait...');
    var id=$(this).attr('id');
 $.ajax({
    type:'POST',
    url:'{{ url("admin/videos/get_movie")}}',
    data: {id:id},
    context: this,
    success: function(data){
         $(this).text('Select');
            var rating=parseInt(data.vote_average);
                rating=parseInt(rating> 0 ? (rating/2):0);
            $('#title').val(data.title);
            var time=parseInt(data.runtime);
            if(time>0){
             $('#duration').val(convertMinsToHrsMins(time));  
            }else{
                $('#duration').val('');  
            }
            if(data.rated){
            $('#age').val(data.rated);
            }else{
             $('#age').val('');   
            }  
            if(data.release_date){
            $('#release_date').val(data.release_date);
            }else{
             $('#release_date').val('');   
            }
       if(data.alternative_titles.titles.length){
            $('#alternative_titles').val(JSON.stringify(data.alternative_titles.titles));
            }else{
             $('#alternative_titles').val('');   
            }
             if(data.credits.cast.length > 0){
                var actors='';
                $.each(data.credits.cast,function(i,actor){
                    if(i==0) 
                    actors+=actor.name;
                     else 
                    actors+=','+actor.name;
                });
            $('#tmd-actors').val(actors);
            }else{
             $('#tmd-actors').val('');   
            }
            if(data.credits.crew.length > 0){
                var directors='',writers='';
                  $.each(data.credits.crew,function(i,crew){
                    if(crew.department=='Directing'){
                    if(directors=='')
                     directors+=crew.name;
                     else
                     directors+=','+crew.name;
                    }
                  if(crew.department=='Writing'){
                    if(writers=='')
                     writers+=crew.name;
                   else
                     writers+=','+crew.name;
                  }
                });
                  $('#tmd-directors').val(directors);
                  $('#tmd-writers').val(writers);
            }else{
                  $('#tmd-directors,#tmd-writers').val('');
            }
                if(data.genres.length > 0){
                var genres='';
                  $.each(data.genres,function(i,genre){
                    if(genres=='')
                     genres+=genre.name;
                     else
                     genres+=','+genre.name;
                });
                  $('#tmd-genre').val(genres);
            }else{
                  $('#tmd-genre').val('');
            }
            $('#youtube_t_option').prop('checked',true).change();
            // $('#other_trailer_video').val('').attr('required','required');
            if(data.videos.results.length > 0){
                var trailer_url = 'https://youtu.be/'+data.videos.results[0].key;
                $('#other_trailer_video').val(trailer_url);
            }
            $('#description').val(data.overview);
            $('.starRating input[value="'+rating+'"]').attr('checked','checked');
            if(rating===0){
                $('.starRating input').prop('checked',false);
            }
            var poster_url="https://image.tmdb.org/t/p/w300"+data.poster_path;
            if(data.poster_path){
               $('#poster').val(poster_url);  
               $('img#default_img').attr('src',poster_url);  
            }else{
                 $('img#default_img').attr('src','{{url("images/default.png")}}');
                 $('#poster').val('');  
            }
            $('#data-modal').modal('hide');
    },
    error: function(){
        alert('Something wrong with request');
          $(this).text('Select');
    },
 });
});
 function  convertMinsToHrsMins(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return h + ':' + m+':00';
}
        function saveVideo() {
            var formData = new FormData($('#upload_video_form')[0]);
            console.log("aaaaaaaaaaaaaaaaaaaaaa");
            $.ajax({
                type : 'post',
                url : "{{route('admin.videos.save')}}",
                data : formData,
                contentType :false,
                processData:false,
                beforeSend : function(data) {
                    $("#finish_video").attr('disabled', true);
                },
                success : function(data) {
                    if (data.response.success) {
                        window.location.href= ""+data.response.data.id;
                    } else {
                        $("#error_messages_text").html(data.response.error_messages);
                        $("#error_popup").click();
                    }
                },
                error : function(data) {
                },
                complete : function(data) {
                    $("#finish_video").attr('disabled', false);
                }
            });
        }
        @if($model->id && !$model->status)
            checkPublishType("{{PUBLISH_LATER}}");
            $("#datepicker").val("{{$model->publish_time}}");
        @endif
        @if($model->id)
        videoUploadType("{{$model->video_type}}", 1);
        trailerVideoUpload("{{$model->video_type_trailer}}", 1);
        //saveCategory("{{$model->category_id}}", "{{REQUEST_STEP_3}}");
        @endif
        function checkPublishType(val){
            $("#time_li").hide();
            //$("#datepicker").prop('required',false);
            $("#datepicker").val("");
            if(val == 2) {
                $("#time_li").show();
               // $("#datepicker").prop('required',true);
            }
        }
    </script>
    <script>
        $('form').submit(function () {
           window.onbeforeunload = null;
        });
        window.onbeforeunload = function() {
             return "Data will be lost if you leave the page, are you sure?";
        };
        loadGenre(genreId);
        window.setTimeout(function() {
            @if($model->genre_id) 
                $("#genre select").val("{{$model->genre_id}}");
            @endif
        }, 2000);
    </script>
@endsection
