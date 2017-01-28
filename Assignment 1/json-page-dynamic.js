/**
 * Basic Template that is used for all pages
 * @param  {[string]} pageType [Specify type to render appropriate template]
 * @return Creates a new document with template selected
 */
function renderPage(pageType) {
  var page = ''
  var title = 'Nothing Selected'
  switch(pageType) {
    case 'music': {
      page = renderMusic();
      title = 'Spotify';
      break;
    }
    case 'movies': {
      page = renderMovies();
      title = 'OMDB Movies';
      break;
    }
    case 'jobs': {
      page = renderJobs();
      title = 'Github Jobs'
      break;
    }
  }

  document.open("text/html", "replace");
  // Adding jQuery, Bootstrap and CSS dependencies
  document.write('<!DOCTYPE html><html><header> \
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script> \
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> \
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous"> \
    <link rel="stylesheet" href="json-page-dynamic.css"> \
    </header><body>');
  document.write('<p><input type="button" \
    value="Go Back" onclick="location.reload()"></p>');
  document.write('<h1 class="text-center">' + title + '</h1>');
  document.write(page);
  document.write('</body></html>');
  document.close();
}

/**
 * Renders Music template
 * @return {[string]} [Template for Music Search Page]
 */
function renderMusic() {
  var page = '<div class="container"> \
    <p class="text-center">Welcome to the Spotify section! Here you can search for \
      music related information by artist, song name or album</p> \
    <form id="spotifyForm"> \
      <div class="form-group"> \
        <label for="searchText">Search</label> \
        <input class="form-control" id="searchText" placeholder="Search for anything music related"> \
      </div> \
      <div class="text-center"> \
        <div class="radio-inline"> \
          <label> \
            <input type="radio" name="spotifyRadios" id="artist" value="artist"> \
            Artist \
          </label> \
        </div> \
        <div class="radio-inline"> \
          <label> \
            <input type="radio" name="spotifyRadios" id="album" value="album"> \
            Album \
          </label> \
        </div> \
        <div class="radio-inline"> \
          <label> \
            <input type="radio" name="spotifyRadios" id="track" value="track" checked> \
            Track \
          </label> \
        </div> \
      </div> \
      <div class="text-center"> \
        <button type="button" onclick="musicSubmit()" class="btn btn-success">Search</button> \
      </div> \
    </form> \
  </div>';
  return page;
}

/**
 * Calls api with user information for name and type of search
 * @return {HTML} [Returns HTML if no results, otherwise executes promise and renders results]
 */
function musicSubmit() {
  var type = $('input[name=spotifyRadios]:checked', '#spotifyForm').val()
  var searchText = document.getElementById('searchText').value
  if (searchText.length) {
    $.getJSON('https://api.spotify.com/v1/search', { q: searchText, type: type}).done(renderMusicResults.bind(null, type))
  } else {
    $('#results').remove();
    $('.container').append('<h4 id="results">No Results</h4>');
  }
}

/**
 * Formats results from Music query which will be used in renderResults
 * @param  {[string]} type           [Type of search (artist, album, track))]
 * @param  {[Array of Objects]} requestResults [results from search query]
 * @return {[HTML]}                [Passes data to renderResults, which will output HTML]
 */
function renderMusicResults(type, requestResults) {
  var output = '';
  switch (type) {
    case 'artist': {
      var results = requestResults['artists'];
      var trackResults = []
      for (var i = 0; i < results.items.length; i++) {
        trackResults[i] = {
          name: results.items[i].name,
          genres: '',
          popularity: results.items[i].popularity,
          followers: results.items[i].followers.total
        };
        for(var j = 0; j < results.items[i].genres.length; j++) {
          trackResults[i].genres += (results.items[i].genres[j] + '; ');
        }
      }
      output =  renderResults(trackResults, ['name', 'genres', 'popularity', 'followers'], ['Name', 'Genres', 'Popularity', 'Followers'])
      break;
    }
    case 'album': {
      var results = requestResults['albums'];
      var trackResults = []
      for (var i = 0; i < results.items.length; i++) {
        trackResults[i] = {
          name: results.items[i].name,
          artists: ''
        };
        for(var j = 0; j < results.items[i].artists.length; j++) {
          trackResults[i].artists += (results.items[i].artists[j].name + '; ');
        }
      }
      output =  renderResults(trackResults, ['name', 'artists'], ['Name', 'Artists'])
      break;
    }
    case 'track': {
      var results = requestResults['tracks'];
      var trackResults = []
      for (var i = 0; i < results.items.length; i++) {
        trackResults[i] = {
          name: results.items[i].name,
          artists: '',
          album: results.items[i].album.name,
        };
        for(var j = 0; j < results.items[i].artists.length; j++) {
          trackResults[i].artists += (results.items[i].artists[j].name + '; ');
        }
      }
      renderResults(trackResults, ['name', 'album', 'artists'], ['Name', 'Album', 'Artists'])
      break;
    }
  }
}

/**
 * Renders Movie template
 * @return {[string]} [Template for Movies Search Page]
 */
