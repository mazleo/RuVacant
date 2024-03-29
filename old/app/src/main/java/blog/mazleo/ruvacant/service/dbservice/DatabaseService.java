package blog.mazleo.ruvacant.service.dbservice;

import android.app.Activity;
import android.util.Log;

import androidx.room.Room;

import java.util.ArrayList;
import java.util.List;

import blog.mazleo.ruvacant.model.Building;
import blog.mazleo.ruvacant.model.Campus;
import blog.mazleo.ruvacant.model.Class;
import blog.mazleo.ruvacant.model.ClassInstructor;
import blog.mazleo.ruvacant.model.Course;
import blog.mazleo.ruvacant.model.Instructor;
import blog.mazleo.ruvacant.model.Level;
import blog.mazleo.ruvacant.model.Meeting;
import blog.mazleo.ruvacant.model.Option;
import blog.mazleo.ruvacant.model.SchoolCampus;
import blog.mazleo.ruvacant.model.Semester;
import blog.mazleo.ruvacant.model.Subject;
import blog.mazleo.ruvacant.repository.DatabaseRepository;
import blog.mazleo.ruvacant.utils.DatabaseUtil;
import io.reactivex.Completable;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;

public class DatabaseService {
    private DatabaseRepository databaseRepository;
    private AppDatabase appDatabase;
    private Activity activity;
    private Disposable disposable;

    public DatabaseService(DatabaseRepository databaseRepository, Activity activity) {
        this.databaseRepository = databaseRepository;
        this.activity = activity;
        this.disposable = null;
        buildDatabase();
    }

    private void buildDatabase() {
        Log.d("APPDEBUG", "Building database...");
        this.appDatabase = Room.databaseBuilder(activity.getApplicationContext(), AppDatabase.class, DatabaseUtil.DATABASE_NAME).build();
    }

    public void setupInitialDatabase(Option option, List<SchoolCampus> schoolCampuses, List<Level> levels, List<Semester> semesters, List<Campus> campuses) {
        Log.d("APPDEBUG", "Setting up initial database...");

        List<Completable> completableCollection = new ArrayList<>();
        populateCompletableCollectionForInitialSetup(option, schoolCampuses, levels, semesters, campuses, completableCollection);

        Completable finalCompletable = Completable.concat(completableCollection);
        this.disposable = finalCompletable
                .subscribeOn(Schedulers.computation())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        this::onInitialSetupComplete,
                        this::onError
                );
    }

    private void populateCompletableCollectionForInitialSetup(Option option, List<SchoolCampus> schoolCampuses, List<Level> levels, List<Semester> semesters, List<Campus> campuses, List<Completable> completableCollection) {
        completableCollection.add(appDatabase.setupDao().insertSchoolCampuses(schoolCampuses.toArray(new SchoolCampus[schoolCampuses.size()])));
        completableCollection.add(appDatabase.setupDao().insertLevels(levels.toArray(new Level[levels.size()])));
        completableCollection.add(appDatabase.setupDao().insertSemesters(semesters.toArray(new Semester[semesters.size()])));
        completableCollection.add(appDatabase.setupDao().insertCampuses(campuses.toArray(new Campus[campuses.size()])));
        completableCollection.add(appDatabase.setupDao().insertOption(option));
    }

    private void onInitialSetupComplete() {
        Log.d("APPDEBUG", "Initial database setup complete...");
        disposable = null;
        databaseRepository.onInitialDatabaseSetupComplete();
    }

    public void saveLocations(List<Building> buildings, List<blog.mazleo.ruvacant.model.Room> rooms) {
        Log.d("APPDEBUG", "Saving locations...");

        List<Completable> completableCollection = new ArrayList<>();
        populateCompletableCollectionForLocations(buildings, rooms, completableCollection);

        Completable finalCompletable = Completable.concat(completableCollection);
        disposable = finalCompletable
                .subscribeOn(Schedulers.computation())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        this::onSaveLocationsComplete,
                        this::onError
                );
    }

    private void populateCompletableCollectionForLocations(List<Building> buildings, List<blog.mazleo.ruvacant.model.Room> rooms, List<Completable> completableCollection) {
        completableCollection.add(appDatabase.locationDao().insertBuildings(buildings.toArray(new Building[buildings.size()])));
        completableCollection.add(appDatabase.locationDao().insertRooms(rooms.toArray(new blog.mazleo.ruvacant.model.Room[rooms.size()])));
    }

    private void onSaveLocationsComplete() {
        Log.d("APPDEBUG", "Saving locations complete...");
        disposable = null;
        databaseRepository.onSaveLocationsComplete();
    }

    public void saveCourses(List<Subject> subjects, List<Course> courses, List<Class> classes, List<Instructor> instructors, List<ClassInstructor> classesInstructors, List<Meeting> meetings) {
        Log.d("APPDEBUG", "Saving courses...");

        List<Completable> completableCollection = new ArrayList<>();
        populateCompletableCollectionForCourses(subjects, courses, classes, instructors, classesInstructors, meetings, completableCollection);

        Completable finalCompletable = Completable.concat(completableCollection);
        disposable = finalCompletable
                .subscribeOn(Schedulers.computation())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        this::onSaveCoursesComplete,
                        this::onError
                );
    }

    private void populateCompletableCollectionForCourses(List<Subject> subjects, List<Course> courses, List<Class> classes, List<Instructor> instructors, List<ClassInstructor> classesInstructors, List<Meeting> meetings, List<Completable> completableCollection) {
        completableCollection.add(appDatabase.courseDao().insertSubjects(subjects.toArray(new Subject[subjects.size()])));
        completableCollection.add(appDatabase.courseDao().insertCourses(courses.toArray(new Course[courses.size()])));
        completableCollection.add(appDatabase.courseDao().insertClasses(classes.toArray(new Class[classes.size()])));
        completableCollection.add(appDatabase.courseDao().insertInstructors(instructors.toArray(new Instructor[instructors.size()])));
        completableCollection.add(appDatabase.courseDao().insertClassesInstructors(classesInstructors.toArray(new ClassInstructor[classesInstructors.size()])));
        completableCollection.add(appDatabase.courseDao().insertMeetings(meetings.toArray(new Meeting[meetings.size()])));
    }

    private void onSaveCoursesComplete() {
        Log.d("APPDEBUG", "Saving courses complete...");
        disposable = null;
        databaseRepository.onSaveCoursesComplete();
    }

    private void onError(Throwable e) {
        Log.d("APPDEBUG", "A database error has occurred...");
        String message = "An error has occurred while saving data. Please try again.";
        databaseRepository.onError(e, message);
        cleanUp();
    }

    public void cleanUp() {
        Log.d("APPDEBUG", "Performing full cleanup of database...");
        if (appDatabase != null) {
            Completable.fromAction(() -> appDatabase.clearAllTables())
                    .subscribeOn(Schedulers.computation())
                    .subscribe(() -> Log.d("APPDEBUG", "Database cleared..."));
        }
        if (disposable != null) {
            disposable.dispose();
            disposable = null;
        }
        databaseRepository = null;
        activity = null;
    }

    public void cleanUpKeepData() {
        Log.d("APPDEBUG", "Performing partial cleanup of database...");
        if (disposable != null) {
            disposable.dispose();
            disposable = null;
        }
        databaseRepository = null;
        activity = null;
    }

    public AppDatabase getAppDatabase() {
        return appDatabase;
    }
}
