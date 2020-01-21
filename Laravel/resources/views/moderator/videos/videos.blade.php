@extends('layouts.moderator')
@section('title', tr('videos'))
@section('content-header') 
{{tr('videos') }}
<a href="#" id="help-popover" class="btn btn-danger" style="font-size: 14px;font-weight: 600;border-radius:50%" title="Any Help ?"><i class="fa fa-question"></i></a>
<div id="help-content" style="display: none">
	<!-- <h5>Usage : This section used to display the payment details of the PPV.</h5> -->
    <ul class="popover-list">
        <li><b>{{tr('ppv')}} - </b> {{tr('pay_per_view')}}</li>
        <li><b>{{tr('watch_count_revenue')}} - </b> {{tr('revenue_details_view_count')}} </li>
        <li><b>{{tr('ppv_revenue')}} - </b> {{tr('revenue_based_ppv')}}</li>
        <li><b>{{tr('edit_video')}} - </b> {{tr('click_action')}}</li>
        <li><b>{{tr('view_video')}} - </b> {{tr('click_title_action')}}  </li>
        <li><b>Set {{tr('ppv')}} - </b> {{tr('click_action')}}</li>
        <li><b>{{tr('ppv')}} - </b> {{tr('click_action')}}</li>
    </ul>
</div>
@endsection
@section('breadcrumb')
    <li><a href="{{route('moderator.dashboard')}}"><i class="fa fa-dashboard"></i>{{tr('home')}}</a></li>
    <li class="active"><i class="fa fa-video-camera"></i> {{tr('videos')}}</li>
@endsection
@section('content')
    @include('notification.notify')
	<div class="row">
        <div class="col-xs-12">
          	<div class="box box-primary">
	          	<div class="box-header label-primary">
	                <b style="font-size:18px;">{{tr('videos')}}</b>
	                <a href="{{route('moderator.videos.create')}}" class="btn btn-default pull-right">{{tr('add_video')}}</a>
	            </div>
	            <div class="box-body">
	            	<div class="table table-responsive" style="padding: 35px 0px">
	            	@if(count($videos) > 0)
		              	<table id="example1" class="table table-bordered table-striped">
							<thead>
							    <tr>
							      	<th>{{tr('id')}}</th>
							      	<th>{{tr('title')}}</th>
							      	<th>{{tr('ppv')}} {{Setting::get('currency')}}</th>
							      	@if(Setting::get('is_payper_view')) <th>{{tr('ppv')}}</th> @endif
							      	<th>{{tr('category')}}</th>
							      	<th>{{tr('sub_category')}}</th>
							      	<th>{{tr('viewers_cnt')}}</th>
							      	<th>{{tr('viewers_cnt')}} {{Setting::get('currency')}}</th>
							      	<th>{{tr('status')}}</th>
							      	<th>{{tr('action')}}</th>
							    </tr>
							</thead>
							<tbody>
								@foreach($videos as $i => $video)
								    <tr>
								      	<td>{{$i+1}}</td>
								      	<td>
								      		<a href="{{route('moderator.view.video' , array('id' => $video->video_id))}}"> {{substr($video->title , 0,25)}}...</a>
								      	</td>
								      	<td>{{Setting::get('currency')}} {{$video->user_amount}}</td>
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
								      	<td>{{$video->sub_category_name}}</td>
								      	<td>{{$video->watch_count}}</td>
								      	<td>{{Setting::get('currency')}} {{$video->redeem_amount}}</td>
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
	            								<li class="dropdown">
									                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
									                  {{tr('action')}} <span class="caret"></span>
									                </a>
									                <ul class="dropdown-menu">
									                	@if ($video->compress_status >= OVERALL_COMPRESS_COMPLETED)
									                  	<li role="presentation"><a role="menuitem" tabindex="-1" href="{{route('moderator.videos.edit' , array('id' => $video->video_id))}}">{{tr('edit_video')}}</a></li>
									                  	@endif
									                  	<li role="presentation"><a role="menuitem" tabindex="-1" target="_blank" href="{{route('moderator.view.video' , array('id' => $video->video_id))}}">{{tr('view_video')}}</a></li>
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
									                </ul>
	              								</li>
	            							</ul>
									    </td>
								    </tr>
									<!-- PPV MODEL POPUP START -->
								    <div id="{{$video->video_id}}" class="modal fade" role="dialog">
									  	<div class="modal-dialog">
										  	<form action="{{route('moderator.save.video-payment', $video->video_id)}}" method="POST">
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
											      		<input type="hidden" name="ppv_created_by" id="ppv_created_by" value="{{Auth::guard('moderator')->user()->id}}">
												        <div class="row">
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
												       			<a class="btn btn-danger" href="{{route('moderator.remove_pay_per_view', $video->video_id)}}" onclick="return confirm(&quot;{{tr('remove_ppv_confirmation')}}&quot;);">{{tr('remove_pay_per_view')}}</a>
												       		@endif
												       	</div>
											       		<div class="pull-right">
												        	<button type="button" class="btn btn-default" data-dismiss="modal">{{tr('close')}}</button>
												        	<button type="submit" class="btn btn-primary">{{tr('submit')}}</button>
												    	</div>
												    	<div class="clearfix"></div>
											      	</div>
											    </div>
											</form>
									  	</div>
									</div>
									<!-- PPV MODEL POPUP END -->
								@endforeach
							</tbody>
						</table>
					@else
						<h3 class="no-result">{{tr('no_result_found')}}</h3>
					@endif
					</div>
	            </div>
          	</div>
        </div>
    </div>
@endsection
