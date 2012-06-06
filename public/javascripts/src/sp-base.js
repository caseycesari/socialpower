if (typeof sp === 'undefined' || !sp) {
  var sp = {};
}

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
  model: sp.Official,
  url: 'json/officials.json'
});

// Individual <article> for each official
// Subview of ListView
sp.ListItemView = Backbone.View.extend({
  tagName: 'article',
  className: 'official-list-item',

  initialize: function() {
    this.template =  _.template($('.tmpl-official-list-item').html());
    this.model.on('change', this.render, this);
    this.dispatcher = sp.dispatcher;
  },

  events: {
    'click h2': 'headerClick'
  },

  render: function() {
    this.$el.html(this.template((this.model.toJSON())));
    return this;
  },

  headerClick: function() {
    this.dispatcher.trigger('open-profile', this);
  }
});

// Contains a ListItemView for each Official where 
// visible = true
sp.ListView = Backbone.View.extend({
  tagName: 'div',
  className: 'official-list',

  initialize: function() {
    $('#content').append(this.$el);
    this.render();
  },

  render: function() {
    var listItems = sp.officials.where({visible: true}).map(function(o){
      return (new sp.ListItemView({model: o, id: o.get('id')})).render().el;
    });

    this.$el.append(listItems);
    return this;
  },

  reset: function() {
    this.$el.html('');
    this.render();
  }
});

// "Detail" view for official. Generated by click of official 
// name in ListItemView or by url profile/:id
sp.ProfileView = Backbone.View.extend({
  tagName: 'div',
  className: 'official-profile',

  events: {
    'click a': 'close'
  },

  initialize: function() {
    this.template =  _.template($('.tmpl-official-profile').html());
    this.model.on('change', this.render, this);
    this.dispatcher = sp.dispatcher;
  },

  render: function() {
    this.$el.html(this.template((this.model.toJSON())));
    return this;
  },

  close: function() {
    this.remove();
    this.unbind();
    this.dispatcher.trigger('close-profile', this);
  }
});

// Generates global UI components and subviews
sp.AppView = Backbone.View.extend({
  initialize: function() {
    this.$el.find('.filter.party').append(this.createSelect('party'));
    this.$el.find('.filter.position').append(this.createSelect('position'));
    this.filter = {party: 'all', position: 'all'};

    this.on('update:filter', this.setVisibleModels, this);
    sp.router.on('route:list', this.setVisibleModels, this);

    sp.dispatcher = _.clone(Backbone.Events);
    this.dispatcher = sp.dispatcher;
    this.dispatcher.on('open-profile', this.openProfile, this);
    this.dispatcher.on('close-profile', this.closeProfile, this);

    sp.list = new sp.ListView({collection: sp.officials});
  },

  events: {
    'change .filter select': 'updateFilter'
  },

  openProfile: function(view) {
    var profile = new sp.ProfileView({
      model: view.model,
      id: view.model.get('id') + '-profile'
    }).render().el;

    this.$el.find('.official-list').hide();
    this.$el.append(profile);
    sp.router.navigate('profile/' + view.model.get('id'));
  },

  closeProfile: function(view) {
    this.$el.find('.official-list').show();
    sp.router.navigate('/');
  },

  createSelect: function(type) {
    var filter = this.$el.find('.filter.' + type),
      select = $('<select/>', {
        html: '<option value="all">All</option>',
        class: type
      });
 
    _.each(_.uniq(sp.officials.pluck(type)), function(item) {
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
  
  updateFilter: function(e) {
    this.filter[e.currentTarget.className] = e.currentTarget.value;
    this.trigger('update:filter');
    sp.router.navigate('list/' + this.filter.party + '/' + this.filter.position);
  },

  setVisibleModels: function() {
    sp.officials.each(function(o) {
      o.updateVisible(this.filter.party, this.filter.position || 'all');
    }, this);

    sp.list.reset();
  }
});

sp.AppRouter = Backbone.Router.extend({
  routes: {
    'list/:party':            'updateFilter',
    'list/:party/:position':  'updateFilter',
    'profile/:id':            'profile'
  },

  updateFilter: function(party, position) {
    // This shouldn't modify the sp.app.filters directly
    // Should pass along new values in event.

    //sp.app.filter.party = party;
    //sp.app.filter.position = position || 'all';
    //sp.app.trigger('change:filter');
  }
});
  
$(document).ready(function() {
  sp.officials = new sp.OfficialCollection(data);
  sp.router = new sp.AppRouter();
  Backbone.history.start();

  sp.app = new sp.AppView({el: '#content'});
});