package blog.mazleo.ruvacant.service.state;

/** All Application states. */
public enum ApplicationState {
  APPLICATION_START("application-start"),
  REQUESTING_DATA("requesting-data"),
  SUBJECTS_REQUEST("subjects-request"),
  SUBJECTS_REQUESTED("subjects-requested"),
  COURSES_REQUEST("courses-request"),
  COURSES_REQUESTED("courses-requested"),
  PLACES_READING("places-reading"),
  PLACES_READ("places-read"),
  PLACES_AGGREGATING("places-aggregating"),
  PLACES_AGGREGATED("places-aggregated"),
  DATA_SAVING("data-saving"),
  DATA_SAVED("data-saved"),
  UNIVERSITY_SCENE_DATA_LOADING("university-scene-data-loading"),
  UNIVERSITY_SCENE_DATA_LOADED("university-scene-data-loaded"),
  ROOM_VIEW_DATA_LOADING("room-view-data-loading"),
  ROOM_VIEW_DATA_LOADED("room-view-data-loaded"),
  CLASSROOM_VIEW_DATA_LOADING("classroom-view-data-loading"),
  CLASSROOM_VIEW_DATA_LOADED("classroom-view-data-loaded"),
  SELECTION_SCENE("selection-scene"),
  SELECTION_SCENE_END("selection-scene-end"),
  UNIVERSITY_SCENE("university-scene"),
  UNIVERSITY_SCENE_ON_RUN("university-scene-on-run"),
  UNIVERSITY_SCENE_END("university-scene-end");

  private final String state;

  ApplicationState(String state) {
    this.state = state;
  }

  public String getState() {
    return state;
  }
}
