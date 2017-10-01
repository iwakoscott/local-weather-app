var WeatherAppViewModel = function(){

  var self = this;

  self.location = ko.observable('');
  self.isFahrenheit = ko.observable(false);
  self.temperature = ko.observable('');
  self.weatherIcon = ko.observable('<i class="fa fa-cloud" aria-hidden="true"></i>');
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

        self.setWeatherIcon('gear');
        $('.weather-icon').rotate({animateTo: 1440, duration: 3000, center: ["50%", "48%"]});

        window.setTimeout(function(){
          var locationURL = "https://geoip-db.com/json/";
          var darkSkysURL = "https://api.darksky.net/forecast/3d3f1ae8241057a29c232b44187a2cc0/";

          $.getJSON(locationURL, function(json){
            var long = json.longitude;
            var lat = json.latitude;
            var position = lat + ',' + long;
            var location = json.city + ", " + json.state;
            $.ajax({
              url: darkSkysURL + position,
              dataType: "jsonp",
              success: function(json){
                  self.location(location);
                  self.conditions(json.currently.summary);
                  self.temperature(Math.round(json.currently.temperature));
                  self.isFahrenheit(true);
                  self.setWeatherIcon(json.currently.summary);
              }
            });
          });

          $('.conversion-buttons').fadeIn("slow");
        }, 3000);
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
      "mist": '<i class="fa fa-th" aria-hidden="true"></i>',
      "gear": '<i class="fa fa-cog" aria-hidden="true"></i>'
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
  }, 1000);
});
