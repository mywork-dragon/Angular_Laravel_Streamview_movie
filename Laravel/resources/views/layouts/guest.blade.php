    <!doctype html>
    <html>
    <head>
       @include('guest.head')
    </head>
    <body>
    <div class="container">
       <header class="row">
           @include('guest.header')
       </header>
       <div id="main" class="row">
               @yield('content')
       </div>
       <footer class="row">
           @include('guest.footer')
       </footer>
    </div>
    </body>
    </html>
