var WeatherAppViewModel = function(){

  var self = this;

  self.location = ko.observable('');
  self.isFahrenheit = ko.observable(false);
  self.temperature = ko.observable('');
  self.weatherIcon = ko.observable('');
  self.conditions = ko.observable("");

  self.formatTemperature = ko.computed(function(){
    if (!self.temperature()){
      return '';
    }

    if(self.isFahrenheit()){
      return self.temperature() + " °F";
    } else {
      return self.temperature() + " °C";
    }
  });

  self.convertFahrenheit = function(){
    if (!self.isFahrenheit()){
      self.temperature(Math.round((self.temperature()*9/5) + 32));
      self.isFahrenheit(true);
    }
  }

  self.convertCelsius = function(){

    if (self.isFahrenheit()){
      self.temperature(Math.round((self.temperature() - 32)*5/9));
      self.isFahrenheit(false);
    }
  }

  self.setLocation = function(){

      $.getJSON("http://freegeoip.net/json/", function(json){
        var lat = json.latitude;
        var lon = json.longitude;
        var location = json.city + ", " + json.region_code;

        var weatherURL = 'https://fcc-weather-api.glitch.me/api/current?lat='+ lat + '&lon=' + lon;
        var googlemapsURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + lon + '&key=AIzaSyC_tqhlcDMQL9QVYgj1DAa-WdDDEo8ZweQ';


        self.weatherIcon('<i class="fa fa-cog" aria-hidden="true"></i>');
        $('.weather-icon').rotate({animateTo: 1400, duration: 4000});

          window.setTimeout(function(){

            // FCC weather API
            $.getJSON(weatherURL, function(json){
              console.log(json.weather);
              self.temperature(Math.round(json.main.temp));
              self.isFahrenheit(false);
              self.setWeatherIcon(json.weather[0].main);
              self.location(location);
            });

        }, 2000);

        $('.conversion-buttons').fadeIn("slow");


      });
  }

  self.setWeatherIcon = function(weatherType){

    var icons = {
      "rain": '<i class="fa fa-tint"></i>',
      "cloud": '<i class="fa fa-cloud"></i>',
      "sun": '<i class="fa fa-sun-o"></i>',
      "lightning": '<i class="fa fa-bolt"></i>',
      "snow": '<i class="fa fa-snowflake-o"></i>',
      "night": '<i class="fa fa-moon-o" aria-hidden="true"></i>',
      "clear": '<i class="fa fa-circle-thin" aria-hidden="true"></i>',
      "fog": '<i class="fa fa-low-vision" aria-hidden="true"></i>',
      "mist": '<i class="fa fa-th" aria-hidden="true"></i>'
    };

    for (key in icons){
      if (weatherType.toLowerCase().indexOf(key) >= 0){
         self.weatherIcon(icons[key]);
         return;
      }
    }

     self.weatherIcon('<i class="fa fa-bicycle" aria-hidden="true"></i>');
     return;
  }

  self.setLocation();

}


$(document).ready(function(){
  $('.conversion-buttons').hide();

  window.setTimeout(function(){
    ko.applyBindings(new WeatherAppViewModel());
  }, 2000);
});
