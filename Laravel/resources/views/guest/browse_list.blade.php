<!DOCTYPE html>
<html lang="en">
<head>
    @include('guest.partials._head')
    @include('guest.partials._ultimate_gallery_pro')
</head>
<body>
<div id="preloader"></div>
<!-- header-start -->
@include('guest.partials._header')
@include('guest.partials._headerSearch')
<!-- header-end -->
<div class="all-album-area">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="section-title">
                    <h2 class="genre">{{$sub_title}}</h2>
                </div>
<!-- UGP holder -->
<div id="myDiv"></div>
<?php foreach($videos as $key=>$video) {
?>
                <!-- UGP playlist -->
<div id="myPlaylist" style="display:none">
    <!-- <ul data-category-name="MULTIMEDIA GALLERY">  -->
    <ul data-category-name="{{$sub_title}}">
            @foreach ($videos as $data)
                <li data-url="link:/movie_details/<?= $data['id']??''?>" data-target="_self">
                    <img src="<?= $data['default_image']?>" alt="<?= $data['title']?> Poster"/>
                    <div data-thumbnail-content1="">
                        <p class="centerWhite"><?= $data['title']?> </p>
                        <div class="centerNormalWhite rating clearfix">
                            @if($data["ratings"] >= 1)
                                <i class="fa fa-star" style="color: orange; font-weight: 900;"></i>
                            @else
                                <i class="fa fa-star" style="color: orange; font-weight: 100;"></i>
                            @endif
                            @if($data["ratings"] >= 2)
                                <i class="fa fa-star" style="color: orange; font-weight: 900;"></i>
                            @else
                                <i class="fa fa-star" style="color: orange; font-weight: 100;"></i>
                            @endif
                            @if($data["ratings"] >= 3)
                                <i class="fa fa-star" style="color: orange; font-weight: 900;"></i>
                            @else
                                <i class="fa fa-star" style="color: orange; font-weight: 100;"></i>
                            @endif
                            @if($data["ratings"] >= 4)
                                <i class="fa fa-star" style="color: orange; font-weight: 900;"></i>
                            @else
                                <i class="fa fa-star" style="color: orange; font-weight: 100;"></i>
                            @endif
                            @if($data["ratings"] >= 5)
                                <i class="fa fa-star" style="color: orange; font-weight: 900;"></i>
                            @else
                                <i class="fa fa-star" style="color: orange; font-weight: 100;"></i>
                            @endif
                        </div>
                        <div class="centerNormalWhite review age">Age: {{$data["age"]}}</div>
                        <div class="centerNormalWhite date">Raleased: {{$data["release_date"]}}</div>
                        <div class="centerNormalWhite duration">Duration: {{$data["duration"]}}</div>
                    </div>
                </li>
            @endforeach
    </ul>
</div>
            </div>
        </div>
    </div>
</div>
<?php } ?>
<!-- footer-start -->
@include('guest.partials._footer')
<!-- footer-end -->
<!-- javascript-start -->
@include('guest.partials._javascripts')
<!-- javascript-end -->
</body>
</html>
