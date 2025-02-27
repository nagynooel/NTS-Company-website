$(document).ready(function () {
    let hasAnimated = false;

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function startCounter() {
        if (hasAnimated) return; // Prevents multiple animations
        $('.counter-count').each(function () {
            const value = $(this).data('value'); // Get the target value from data attribute
            const duration = $(this).data('duration') || 2000; // Get duration or default to 2000
            $(this).prop('Counter', 0).animate({
                Counter: value
            }, {
                duration: duration,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });
        hasAnimated = true; // Set the flag to true after animation
    }

    // Check immediately if counters are in viewport on page load
    $('.counter-count').each(function () {
        if (isInViewport(this)) {
            startCounter();
        }
    });

    $(window).on('scroll resize', function () {
        $('.counter-count').each(function () {
            if (isInViewport(this)) {
                startCounter();
            }
        });
    });

    // - Back to Top button
    if ($(this).scrollTop() > 100) {
        $('#back-to-top').fadeIn();
    } else {
        $('#back-to-top').fadeOut();
    }

    // Show or hide the button based on scroll position
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    // Smooth scroll to top when the button is clicked
    $('#back-to-top').click(function () {
        window.scrollTo(0,0)
        return false;
    });

    // Responsive navbar
    var header_util = {
        mobileMenu() {
            alert("1");
            $("#nav").toggleClass("nav-visible")
        },
        windowResize() {
            if ($(window).width() > 1000) {
                $("#nav").removeClass("nav-visible");
            }
        }
    }

    $("#menu").click(header_util.mobileMenu);
    $(window).resize(header_util.windowResize);

    $('.carousel').carousel({
        interval: 4000
    })
});

// Fade in
function checkElementLocation() {
    var $window = $(window);
    var bottom_of_window = $window.scrollTop() + $window.height();
  
    $('section.to-fade-in').each(function(i) {
      var $that = $(this);
      var trigger = $that.position().top + 50
  
      //if element is in viewport, add the animate class
      if (bottom_of_window > trigger) {
        $(this).addClass('fade-in');
      }
    });
  }
  // if in viewport, show the animation
  checkElementLocation();
  
  $(window).on('scroll', function() {
    checkElementLocation();
  });