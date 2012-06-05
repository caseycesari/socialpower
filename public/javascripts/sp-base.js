if (typeof sp === 'undefined' || !sp) {
  var sp = {};
}

$(document).ready(function() {
  sp.Official = Backbone.Model.extend({
    defaults: {
      visible: true
    },

    //TODO: This is the raw logic, but I'm sure we can
    //think of a cleaner way to implement, possibly using
    // _.filter
    updateVisible: function(party, position) {
      if (party === 'all' && position === 'all') {
        this.set({visible: true, silent: true});
      } else if (party !== 'all' && position === 'all') {
        if (this.get('party') === party) {
          this.set({visible: true, silent: true});
        } else {
          this.set({visible: false, silent: true});
        }
      } else if (party === 'all' && position !== 'all') {
        if (this.get('position') === position) {
          this.set({visible: true, silent: true});
        } else {
          this.set({visible: false, silent: true});
        }
      } else if (party !== 'all' && position !== 'all') {
        if (this.get('party') === party && this.get('position') === position) {
          this.set({visible: true, silent: true});
        } else {
          this.set({visible: false, silent: true});
        }
      }
    }
  });

  sp.OfficialCollection = Backbone.Collection.extend({
    model: sp.Official
  });

  sp.ListItemView = Backbone.View.extend({
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
      this.on('filterUpdate', this.reset, this);
    },

    render: function () {
      var listItems = sp.officials.where({visible: true}).map(function(o){
        return (new sp.ListItemView({model: o, id: o.get('id')})).render().el;
      });

      this.$el.append(listItems);
    },

    reset: function () {
      this.$el.html('');
      this.render();
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

      sp.list = new sp.ListView({collection: sp.officials});
    },

    events: {
      'change .filter select': 'setFilter'
    },

    createSelect: function(type) {
      var filter = this.$el.find('.filter.' + type),
        select = $('<select/>', {
          html: '<option value="all">All</option>'
        });
   
      _.each(_.uniq(sp.officials.pluck(type)), function (item) {
        var option = $('<option/>', {
          value: item,
          text: this.getAlias(item)
        }).appendTo(select);
      }, this);

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

      return aliasLookup[position];
    },
    
    setFilter: function (e) {
      if (e.currentTarget.parentNode.className === 'filter party') {
        this.filterParty = e.currentTarget.value;
      } else if (e.currentTarget.parentNode.className === 'filter position') {
        this.filterPosition = e.currentTarget.value;
      }

      this.trigger('change:filter');
      sp.router.navigate('list/' + this.filterParty + '/' + this.filterPosition);
    },

    setVisibleModels: function () {
      _.each(sp.officials.models, function (official) {
        official.updateVisible(this.filterParty, this.filterPosition || 'all');
      }, this);

      sp.list.reset();
    }
  });

  sp.AppRouter = Backbone.Router.extend({
    routes: {
      'list/:party': 'updateFilter',
      'list/:party/:position': 'updateFilter'
    },
 
    updateFilter: function (party, position) {
      sp.app.filterParty = party;
      sp.app.filterPosition = position || 'all';
      sp.app.trigger('change:filter');
    }
  });
  
  sp.officials = new sp.OfficialCollection(data);
  sp.router = new sp.AppRouter();
  sp.app = new sp.AppView();

  Backbone.history.start();
});
