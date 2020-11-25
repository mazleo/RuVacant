package blog.mazleo.ruvacant.processor;

import android.app.Activity;

import androidx.lifecycle.MutableLiveData;

import blog.mazleo.ruvacant.model.Option;
import blog.mazleo.ruvacant.viewmodel.CoursesViewModel;
import blog.mazleo.ruvacant.viewmodel.DatabaseViewModel;
import blog.mazleo.ruvacant.viewmodel.LocationsViewModel;

public class DataDownloadProcessor {
    // ----- FIELDS -----
    private Activity currentActivity;
    private Option selectedOptions;

    // ----- VIEWMODELS -----
    private LocationsViewModel locationsViewModel;
    private CoursesViewModel coursesViewModel;
    private DatabaseViewModel databaseViewModel;

    // ----- UI Components -----
    private MutableLiveData<Boolean> dataRetrievalProgress;
    private MutableLiveData<Boolean> dataDownloadProgress;
    private MutableLiveData<Boolean> dataSaveProgress;
    private MutableLiveData<Boolean> onDownloadError;
    private MutableLiveData<Boolean> onSaveError;

    public DataDownloadProcessor() {}

    public DataDownloadProcessor(Activity currentActivity, Option selectedOptions) {
        this.currentActivity = currentActivity;
        this.selectedOptions = selectedOptions;

        this.locationsViewModel = new LocationsViewModel(this);
        this.coursesViewModel = new CoursesViewModel(this);
        this.databaseViewModel = new DatabaseViewModel(currentActivity);

        this.dataRetrievalProgress = new MutableLiveData<>();
        this.dataDownloadProgress = new MutableLiveData<>();
        this.dataSaveProgress = new MutableLiveData<>();
        this.onDownloadError = new MutableLiveData<>();
        this.onSaveError = new MutableLiveData<>();

        this.dataRetrievalProgress.setValue(false);
        this.dataDownloadProgress.setValue(false);
        this.dataSaveProgress.setValue(false);
        this.onDownloadError.setValue(false);
        this.onSaveError.setValue(false);
    }

    public Option getSelectedOptions() {
        return selectedOptions;
    }

    public void setSelectedOptions(Option selectedOptions) {
        this.selectedOptions = selectedOptions;
    }

    public void onSaveError(Throwable e) {
        this.onSaveError.setValue(true);
        this.onSaveError.setValue(false);
        this.dataSaveProgress.setValue(false);
        e.printStackTrace();
        cleanUpDatabase();
    }

    public void cleanUpDatabase() {
        if (this.databaseViewModel != null) {
            this.databaseViewModel.cleanUp();
            this.databaseViewModel = null;
        }
    }

    public LocationsViewModel getLocationsViewModel() {
        return locationsViewModel;
    }

    public CoursesViewModel getCoursesViewModel() {
        return coursesViewModel;
    }

    public boolean isDataDownloadInProgress() {
        return this.dataDownloadProgress.getValue();
    }

    public boolean isDataSaveInProgress() {
        return this.dataSaveProgress.getValue();
    }

    public boolean isDataRetrievalInProgress() {
        return this.dataRetrievalProgress.getValue();
    }
}
