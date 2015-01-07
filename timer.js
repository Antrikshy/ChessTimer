var timerRunning = false;
var timerIntId = null;
var currentTheme = 'white';
var colorsContrast = true;
var whiteTurn = true;

$(document).ready(function() {
    $('.player-indicator').hide();
    $('.play-pause-btn').hide();

    $('.main-timer').addClass('animated fadeInDownBig');
    $('.bottom-timer').addClass('animated fadeInUpBig');

    $('.bottom-timer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('.play-pause-btn').fadeIn(1000);
    });

    $(document).keydown(function(e) {
        if (e.which == 32) {
            if (timerRunning)
                switchPlayer();

            else {
                startCountdown();
                $('.play-pause-btn').html('<i class="fa fa-pause fa-2x"></i>');
            }

            if ($('.spacebar-indicator').is(':visible'))
                $('.spacebar-indicator').fadeOut(150);
        }
    });

    $('.play-pause-btn').click(function() {
        if (!timerRunning) {
            startCountdown();
            $(this).html('<i class="fa fa-pause fa-2x"></i>');
        }

        else {
            stopCountdown();
            $(this).html('<i class="fa fa-play fa-2x"></i>');
        }
    });

    $('.swap-btn').click(function() {
        if (!timerRunning) {
            $(this).addClass('animated shake');
            $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('animated shake');
            });
            return;
        }

        switchPlayer();
    });

    $('.spacebar-indicator').click(function() {
        $(this).fadeOut(150);
    });

    $('.theme-select-btn').click(function() {
        var themeId = $(this).attr('id');

        if (whiteTurn)
            var currentThemeColor = $('.bottom-timer').css('background-color');
        else
            var currentThemeColor = $('.main-timer').css('background-color');

        $(this).animate({color: currentThemeColor}, 70, 'linear');
        $(this).attr('id', currentTheme + '-theme');

        selectedColor = themeId.substr(0, themeId.length - 6);
        changeTheme(selectedColor);
    });

    $('.time-value').mouseenter(function() {
        if (!timerRunning) {
            $(this).css('text-decoration', 'underline');
            $(this).css('cursor', 'text');
            
            $(this).mouseleave(function() {
                $(this).css('text-decoration', 'none');
                $(this).css('cursor', 'default');
            });

            $(this).click(function() {
                var value = $(this).text();

                if ($(this).hasClass('main-value')) 
                    $(this).replaceWith('<input type="text" class="main-edit-input edit-input" placeholder="' + value.toString() + '"/>');
                else if ($(this).hasClass('bottom-value'))
                    $(this).replaceWith('<input type="text" class="bottom-edit-input edit-input" placeholder="' + value.toString() + '"/>');
            });
        }
    });
});

function startCountdown() {
    if (!timerRunning) {
        timerIntId = setInterval(tickDown, 1000);
        timerRunning = true;
    }
}

function stopCountdown() {
    if (timerRunning) {
        clearInterval(timerIntId);
        timerRunning = false;
    }
}

function tickDown() {
    var minute = Number($('span#cur-minutes').text());
    var second = Number($('span#cur-seconds').text());

    if (second > 0) {
        minute = decorateZeroes(minute);
        second = decorateZeroes(second - 1);
    }

    else {
        if (minute > 0) {
            minute = decorateZeroes(minute - 1);
            second = "59";
        }

        else {
            minute = decorateZeroes(minute);
            second = decorateZeroes(second);
        }
    }

    $('#cur-minutes').text(minute);
    $('#cur-seconds').text(second);
}

function switchPlayer() {
    if (!timerRunning)
        return;

    stopCountdown();

    // Swap timers
    var tmpMin = $('#cur-minutes').text();
    var tmpSec = $('#cur-seconds').text();

    $('#cur-minutes').text($('#oth-minutes').text());
    $('#cur-seconds').text($('#oth-seconds').text());

    $('#oth-minutes').text(tmpMin);
    $('#oth-seconds').text(tmpSec);

    // Swap container colors
    var mainColor = $('.main-timer').css('color');
    var mainBackColor = $('.main-timer').css('background-color');

    var bottomColor = $('.bottom-timer').css('color');
    var bottomBackColor = $('.bottom-timer').css('background-color');

    $('.timer').addClass('animated pulse');
    $('.timer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('.timer').removeClass('animated pulse');
    });

    $('.play-pause-btn').animate({color: bottomColor}, 200, 'linear');
    if (!colorsContrast)
        $('.swap-btn').animate({color: "#ffffff"}, 200, 'linear');
    else
        $('.swap-btn').animate({color: bottomBackColor}, 200, 'linear');
    $('.swap-btn').animate({backgroundColor: mainBackColor}, 200, 'linear');
    $('.main-timer').animate({color: bottomColor}, 200, 'linear');
    $('.main-timer').animate({backgroundColor: bottomBackColor}, 200, 'linear', function() {
        $('.bottom-timer').animate({color: mainColor}, 200, 'linear');
        $('.bottom-timer').animate({backgroundColor: mainBackColor}, 200, 'linear');
    });

    whiteTurn = !whiteTurn;
    startCountdown();
}

function changeTheme(selectedColor) {
    var topBackColor;
    var bottomBackColor;

    switch(selectedColor) {
        case 'white':
            topBackColor = '#ffffff';
            bottomBackColor = '#292929';
            currentTheme = 'white';
            colorsContrast = true;
            break;

        case 'pale':
            topBackColor = '#ffd98e';
            bottomBackColor = '#853100';
            currentTheme = 'pale';
            colorsContrast = true;
            break;

        case 'purple':
            topBackColor = '#f7f0f9';
            bottomBackColor = '#8e44ad';
            currentTheme = 'purple';
            colorsContrast = true;
            break;

        case 'gold':
            topBackColor = '#f5f5f5';
            bottomBackColor = '#FFAA00';
            currentTheme = 'gold';
            colorsContrast = true;
            break;

        case 'red':
            topBackColor = '#ffffff';
            bottomBackColor = '#e52026';
            currentTheme = 'red';
            colorsContrast = true;
            break;
    }

    if (!whiteTurn) {
        var tmpColor = topBackColor;
        topBackColor = bottomBackColor;
        bottomBackColor = tmpColor;
    }

    if (!colorsContrast) {
        $('.play-pause-btn').animate({color: "#ffffff"}, 200, 'linear');
        $('.swap-btn').animate({color: "#ffffff"}, 200, 'linear');
        $('.main-timer').animate({color: "#ffffff"}, 200, 'linear');
    }

    else {
        $('.play-pause-btn').animate({color: bottomBackColor}, 200, 'linear');
        $('.swap-btn').animate({color: topBackColor}, 200, 'linear');
        $('.main-timer').animate({color: bottomBackColor}, 200, 'linear');
    }

    $('.swap-btn').animate({backgroundColor: bottomBackColor}, 200, 'linear');
    $('.main-timer').animate({backgroundColor: topBackColor}, 200, 'linear', function() {
        if (!colorsContrast)
            $('.bottom-timer').animate({color: topBackColor}, 200, 'linear');
        $('.bottom-timer').animate({backgroundColor: bottomBackColor}, 200, 'linear');
    });
}

function decorateZeroes(number) {
    if (number >= 10)
        return number.toString();

    return "0" + number.toString();
}
