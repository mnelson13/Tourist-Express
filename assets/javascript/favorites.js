$(document).ready(function(){

    $('.sidenav').sidenav();

    let APIKeyWeather = "df51c21d9a4ddc2a75c5f87f7600ed95";
    let apikeySygic = "KpeNRgekRLJeDOc0Yg1D91Gv5VK3EnU3EqRxSykg";
    // let favorites = [localStorage.getItem("favorites")];
    // let favoritesArray = JSON.parse(favorites);
    let favorites = []
    if (localStorage.getItem("favorites")) {
        favorites.push(localStorage.getItem("favorites"));
         favorites = JSON.parse(favorites);
    };


    for (i in favorites) {
        let queryURL = "https://api.sygictravelapi.com/1.1/en/places/" + favorites[i] + "";
        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET",
            headers: {
                "x-api-key": apikeySygic,
            }
        }).then(function(response){
            console.log(response)

            var result = response.data.place
            
            
            let lat = result.location.lat
            let lon = result.location.lng
            let queryURL2 = "https://api.openweathermap.org/data/2.5/weather?appid=" +APIKeyWeather + "&lat=" + lat + "&lon=" + lon +"";
            let resultDiv = $("<div>");
            resultDiv.attr("class", "row card horizontal resultcard");

            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function(response){
                console.log(response);
                let weatherDiv = $("<div>")
                weatherDiv.attr("class", "col s3 card blue-grey darken-1 card-content white-text");
                
                weatherDiv.append('<p class="card-title">Current Weather for ' + response.name + ':<p>')

                weatherDiv.append('<p>General: ' + response.weather[0].description + '<p>')

                var F = Math.round((response.main.temp - 273.15) * 1.8 +32);
                weatherDiv.append('<p>Temp: ' + F + ' F<p>')

                weatherDiv.append('<p>Humidity: ' + response.main.humidity + '<p>')
                // weatherDiv.append('<p>Wind Speed: ' + response.wind.speed)
                weatherDiv.append('<a href="https://openweathermap.org/city/' + response.id + '" target="_blank">Click here for extended forecast</a>')
                // weatherDiv.append('<p>lat: ' + response.coord.lat + '<p>')
                // weatherDiv.append('<p>lon: ' + response.coord.lon + '<p>')

                resultDiv.append(weatherDiv);

            });

            let travelDiv = $("<div>");
            travelDiv.attr("class", "col s6 card-stacked");
            let imgDiv = $("<div>");
            imgDiv.attr("class", "col s3")

            if (result.thumbnail_url !== null) {
                imgDiv.append('<img class="test responsive-img" src="' + result.thumbnail_url + '" />')
            } else if (result.thumbnail_url === null) {
                imgDiv.append('<img class="test responsive-img" src="assets/images/sorry-image-not-available.jpg" />')
            };

            if (favorites.indexOf(result.id) === -1) {
                imgDiv.append('<i data-id=' + result.id + ' class="material-icons notSelected">favorite_border</i>');
            } else {
                imgDiv.append('<i data-id=' + result.id + ' class="material-icons selected">favorite</i>');
            }

            if (result.original_name !== null) {
                travelDiv.append('<h3 class="card-title">'+ result.original_name + '</h3>');
            };

            if (result.name_suffix !== null) {
                travelDiv.append('<p>' + result.name_suffix + '</p>');
            };

            if (result.perex !== null) {
                travelDiv.append('<p>' + result.perex + '</p>');
            };

            if (result.url !== null) {
                travelDiv.append('<a href="' + result.url + '" target="_blank">Click here for more information</a>')
            };

            // if (result.location.lat !== null) {
            //     travelDiv.append('<p>lat: ' + result.location.lat + '</p>');
            // };

            // if (result.location.lng !== null) {
            //     travelDiv.append('<p>lon: ' + result.location.lng + '</p>');
            // };
            
            resultDiv.prepend(travelDiv);
            resultDiv.prepend(imgDiv);

            $("#main").append(resultDiv);

        });
    };

    $(document.body).on("click", ".notSelected", function(){
        $(this).text("favorite");
        $(this).removeClass("notSelected");
        $(this).addClass("selected");
        favorites.unshift($(this).attr("data-id"));
        let favoritesString = JSON.stringify(favorites)
        localStorage.setItem("favorites", favoritesString);

        // console.log(favorites);
        
    });

    $(document.body).on("click", ".selected", function(){
        $(this).text("favorite_border");
        $(this).removeClass("Selected");
        $(this).addClass("notSelected");
        let index = favorites.indexOf($(this).attr("data-id"));
        favorites.splice(index, 1);
        let favoritesString = JSON.stringify(favorites)
        localStorage.setItem("favorites", favoritesString);

        // console.log(favorites);
        
    });

    $("#searchResults").keypress(function (e) {
        searchValue = $("#searchResults").val();
        var key = e.which;
        if (key === 13) {
            searchValue = searchValue.replace(/[^a-zA-Z]+/g, "");
            searchValue = searchValue.trim();
            localStorage.setItem("searchValue", searchValue);
            window.open("results.html");
             $("#searchResults").val('');
        }
       
    })

});