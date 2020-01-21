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
    <!-- details-area-start -->
    <div class="details-area">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="details">
                        <div class="details-movie">
                            <div class="img">
                                <img alt='{{$data["title"]}}' title='{{$data["title"]}}' src='{{$data["default_image"]}}' id="default_image" itemprop="image" />
                            </div>
                        </div>
                        <div class="details-content">
                            <div class="content">
                                <h2 class="name">{{$data["title"]}}</h2>
                                <div class="reviews" >
                                    <p class="review age">{{$data["age"]}}</p>
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
                                </div>
                                <h2 class="title">Discription :</h2>
                                <p class="text"><?= $data['description']?></p>
                                <h2 class="title cast-crew">Cast and Crew :</h2>
                                <ul class="info">
                                    <li>Directors :
                                        @foreach($data['directors'] as $director)
                                            {{$director["name"]}}
                                        @endforeach
                                    </li>
                                    <li>Actor :
                                        @foreach($data['actors'] as $actors)
                                            {{$actors["name"]}},
                                        @endforeach
                                    </li>
                                    <li>Genre :  {{$data["sub_category_name"]}}
<!--  Genres not working
                                        @foreach($data['genres'] as $genre)
                                            {{$genre["name"]}},
                                        @endforeach
-->
                                    </li>
                                    <li>Release : {{$data["release_date"]}}</li>
                                    <li>Duration : {{$data["duration"]}}</li>
                                </ul>
                                <div class="share">
                                    <span class="label">Share:</span>
                                    <ul class="social">
                                        <li class="facebook">
                                            <a href="#" target="_blank">
                                                <i class="fab fa-facebook-f"></i>
                                            </a>
                                        </li>
                                        <li class="twitter">
                                            <a href="#" target="_blank">
                                                <i class="fab fa-twitter"></i>
                                            </a>
                                        </li>
                                        <li class="instagram">
                                            <a href="#" target="_blank">
                                                <i class="fab fa-instagram"></i>
                                            </a>
                                        </li>
                                        <li class="pinterest">
                                            <a href="#" target="_blank">
                                                <i class="fab fa-pinterest-p"></i>
                                            </a>
                                        </li>
                                        <li class="vimeo">
                                            <a href="#" target="_blank">
                                                <i class="fab fa-vimeo-v"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
<!--
                                <a class="all" href="/browse_list?category={{$data["sub_category_name"]}}">All {{$data["sub_category_name"]}} Movies</a>
                            </>
-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- details-area-end -->
    <!-- footer-start -->
    @include('guest.partials._footer')
    <!-- footer-end -->
    <!-- javascript-start -->
    @include('guest.partials._javascripts')
    <!-- javascript-end -->
</body>
</html>
