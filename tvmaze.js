"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

//TODO: global for tinyurl

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
//TODO: const data = res.json()
//TODO: get only needed data out
async function getShowsByTerm(term) {
  const params = new URLSearchParams({ q: term });

  const response = await fetch(`https://api.tvmaze.com/search/shows?${params}`);

  return await response.json();
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();
  for (const show of shows) {
    const currShow = show.show;
    const $show = $(`
        <div data-show-id="${currShow.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${currShow?.image?.original || "https://tinyurl.com/tv-missing"}"
              alt="image of ${currShow.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${currShow.name}</h5>
             <div><small>${currShow.summary}</small></div>
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

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
