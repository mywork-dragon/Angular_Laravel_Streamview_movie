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
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                    <div class="contact-us">
                        <h4 class="contact-title">Contact Form</h4>
                        <div class="cf-msg"></div>
                        <form action="mail.php" method="post" id="cf">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="cf-input-box">
                                        <input type="text" placeholder="Name" id="fname" name="fname" required="">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="cf-input-box">
                                        <input type="text" placeholder="Email" id="email" name="email" required="">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="cf-input-box">
                                        <input type="text" placeholder="Subject" id="email" name="email" required="">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="cf-input-box">
                                        <textarea class="contact-textarea" placeholder="Message" id="msg" name="msg" required=""></textarea>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="cf-input-box">
                                        <button id="submit" class="cont-submit btn-contact" name="submit">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-lg-6 col-md-8 col-sm-12 col-12">
                    <div class="contact-info">
                        <h4 class="contact-title">Office Address</h4>
                        <ul class="info">
                            <li>Moview Inc. 935 W. Webster Ave New Streets Chicago, IL 60614, NY Newyork USA</li>
                            <li>Mobile: +2346 17 38 93</li>
                            <li>Fax: 1-714-252-0026</li>
                            <li>Email Address: support@yourmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
  <!--  </div>    -->
    <!-- contact-area-end -->
<!-- footer-start -->
@include('guest.partials._footer')
<!-- footer-end -->
<!-- javascript-start -->
@include('guest.partials._javascripts')
<!-- javascript-end -->
</body>
</html>
