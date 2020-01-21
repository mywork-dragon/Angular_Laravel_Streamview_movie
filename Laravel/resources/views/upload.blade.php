@extends('layouts.user')
@section('content')
	<div class="row" style="margin-top:10px;margin-bottom:10px;min-height:500px;">
<form method="post" action="" enctype="multipart/form-data">
    {{ csrf_field() }}
    <h1>Upload</h1>
    <label>
        Upload a file<br>
        <input type="hidden" name="text" value="text" />
        <input type="file" name="file" />
    </label>
    <p><button>Submit</button></p>
</form>
<h1>Existing Files</h1>
<ul>
@forelse($files as $file)
    <li><a href="{{ Storage::disk('spaces')->url($file) }}">{{ Storage::disk('spaces')->url($file) }}</a></li>
@empty
    <li><em>No files to display.</em></li>
@endforelse
</ul>
	</div>
@endsection