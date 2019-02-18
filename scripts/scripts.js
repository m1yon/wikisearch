var xhr;
var searching = false;

// initial search call, acts as debouncer
const search = (searchboxType) => {
  // if not searching and search isn't null
  if(!searching && document.getElementById(searchboxType).value.length > 0) {
    // clear search results
    document.getElementById("resultsDiv").innerHTML = "";

    // hide footer during search
    document.getElementById("footer").style.display = "none";

    // initial search
    if(searchboxType == "search") {
      // move mainTitle and search up
      document.getElementById("mainTitle").style.display = "none";
      document.getElementById("mainTitleAlt").style.display = "flex";
      
      document.getElementById("searchAlt").value = document.getElementById("search").value;
    }

    // start searching
    searching = true;
    getSearch(searchboxType);
  }
}

// fetches the JSON file using the given keyword
const getSearch = (searchboxType) => {
  // searchbox user input
  var keyword = document.getElementById(searchboxType).value;

  // generate api call
  xhr = createCORSRequest("GET", `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${keyword}&prop=info&srlimit=100&origin=*&inprop=url&utf8=&format=json`);
  if(xhr) {
    xhr.send();
  } else {
    console.error("CORS not support by browser.")
    return;
  }


  // successful call
  xhr.onload = function() {
    var data = JSON.parse(xhr.responseText);
    updateSearch(data);
  }

  // error handler
  xhr.onerror = function() {
    console.log("Error");
  }
}

// updates the CSS with the new JSON file
const updateSearch = (data) => {
  if(data.query.search.length <= 0) {
    // no results were found
    noResults();
  } else {
    // results were found, add new search results
    for(var i = 0; i < data.query.search.length; i++) {
      var card = document.getElementById("resultCard").cloneNode(true); // clone children too (true)
      document.getElementById("resultsDiv").appendChild(card);

      var cardAtr = card.childNodes;
      cardAtr[1].innerHTML = data.query.search[i].title;
      cardAtr[1].href = `https://en.wikipedia.org/?curid=${data.query.search[i].pageid}`;
      cardAtr[3].innerHTML = `https://en.wikipedia.org/?curid=${data.query.search[i].pageid}`;
      cardAtr[5].innerHTML = `"...${data.query.search[i].snippet}..."`;
      card.style.display = "flex";
    }
  }

  document.getElementById("footer").style.display = "block";
  searching = false;
}

// allows cross-origin requests
const createCORSRequest = (method, url) => {
  var xhr = new XMLHttpRequest();
  // check if xhr is an XMLHTTPRequest2 object (Chrome, Firefox, etc.)
  if("withCredentials" in xhr) {
    xhr.open(method, url, true);
  // check if xhr is an XDomainRequest object (IE)
  } else if(typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  // else CORS is not supported by the current browser
  } else {
    xhr = null;
  }

  // Wikipedia requires an Api-User-Agent header
  xhr.setRequestHeader("Api-User-Agent", "sevonefive-wiki/1.0");
  return xhr;
}

// event handler for results = 0
const noResults = () => {
  document.getElementById("resultsDiv").innerHTML = "<h2 style='color: #f4f4f4;'>No results found :(</h2>";
}


