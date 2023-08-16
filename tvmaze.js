"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episdoesList = $("#episodesList");

const DEFAULT_IMAGE = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const params = new URLSearchParams({ q: term });

  const response = await fetch(`https://api.tvmaze.com/search/shows?${params}`);

  const data = await response.json();

  return data.map(({ show }) =>
  ({
    id: show.id,
    name: show.name,
    summary: show.summary,
    image: show?.image?.original || DEFAULT_IMAGE
  })
  );
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();
  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="image of ${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await fetch(
    `https://api.tvmaze.com/shows/${id}/episodes`
  );

  const data = await response.json();

  return data.map(({ id, name, season, number }) =>
  ({
    id,
    name,
    season,
    number
  })
  );
}
/** Write a clear docstring for this function... */

function displayEpisodes(episodes) {
  $episodesArea.show();
  $episdoesList.empty();

  for (const episode of episodes) {
    const $listItem = $(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`);

    $episdoesList.append($listItem);
  }
}




async function searchEpisodesAndDisplay(showId) {
  const episodes = await getEpisodesOfShow(showId);
  displayEpisodes(episodes);
}


$showsList.on("click", ".Show-getEpisodes", function (evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");
  searchEpisodesAndDisplay(showId);
});
