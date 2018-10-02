var html5demoTweets = (function (user, elm, status) {
  var elm = document.querySelector(elm),
      status = document.querySelector(status),
      db = null,
      showingTimeline = true,
      latest = 0;
    
  function initDb() {
    status.innerHTML = 'initialising database';
    try {
      if (window.openDatabase) {
        db = openDatabase("html5demos", "1.0", "HTML 5 Database API example", 200000);
        if (db) {
          db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS tweets (id REAL UNIQUE, text TEXT, created_at TEXT, screen_name TEXT, mention BOOLEAN)", [], function (tx, result) { 
              clear();
              html5demoTweets.timeline();
            });
          });
        } else {
          status.innerHTML = 'error occurred trying to open DB';
        }
      } else {
        status.innerHTML = 'Web Databases not supported';
      }
    } catch (e) {
      status.innerHTML = 'error occurred during DB init, Web Database supported?';
    }
  }

  function load(mention, url) {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM tweets WHERE mention = ? AND id > ? ORDER BY id DESC', [mention, latest], function (tx, results) {
        var tweets = [], i, since_id = 0, script;
        
        if (results.rows && results.rows.length) {
          status.innerHTML = 'loading ' + (showingTimeline ? 'timeline' : 'mentions') + ' from DB';
          for (i = 0; i < results.rows.length; i++) {
            if (since_id == 0) {
              since_id = results.rows.item(i).id;
            }
            tweets.push(results.rows.item(i));
          }
          
          show(tweets);
        } else if (latest) {
          since_id = latest;
        }

        if (since_id) {
          url += '&since_id=' + since_id;
        }

        url += '&_cb=' + Math.random();

        script = document.createElement('script');
        script.src = url;
        script.id = "twitterJSON";
        document.body.appendChild(script);
      }, function (tx) {
        status.innerHTML = 'error occurred, please reset DB';
      });
    });
    
  }
  
  function show(tweets) {
    if (tweets.length) {
      // status.innerHTML = 'showing ' + tweets.length + ' tweets';
      tweets = tweets.reverse();
      var html = '', li;
      for (var i = 0; i < tweets.length; i++) {
        li = document.createElement('li');
        li.innerHTML = ify.clean(tweets[i].text) + ' (<a href="http://twitter.com/' + tweets[i].screen_name + '/status/' + tweets[i].id + '">' + tweets[i].created_at + '</a>)';
        if (elm.firstChild) {
          elm.insertBefore(li, elm.firstChild);
        } else {
          elm.appendChild(li);
        }
        
        latest = tweets[i].id;
      }
    }
  }
  
  function clear() {
    latest = 0;
    elm.innerHTML = '';
  }
  
  return {
    latest: function () {
      return latest;
    },
    
    init: initDb,
    
    timeline: function () {
      status.innerHTML = 'loading timeline';
      if (!showingTimeline) {
        clear();
      }
      
      showingTimeline = true;
      
      var url = 'http://twitter.com/statuses/user_timeline/' + encodeURIComponent(user) + '.json?callback=html5demoTweets.loadTweets';
      load(false, url);
    },
    
    mentions: function () {
      status.innerHTML = 'loading mentions';
      if (showingTimeline) {
        clear();
      }
      
      showingTimeline = false;
      
      var url = 'http://search.twitter.com/search.json?rpp=20&callback=html5demoTweets.loadTweets&q=' + encodeURIComponent('@' + user);
      load(true, url);
    },
    
    reset: function () {
      status.innerHTML = 'resetting database';
      
      db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS tweets', [], function () {
          status.innerHTML = 'database has been cleared - please reload';
          clear();
        });
      });
    },
    
    // public so the JSONP callback can hit it
    loadTweets: function (tweets) {
      var search = false;
      
      document.body.removeChild(document.getElementById('twitterJSON'));
      
      if (typeof tweets == 'string') {
        // error occurred
        return;
      }
      
      if (tweets.results) {
        tweets = tweets.results;
        search = true;
      }
      
      if (tweets.length) {
        status.innerHTML = tweets.length + ' new tweets loaded';

        db.transaction(function (tx) {
          var i;
          for (i = 0; i < tweets.length; i++) {
            if (search) {
              tweets[i].screen_name = tweets[i].from_user;
            } else {
              tweets[i].screen_name = tweets[i].user.screen_name;
            }
            tx.executeSql('INSERT INTO tweets (id, text, created_at, screen_name, mention) values (?, ?, ?, ?, ?)', [tweets[i].id, tweets[i].text, tweets[i].created_at, tweets[i].screen_name, search]);
          }

          show(tweets);
        });
      }
    }
  };
  
})('rem', '#tweets ol', '#status');
// twitter username, element with the list of tweets, status field


var ify = function() {
  var entities = {
      '"' : '&quot;',
      '&' : '&amp;',
      '<' : '&lt;',
      '>' : '&gt;'
  };
  
  return {
    "link": function(t) {
      return t.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+[^\.,\)\s*$]/g, function(m) {
        return '<a href="' + m + '">' + ((m.length > 25) ? m.substr(0, 24) + '...' : m) + '</a>';
      });
    },
    "at": function(t) {
      return t.replace(/(^|[^\w]+)\@([a-zA-Z0-9_]{1,15})/g, function(m, m1, m2) {
        return m1 + '@<a href="http://twitter.com/' + m2 + '">' + m2 + '</a>';
      });
    },
    "hash": function(t) {
      return t.replace(/(^|[^\w]+)\#([a-zA-Z0-9_]+)/g, function(m, m1, m2) {
        return m1 + '#<a href="http://search.twitter.com/search?q=%23' + m2 + '">' + m2 + '</a>';
      });
    },
    "clean": function(tweet) {
      return this.hash(this.at(this.link(tweet)));
    }
  };
}();
