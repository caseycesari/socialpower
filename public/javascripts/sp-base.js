if (typeof sp === 'undefined' || !sp) {
  var sp = {};
}

sp = {
  getPols: function() {
    $.ajax({
      url: '/json/officials.json',
      success: function(data){
        console.log(data);
      }
    });
  }
};

$(document).ready(function() {
  var Official = Backbone.Model.extend({
    initialize: function() {
      console.log('Hello ' + this.firstName + ' ' + this.lastName);
    },
  });

  var OfficialList = Backbone.Collection.extend({
    model: Official,
    url: 'json/officials.json'
  });

  var Officials = new OfficialList;

  var OfficialView = Backbone.View.extend({
    tagName: 'li'
  });

  var AppView = Backbone.View.extend({
    el: $("#content"),

    initialize: function() {
      console.log('app is ready to go!');

      Officials.fetch();
    }
  }); 

  var App = new AppView;

});