function renderMovies() {
  var page = '<div class="container"> \
    <p class="text-center">Welcome to the Open Movie Database section! Here you can search for \
      video information by title and type</p> \
    <form id="movieForm"> \
      <div class="form-group"> \
        <label for="videoTitle">Title</label> \
        <input class="form-control" id="videoTitle" placeholder="Enter title of your video"> \
      </div> \
      <div class="text-center"> \
        <div class="radio-inline"> \
          <label> \
            <input type="radio" name="movieRadios" id="movie" value="movie" checked> \
            Movie \
          </label> \
        </div> \
        <div class="radio-inline"> \
          <label> \
            <input type="radio" name="movieRadios" id="series" value="series"> \
            Series \
          </label> \
        </div> \
        <div class="radio-inline"> \
          <label> \
            <input type="radio" name="movieRadios" id="episode" value="episode"> \
            Episode \
          </label> \
        </div> \
      </div> \
      <div class="text-center"> \
        <button type="button" onclick="movieSubmit()" class="btn btn-success">Search</button> \
      </div> \
    </form> \
  </div>';
  return page;
}

/**
 * Calls api with user input for name and type of search
 * @return {HTML} [Returns HTML if no results, otherwise executes promise and renders results]
 */
function movieSubmit() {
  var videoTitle = document.getElementById('videoTitle').value;
  var type = $('input[name=movieRadios]:checked', '#movieForm').val()

  if (videoTitle.length) {
    $.getJSON('http://www.omdbapi.com/', {
      s: videoTitle,
      type: type
    }).done(renderMovieResults)
  } else {
    $('#results').remove();
    $('.container').append('<h4 id="results">No Results</h4>');
  }
}

/**
 * Formats results from Movies query which will be used in renderResults
 * @param  {[Array of Objects]} results [Results from search query]
 * @return {[HTML]}                [Passes data to renderResults, which will output HTML]
 */
function renderMovieResults(results) {
  if (results.Error) {
    $('#results').remove();
    $('.container').append('<h4 id="results">No Results</h4>');
  } else {
    renderResults(results.Search, ['Title', 'Type', 'Year', 'imdbID'], ['Title', 'Type', 'Year', 'IMDB ID'])
  }
}

/**
 * Renders Job template
 * @return {[string]} [Template for Job Search Page]
 */
function renderJobs() {
  var page = '<div class="container"> \
    <p class="text-center">Welcome to the Github Jobs section! Here you can search for \
      jobs posted on github by description, location and full time</p> \
    <form id="jobsForm"> \
      <div class="form-group"> \
        <label for="description">Description</label> \
        <textarea class="form-control" rows="3" id="description" placeholder="Job Description Search"></textarea> \
      </div> \
      <div class="form-group"> \
        <label for="location">Location</label> \
        <input class="form-control" id="location" placeholder="Enter job location"> \
      </div> \
      <div class="checkbox"> \
        <label> \
          <input id="fullTime" type="checkbox" value=""> \
          Full Time \
        </label> \
      </div> \
      <div class="text-center"> \
        <button type="button" onclick="jobSubmit()" class="btn btn-success">Search</button> \
      </div> \
    </form> \
  </div>';
  return page;
}

/**
 * Calls api with user information for name and type of search
 * @return {HTML} [Returns HTML if no results, otherwise executes promise and renders results]
 */
function jobSubmit() {
  var description = document.getElementById('description').value;
  var location = document.getElementById('location').value;
  var fullTime = document.getElementById('fullTime').checked;

  var params = { full_time: fullTime };

  if (description.length) {
    params.description = description;
  }

  if (location.length) {
    params.location = location;
  }

  $.ajax({
    dataType: "jsonp",
    url: "https://jobs.github.com/positions.json",
    data: params,
    success: renderJobResults
  });

}

/**
 * Formats results from Music query which will be used in renderResults
 * @param  {[Array of Objects]} results [results from search query]
 * @return {[HTML]}                [Passes data to renderResults, which will output HTML]
 */
function renderJobResults(results) {
  renderResults(results, ['title', 'location', 'description', 'url', 'type'], ['Title', 'Location', 'Description', 'Application URL', 'Type'])
}

/**
 * Outputs Resuls in Tablular format
 * @param  {[Array of Objects]} results [Contains list of objects from the search response]
 * @param  {[Array of Strings]} fields  [Object fields from results that need to be processed]
 * @param  {[Array of Strings]} headers [Table Headers]
 * @return {[HTML]}         [Modifies existing page to include search results]
 */
function renderResults(results, fields, headers) {
  var output = '<h4 id="results">No Results</h4>';
  if (results.length) {
    output = '<table id="results" class="table table-striped table-hover"><tr>';
    for (var i = 0; i < headers.length; i++) {
      output += ('<th>' + headers[i] + '</th>');
    }
    output += '</tr>';
    for (var i = 0; i < results.length; i++) {
      output += '<tr>';
      for (var j = 0; j < fields.length; j++) {
        output += '<td>' + results[i][fields[j]] + '</td>';
      }
      output +='</tr>';
    }
    output += '</table>';
  }

  $('#results').remove();
  $('.container').append(output);
}
