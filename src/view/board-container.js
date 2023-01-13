import AbstractView from '../framework/view/abstract-view';

function createBoardTemplate() {
  return (`
  <section class="trip-events"></section>
  `);
}

export default class BoardView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }
}
