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
  var officials = [
    {
      "id": 1,
      "lastName": "Nutter",
      "firstName": "Michael",
      "nickname": "",
      "position": "mayor",
      "positionAlias": "Mayor",
      "party": "D",
      "twitter": "@Michael_Nutter",
      "facebook": "mayornutter",
      "website": "",
      "photoURL": ""
    },
    {
      "id": 2,
      "lastName": "Squilla",
      "firstName": "Mark",
      "nickname": "",
      "position": "council",
      "positionAlias": "Councilman (1st District)",
      "party": "D",
      "twitter": "@marksquilla",
      "facebook": "",
      "website": "http://www.phila.gov/citycouncil/squilla.html",
      "photoURL": ""
    } 
  ];

  var Official,
      OfficialList,
      ListView,
      ProfileView;

  Official = Backbone.Model.extend({
  });

  OfficialList = Backbone.Collection.extend({
    model: Official
  });

  ProfileView = Backbone.View.extend({
    tagName: 'article',
    className: 'official-profile',
    template: $('.officialTemplate').html(),
    render: function () {
      var tmpl = _.template(this.template);

      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    }
  });

  ListView = Backbone.View.extend({
    el: $('.official-list'),
    initialize: function () {
      this.collection = new OfficialList(officials),
      this.render();
      this.$el.find('.filter').append(this.createSelect());
    },

    render: function () {
        var that = this;
        _.each(this.collection.models, function (item) {
            that.renderProfile(item);
        }, this);
    },
 
    renderProfile: function (item) {
      var profileView = new ProfileView({
        model: item
      });
      this.$el.append(profileView.render().el);
    },

    getParties: function () {
      return _.uniq(this.collection.pluck('party'), false, function (party) {
        return party.toLowerCase();
      });
    },
     
    createSelect: function () {
      var filter = this.$el.find(".filter"),
        select = $("<select/>", {
          html: "<option>All</option>"
        });
   
      _.each(this.getParties(), function (item) {
        var option = $("<option/>", {
          value: item.toLowerCase(),
          text: item.toLowerCase()
        }).appendTo(select);
      });

      return select;
    }

  });

  var list = new ListView();
});
