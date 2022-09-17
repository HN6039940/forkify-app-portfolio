import View from './views.js';
import previewView from './previewView.js';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'We could not find that recipe. Please try another one!';

  addHandleBoookmark(handle) {
    window.addEventListener('load', handle());
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
