var user_searched_city_list = $("#city-list");
var cities_array = [];
var API_KEY = "b767cc49252944c25de3fbd8727fa33d";

//Format for day
function FormatDay(date) {

    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var dayOutput = date.getFullYear() + '/' +
        (month < 10 ? '0' : '') + month + '/' +
        (day < 10 ? '0' : '') + day;
    return dayOutput;
}



//Calling function getCityArrayFromLocalStorageAndReturn();
getCityArrayFromLocalStorageAndReturn();

//Function getCityArrayFromLocalStorageAndReturn();
function getCityArrayFromLocalStorageAndReturn() {
    //Get stored cities_array from localStorage
    //Parsing the JSON string to an object
    var storedcities_array = JSON.parse(localStorage.getItem("cities_array"));

    // If cities_array were retrieved from localStorage, update the cities_array array to it
    if (storedcities_array !== null) {
        cities_array = storedcities_array;
    }
    // Render cities_array to the DOM
    returns_cities_array();
    // console.log(cities_array);
}

//Function Storecities_array()
function storecities_array() {
    // Stringify and set "cities_array" key in localStorage to cities_array array
    localStorage.setItem("cities_array", JSON.stringify(cities_array));

}

//Function returns_cities_array()
function returns_cities_array() {
    // Clear user_searched_city_list element
    // user_searched_city_list.text = "";
    // user_searched_city_list.HTML = "";
    user_searched_city_list.empty();

    // Render a new li for each city
    for (var i = 0; i < cities_array.length; i++) {
        var city = cities_array[i];

        var li = $("<li>").text(city);
        li.attr("id", "listC");
        li.attr("data-city", city);
        li.attr("class", "list-group-item");

        user_searched_city_list.prepend(li);
    }
    //Get Response weather for the first city only
    if (!city) {
        return
    }
    else {
        ResponseWeather(city)
    };
}

//When form is submitted...
$("#btnSearch").on("click", function (event) {
    event.preventDefault();

    // This line will grab the city from the input box
    var city = $("#search-input").val().trim();

    // Return from function early if submitted city is blank
    if (city === "") {
        return;
    }
    //Adding city-input to the city array
    cities_array.push(city);
    // Store updated cities_array in localStorage, re-render the list
    storecities_array();
    returns_cities_array();
});

//Function get Response Weather 

function ResponseWeather(user_searched_city_name) {

    //Clear content of city-name-with-current-weather

    $("#city-name-with-current-weather").empty();
    $(".day").empty();

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + user_searched_city_name + "&appid=" + API_KEY,
        method: "GET",
        success: function (response) {

            // Create a new table row element

            city_name = $("<h1>").text(response.name + " " + FormatDay());

            $("#city-name-with-current-weather").append(city_name);


            var weathe_condition_icon = $("<img>");

            var sky_conditions = response.weather[0].main;

            if (sky_conditions === "Clouds") {
                weathe_condition_icon.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
            } else if (sky_conditions === "Clear") {
                weathe_condition_icon.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
            } else if (sky_conditions === "Rain") {
                weathe_condition_icon.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
            }

            $("#city-name-with-current-weather").append(weathe_condition_icon);

            var tempeture_to_fahrenheit = parseInt((response.main.temp) * 9 / 5 - 459);

            var cityTemperature = $("<p>").text("Tempeture: " + tempeture_to_fahrenheit + " °F");

            $("#city-name-with-current-weather").append(cityTemperature);

            var cityHumidity = $("<p>").text("Humidity: " + response.main.humidity + " %");

            $("#city-name-with-current-weather").append(cityHumidity);

            var cityWindSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

            $("#city-name-with-current-weather").append(cityWindSpeed);

            //Api to get 5-day forecast  


            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/forecast?q=" + user_searched_city_name + "&appid=" + API_KEY,
                method: "GET",
                success: function (city_name_with_5_days_forecast_response) {

                    $(".city-name-with-5--days-forecast").empty();

                    for (var i = 0, j = 0; j <= 5; i = i + 6) {

                        var read_date = city_name_with_5_days_forecast_response.list[i].dt;

                        if (city_name_with_5_days_forecast_response.list[i].dt != city_name_with_5_days_forecast_response.list[i + 1].dt) {

                            var five_day_div_container = $("<div>");

                            five_day_div_container.attr("class", "day")

                            var date = new Date(0); // The 0 there is the key, which sets the date to the epoch

                            date.setUTCSeconds(read_date);

                            var month = date.getMonth() + 1;

                            var day = date.getDate();

                            var dayOutput = date.getFullYear() + '/' +
                                (month < 10 ? '0' : '') + month + '/' +
                                (day < 10 ? '0' : '') + day;

                            var five_day_h2_container = $("<h2>").text(dayOutput);

                            //Set src to the imags
                            var imgtag = $("<img>");

                            var sky_conditions = city_name_with_5_days_forecast_response.list[i].weather[0].main;
                            if (sky_conditions === "Clouds") {
                                imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                            } else if (sky_conditions === "Clear") {
                                imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                            } else if (sky_conditions === "Rain") {
                                imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                            }

                            var get_temperature_kelvin  = city_name_with_5_days_forecast_response.list[i].main.temp;
                            
                            // convert degree kelvin to fahrenheit
                            var tempeture_to_fahrenheit = parseInt((get_temperature_kelvin ) * 9 / 5 - 459);

                            var paragraph_temperature = $("<p>").text("Tempeture: " + tempeture_to_fahrenheit + " °F");

                            var paragraph_humidity = $("<p>").text("Humidity: " + city_name_with_5_days_forecast_response.list[i].main.humidity + " %");

                            var wind_spead = $("<p>").text("Wind Speed: " + city_name_with_5_days_forecast_response.list[i].wind.speed + " MPH");

                            five_day_div_container.append(five_day_h2_container);
                            five_day_div_container.append(imgtag);
                            five_day_div_container.append(paragraph_temperature);
                            five_day_div_container.append(paragraph_humidity);
                            five_day_div_container.append(wind_spead);

                            $(".city-name-with-5--days-forecast").append(five_day_div_container);

                            j++;
                        }

                    }

                },

            });

        },

        error: function (response) {

            city_name = $("<h1>").text(response?.responseJSON?.message + ": or it could be spelling error so, please try again");

            $("#city-name-with-current-weather").append(city_name);

        },

    });

}

//Click function to each Li 
$(document).on("click", "#listC", function () {
    var thisCity = $(this).attr("data-city");
    ResponseWeather(thisCity);
});

//  clear the local storage
$("#clear_storage").on("click", function () {
    window.localStorage.removeItem('cities_array');
    location.reload();
})







