import * as model from './model.js';
import { SET_TIME } from './config.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import PaginationView from './view/PaginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
  try {
    recipeView.renderSpinner();
    resultsView.update(model.getSerachResultsPage(model.state.search.page));

    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  resultsView.renderSpinner();
  const query = searchView.getQuery();
  searchView.clearInput();
  if (!query) return;
  try {
    await model.loadSearchResults(query);
    resultsView.render(model.getSerachResultsPage());

    PaginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (num) {
  resultsView.render(model.getSerachResultsPage(num));
  PaginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  model.updateServings(newServing);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
    addRecipeView.renderMessage();
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    await new Promise(resolve =>
      resolve(
        setTimeout(() => addRecipeView._generateMarkup(), SET_TIME * 1000)
      )
    );
    await new Promise(resolve =>
      resolve(setTimeout(() => addRecipeView.toggleWindow(), SET_TIME * 2000))
    );
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandleBoookmark(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHandlerBookMark(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// searchBtn.addEventListener('click', async function (e) {
//   e.preventDefault();
//   searchField.value = '';
// });

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
