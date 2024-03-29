package blog.mazleo.ruvacant.service.state.binders;

import blog.mazleo.ruvacant.service.database.DatabaseService;
import blog.mazleo.ruvacant.service.state.ApplicationState;
import blog.mazleo.ruvacant.service.state.ApplicationStateBinder;
import blog.mazleo.ruvacant.service.state.ApplicationStateBinding;
import blog.mazleo.ruvacant.service.state.ApplicationStateManager;
import blog.mazleo.ruvacant.service.state.util.StateBinderUtil;
import blog.mazleo.ruvacant.service.web.RequestService;
import javax.inject.Inject;
import javax.inject.Singleton;

/** State binder for the request service. */
@Singleton
public final class RequestBinder implements ApplicationStateBinder {

  private final RequestService requestService;
  private final StateBinderUtil stateBinderUtil;
  private DatabaseService databaseService;

  @Inject
  RequestBinder(
      RequestService requestService,
      StateBinderUtil stateBinderUtil,
      DatabaseService databaseService) {
    this.requestService = requestService;
    this.stateBinderUtil = stateBinderUtil;
    this.databaseService = databaseService;
  }

  @Override
  public void bind(ApplicationStateManager stateManager) {
    bindApplicationStart(stateManager);
    bindSubjectsRequest(stateManager);
    bindSubjectsRequested(stateManager);
    bindCoursesRequest(stateManager);
    bindCoursesRequested(stateManager);
  }

  @Override
  public void reset() {
    requestService.reset();
  }

  private void bindApplicationStart(ApplicationStateManager stateManager) {
    stateManager.registerStateBinding(
        ApplicationState.APPLICATION_START.getState(),
        stateBinderUtil.getAsyncBinding(
            unused -> {
              if (!databaseService.hasData()) {
                stateManager.enterState(ApplicationState.REQUESTING_DATA.getState());
                stateManager.enterState(ApplicationState.SUBJECTS_REQUEST.getState());
              }
              stateManager.exitState(ApplicationState.APPLICATION_START.getState());
              return null;
            }),
        StateBinding.REQUEST_SUBJECT_INFO.getId());
  }

  private void bindSubjectsRequest(ApplicationStateManager stateManager) {
    ApplicationStateBinding subjectsRequestBinding =
        stateBinderUtil.getAsyncBinding(
            unused -> {
              requestService.initiateSubjectsRequest();
              return null;
            });
    stateManager.registerStateBinding(
        ApplicationState.SUBJECTS_REQUEST.getState(),
        subjectsRequestBinding,
        StateBinding.REQUEST_SUBJECT_INFO.getId());
  }

  private void bindSubjectsRequested(ApplicationStateManager stateManager) {
    ApplicationStateBinding subjectsRequestedBinding =
        stateBinderUtil.getAsyncBinding(
            unused -> {
              stateManager.exitState(ApplicationState.SUBJECTS_REQUESTED.getState());
              stateManager.enterState(ApplicationState.COURSES_REQUEST.getState());
              return null;
            });
    stateManager.registerStateBinding(
        ApplicationState.SUBJECTS_REQUESTED.getState(),
        subjectsRequestedBinding,
        StateBinding.REQUEST_SUBJECT_INFO.getId());
  }

  private void bindCoursesRequest(ApplicationStateManager stateManager) {
    ApplicationStateBinding coursesRequestBinding =
        stateBinderUtil.getAsyncBinding(
            unused -> {
              requestService.initiateClassInfosRequests();
              return null;
            });
    stateManager.registerStateBinding(
        ApplicationState.COURSES_REQUEST.getState(),
        coursesRequestBinding,
        StateBinding.REQUEST_COURSE_INFO.getId());
  }

  private void bindCoursesRequested(ApplicationStateManager stateManager) {
    ApplicationStateBinding coursesRequestedBinding =
        stateBinderUtil.getAsyncBinding(
            unused -> {
              stateManager.exitState(ApplicationState.COURSES_REQUESTED.getState());
              stateManager.exitState(ApplicationState.REQUESTING_DATA.getState());
              stateManager.enterState(ApplicationState.PLACES_AGGREGATING.getState());
              return null;
            });
    stateManager.registerStateBinding(
        ApplicationState.COURSES_REQUESTED.getState(),
        coursesRequestedBinding,
        StateBinding.REQUEST_COURSE_INFO.getId());
  }
}
