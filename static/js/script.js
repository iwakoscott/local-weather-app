var WeatherAppViewModel = function(){
  var self = this;
  self.location = ko.observable('Davis');
  self.isFahrenheit = ko.observable(true);
  self.temperature = ko.observable(67);

  self.weatherIcon = ko.observable('<i class="fa fa-cloud"></i>');
  self.formatTemperature = ko.computed(function(){
    if(self.isFahrenheit()){
      return self.temperature() + " °F";
    } else {
      return self.temperature() + " °C";
    }
  });

  self.getLocation = function(){

  }

  self.setLocation = function(){

  }

  self.convert = function(){

  }
}

ko.applyBindings(new WeatherAppViewModel());
