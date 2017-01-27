// Show Urls and Cast
var urls = [
  "http://api.tvmaze.com/shows/2368", //Dragon Ball Super
  "http://api.tvmaze.com/shows/2368/cast", //Dragon Ball Super Cast
  "http://api.tvmaze.com/shows/13814", //Sousei no Onmyouji
  "http://api.tvmaze.com/shows/13814/cast", //Sousei no Onmyouji Cast
  "http://api.tvmaze.com/shows/40", //Death Note
  "http://api.tvmaze.com/shows/40/cast", //Death Note Cast
  "http://api.tvmaze.com/shows/1905", //Bleach
  "http://api.tvmaze.com/shows/1905/cast", //Bleach
  "http://api.tvmaze.com/shows/2071", //Fullmetal Alchemist: Brotherhood
  "http://api.tvmaze.com/shows/2071/cast" //Fullmetal Alchemist: Brotherhood Cast
];

//Dragon Ball Super Clips
var dbs = [
  "https://www.youtube.com/embed/DanemKSoytI",
  "https://www.youtube.com/embed/t_4j8RLrbHY",
  "https://www.youtube.com/embed/Y6qr6qxwOMY"
];

//Sousei no Onmyouji Clips
var exorcist = [
  "https://www.youtube.com/embed/p_X5oXO_ZQc",
  "https://www.youtube.com/embed/GkuEbpCJot0",
  "https://www.youtube.com/embed/PhC9p252bKc"
];

//Death Note Clips
var death = [
  "https://www.youtube.com/embed/GHilgpeyZHI",
  "https://www.youtube.com/embed/fAA7uYqayEc",
  "https://www.youtube.com/embed/B7Jq9SNZMtw"
];

//Bleach Clips
var bleach = [
  "https://www.youtube.com/embed/5LIIRCJZAdk",
  "https://www.youtube.com/embed/oZ67d9XSjFs",
  "https://www.youtube.com/embed/wyw3e-qS7-M"
];

//Fullmetal Alchemist Clips
var alchemist = [
  "https://www.youtube.com/embed/MzdRXA1uiNc",
  "https://www.youtube.com/embed/_FTya_31JUk",
  "https://www.youtube.com/embed/3fwXn8Ms0Is"
];

/**
 * This iterates through list of urls and creates network request via promises
 * @param  {[string]} showUrls [Array of string urls to retrieve information about show and cast]
 * @return None
 */
function retrieveAnime(showUrls) {
  var requests = []

  showUrls.forEach(function(url) {
    requests.push($.getJSON(url));
  });

  //Waits until all requests have returned before calling displayShows
  $.when.apply($, requests).done(displayShows);
}

/**
 * This iterates through the list of url request responses
 * and renders show name, url, summary, cast and a random clip
 * in a tabular format
 * @return None
 */
function displayShows() {
  var results = arguments;

  //Iterates through arguments by 2 as two consecutive elements in the array
  //belong to one show (first is show information, second is cast information)
  for (var i = 0; i < results.length; i+=2) {
    var show = results[i][0];
    var cast = results[i+1][0];

    var castText = '';

    //Iterates through cast
    for (var j = 0; j < cast.length; j++) {
      castText += (cast[j].person.name + '; ');
    }

    var table = $('table');
    table.append('<tr>' +
      '<td>' + show.name + '</td>' +
      '<td><a href="' + show.url + '">'+ show.url +'</a></td>' +
      '<td>' + show.summary + '</td>' +
      '<td>' + castText + '</td>' +
      '<td>' + randomizeShowClip(show.name) + '</td>' +
      '</tr>'
    );
  }
}

/**
 * Given a show name, this will return a random youtube clip from multiple arrays
 * @param  {[string]} name [Show name that needs a random youtube clip]
 * @return {[string]}      [String containing iframe html structure with random clip url inserted]
 */
function randomizeShowClip(name) {
  var randomIndex = Math.floor(Math.random() * 3);
  var url = '';

  switch(name) {
    case 'Dragon Ball Super': {
      url = dbs[randomIndex];
      break;
    }
    case 'Sousei no Onmyouji': {
      url = exorcist[randomIndex];
      break;
    }
    case 'Death Note': {
      url = death[randomIndex];
      break;
    }
    case 'Bleach': {
      url = bleach[randomIndex];
      break;
    }
    case 'Fullmetal Alchemist: Brotherhood': {
      url = alchemist[randomIndex];
      break;
    }
  }

  return '<iframe width="560" height="315" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
}

// Calls retrieveAnime with urls above to initiate network requests and retrieve data
retrieveAnime(urls);
