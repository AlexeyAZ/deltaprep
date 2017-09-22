$(function() {

    var $body = $("body");

    // show nav on tablet & mobile
    $body.on("click", ".header__btn_menu", function() {
        var nav = $(".header__nav");

        if (nav.hasClass("header__nav_show")) {
            nav.removeClass("header__nav_show");
        } else {
            nav.addClass("header__nav_show");
        }
    });


    // show socials on tablet & mobile
    $body.on("click", ".header__btn_social", function() {
        var socials = $(".header__social-list");

        if (socials.hasClass("header__social-list_show")) {
            socials.removeClass("header__social-list_show");
        } else {
            socials.addClass("header__social-list_show");
        }
    });



    //page main gallery
    $(".main__gallery").slick();

    //page about gallery
    $(".about__gallery").slick();

    //page events calendar
    $( ".events__calendar" ).datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        dayNamesMin: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        beforeShowDay: function (date) {

            if (date.getDate() == 6 || date.getDate() == 21) {
                return [true, 'events__calendar-event'];
            }
            return [true, ''];
        }
    });

    //page stuff cards

    // ajax request
    $.ajax({
        url: "/json/stuff-cards.json",
        success: function(data) {
            createStuffCards(data);
        }
    });


    // create cards
    var stuffCards = $(".stuff__cards");

    function createStuffCards(data) {
        var stuffPhotoTemplate = $("#stuffPhotoTemplate");
        var stuffTemplate = $("#stuffTemplate");

        var stuffCardsArray = "";
        var newCardTemplate;


        for (var i = 0; i < data.length; i++) {
            if (data[i].photo == "") {
                newCardTemplate = stuffTemplate.clone();
            } else {
                newCardTemplate = stuffPhotoTemplate.clone();
            }

            var cardPhoto = newCardTemplate.find(".stuff__card-photo");
            var cardName = newCardTemplate.find(".stuff__card-name");
            var cardSkill = newCardTemplate.find(".stuff__card-skill");
            var cardAbout = newCardTemplate.find(".stuff__card-about");
            var cardPhone = newCardTemplate.find(".stuff__card-phone");
            var cardMail = newCardTemplate.find(".stuff__card-mail");

            var dataPhoto = data[i].photo;
            var dataName = data[i].name;
            var dataSkill = data[i].skill;
            var dataAbout = data[i].about;
            var dataPhone = data[i].phone;
            var dataMail = data[i].mail;


            cardPhoto.css({
                backgroundImage: "url(" + dataPhoto + ")",
            });
            cardName.text(dataName);
            cardSkill.text(dataSkill);
            cardAbout.text(dataAbout);
            cardPhone.text(dataPhone);
            cardMail.attr("href", "mailto:" + dataMail).text(dataMail);

            stuffCardsArray += newCardTemplate.html();
        }

        stuffCards.html(stuffCardsArray);
    }


    // find employers
    $(".stuff__search-input").keyup(function(){
        var $this = $(this);
        var inputVal = $this.val();

        findEmployee(inputVal);
    });


    function findEmployee(value) {
        var stuffCardElements = stuffCards.find(".stuff__card");
        var inputValueLength = value.length;

        for (var i = 0; i < stuffCardElements.length; i++) {
            var stuffCardElement = stuffCardElements.eq(i);
            var stuffCardName = stuffCardElement.find(".stuff__card-name").text();
            var stuffCardSkill = stuffCardElement.find(".stuff__card-skill").text();

            if (stuffCardName.toLowerCase().slice(0, inputValueLength) == value.toLowerCase() ||
                stuffCardSkill.toLowerCase().slice(0, inputValueLength) == value.toLowerCase()) {

                stuffCardElement.css({
                    display: "block"
                });
            } else {
                stuffCardElement.css({
                    display: "none"
                });
            }
        }
    };

});

