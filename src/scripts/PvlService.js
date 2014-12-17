/** ngInject **/
function PvlService($http, $q, $sce, io) {
  let apiHost = "https://ponyvillelive.com";
  let apiBase = `${apiHost}/api`;

  var nowPlayingCache = {},
      nowPlayingSocket = io("wss://api.ponyvillelive.com", {path: '/live'});

  nowPlayingSocket.on('nowplaying', data => {
    for(var shortcode in data) {
      if(!nowPlayingCache.hasOwnProperty(shortcode)) {
        nowPlayingCache[shortcode] = data[shortcode];
      } else {
        // TODO: update track history!
      }
    }
  });
  
  function getStations(type) {
    var deferred = $q.defer();

    $http
      .get(this.apiBase + "/station/list/category/" + type, {
        transformResponse: function(data) {
          var payload = JSON.parse(data),
              stations = payload.result;

          stations.forEach(function(station) {
            station.safe_img_url = '';
            station.stream_url = $sce.trustAsResourceUrl(station.stream_url);
            $http
              .get(station.image_url, {responseType: 'blob'})
              .success(function(response, status, headers, config) {
                var fileUrl = URL.createObjectURL(response);
                station.safe_img_url = $sce.trustAsResourceUrl(fileUrl);
              });
          });
            
          return payload;
        }
      })
      .success(function(json) {
        deferred.resolve(json.result);
      })
      .error(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
  }

  function getNowPlaying() {
    return nowPlayingCache;
  }

  return {apiBase, getStations, getNowPlaying};
}

angular
    .module('PVL')
    .service('PvlService', PvlService);