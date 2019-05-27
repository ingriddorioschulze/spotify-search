(function() {
    var nextUrl;
    var results = $(".search-results");
    var search = $("input");
    var searchResultsHeader = $(".search-results-header");
    var moreButton = $(".more-btn");
    var currentRequest;
    var infiniteScroll = location.search.indexOf("scroll=infinite") > -1;

    function checkScroll() {
        var userHasScrolledtoBottom = isScrolledToBottom();
        if (userHasScrolledtoBottom) {
            currentRequest = $.ajax({
                url: nextUrl,
                success: function(data) {
                    data = data.artists || data.albums;
                    nextSearchResults(data);
                }
            });
        } else {
            setTimeout(checkScroll, 500);
        }
    }

    function nextSearchResults(data) {
        var resultHtml = "";
        for (var i = 0; i < data.items.length; i++) {
            var img = "default.png";
            if (data.items[i].images[0]) {
                img = data.items[i].images[0].url;
            }
            var name = data.items[i].name;
            var link = data.items[i].external_urls.spotify;

            resultHtml += '<a target="blank" class="item" href="' + link + '">';
            resultHtml +=
                '<img class="search-results-image" src="' + img + '">';
            resultHtml += '<div class="search-results-text">' + name + "</div>";
            resultHtml += "</a>";
        }
        results.append(resultHtml);

        if (data.next) {
            nextUrl = data.next.replace(
                "api.spotify.com/v1/search",
                "elegant-croissant.glitch.me/spotify"
            );
            if (infiniteScroll === true) {
                checkScroll();
            } else {
                moreButton.css("visibility", "visible");
            }
        } else {
            moreButton.css("visibility", "hidden");
        }
    }

    moreButton.on("click", function(e) {
        if (currentRequest) {
            currentRequest.abort();
        }
        currentRequest = $.ajax({
            url: nextUrl,
            success: function(data) {
                data = data.artists || data.albums;
                nextSearchResults(data);
            }
        });
    });

    $(".go-btn").on("click", function(e) {
        results.html("");
        moreButton.css("visibility", "hidden");
        $.ajax({
            url: "https://elegant-croissant.glitch.me/spotify",
            data: {
                q: search.val(),
                type: $("select").val()
            },
            success: function(data) {
                data = data.artists || data.albums;
                nextSearchResults(data);
                if (data.total === 0) {
                    searchResultsHeader.html("no results");
                } else {
                    searchResultsHeader.html(
                        'results for "' + search.val() + '"'
                    );
                }
            }
        });
    });
})();

function isScrolledToBottom() {
    var documentHeight = $(document).height();
    var windowHeight = $(window).scrollTop();
    var windowScrollTop = $(window).height();
    documentHeight == windowHeight + windowScrollTop;
    if (documentHeight === windowHeight + windowScrollTop) {
        return true;
    } else {
        return false;
    }
}
