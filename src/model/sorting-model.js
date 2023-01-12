import {generateSorting} from '../mock/sorting';

export default class SortingModel {
  #sortingList = generateSorting();

  get sortingList() {
    return this.#sortingList;
  }
}
