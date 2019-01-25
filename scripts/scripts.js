var xhr;
var searching = false;

// Initial search call, acts as debouncer
function search() {
  if(!searching && document.getElementById("search").value.length > 0) {
    var cards = document.getElementById("resultsDiv").childNodes;
    if(cards.length > 3) {
      var cardsAnimate = anime({
        targets: cards,
        opacity: 0,
        easing: "easeOutCubic",
        translateY: 100,
        duration: 300
      });
      searching = true;
      window.setTimeout(getSearch, 300);
    } else {
      searching = true;
      getSearch();
    }
  }
}

// Fetches the JSON file using the given keyword
function getSearch() {
  var keyword = document.getElementById("search").value;
  xhr = createCORSRequest("GET", "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + keyword + "&prop=info&srlimit=100&origin=*&inprop=url&utf8=&format=json");
  xhr.send();

  xhr.onload = function() {
    console.log("Responded");
    var data = JSON.parse(xhr.responseText);
    //console.log(data);
    updateSearch(data);
  }

  xhr.onerror = function() {
    console.log("Error");
  }
}

// Updates the CSS with the new JSON file
function updateSearch(data) {
  // Clear old search results
  document.getElementById("resultsDiv").innerHTML = "";

  // Add new search results
  if(data.query.search.length <= 0) {
    noResults();
  } else {
    for(var i = 0; i < data.query.search.length; i++) {
      var card = document.getElementById("resultCard").cloneNode(true);
      document.getElementById("resultsDiv").appendChild(card);
      var cardAtr = card.childNodes;
      //console.log(cardAtr);
      cardAtr[1].innerHTML = data.query.search[i].title;
      cardAtr[3].innerHTML = '"...' + data.query.search[i].snippet + '..."';
      card.setAttribute("onclick", "window.open('https://en.wikipedia.org/?curid=" + data.query.search[i].pageid + "'); return false;")
      card.style.display = "block";
    }
  }
    
  // Adjust footer after search
  document.getElementById("footer").style.marginTop = "-15%";

  // Animate cards
  var cards = document.getElementById("resultsDiv").childNodes;
  var cardsAnimate = anime({
    targets: cards,
    opacity: 0.85,
    easing: "easeOutCubic",
    translateY: 50
  });

  // Move mainTitle and search up
  var mainTitleAnimate = anime({
    targets: "#searchDiv",
    easing: "easeOutCubic",
    translateY: -300
  });

  // Move searchDiv up also
  var resultsAnimate = anime({
    targets: "#resultsDiv",
    easing: "easeOutCubic",
    translateY: -350
  });
  searching = false;
}

// Allows Cross-Origin requests
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if("withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if(typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  xhr.setRequestHeader("Api-User-Agent", "sevonefive-fcc-wiki/1.0");
  
  return xhr;
}

// Event handler for results = 0
function noResults() {
  document.getElementById("resultsDiv").innerHTML = "<h2 style='color: #f4f4f4;'>No results found :(</h2>";
}

// Cool Anime JS stuff
var mainTitleAnimate = anime({
  targets: "#mainTitle",
  opacity: 1,
  easing: "easeOutCubic",
  translateY: 50,
  delay: 500
});

var searchBoxAnimate = anime({
  targets: "#searchBox",
  opacity: 1,
  easing: "easeOutCubic",
  translateY: -50,
  delay: 750
});

var footernimate = anime({
  targets: "#footer",
  opacity: 0.75,
  easing: "easeOutCubic",
  translateY: 50,
  delay: 1000
});

// Card:hover event handlers
function cardHoverIn(x) {
  x.style.opacity = 1;
}

function cardHoverOut(x) {
  x.style.opacity = 0.85;
}


