import icons from '../../img/icons.svg';
export default class View {
  _data;

  /**
   * render 受け取ったObjectをDOMに変換する場所
   * @param {Object | Object[]} data　dataは、必要なHTMLの生成などに使うデータ群
   * @param {boolean} [render=true]　falseの場合は、DOMのみ返し、renderの中でのDOM挿入を行わない。
   * @returns {undefined | string} renderがtrueの場合はmarkupが返却される
   * @this {Object} Viewインスタンス
   * @author NAGATA
   * @todo 実装確認済
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(this._errorMessage);

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    console.log(data);
    const newMarkup = this._generateMarkup();
    // HTMLのテキストを引数に渡すことで親を持たないdocumentFragmentを生成する
    const newFragment = document
      .createRange()
      .createContextualFragment(newMarkup);
    // documentFragmentはNodeのプロパティを継承しているためquarySelectAllやappend prependが使用できる。
    const newElement = Array.from(newFragment.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = 'error') {
    const markup = `
            <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `<div class="spinner">
        <svg>
        <use href="${icons}#icon-loader"></use>
        </svg>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
