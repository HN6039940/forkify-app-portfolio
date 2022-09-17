import View from './views.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = Number(btn.dataset.goto);
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    console.log(this._data);
    const curNum = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (curNum === 1 && numPage > 1) {
      return this._nextBtn(curNum);
    }
    if (curNum === numPage && numPage > 1) {
      return this._prevBtn(curNum);
    }
    if (curNum < numPage && numPage > 1) {
      return this._bothBtn(curNum);
    }
    return '';
  }

  _prevBtn(num) {
    return `  
    <button data-goto="${num - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${num - 1}</span>
    </button> `;
  }

  _nextBtn(num) {
    return `
    <button data-goto="${num + 1}" class="btn--inline pagination__btn--next">
      <span>Page ${num + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
  }

  _bothBtn(num) {
    return ` 
     <button data-goto="${num - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${num - 1}</span>
    </button>
    <button data-goto="${num + 1}" class="btn--inline pagination__btn--next">
      <span>Page ${num + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
  `;
  }
}

export default new PaginationView();
