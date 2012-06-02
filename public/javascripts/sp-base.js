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
    },
    {
      "id": 11,
      "lastName": "O'Neill",
      "middleName": "J.",
      "firstName": "Brian",
      "nickname": "",
      "position": "council",
      "positionAlias": "Councilman (10th District), Minority Leader",
      "party": "R",
      "twitter": "@ONeill4NEPhilly",
      "facebook": "CouncilmanONeill",
      "website": "http://www.phila.gov/citycouncil/BrianJONeill.html",
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
      this.on('change:filterParty', this.filterByParty, this);
      this.collection.on('reset', this.render, this);
    },

    render: function () {
      var that = this;

      this.$el.find('article').remove();

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
        return party;
      });
    },
     
    createSelect: function () {
      var filter = this.$el.find(".filter"),
        select = $("<select/>", {
          html: "<option>All</option>"
        });
   
      _.each(this.getParties(), function (item) {
        var option = $("<option/>", {
          value: item,
          text: item
        }).appendTo(select);
      });

      return select;
    },
    
    events: {
      'change .filter select': 'setFilter'
    },
    
    setFilter: function (e) {
      this.filterParty = e.currentTarget.value;
      this.trigger("change:filterParty");
    },
    
    filterByParty: function () {
      if (this.filterParty === 'All') {
        this.collection.reset(officials);
      } else {
        this.collection.reset(officials, { silent: true });
 
        var filterParty = this.filterParty,
          filtered = _.filter(this.collection.models, function (item) {
          return item.get('party') === filterParty;
        });
 
        this.collection.reset(filtered);
      }
    }
  });

  var list = new ListView();
});
