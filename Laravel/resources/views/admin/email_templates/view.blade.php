@extends('layouts.admin')
@section('title', tr('view_template'))
@section('content-header', tr('view_template'))
@section('breadcrumb')
    <li><a href="{{route('admin.dashboard')}}"><i class="fa fa-dashboard"></i>{{tr('home')}}</a></li>
    <li><a href="{{route('admin.templates')}}"><i class="fa fa-envelope"></i> {{tr('email_templates')}}</a></li>
    <li class="active"><i class="fa fa-eye"></i>&nbsp;{{tr('view_template')}}</li>
@endsection
@section('content')
	@include('notification.notify')
	<div class="row">
        <div class="col-xs-12">
            <div class="panel">
                <div class="panel-body">
                    <div class="post">
                        <div class="user-block">
                            <div class="pull-left">
                                <span class="username" style="margin-left: 0px;">
                                    <a href="">{{getTemplateName($model->template_type)}}</a> 
                                </span>
                            </div>
                            <div class="pull-right">
                                <a href="{{route('admin.edit.template', array('id'=>$model->id))}}" class="btn btn-warning btn-sm"><i class="fa fa-pencil"></i> {{tr('edit')}}</a>
                            </div>
                        </div>
                        <hr>
                        <div class="row margin-bottom">  
                            <div class="col-sm-12">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="header">
                                            <h4><b>{{tr('subject')}}</b></h4>
                                            <p>{{$model->subject}}</p>
                                        </div>
                                    </div>
                                    <div class="col-sm-12">
                                        <h3><b>{{tr('content')}}</b></h3>
                                        <p><?= $model->description ?></p>
                                    </div>
                            	</div>
                       		</div>
                    	</div>
                	</div>
            	</div>
        	</div>
    	</div>
    </div>
@endsection
