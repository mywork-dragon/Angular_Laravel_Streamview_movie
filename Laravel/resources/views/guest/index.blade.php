<!DOCTYPE html>
<html lang="en">
<head>
    @include('guest.partials._head')
</head>
<body>
<div id="preloader"></div>
<!-- header-start -->
@include('guest.partials._header')
@include('guest.partials._headerSearch')
<!-- header-end -->
<!-- carousel-start -->
<?php foreach($videos as $key=>$video) {
$videoData = isset($video['videos'])?$video['videos']:[];
?>
<div class="all-album-area">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="section-title">
                    <h2 class="genre">{{$key}}<a href="<?= '/browse_list?category='.$key.'&id='?><?= ($video['id'])??'' ?>" class="btn btn-view-all btn-sm">VIEW ALL</a> </h2>
                </div>
                <div class="all-album-carousel owl-carousel">
                    @foreach ($videoData as $data)
                        <div class="h3-single-album single-top-movie">
                            <div class="img">
                                <a href="/movie_details/<?= $data['admin_video_id']??''?>">
                                    <img src="<?= $data['default_image']?>" alt="<?= $data['title']?> Poster" style="height: 430px;">
                                </a>
                            </div>
<!--
                            <span class="view-counter">263k Views</span>
                            <a class="popup-youtube" href="/movie_details/<?= $data['admin_video_id'] ?>">
                                <i class="far fa-play-circle"></i>
                            </a>
-->
                            <div class="content">
                                <h2 class="name">
                                    <a href="/movie_details/<?= $data['admin_video_id'] ?>"><?= $data['title']?></a>
                                </h2>
                                <div class="rating clearfix">
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
                                <p class="date">{{$data["release_date"]}}</p>
                                <p class="duration">{{$data["duration"]}}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
<?php } ?>
<!-- carousel-end -->
@include('guest.partials._footer')
@include('guest.partials._javascripts')
</body>
</html>
