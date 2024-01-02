package blog.mazleo.ruvacant.ui.selectionview.activities;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import blog.mazleo.ruvacant.R;
import blog.mazleo.ruvacant.info.UniversityCampusUtil;
import blog.mazleo.ruvacant.info.UniversityLevelUtil;
import blog.mazleo.ruvacant.info.UniversitySemesterUtil;
import blog.mazleo.ruvacant.service.state.ApplicationState;
import blog.mazleo.ruvacant.service.state.ApplicationStateManager;
import blog.mazleo.ruvacant.shared.ApplicationData;
import blog.mazleo.ruvacant.shared.SharedApplicationData;
import blog.mazleo.ruvacant.ui.content.ContentActivity;
import blog.mazleo.ruvacant.ui.selectionview.dialogs.UniversitySelection;
import blog.mazleo.ruvacant.ui.selectionview.dialogs.UniversitySelectionDialogFactory;
import dagger.hilt.android.AndroidEntryPoint;
import javax.inject.Inject;

/** The selection activity. */
@AndroidEntryPoint
public final class SelectionActivity extends AppCompatActivity {

  @Inject ApplicationStateManager stateManager;
  @Inject SharedApplicationData sharedApplicationData;

  private Button semesterButton;
  private Button campusButton;
  private Button levelButton;
  private Button selectButton;

  private Dialog semesterDialog;
  private Dialog campusDialog;
  private Dialog levelDialog;

  private boolean isSemesterSelected = true;
  private boolean isCampusSelected = false;
  private boolean isLevelSelected = false;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_selection);

    semesterButton = (Button) findViewById(R.id.semester_selection);
    campusButton = (Button) findViewById(R.id.campus_selection);
    levelButton = (Button) findViewById(R.id.level_selection);
    selectButton = (Button) findViewById(R.id.select_button_selections);

    semesterDialog =
        UniversitySelectionDialogFactory.create(
            UniversitySelection.SEMESTER.getSelection(),
            semesterButton,
            SelectionActivity.this,
            () -> {},
            this::enableSaveButton);
    campusDialog =
        UniversitySelectionDialogFactory.create(
            UniversitySelection.CAMPUS.getSelection(),
            campusButton,
            SelectionActivity.this,
            () -> isCampusSelected = true,
            this::enableSaveButton);
    levelDialog =
        UniversitySelectionDialogFactory.create(
            UniversitySelection.LEVEL.getSelection(),
            levelButton,
            SelectionActivity.this,
            () -> isLevelSelected = true,
            this::enableSaveButton);

    semesterButton.setText(
        String.format(
            "%s %s",
            UniversitySemesterUtil.getCurrentSemester(),
            UniversitySemesterUtil.getCurrentSemesterYear()));

    semesterButton.setOnClickListener(view -> semesterDialog.show());
    campusButton.setOnClickListener(view -> campusDialog.show());
    levelButton.setOnClickListener(view -> levelDialog.show());

    selectButton.setOnClickListener(
        view -> {
          String semesterCode =
              String.format(
                  "%s%s",
                  UniversitySemesterUtil.getSemesterCodeFromString(
                      String.valueOf(semesterButton.getText())),
                  UniversitySemesterUtil.getSemesterYearFromString(
                      String.valueOf(semesterButton.getText())));
          String campusCode =
              UniversityCampusUtil.getCampusCodeFromString(String.valueOf(campusButton.getText()));
          String levelCode =
              UniversityLevelUtil.getLevelCodeFromString(String.valueOf(levelButton.getText()));

          sharedApplicationData.addData(ApplicationData.SEMESTER_CODE.getTag(), semesterCode);
          sharedApplicationData.addData(ApplicationData.CAMPUS_CODE.getTag(), campusCode);
          sharedApplicationData.addData(ApplicationData.LEVEL_CODE.getTag(), levelCode);

          Intent intent = new Intent(this, ContentActivity.class);
          startActivity(intent);
        });
  }

  @Override
  protected void onStart() {
    super.onStart();
    stateManager.exitState(ApplicationState.APPLICATION_START.getState());
    stateManager.enterState(ApplicationState.PLACES_READING.getState());
    stateManager.enterState(ApplicationState.REQUESTING_DATA.getState());
    stateManager.enterState(ApplicationState.SUBJECTS_REQUEST.getState());
  }

  private void enableSaveButton() {
    if (isSemesterSelected && isCampusSelected && isLevelSelected) {
      selectButton.setEnabled(true);
      selectButton.setBackgroundColor(getResources().getColor(R.color.red_main, getTheme()));
    }
  }
}