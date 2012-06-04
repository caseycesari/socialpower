if (typeof sp === 'undefined' || !sp) {
  var sp = {};
}

$(document).ready(function() {
  sp.Official = Backbone.Model.extend({
    defaults: {
      visible: true
    },

    updateVisible: function(party) {
      if (party === 'all') {
        this.set('visible', true);
      } else if (this.get('party') === party) {
        this.set('visible', true);
      } else {
        this.set('visible', false);
      }
    }
  });

  sp.OfficialCollection = Backbone.Collection.extend({
    model: sp.Official
  });

  sp.ProfileView = Backbone.View.extend({
    tagName: 'article',

    className: 'official-profile',

    template: $('.officialTemplate').html(),
    
    render: function () {
      var tmpl = _.template(this.template);

      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    }
  });

  sp.ListView = Backbone.View.extend({
    el: '.official-list',

    initialize: function () {
      this.render();
      this.collection.on('reset', this.render, this);
      Officials.on('change:visible', this.updateList, this);
    },

    render: function () {
      var that = this;

      _.each(this.collection.models, function (official) {
          if(official.get('visible') === true) {
            that.renderProfile(official);
          }
      }, this);
    },

    renderProfile: function (official) {
      var profileView = new sp.ProfileView({
        model: official,
        id: 'official-' + official.get('id')
      });

      this.$el.append(profileView.render().el);
    },

    updateList: function(model, visible) {
      if (visible === true) {
        this.$el.find('#official-' + model.get('id')).show();
      } else {
        this.$el.find('#official-' + model.get('id')).hide();
      }
    }
  });

  sp.AppView = Backbone.View.extend({
    el: '#content',

    initialize: function() {
      this.$el.find('.filter').append(this.createSelect());
      this.on('change:filterParty', this.updatePartyFilter, this);

      var List = new sp.ListView({collection: Officials});
    },

    events: {
      'change .filter select': 'setFilter'
    },

    getParties: function () {
      return _.uniq(Officials.pluck('party'), false, function (party) {
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
    
    setFilter: function (e) {
      this.filterParty = e.currentTarget.value;
      this.trigger("change:filterParty");
      Router.navigate('list/' + this.filterParty);
    },

    updatePartyFilter: function () {
      var filterParty = this.filterParty;
      _.each(Officials.models, function (official) {
        official.updateVisible(filterParty);
      });
    }
  });

  sp.AppRouter = Backbone.Router.extend({
    routes: {
      'list/:party': 'filterParty'
    },
 
    filterParty: function (party) {
      App.filterParty = party;
      App.trigger('change:filterParty');
    }
  });
  
  var Officials = new sp.OfficialCollection(officials);
  var Router = new sp.AppRouter();
  var App = new sp.AppView();

  Backbone.history.start();
});
