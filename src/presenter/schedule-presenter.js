import ScheduleView from '../view/schedule-view.js';
import AddPointView from '../view/add-point';
import EditPointView from '../view/edit-point';
import PointView from '../view/point';

import {render} from '../render.js';

export default class SchedulePresenter {
  scheduleComponent = new ScheduleView();

  constructor({scheduleContainer}) {
    this.scheduleContainer = scheduleContainer;
  }

  init() {
    render(this.scheduleComponent, this.scheduleContainer);
    render(new EditPointView(), this.scheduleComponent.getElement());
    render(new AddPointView(), this.scheduleComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.scheduleComponent.getElement());
    }
  }
}
