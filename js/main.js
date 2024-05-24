$(document).ready(function () {
  var _url = "https://my-json-server.typicode.com/Ar-Study/animalapi/animal";

  var dataResults = "";
  var optionResults = "";
  var categories = [];

  function renderPage(data) {
    $.get(_url, function (data) {
      $.each(data, function (key, items) {
        _cat = items.scientific_name;

        dataResults +=
          "<div>" +
          "<h3>" +
          items.common_name +
          "</h3>" +
          "<p>" +
          items.scientific_name +
          "</p>";
        ("</div>");

        if ($.inArray(_cat, categories) == -1) {
          categories.push(_cat);
          optionResults += "<option value='" + _cat + "'>" + _cat + "</option>";
        }
      });
      $("#animals").html(dataResults);
      $("#cat_select").html(
        "<option value='all'>semua</option>" + optionResults
      );
    });
  }

  var networkDataReceived = false;

  // fresh data from online
  var networkUpdate = fetch(_url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      networkDataReceived = true;
      renderPage(data);
    });

  // return data from cache
  caches
    .match(_url)
    .then(function (response) {
      if (!response) throw Error("no data on cache");
      return response.json();
    })
    .then(function (data) {
      if (!networkDataReceived) {
        renderPage(data);
      }
    })
    .catch(function () {
      return networkUpdate;
    });

  $("#cat_select").on("change", function () {
    updateAnimal($(this).val());
  });

  function updateAnimal(cat) {
    var dataResults = "";
    var _newUrl = _url;

    if (cat != "all") _newUrl = _url + "?scientific_name=" + cat;
    $.get(_newUrl, function (data) {
      $.each(data, function (key, items) {
        _cat = items.scientific_name;

        dataResults +=
          "<div>" +
          "<h3>" +
          items.common_name +
          "</h3>" +
          "<p>" +
          items.scientific_name +
          "</p>";
        ("</div>");
      });
      $("#animals").html(dataResults);
    });
  }
});

window.addEventListener("load", () => {
  // Is service worker available?
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/serviceworker.js")
      .then(() => {
        console.log("Service worker registered!");
      })
      .catch((error) => {
        console.warn("Error registering service worker:");
        console.warn(error);
      });
  }
});
