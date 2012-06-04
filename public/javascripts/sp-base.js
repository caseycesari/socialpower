if (typeof sp === 'undefined' || !sp) {
  var sp = {};
}

$(document).ready(function() {
  sp.Official = Backbone.Model.extend({
    defaults: {
      visible: true
    },

    updateVisible: function(party, position) {
      if (party === 'all' && position === 'all') {
        this.set('visible', true);
      } else if (party !== 'all' && position === 'all') {
        if (this.get('party') === party) {
          this.set('visible', true);
        } else {
          this.set('visible', false);
        }
      } else if (party === 'all' && position !== 'all') {
        if (this.get('position') === position) {
          this.set('visible', true);
        } else {
          this.set('visible', false);
        }
      } else if (party !== 'all' && position !== 'all') {
        if (this.get('party') === party && this.get('position') === position) {
          this.set('visible', true);
        } else {
          this.set('visible', false);
        }
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
      this.$el.find('.filter.party').append(this.createSelect('party'));
      this.$el.find('.filter.position').append(this.createSelect('position'));
      this.on('change:filter', this.setVisibleModels, this);
      this.filterParty = 'all'
      this.filterPosition = '';

      var List = new sp.ListView({collection: Officials});
    },

    events: {
      'change .filter select': 'setFilter'
    },

    createSelect: function(type) {
      var that = this;

      var filter = this.$el.find('.filter.' + type),
        select = $('<select/>', {
          html: '<option value="all">All</option>'
        });
   
      _.each(_.uniq(Officials.pluck(type)), function (item) {
        var option = $('<option/>', {
          value: item,
          text: that.getAlias(item)
        }).appendTo(select);
      });

      return select;
    },

    getAlias: function(position) {
      var aliasLookup = {
        R : 'Republican',
        D : 'Democrat',
        mayor : 'Mayor',
        council : 'City Council',
        'state-rep': 'State Rep.',
        'us-rep': 'U.S. Rep.'
      };

      return aliasLookup[position] || '';
    },
    
    setFilter: function (e) {
      if (e.currentTarget.parentNode.className === 'filter party') {
        this.filterParty = e.currentTarget.value;
      } else if (e.currentTarget.parentNode.className === 'filter position') {
        this.filterPosition = e.currentTarget.value;
      }
      this.trigger('change:filter');
      Router.navigate('list/' + this.filterParty + '/' + this.filterPosition);
    },

    setVisibleModels: function () {
      var filterParty = this.filterParty;
      var filterPosition = this.filterPosition || 'all';
      _.each(Officials.models, function (official) {
        official.updateVisible(filterParty, filterPosition);
      });
    }
  });

  sp.AppRouter = Backbone.Router.extend({
    routes: {
      'list/:party': 'updateFilter',
      'list/:party/:position': 'updateFilter'
    },
 
    updateFilter: function (party, position) {
      App.filterParty = party;
      App.filterPosition = position;
      App.trigger('change:filter');
    }
  });
  
  var Officials = new sp.OfficialCollection(officials);
  var Router = new sp.AppRouter();
  var App = new sp.AppView();

  Backbone.history.start();
});
