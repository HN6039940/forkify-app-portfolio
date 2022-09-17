import View from './views.js';

class SearchView extends View {
  #parentEl = document.querySelector('.search');

  getQuery() {
    return this.#parentEl.querySelector('.search__field').value;
  }

  clearInput() {
    return (this.#parentEl.querySelector('.search__field').value = '');
  }

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
