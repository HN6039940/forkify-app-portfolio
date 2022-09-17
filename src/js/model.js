import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { Ajax } from './helper.js';

export const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipe = function (data) {
  let { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await Ajax(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipe(data);
    console.log(state.bookmarks, state.recipe.title);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await Ajax(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data.data.recipes);
    state.search.results = data.data.recipes.map(rec => {
      return {
        publisher: rec.publisher,
        image: rec.image_url,
        title: rec.title,
        id: rec.id,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(err);
  }
};

export const getSerachResultsPage = function (page = (state.search.page = 1)) {
  console.log(state.search);
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  // state.bookmarks = state.bookmarks.filter(
  //   bookmark => bookmark.id !== recipe.id && bookmark.bookmarked === true
  // );
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

const clearStorage = function () {
  localStorage.clear('bookmark');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(entry => {
        const ingArr = entry[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error('Wrong format!');
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      ingredients,
      servings: +newRecipe.servings,
    };
    const data = await Ajax(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

init();
// clearStorage();
