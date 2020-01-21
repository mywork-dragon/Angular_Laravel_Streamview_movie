@extends('layouts.admin')
@section('title', tr('view_videos'))
@section('content-header')
{{tr('view_videos')}}
@endsection
@section('breadcrumb')
    <li><a href="{{route('admin.dashboard')}}"><i class="fa fa-dashboard"></i>{{tr('home')}}</a></li>
    <li class="active"><i class="fa fa-video-camera"></i> {{tr('view_videos')}}</li>
@endsection
@section('content')
    @include('notification.notify')
    @if($category || $sub_category || $genre || isset($moderator_details))
	    <div class="row">
	    	<div class="col-xs-12">
	    		@if($category)
	    			<p class="text-uppercase">{{tr('category')}} - {{$category ? $category->name : "-" }}</p>
	    		@endif
	    		@if($sub_category)
	    			<p class="text-uppercase">{{tr('sub_category')}} - {{$sub_category ? $sub_category->name : "-" }}</p>
	    		@endif
	    		@if($genre)
	    			<p class="text-uppercase">{{tr('genre')}} - {{$genre ? $genre->name : "-"}}</p>
	    		@endif
	    		@if(isset($moderator_details))
	    			@if($moderator_details)<p class="text-uppercase">{{tr('moderator')}} - {{$moderator_details->name}}</p>@endif
	    		@endif
	    	</div>
	    </div>
    @endif
	<div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
          	<div class="box-header label-primary">
                <b style="font-size:18px;">{{tr('view_videos')}}</b>
                <a href="{{route('admin.videos.create')}}" class="btn btn-default pull-right">{{tr('add_video')}}</a>
                 <!-- EXPORT OPTION START -->
                @if(count($videos) > 0 )
	                <ul class="admin-action btn btn-default pull-right" style="margin-right: 20px">
						<li class="dropdown">
			                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
			                  {{tr('export')}} <span class="caret"></span>
			                </a>
			                <ul class="dropdown-menu">
			                  	<li role="presentation">
			                  		<a role="menuitem" tabindex="-1" href="{{route('admin.videos.export' , ['format' => 'xls'])}}">
			                  			<span class="text-red"><b>{{tr('excel_sheet')}}</b></span>
			                  		</a>
			                  	</li>
			                  	<li role="presentation">
			                  		<a role="menuitem" tabindex="-1" href="{{route('admin.videos.export' , ['format' => 'csv'])}}">
			                  			<span class="text-blue"><b>{{tr('csv')}}</b></span>
			                  		</a>
			                  	</li>
			                </ul>
						</li>
					</ul>
				@endif
                <!-- EXPORT OPTION END -->
            </div>
            <div class="box-body">
            	<div class=" table-responsive"> 
					<form action="{{route('admin.videos')}}" class="form" >
						<button type="submit" class="btn btn-success" style="float:right; margin-left:10px" >search</button>
						<input type="text" placeholder="search" style="float:right" class="input" name="search" value="{{session('search')}}">
					</form>
            	@if(count($videos) > 0)
	              	<table id="" class="table table-bordered table-striped">
							<thead>
						    <tr>
							  <th onclick="sort(this)" style="cursor:pointer" id="{{tr('id')}}">{{tr('id')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('id'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('id')}}" style="float:right; cursor:pointer"></span></th>
						      <th onclick="sort(this)" style="cursor:pointer" id="{{tr('title')}}">{{tr('title')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('title'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('title')}}" style="float:right; cursor:pointer"></i></th>
						      <th onclick="sort(this)" style="cursor:pointer" id="{{tr('revenue')}}">{{tr('revenue')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('revenue'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('revenue')}}" style="float:right; cursor:pointer"></i></th>
						      @if(Setting::get('is_payper_view'))
						      	<th onclick="sort(this)" style="cursor:pointer" id="{{tr('ppv')}}">{{tr('ppv')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('ppv'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('ppv')}}" style="float:right; cursor:pointer"></i></th>
						      @endif
						       <th onclick="sort(this)" style="cursor:pointer" id="{{tr('category')}}">{{tr('category')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('category'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('category')}}" style="float:right; cursor:pointer"></i></th>
						      <th onclick="sort(this)" style="cursor:pointer" id="{{tr('sub_category')}}">{{tr('sub_category')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('sub_category'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('sub_category')}}" style="float:right; cursor:pointer"></i></th>
						      <th onclick="sort(this)" style="cursor:pointer" id="{{tr('genre_name')}}">{{tr('genre_name')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('genre_name'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('genre_name')}}" style="float:right; cursor:pointer"></i></th>
						      <th onclick="sort(this)" style="cursor:pointer" id="{{tr('viewers_cnt')}}">{{tr('viewers_cnt')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('viewers_cnt'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('viewers_cnt')}}" style="float:right; cursor:pointer"></i></th>
						      <th onclick="sort(this)" style="cursor:pointer" id="{{tr('is_banner')}}">{{tr('is_banner')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('is_banner'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('is_banner')}}" style="float:right; cursor:pointer"></i></th>
						      <th onclick="sort(this)" style="cursor:pointer" id="{{tr('position')}}">{{tr('position')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('position'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('position')}}" style="float:right; cursor:pointer"></i></th>
						      @if(Setting::get('theme') == 'default')
						      	<th onclick="sort(this)" style="cursor:pointer" id="{{tr('slider_video')}}">{{tr('slider_video')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('slider_video'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('slider_video')}}" style="float:right; cursor:pointer"></i></th>
						      @endif
						      <th onclick="sort(this)" style="cursor:pointer" id="{{tr('uploaded_by')}}">{{tr('uploaded_by')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('uploaded_by'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('uploaded_by')}}" style="float:right; cursor:pointer"></i></th>
						      <th onclick="sort(this)" style="cursor:pointer" id="{{tr('status')}}">{{tr('status')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('status'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('status')}}" style="float:right; cursor:pointer"></i></th>
						       <th onclick="sort(this)" style="cursor:pointer" id="{{tr('action')}}">{{tr('action')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']==tr('action'))?"":"-alt"?>" onclick="sort(this)" id="{{tr('action')}}" style="float:right; cursor:pointer"></i></th>
						    </tr>
						</thead>
						<tbody>
							@foreach($videos as $i => $video)
							    <tr>
							      	<td>{{showEntries($_GET, $i+1)}}</td>
							      	<td><a href="{{route('admin.view.video' , array('id' => $video->video_id))}}">{{substr($video->title , 0,25)}}...</a></td>
							      	<td>{{Setting::get('currency')}} {{$video->admin_amount ? $video->admin_amount : "0.00"}}</td>
							      	@if(Setting::get('is_payper_view'))
							      	<td class="text-center">
							      		@if($video->amount > 0)
							      			<span class="label label-success">{{tr('yes')}}</span>
							      		@else
							      			<span class="label label-danger">{{tr('no')}}</span>
							      		@endif
							      	</td>
							      	@endif
							      	<td>{{$video->category_name}}</td>
							      	<td>{{ category($video->sub_category_id) }}</td>
							      	<td>{{$video->genre_name ? $video->genre_name : '-'}}</td>
							      	<td>{{number_format_short($video->watch_count)}}</td>
							      	<td class="text-center">
							      		@if($video->is_banner == BANNER_VIDEO)
							      			<span class="label label-success">{{tr('yes')}}</span>
							      		@else
							      			<span class="label label-danger">{{tr('no')}}</span>
							      		@endif
							      	</td>
							      	<td>
							      		@if ($video->genre_id > 0)
								      		@if($video->position > 0)
									      	<span class="label label-success">{{$video->position}}</span>
									      	@else
									      	<span class="label label-danger">{{$video->position}}</span>
									      	@endif
									    @else
									    	<span class="label label-warning">{{tr('not_genre')}}</span>
									    @endif
							      	</td>
							      	@if(Setting::get('theme') == 'default')
							      	<td>
							      		@if($video->is_home_slider == 0 && $video->is_approved && $video->status)
							      			<a href="{{route('admin.slider.video' , $video->video_id)}}"><span class="label label-danger">{{tr('set_slider')}}</span></a>
							      		@elseif($video->is_home_slider)
							      			<span class="label label-success">{{tr('slider')}}</span>
							      		@else
							      			-
							      		@endif
							      	</td>
							      	@endif
							      	<td>
							      		@if(is_numeric($video->uploaded_by))
							      			<a href="{{route('admin.moderator.view',$video->uploaded_by)}}">{{$video->moderator ? $video->moderator->name : ''}}</a>
							      		@else 
							      			{{$video->uploaded_by}}
							      		@endif
							      	</td>
							      	<td>
							      		@if ($video->compress_status < OVERALL_COMPRESS_COMPLETED)
							      			<span class="label label-danger">{{tr('compress')}}</span>
							      		@else
								      		@if($video->is_approved)
								      			<span class="label label-success">{{tr('approved')}}</span>
								       		@else
								       			<span class="label label-warning">{{tr('pending')}}</span>
								       		@endif
								       	@endif
							      	</td>
								    <td>
            							<ul class="admin-action btn btn-default">
            								<li class="{{ $i < 5 ? 'dropdown' : 'dropup'}}">
								                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
								                  {{tr('action')}} <span class="caret"></span>
								                </a>
								                <ul class="dropdown-menu dropdown-menu-left">
								                	@if ($video->compress_status >= OVERALL_COMPRESS_COMPLETED)
								                  	<li role="presentation">
                                                        @if(Setting::get('admin_delete_control'))
                                                            <a role="button" href="javascript:;" class="btn disabled" style="text-align: left">{{tr('edit')}}</a>
                                                        @else
                                                            <a role="menuitem" tabindex="-1" href="{{route('admin.videos.edit' , array('id' => $video->video_id))}}">{{tr('edit')}}</a>
                                                        @endif
                                                    </li>
                                                    @endif
								                  	<li role="presentation"><a role="menuitem" tabindex="-1"  href="{{route('admin.view.video' , array('id' => $video->video_id))}}">{{tr('view')}}</a></li>
								                  	<!-- <li role="presentation"><a role="menuitem" href="{{route('admin.gif_generator' , array('video_id' => $video->video_id))}}">{{tr('generate_gif_image')}}</a></li> -->
								                  @if ($video->genre_id > 0 && $video->is_approved && $video->status)
								                  	<li role="presentation">
								                		<a role="menuitem" tabindex="-1" role="menuitem" tabindex="-1" data-toggle="modal" data-target="#video_{{$video->video_id}}">{{tr('change_position')}}</a>
								                	</li>
								                	@endif
								                  	@if ($video->compress_status >= OVERALL_COMPRESS_COMPLETED)
								                  		@if($video->is_approved && $video->status)
									                  	<li class="divider" role="presentation"></li>
								                  		<li role="presentation">
								                  			<a role="menuitem" tabindex="-1" data-toggle="modal" data-target="#banner_{{$video->video_id}}">
								                  				{{tr('mobile_banner_video')}}
								                  				@if($video->is_banner == BANNER_VIDEO)
								                  				<span class="text-green"><i class="fa fa-check-circle"></i></span>
								                  				@endif
								                  			</a>
								                  		</li>
								                  		@endif
								                  	@endif
								                  	@if ($video->compress_status >= OVERALL_COMPRESS_COMPLETED)
								                  		@if($video->is_approved && $video->status)
									                  	<li class="divider" role="presentation"></li>
								                  		<li role="presentation">
								                  			<a role="menuitem" href="{{ url('admin/change_slider/'.$video->video_id)}}" onclick="return confirm('Do you want to change it as home slider')">
								                  				Home Slider
								                  				@if($video->is_home_slider == 1)
								                  				<span class="text-green"><i class="fa fa-check-circle"></i></span>
								                  				@endif
								                  			</a>
								                  		</li>
								                  		@endif
								                  	@endif
								                  	@if(Setting::get('is_payper_view'))
								                  		<li role="presentation">
								                  			<a role="menuitem" tabindex="-1" data-toggle="modal" data-target="#{{$video->video_id}}">
								                  				{{tr('ppv')}}
								                  				@if($video->amount > 0)
								                  				<span class="text-green pull-right"><i class="fa fa-check-circle"></i></span>
								                  				@endif
								                  			</a>
								                  		</li>
								                  	@endif
								                  	<li class="divider" role="presentation"></li>
								                  	@if($video->is_approved == VIDEO_APPROVED)
								                		<li role="presentation"><a role="menuitem" tabindex="-1" href="{{route('admin.video.decline',$video->video_id)}}">{{tr('decline')}}</a></li>
								                	@else
								                		@if ($video->compress_status < OVERALL_COMPRESS_COMPLETED)
								                			<li role="presentation">
								                				<a href="{{route(
								                				'admin.compress.status', ['id'=>$video->video_id])}}" role="menuitem" tabindex="-1">
								                					{{tr('do_compression_in_background')}}
								                				</a>
								                			</li>
								                		@else 
								                  			<li role="presentation"><a role="menuitem" tabindex="-1" href="{{route('admin.video.approve',$video->video_id)}}">{{tr('approve')}}</a></li>
								                  		@endif
								                  	@endif
								                  	@if ($video->compress_status >= OVERALL_COMPRESS_COMPLETED)
									                  	<li role="presentation">
									                  		@if(Setting::get('admin_delete_control'))
										                  	 	<a role="button" href="javascript:;" class="btn disabled" style="text-align: left">{{tr('delete')}}</a>
										                  	@else
									                  			<a role="menuitem" tabindex="-1" onclick="return confirm('Are you sure want to delete video? Remaining video positions will Rearrange')" href="{{route('admin.delete.video' , array('id' => $video->video_id))}}">{{tr('delete')}}</a>
									                  		@endif
									                  	</li>
								                  	@endif
								                  	@if($video->status == 0)
								                  		<li role="presentation"><a role="menuitem" tabindex="-1" href="{{route('admin.video.publish-video',$video->video_id)}}">{{tr('publish')}}</a></li>
								                  	@endif
								                </ul>
              								</li>
            							</ul>
								    </td>
							    </tr>
								<!-- PPV Modal Popup-->
								<div id="{{$video->video_id}}" class="modal fade" role="dialog">
								  	<div class="modal-dialog">
									  	<form action="{{route('admin.save.video-payment', $video->video_id)}}" method="POST">
										    <!-- Modal content-->
										   	<div class="modal-content">
										      	<div class="modal-header">
										        	<button type="button" class="close" data-dismiss="modal">&times;</button>
										        	<h4 class="modal-title text-uppercase">
										        		<b>{{tr('pay_per_view')}}</b>
										        		@if($video->amount > 0)
						                  					<span class="text-green"><i class="fa fa-check-circle"></i></span>
						                  				@endif
										        	</h4>
										      	</div>
										   		<div class="modal-body">
											        <div class="row">
											        	<input type="hidden" name="ppv_created_by" id="ppv_created_by" value="{{Auth::guard('admin')->user()->name}}">
											        	<div class="col-lg-12">
											        		<label class="text-uppercase">{{tr('video')}}</label>
											        	</div>
											        	<div class="col-lg-12">
											        		<p>{{$video->title}}</p>
											        	</div>
											        	<div class="col-lg-12">
											        		<label class="text-uppercase">{{tr('type_of_user')}} *</label>
											        	</div>
										                <div class="col-lg-12">
										                  	<div class="input-group">
										                        <input type="radio" name="type_of_user" value="{{NORMAL_USER}}" {{($video->type_of_user == 0 || $video->type_of_user == '') ? 'checked' : (($video->type_of_user == NORMAL_USER) ? 'checked' : '')}}>&nbsp;<label class="text-normal">{{tr('normal_user')}}</label>&nbsp;
										                        <input type="radio" name="type_of_user" value="{{PAID_USER}}" {{($video->type_of_user == PAID_USER) ? 'checked' : ''}}>&nbsp;<label class="text-normal">{{tr('paid_user')}}</label>&nbsp;
										                        <input type="radio" name="type_of_user" value="{{BOTH_USERS}}" {{($video->type_of_user == BOTH_USERS) ? 'checked' : ''}}>&nbsp;<label class="text-normal">{{tr('both_user')}}</label>
										                  	</div>
										                  	<!-- /input-group -->
										                </div>
										            </div>
										            <br>
										            <div class="row">
											        	<div class="col-lg-12">
											        		<label class="text-uppercase">{{tr('type_of_subscription')}} *</label>
											        	</div>
										                <div class="col-lg-12">
										                  <div class="input-group">
										                        <input type="radio" name="type_of_subscription" value="{{ONE_TIME_PAYMENT}}" {{($video->type_of_subscription == 0 || $video->type_of_subscription == '') ? 'checked' : (($video->type_of_subscription == ONE_TIME_PAYMENT) ? 'checked' : '')}}>&nbsp;<label class="text-normal">{{tr('one_time_payment')}}</label>&nbsp;
										                        <input type="radio" name="type_of_subscription" value="{{RECURRING_PAYMENT}}" {{($video->type_of_subscription == RECURRING_PAYMENT) ? 'checked' : ''}}>&nbsp;<label class="text-normal">{{tr('recurring_payment')}}</label>
										                  </div>
										                  <!-- /input-group -->
										                </div>
										            </div>
										            <br>
										            <div class="row">
											        	<div class="col-lg-12">
											        		<label class="text-uppercase">{{tr('amount')}} *</label>
											        	</div>
										                <div class="col-lg-12">
										                    <input type="number" required value="{{$video->amount}}" name="amount" class="form-control" id="amount" placeholder="{{tr('amount')}}" step="any">
										                </div>
										            </div>
											    </div>
										      	<div class="modal-footer">
											      	<div class="pull-left">
											      		@if($video->amount > 0)
											       			<a class="btn btn-danger" href="{{route('admin.remove_pay_per_view', $video->video_id)}}" onclick="return confirm(&quot;{{tr('remove_ppv_confirmation')}}&quot;);">
											       				{{tr('remove_pay_per_view')}}
											       			</a>
											       		@endif
											       	</div>
											        <div class="pull-right">
												        <button type="button" class="btn btn-default" data-dismiss="modal">{{tr('close')}}</button>
												        <button type="submit" class="btn btn-primary" onclick="return confirm(&quot;{{tr('set_ppv_confirmation')}}&quot;);">{{tr('submit')}}</button>
												    </div>
											    	<div class="clearfix"></div>
										      	</div>
										    </div>
										</form>
								  </div>
								</div>
								@if ($video->compress_status >= OVERALL_COMPRESS_COMPLETED && $video->is_approved && $video->status)
								<!-- Modal -->
								<div id="banner_{{$video->video_id}}" class="modal fade" role="dialog">
								  	<div class="modal-dialog">
										<form action="{{route('admin.banner.set', ['admin_video_id'=>$video->video_id])}}" method="POST" enctype="multipart/form-data">
										    <!-- Modal content-->
										   	<div class="modal-content">
										      	<div class="modal-header">
										        	<button type="button" class="close" data-dismiss="modal">&times;</button>
										        	<h4 class="modal-title">{{tr('set_banner_image')}}</h4>
										      	</div>
										      	<div class="modal-body">
											        <div class="row">
											    		<div class="col-lg-12">
											    			<p class="text-blue text-uppercase">
											    				{{ tr('banner_video_notes') }}
											    			</p>
											    		</div>
											    		<div class="col-lg-12">
											    			<p>{{$video->title}}</p>
											    		</div>
											        	<div class="col-lg-12">
											        		<label>{{tr('picture')}} *</label>
											        		<p class="help-block">{{tr('image_validate')}} {{tr('rectangle_image')}}</p>
											        	</div>
											            <div class="col-lg-12">
											              <div class="input-group">
											                    <input type="file" id="banner_image_file_{{$video->video_id}}" accept="image/png,image/jpeg" name="banner_image" placeholder="{{tr('banner_image')}}" style="display:none" onchange="loadFile(this,'banner_image_{{$video->video_id}}')" />
											                    <div>
											                        <img src="{{($video->is_banner) ? $video->banner_image : asset('images/320x150.png')}}" style="width:300px;height:150px;" 
											                        onclick="$('#banner_image_file_{{$video->video_id}}').click();return false;" id="banner_image_{{$video->video_id}}" style="cursor: pointer;" />
											                    </div>
											              </div>
											              <!-- /input-group -->
											            </div>
											        </div>
										        	<br>
										      	</div>
										      	<div class="modal-footer">
											      	@if($video->is_banner == BANNER_VIDEO)
											      	<div class="pull-left">
											      		<?php $remove_banner_image_notes = tr('remove_banner_image_notes');?>
											          	<a onclick="return confirm('{{$remove_banner_image_notes}}')" role="menuitem" tabindex="-1" href="{{route('admin.banner.remove',['admin_video_id'=>$video->video_id])}}" class="btn btn-danger">{{tr('remove_banner_image')}}</a>
											      	</div>
											      	@endif
											        <div class="pull-right">
												        <button type="button" class="btn btn-default" data-dismiss="modal">{{tr('close')}}</button>
												        <button type="submit" class="btn btn-primary" onclick="return confirm(&quot;{{tr('set_banner_image_confirmation')}}&quot;);">{{tr('submit')}}</button>
												    </div>
											    	<div class="clearfix"></div>
										     	</div>
										    </div>
										</form>
								  	</div>
								</div>
								@endif
								@if ($video->genre_id > 0 && $video->is_approved && $video->status)
								<div id="video_{{$video->video_id}}" class="modal fade" role="dialog">
								  <div class="modal-dialog">
								  <form action="{{route('admin.save.video.position',['video_id'=>$video->video_id])}}" method="POST">
									    <!-- Modal content-->
									   	<div class="modal-content">
									      <div class="modal-header">
									        <button type="button" class="close" data-dismiss="modal">&times;</button>
									        <h4 class="modal-title">{{tr('change_position')}}</h4>
									      </div>
									      <div class="modal-body">
								            <div class="row">
									        	<div class="col-lg-3">
									        		<label>{{tr('position')}}</label>
									        	</div>
								                <div class="col-lg-9">
								                       <input type="number" required value="{{$video->position}}" name="position" class="form-control" id="position" placeholder="{{tr('position')}}" pattern="[0-9]{1,}" title="Enter 0-9 numbers">
								                  <!-- /input-group -->
								                </div>
								            </div>
									      </div>
									      <div class="modal-footer">
									        <div class="pull-right">
										        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
										        <button type="submit" class="btn btn-primary">{{tr('submit')}}</button>
										    </div>
										    <div class="clearfix"></div>
									      </div>
									    </div>
									</form>
								  </div>
								</div>
								@endif
							@endforeach
						</tbody>
					</table>
					<div align="right" id="paglink">
						<?php 
							echo $videos->appends(['category_id' => isset($_GET['category_id']) ? $_GET['category_id'] : 0 , 'sub_category_id' => isset($_GET['sub_category_id']) ? $_GET['sub_category_id'] : 0 , 'genre_id' => isset($_GET['genre_id']) ? $_GET['genre_id'] : 0 , 'moderator_id' => isset($_GET['moderator_id']) ? $_GET['moderator_id'] : 0])->links(); 
						?>
					</div>
				@else
					<h3 class="no-result">{{tr('no_video_found')}}</h3>
				@endif
				</div>
            </div>
          </div>
        </div>
    </div>
@endsection
@section('scripts')
<script type="text/javascript">
function loadFile(event, id){
    // alert(event.files[0]);
    var reader = new FileReader();
    reader.onload = function(){
      var output = document.getElementById(id);
      // alert(output);
      output.src = reader.result;
       //$("#imagePreview").css("background-image", "url("+this.result+")");
    };
    reader.readAsDataURL(event.files[0]);
}
// window.setTimeout(function() {
// 	$(".sidebar-toggle").click();
// }, 1000);
</script>
<script>
	function sort(data){
		var search = "<?php echo session('search');?>";console.log(search);
		var sort = data.id;console.log(sort);
		var direction = "<?php echo session('direction');?>";
		if(direction == "asc")
			{
				direction = "desc"
			}
		else{
			direction = "asc"
		}
		window.location.href="https://admin.flashington.com/admin/videos?search="+search+"&sort="+sort+"&direction="+direction;
	}
</script>
@endsection