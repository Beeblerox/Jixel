def('Jxl.AssetManager', {
    init: function() {
        this.assets = {};
	    this.batches = [];
    },
    alias: 'Jxl.am',
    singleton: true,
    get: function(name) {
        return this.assets[name];
    },
    reload: function(callback) {
    	var self = this;
    	var ln = this.batches.length, ct = 0;
    	_(this.batches).each(function(batch) {
    	    self.load(batch, function() {
        		ct++;
        		if(callback != undefined && ln == ct) callback();
    	    });
    	});
    },
    load: function(assets, callback, progress) {
    	var self = this,
        ct = 0,
        ln = 0;
        if(assets.images) {
            _(assets.images).each(function(val, key) {
                self.loadAsset('image', key, val, function(asset) {
                   ct++;
                   if(callback != undefined && ct >= ln) callback();
                   if(progress)progress(ct, ln);
                });
                ln++;
            });
        }
        if(assets.sounds) {
            _(assets.sounds).each(function(val, key) {
                self.loadAsset('sound', key, val, function(asset) {
                   ct++;
                   if(callback != undefined && ct >= ln) callback();
                   if(progress)progress(ct, ln);
                });
                ln++;
            });
        }
        if(assets.data) {
           _(assets.data).each(function(val, key) {
                self.loadAsset('data', key, val, function(asset) {
                    ct++;
                    if(callback != undefined && ct >= ln) callback();
                    if(progress)progress(ct, ln);
                });
                ln++;
           });
        }
    },
    loadAsset: function(type, name, src, callback) {
      var self = this;
      if(name in this.assets) {
        if(callback) callback();
        return;
      }
      switch(type) {
        case 'audio':
        case 'sound': 
            var temp = new Audio(src);
            temp.src = src;
            temp.load();
            this.assets[name] = temp;
            Jxl.audio.add(name, temp);
            if(callback) callback(temp);
            break;
        case 'image':
            var temp = document.createElement('img');
            temp.src = src;
            temp.addEventListener('load', function() {
                var can = document.createElement('canvas');
                can.width = this.width;
                can.height = this.height;
                var ctx = can.getContext('2d');
                ctx.drawImage(this, 0, 0);
                self.assets[name] = can;
                if(callback) callback(can);
            }, true);
        break;
        case 'data':
            var xmlHTTP = new XMLHttpRequest();
            xmlHTTP.onreadystatechange = function() {
                if(xmlHTTP.readyState == 4 && xmlHTTP.status==200) {
                    self.assets[name] = xmlHTTP.responseText;
                    if(callback) callback(xmlHTTP.responseText);
                }
            }
            xmlHTTP.open("GET", src, true);
            xmlHTTP.send();
      }
    }
});
