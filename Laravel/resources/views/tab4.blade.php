<div role="tabpanel" class="tab-pane fade in active" id="fourth">
    <ul class="form-style-7">
        <li id="genre_id">
            <label for="genre">{{tr('select_genre')}}
                <span class="asterisk"><i class="fa fa-asterisk"></i></span>
            </label>
            <select class="form-control" id="genre" disabled name="genre_id">
                <option value="">{{tr('select_genre')}}</option>
            </select>
        </li>
    </ul>
    <div class="clearfix"></div>
    <!-- radio and checkbox -->
    <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <h3 class="bg bg-primary" style="width:300px; padding: 10px;">Upload Video</h3>
            <div class="mb-30">
                <label class="label-cls">{{tr('video_type')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span> </label>
                <div class="margin-videotype">
                    <div class="radio radio-primary radio-inline">
                        <input type="radio" id="video_upload_link" value="{{VIDEO_TYPE_UPLOAD}}" name="video_type" onchange="videoUploadType(this.value,0)" {{$model->id ? ($model->video_type == VIDEO_TYPE_UPLOAD ? 'checked': ''):'checked'}}>
                        <label for="video_upload_link"> {{tr('video_upload_link')}} </label>
                    </div>
                    <div class="radio radio-inline radio-primary" id="youtube">
                        <input type="radio" id="youtube_link" value="{{VIDEO_TYPE_YOUTUBE}}" name="video_type" onchange="videoUploadType(this.value,0)" {{$model->id ? ($model->video_type == VIDEO_TYPE_YOUTUBE ? 'checked': ''):''}}>
                        <label for="youtube_link"> {{tr('youtube')}} </label>
                    </div>
                    <div class="radio radio-inline radio-primary" id="other_link">
                        <input type="radio" id="other_links" value="{{VIDEO_TYPE_OTHER}}" name="video_type" onchange="videoUploadType(this.value,0)" {{$model->id ? ($model->video_type == VIDEO_TYPE_OTHER ? 'checked': ''):''}}>
                        <label for="other_links"> {{tr('other_link')}} </label>
                    </div>
                </div>
            </div>
            <div class="row manual_video_upload">
                <div class="mb-30">
                    <div>
                        <label class="label-cls">{{tr('main_resize_video_resolutions')}}
                            <span class="asterisk"><i class="fa fa-asterisk1"></i></span>
                        </label>
                    </div>
                    @foreach(getVideoResolutions() as $key => $resolution)
                    <div class="checkbox checkbox-inline checkbox-primary" style="{{$key == 0 ? '' : ''}}">
                        <input type="checkbox" id="main_{{$resolution->value}}" value="{{$resolution->value}}" name="video_resolutions[]" @if(in_array($resolution->value, $model->trailer_video_resolutions)) checked @endif>
                        <label for="main_{{$resolution->value}}">{{$resolution->value}} </label>
                    </div>
                    @endforeach
                </div>
                <!-- upload  video section -->
                <ul class="form-style-7">
                    <!-- video -->
                    <li>
                        <label for="title">{{tr('video')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span> </label>
                        <p class="img-note mb-10">{{tr('video_validate')}}</p>
                        <div class="">
                            <div class="">
                                <label class="">
                                    <!-- <div class="btn btn-primary btn-sm">{{tr('browse')}}</div> -->
                                    <input type="file" name="video" accept="video/mp4,video/x-matroska" id="video" @if(!$model->id) required @endif/>
                                </label>
                            </div>
                        </div>
                    </li>
                    <li>
                        <label for="title">{{tr('subtitle')}}</label>
                        <p class="img-note mb-10">{{tr('subtitle_validate')}}</p>
                        <div class="">
                            <div class="">
                                <label class="">
                                    <input id="video_subtitle" type="file" name="video_subtitle" onchange="checksrt(this, this.id)" />
                                </label>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- upload  video section -->
            <ul class="form-style-7 others">
                <!-- video -->
                <li style="width: 100%;">
                    <label for="video">{{tr('video')}}
                        <span class="asterisk"><i class="fa fa-asterisk"></i></span>
                    </label>
                    <input type="url" name="video" maxlength="256" id="other_video">
                </li>
            </ul>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <h3 class="bg bg-primary" style="width:300px; padding: 10px;">Upload Trailer</h3>
            <div class="mb-30">
                <label class="label-cls">{{tr('video_type')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span> </label>
                <div class="margin-videotype">
                    <div class="radio radio-primary radio-inline">
                        <input type="radio" id="upload_t_option" value="1" name="video_type_trailer" onchange="trailerVideoUpload(this.value,0)" {{$model->id ? ($model->video_type_trailer == 1 ? 'checked': ''):'checked'}}>
                        <label for="upload_t_option"> {{tr('video_upload_link')}} </label>
                    </div>
                    <div class="radio radio-inline radio-primary">
                        <input type="radio" id="youtube_t_option" value="2" name="video_type_trailer" onchange="trailerVideoUpload(this.value,0)" {{ $model->id ? ($model->video_type_trailer == 2 ? 'checked': ''):''}}>
                        <label for="youtube_t_option"> {{tr('youtube')}} </label>
                    </div>
                    <div class="radio radio-inline radio-primary">
                        <input type="radio" id="other_t_option" value="3" name="video_type_trailer" onchange="trailerVideoUpload(this.value,0)" {{ $model->id ? ($model->video_type_trailer == 3 ? 'checked': ''):''}}>
                        <label for="other_t_option"> {{tr('other_link')}} </label>
                    </div>
                </div>
            </div>
            <div id="upload_trailer">
                <div class="mb-30">
                    <div>
                        <label class="label-cls">{{tr('trailer_resize_video_resolutions')}} <span class="asterisk"><i class="fa fa-asterisk1"></i></span> </label>
                    </div>
                    @foreach(getVideoResolutions() as $i => $resolution)
                    <div class="checkbox checkbox-inline checkbox-primary" style="{{$i == 0 ? '' : 'padding-left:10px'}}">
                        <input type="checkbox" id="trailer_{{$resolution->value}}" value="{{$resolution->value}}" name="trailer_video_resolutions[]" @if(in_array($resolution->value, $model->trailer_video_resolutions)) checked @endif>
                        <label for="trailer_{{$resolution->value}}">{{$resolution->value}} </label>
                    </div>
                    @endforeach
                </div>
                <ul class="form-style-7">
                    <!-- video -->
                    <li>
                        <label for="title">{{tr('trailer_video')}}</label>
                        <p class="img-note mb-10">{{tr('video_validate')}}</p>
                        <div class="">
                            <div class="">
                                <label class="">
                                    <!-- <div class="btn btn-primary btn-sm">{{tr('browse')}}</div> -->
                                    <input type="file" name="trailer_video" accept="video/mp4,video/x-matroska" id="trailer_video" />
                                </label>
                            </div>
                        </div>
                    </li>
                    <li>
                        <label for="title">{{tr('subtitle')}}</label>
                        <p class="img-note mb-10">{{tr('subtitle_validate')}}</p>
                        <div class="">
                            <div class="">
                                <label class="">
                                    <!-- <div class="btn btn-primary btn-sm">{{tr('browse')}}</div> -->
                                    <input id="trailer_subtitle" type="file" name="trailer_subtitle" onchange="checksrt(this, this.id)" id="trailer_subtitle" />
                                </label>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <ul class="form-style-7 other_trailer" style="display: none;">
                <!-- video -->
                <li style="width: 100%;">
                    <label for="trailer_video">
                        {{tr('trailer_video')}}
                        <span class="asterisk"><i class="fa fa-asterisk"></i></span>
                    </label>
                    <input type="url" name="trailer_video" maxlength="256" id="other_trailer_video">
                </li>
            </ul>
        </div>
    </div>
    <div class="row" id="upload-location">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <div class="mb-30">
                <div>
                    <label class="label-cls">{{tr('video_upload_type')}} <span class="asterisk"><i class="fa fa-asterisk1"></i></span> </label>
                </div>
                @if(check_s3_configure())
                <div class="radio radio-primary radio-inline">
                    <input type="radio" id="s3" value="{{VIDEO_UPLOAD_TYPE_s3}}" name="video_upload_type">
                    <label for="s3">{{tr('s3')}}</label>
                </div>
                @endif
                <div class="radio radio-inline radio-primary">
                    <input type="radio" id="spaces" checked value="{{VIDEO_UPLOAD_TYPE_spaces}}" name="video_upload_type">
                    <label for="spaces">{{tr('spaces')}}</label>
                </div>
                <div class="radio radio-inline radio-primary">
                    <input type="radio" id="direct" value="{{VIDEO_UPLOAD_TYPE_DIRECT}}" name="video_upload_type">
                    <label for="direct">{{tr('direct')}}</label>
                </div>
            </div>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <div class="mb-30">
                <div>
                    <label class="label-cls">{{tr('compress_video')}}<span class="asterisk"><i class="fa fa-asterisk"></i></span> </label>
                </div>
                <div class="radio radio-primary radio-inline">
                    <input type="radio" id="COMPRESS_ENABLED" name="compress_video" value="{{COMPRESS_ENABLED}}">
                    <label for="COMPRESS_ENABLED"> {{tr('yes')}} </label>
                </div>
                <div class="radio radio-inline radio-primary">
                    <input type="radio" id="COMPRESS_DISABLED" name="compress_video" value="{{COMPRESS_DISABLED}}" checked>
                    <label for="COMPRESS_DISABLED"> {{tr('no')}} </label>
                </div>
            </div>
        </div>
    </div>
    <div class="clearfix"></div>
    <div style="margin-bottom: 10px;">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="checkbox checkbox-inline checkbox-primary">
                    <input type="checkbox" value="1" name="send_notification" @if(!$model->id) checked @endif id="send_notification">
                    <label for="send_notification">{{tr('send_notification')}}</label>
                </div>
            </div>
        </div>
    </div>
    <!-- select image section -->
    <div>
        <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-4 image-upload">
                <h3 class="bg bg-primary" style="width:300px; padding: 10px;">Upload Image</h3>
                <label>{{tr('default_image')}} <span class="asterisk"><i class="fa fa-asterisk"></i></span> </label>
                <input type="hidden" name="poster" id="poster">
                <input type="file" id="default_image" accept="image/png, image/jpeg, image/jpg" name="default_image" placeholder="{{tr('default_image')}}" style="display:none" onchange="loadFile(this,'default_img')">
                <img src="{{$model->default_image ? $model->default_image : asset('images/default.png')}}" onclick="$('#default_image').click();return false;" id="default_img">
                <!-- <div id="default_image"></div> -->
                <p class="img-note">{{tr('video_image_validate')}} {{tr('rectangle_image')}}</p>
                <label>Image Type<span class="asterisk"><i class="fa fa-asterisk"></i></span> </label>
                <select required name="image_type" class="form-control">
                    <option value=""></option>
                    <option @if($model->is_home_slider==1) selected @endif value="is_home_slider">Home Slider</option>
                    <option @if($model->is_banner==1) selected @endif value="is_banner"> Banner</option>
                </select>
            </div>
            <div class="clearfix"></div>
            @if(Setting::get('admin_delete_control') == 1)
            <button disabled class="btn  btn-primary finish-btn" type="submit" id="finish_video"><i class="fa fa-arrow-right" aria-hidden="true"></i> &nbsp; Finish</button>
            @else
            <button class="btn  btn-primary finish-btn" type="submit" id="finish_video"><i class="fa fa-arrow-right" aria-hidden="true"></i> &nbsp; Finish</button>
            @endif
            <div class="progress" style="margin-right: 10px; margin-top: 8px;">
                <div class="bar"></div>
                <div class="percent">0%</div>
            </div>
        </div>
    </div>