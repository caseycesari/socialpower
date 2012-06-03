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
  var Official,
      OfficialList,
      ListView,
      ProfileView,
      OfficialRouter;

  Official = Backbone.Model.extend({});

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
      this.initState();
      this.render();
      this.$el.find('.filter').append(this.createSelect());
      this.on('change:filterParty', this.filterByParty, this);
      this.collection.on('reset', this.render, this);
    },

    initState: function () {
      _.each(this.collection.models, function (item) {
        if (!item.hasOwnProperty('visible')) {
          item.visible = true;
        }
      });
    },

    render: function () {
      var that = this;

      this.$el.find('article').remove();

      _.each(this.collection.models, function (item) {
          if(item.visible) {
            that.renderProfile(item);
          }
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
          html: '<option value="all">All</option>'
        });
   
      _.each(this.getParties(), function (item) {
        var option = $("<option/>", {
          value: item,
          text: ((item === 'R') ? 'Republicans' : 'Democrats')
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
      var filterParty;

      if (this.filterParty === 'all') {
        filterParty = 'all';
        _.each(this.collection.models, function(item) {
          item.visible = true;
        });
      } else {
        filterParty = this.filterParty;
        _.each(this.collection.models, function(item) {
          if (item.get('party') === filterParty) {
            item.visible = true;
          } else {
            item.visible = false;
          }
        });
      }

      this.render();
      appRouter.navigate('filter/' + filterParty);
    }
  });

  var list = new ListView();

  AppRouter = Backbone.Router.extend({
    routes: {
      'filter/:party': 'urlFilter'
    },
 
    urlFilter: function (party) {
      list.filterParty = party;
      list.trigger('change:filterParty');
    }
  });
  
  var appRouter = new AppRouter();
  Backbone.history.start();
});
