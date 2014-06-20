/* menu選單 */
	    var menu = '<ul><li><a href="all.html"><i class="all"></i><p>最新文章</p></a></li><li><a href="topic.html"><i class="topic"></i><p>主題</p></a></li><li><a href="movie.html"><i class="movie"></i><p>電影</p></a></li><li><a href="music.html"><i class="music"></i><p>音樂</p></a></li><li><a href="book.html"><i class="book"></i><p>書</p></a></li><li><a href="column.html"><i class="fa fa-3x fa-bullhorn"></i><p>看專欄</p></a></li><li class="fb_login"><a target="_blank" href="https://www.facebook.com/TaiwanMplus"><i class="fa fa-3x fa-facebook-square"></i><p>加入粉絲</p></a></li><li><a target="_blank" href="https://plus.google.com/103120524145150725511?rel=author"><i class="fa fa-3x fa-google-plus-square"></i><p>加入追蹤</p></a></li><li><a href="http://www.mplus.com.tw/articlefeed.xml"><i class="fa fa-3x fa-rss-square"></i><p>RSS訂閱</p></a></li><li><a target="_blank" href="http://www.twebook.com.tw"><i class="fa fa-3x fa-question-circle"></i><p>關於我們</p></a></li></ul>';
	    var movie_music_book = '<ul><li><a class="search" href="#"><i class="fa fa-search fa-3x"></i></a></li><li><a class="menu" href="#"><i class="fa fa-bars fa-3x"></i></a></li></ul>';
	    var search = '<div class="search_bar"><form action="#"><input autofocus class="search_input" type="text" name="search"></form></div>';
  			$('.sidebar').append(menu);
  			$('.link').append(movie_music_book);
  			$('.header').append(search);
  			$('.logo').click(function(){
  				FB.login(function(response) {
				    if (response.authResponse) {
				        window.top.location.href = "http://www.facebook.com/connect/uiserver.php?app_id=" +  encodeURIComponent("1559715337587740") + "&next=" + encodeURIComponent("http://www.xxxx.com.tw/fblogin.aspx?BackURL=http://www.xxxx.com.tw/default.aspx") + "&display=popup&perms=email,user_birthday&fbconnect=1&method=permissions.request";
				    } else {
				        // The person cancelled the login dialog
				        alert('fail');
				    }
				});
  			})

/* slides */

	    $(function() {
	      $('#slides').slidesjs({
	        width: 1080,
	        height: 416,
	        navigation: true,
	        play: {
	        	active: false,
	        	auto: true
	        }
	      });
	      $('.menu,.hide').click(function(){
	      	$('.sidebar').toggleClass('hide');
	      	$('.menu').toggleClass('active');
	      });
	      $('.menu.a').click(function(){
	      	$('.sidebar').addClass('hide');
	      });

/* Search功能 */
			$('.active').removeClass('hide');
		    $('.search').click(function(){
		    	$('.search').toggleClass('active');
		    	// setTimeout( "jQuery('.search_input').focus().select();",1000 );
		    });
		    $('.search').click(function(){
		    	$('.active').removeClass('hide');
		    });

			window.addEventListener('DOMContentLoaded', function() {
			      var button = document.querySelector('.search');
			      var input = document.querySelector('.search_input');
			      var focus = function(e) {
			        e.stopPropagation();
			        e.preventDefault();
			        var clone = input.cloneNode(true);
			        var parent = input.parentElement;
			        parent.appendChild(clone);
			        parent.replaceChild(clone, input);
			        input = clone;
			        window.setTimeout(function() {
			          input.value = input.value || "";
			          input.focus();
				    	$('.logo').toggleClass('hide');
			        }, 0);
			      }
			      button.addEventListener('mousedown', focus);
			      button.addEventListener('touchstart', focus);
			    }, false);
/* 影樂書slides */

			$('#carousel01').elastislide();
			$('#carousel02').elastislide();
			$('#carousel03').elastislide();
			$('#carousel04').elastislide();

$.Elastislide.defaults = {
    // orientation 'horizontal' || 'vertical'
    orientation : 'horizontal',
 
    // sliding speed
    speed : 500,
 
    // sliding easing
    easing : 'ease-in-out',
 
    // index of the current item (left most item of the carousel)
    start : 0,
     
    // click item callback
    onClick : function( el, position, evt ) { return false; },
    onReady : function() { return false; },
    onBeforeSlide : function() { return false; },
    onAfterSlide : function() { return false; }
};

	    });



  			
/* X-Back */
;!function(pkg, undefined){
	var STATE = 'x-back';
	var element;

	var onPopState = function(event){
		event.state === STATE && fire();
	}

	var record = function(state){
		history.pushState(state, null, location.href);
	}

	var fire = function(){
		var event = document.createEvent('Events');
		event.initEvent(STATE, false, false);
		element.dispatchEvent(event);
	}

	var listen = function(listener){
		element.addEventListener(STATE, listener, false);
	}

	!function(){
		element = document.createElement('span');
		window.addEventListener('popstate', onPopState);
		this.listen = listen;
		record(STATE);
	}.call(window[pkg] = window[pkg] || {});

}('XBack');

  		XBack.listen(function(){
	      	$('.sidebar').toggleClass('hide');
		});

