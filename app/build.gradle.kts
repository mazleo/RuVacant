plugins {
    id("com.android.application")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "blog.mazleo.ruvacant"
    compileSdk = 34

    defaultConfig {
        applicationId = "blog.mazleo.ruvacant"
        minSdk = 28
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    testOptions {
        unitTests.isReturnDefaultValues = true

        unitTests {
            isIncludeAndroidResources = true
        }
    }

    buildFeatures {
        dataBinding = true
    }
}

dependencies {

    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.9.0")
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0");
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("com.google.code.findbugs:jsr305:3.0.2")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("com.google.dagger:hilt-android:2.50")
    annotationProcessor("com.google.dagger:hilt-compiler:2.50")
    annotationProcessor("androidx.room:room-compiler:2.6.1")
    implementation("com.google.dagger:dagger:2.50")
    annotationProcessor("com.google.dagger:dagger-compiler:2.50")
    implementation("com.google.auto.value:auto-value-annotations:1.6")
    annotationProcessor("com.google.auto.value:auto-value:1.6")
    implementation("com.facebook.shimmer:shimmer:0.5.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    testImplementation("com.google.dagger:hilt-android-testing:2.50")
    testAnnotationProcessor("com.google.dagger:hilt-android-compiler:2.50")
    androidTestImplementation("com.google.dagger:hilt-android-testing:2.50")
    androidTestAnnotationProcessor("com.google.dagger:hilt-android-compiler:2.50")
    testImplementation("org.robolectric:robolectric:4.11.1")
    androidTestImplementation("org.robolectric:robolectric:4.11.1")
}