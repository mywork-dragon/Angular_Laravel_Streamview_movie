@extends('layouts.admin')
@section('title', tr('cast_crews'))
@section('content-header', tr('cast_crews'))
@section('breadcrumb')
    <li><a href="{{route('admin.dashboard')}}"><i class="fa fa-dashboard"></i>{{tr('home')}}</a></li>
    <li class="active"><i class="fa fa-users"></i> {{tr('cast_crews')}}</li>
@endsection
@section('content')
	@include('notification.notify')
	<div class="row">
        <div class="col-xs-12">
          	<div class="box box-primary">
	          	<div class="box-header label-primary">
	                <b style="font-size:18px;">{{tr('cast_crews')}}</b>
	                <a href="{{route('admin.cast_crews.add')}}" class="btn btn-default pull-right">{{tr('add_cast_crew')}}</a>
	            </div>
	            <div class="box-body">
					<form action="{{route('admin.cast_crews.index')}}" class="form" >
						<button type="submit" class="btn btn-success" style="float:right; margin-left:10px" >search</button>
						<input type="text" placeholder="search" style="float:right" class="input" name="search" value="{{session('cast_crew_search')}}">
					</form>
	              	<table id="" class="table table-bordered table-striped">
						<thead>
						    <tr>
						      <th onclick="sort(this)" id="id" style="cursor:pointer">{{tr('id')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']=='id')?"":"-alt"?>" onclick="sort(this)" id="id" style="float:right;cursor:pointer"></i></th>
						      <th onclick="sort(this)" id="name" style="cursor:pointer">{{tr('name')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']=='name')?"":"-alt"?>" onclick="sort(this)" id="name" style="float:right;cursor:pointer"></i></th>
						      <th onclick="sort(this)" id="position" style="cursor:pointer">Position<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']=='position')?"":"-alt"?>" onclick="sort(this)" id="position" style="float:right;cursor:pointer"></i></th>
						      <th onclick="sort(this)" id="image" style="cursor:pointer">{{tr('image')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']=='image')?"":"-alt"?>" onclick="sort(this)" id="image" style="float:right;cursor:pointer"></i></th>
						      <th onclick="sort(this)" id="status" style="cursor:pointer">{{tr('status')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']=='status')?"":"-alt"?>" onclick="sort(this)" id="status" style="float:right;cursor:pointer"></i></th>
						      <th style="cursor:pointer">{{tr('action')}}<span class="glyphicon glyphicon-sort-by-attributes<?= (!isset($_GET['sort']))||($_GET['direction']=="asc")&&($_GET['sort']=='action')?"":"-alt"?>" style="float:right;cursor:pointer"></i></th>
						    </tr>
						</thead>
						<tbody>
							@foreach($model as $i => $data)
							    <tr>
							      	<td>{{showEntries($_GET, $i+1)}}</td>
							      	<td>{{$data->name}}</td>
							        @if($data->position==1)  <td>Actor</td> @endif
                                      @if($data->position==2)  <td>Director</td> @endif
                                      @if($data->position==3)  <td>Writer</td> @endif
                                      @if($data->position==4)  <td>Genre</td> @endif
							      	<td>
	                                	<img style="height: 30px;" src="{{$data->image}}">
	                            	</td>
	                            		<td>
											      	@if($data->status)
											      		<span class="label label-success">{{tr('approve')}}</span>
											      	@else
											      		<span class="label label-warning">{{tr('pending')}}</span>
											      	@endif
										     	</td>
							      <td>
	        							<ul class="admin-action btn btn-default">
	        								<li class="dropup">
								                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
								                  {{tr('action')}} <span class="caret"></span>
								                </a>
								                <ul class="dropdown-menu dropdown-menu-right">
								                  	<li role="presentation">
	                                                    @if(Setting::get('admin_delete_control'))
	                                                        <a role="button" href="javascript:;" class="btn disabled" style="text-align: left">{{tr('edit')}}</a>
	                                                    @else
	                                                        <a role="menuitem" tabindex="-1" href="{{route('admin.cast_crews.edit' , array('id' => $data->unique_id))}}">{{tr('edit')}}</a>
	                                                    @endif
	                                                </li>
	                                                <li role="presentation">
	                                                    @if(Setting::get('admin_delete_control'))
	                                                        <a role="button" href="javascript:;" class="btn disabled" style="text-align: left">{{tr('view')}}</a>
	                                                    @else
	                                                        <a role="menuitem" tabindex="-1" href="{{route('admin.cast_crews.view' , array('id' => $data->unique_id))}}">{{tr('view')}}</a>
	                                                    @endif
	                                                </li>
	                                                <li role="presentation">
	                                                	<?php $decline_msg = tr('decline_cast_crews');?>
														@if($data->status == 0)
														<a class="menuitem" tabindex="-1" href="{{route('admin.cast_crews.status',['id'=>$data->unique_id])}}" onclick="return confirm('Are You Sure?')">{{tr('approve')}} </a>
														@else
														<a class="menuitem" tabindex="-1" href="{{route('admin.cast_crews.status',['id'=>$data->unique_id])}}" onclick="return confirm('{{$decline_msg}}')">{{tr('decline')}}</a>
														@endif
													</li>
								                  	<li role="presentation">
									                  	@if(Setting::get('admin_delete_control'))
										                  	<a role="button" href="javascript:;" class="btn disabled" style="text-align: left">{{tr('delete')}}</a>
										                @else
								                  			<a role="menuitem" tabindex="-1" onclick="return confirm(&quot;{{tr('category_delete_confirmation' , $data->name)}}&quot;);" href="{{route('admin.cast_crews.delete' , array('id' => $data->unique_id))}}">{{tr('delete')}}</a>
								                  		@endif
								                  	</li>
								                </ul>
	          								</li>
	        							</ul>
							      </td>
							    </tr>
							@endforeach
						</tbody>
					</table>
					@if(count($model) > 0) <div align="right" id="paglink"><?php echo $model->links(); ?></div> @endif
	            </div>
          	</div>
        </div>
    </div>
<script>
	function sort(data){
		var search = "<?php echo session('cast_crew_search');?>";console.log(search);
		var sort = data.id;
		var direction = "<?php echo session('direction');?>";
		if(direction == "asc")
			{
				direction = "desc"
			}
		else{
			direction = "asc"
		}
		window.location.href="https://admin.flashington.com/admin/cast-crews/index?search="+search+"&sort="+sort+"&direction="+direction;
	}
</script>
@endsection
