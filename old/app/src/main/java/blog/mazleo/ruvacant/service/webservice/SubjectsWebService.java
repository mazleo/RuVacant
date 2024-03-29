package blog.mazleo.ruvacant.service.webservice;

import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import blog.mazleo.ruvacant.model.Option;
import blog.mazleo.ruvacant.model.Subject;
import blog.mazleo.ruvacant.repository.CoursesRepository;
import blog.mazleo.ruvacant.repository.LocationsRepository;
import blog.mazleo.ruvacant.repository.RepositoryInstance;
import blog.mazleo.ruvacant.service.deserializer.SubjectListDeserializer;
import blog.mazleo.ruvacant.utils.CoursesUtil;
import blog.mazleo.ruvacant.utils.OptionsUtil;
import hu.akarnokd.rxjava3.retrofit.RxJava3CallAdapterFactory;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.annotations.NonNull;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.Observer;
import io.reactivex.rxjava3.disposables.Disposable;
import io.reactivex.rxjava3.schedulers.Schedulers;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class SubjectsWebService implements Observer {
    private RepositoryInstance repository;
    private List<Subject> subjects;
    private Disposable disposable;

    public SubjectsWebService(RepositoryInstance repository) {
        this.repository = repository;
        this.subjects = new ArrayList();
    }

    public void downloadSubjects(Option selectedOption) {
        Log.d("APPDEBUG", "Beginning subjects download...");
        Gson gson = getGson();
        OkHttpClient client = getClient();
        Retrofit retrofit = getRetrofit(gson, client);
        SubjectsService subjectsService = retrofit.create(SubjectsService.class);

        List<Observable> observables = new ArrayList<>();
        Observable<List> originalObservable = subjectsService.retrieveSubjects(
                new StringBuilder()
                        .append(selectedOption.getSemesterMonth())
                        .append(selectedOption.getSemesterYear())
                        .toString(),
                selectedOption.getSchoolCampusCode(),
                selectedOption.getLevelCode()
        );
        observables.add(originalObservable);

        if (repository instanceof LocationsRepository) {
            if (selectedOption.getSemesterMonth() == 0 || selectedOption.getSemesterMonth() == 7) {
                Option fullerOption = OptionsUtil.getNearestFullSemesterOption(selectedOption);

                Observable<List> fullerObservable = subjectsService.retrieveSubjects(
                        new StringBuilder()
                                .append(fullerOption.getSemesterMonth())
                                .append(fullerOption.getSemesterYear())
                                .toString(),
                        fullerOption.getSchoolCampusCode(),
                        fullerOption.getLevelCode()
                );

                observables.add(fullerObservable);
            }
        }

        Observable<List> observable = Observable.concatArray(observables.toArray(new Observable[observables.size()]));

        observable
                .subscribeOn(Schedulers.computation())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(this);
    }

    private static Retrofit getRetrofit(Gson gson, OkHttpClient client) {
        return new Retrofit.Builder()
                    .baseUrl(CoursesUtil.RUTGERS_SIS_BASE_URL)
                    .client(client)
                    .addCallAdapterFactory(RxJava3CallAdapterFactory.create())
                    .addConverterFactory(GsonConverterFactory.create(gson))
                    .build();
    }

    private static OkHttpClient getClient() {
        return new OkHttpClient.Builder()
                    .callTimeout(15, TimeUnit.MINUTES)
                    .build();
    }

    private static Gson getGson() {
        return new GsonBuilder()
                    .registerTypeAdapter(List.class, new SubjectListDeserializer())
                    .create();
    }

    private void returnSubjects() {
        if (repository instanceof LocationsRepository) {
            ((LocationsRepository) repository).onSubjectsDownloadComplete(subjects);
        }
        else if (repository instanceof CoursesRepository) {
            ((CoursesRepository) repository).onSubjectsDownloadComplete(subjects);
        }
    }

    private void appendSubjects(List newSubjects) {
        subjects.addAll(newSubjects);
    }

    private void passError(Throwable e, String message) {
        if (repository instanceof LocationsRepository) {
            ((LocationsRepository) repository).onError(e, message);
        }
        else if (repository instanceof CoursesRepository) {
            ((CoursesRepository) repository).passError(e, message);
        }
    }

    public void cleanUp() {
        Log.d("APPDEBUG", "Performing SubjectsWebService cleanup...");
        if (disposable != null && !disposable.isDisposed()) {
            disposable.dispose();
        }

        repository = null;
        subjects = null;
        disposable = null;
    }

    @Override
    public void onSubscribe(@NonNull Disposable d) {
        disposable = d;
    }

    @Override
    public void onNext(Object o) {
        if (o instanceof List) {
            appendSubjects((List) o);
        }
    }

    @Override
    public void onError(@NonNull Throwable e) {
        Log.d("APPDEBUG", "An error has occurred while downloading subjects...");
        String message = "An error has occurred while downloading Rutgers data. Please try again.";
        passError(e, message);
        cleanUp();
    }

    @Override
    public void onComplete() {
        Log.d("APPDEBUG", "Subjects download complete...");
        returnSubjects();
        cleanUp();
    }
}
