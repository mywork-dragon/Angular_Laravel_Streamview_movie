<div class="col-lg-12 col-md-12 col-sm-12 col-12">
    <div class="search-signup">
        <div class="search">
            <form action="/search_results" method="POST" role="search">
                {{ csrf_field() }}
                <div class="search-input-box">
                    <input type="text" style="margin-left: 10px;" name="searchQuery" placeholder="Search the Movies" required>
                    <button>
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
