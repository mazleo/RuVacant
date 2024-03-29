package blog.mazleo.ruvacant.viewmodel;

import android.util.Log;

import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.HashSet;
import java.util.List;

import blog.mazleo.ruvacant.model.Building;
import blog.mazleo.ruvacant.model.Option;
import blog.mazleo.ruvacant.model.Room;
import blog.mazleo.ruvacant.processor.DataDownloadProcessor;

@RunWith(AndroidJUnit4.class)
public class LocationsViewModelTest {
    @Test
    public void addAndContainsBuildingTest() {
        LocationsViewModel locationsViewModel = new LocationsViewModel(null);
        Building building1 = new Building("HLL", "Hill Center", "BUS", false);
        Building building2 = new Building("AB", "Academic Building", "CAC", false);

        locationsViewModel.addBuilding(building1);

        boolean building1Exists = locationsViewModel.containsBuilding(building1);
        boolean building2Exists = locationsViewModel.containsBuilding(building2);

        Assert.assertTrue(building1Exists);
        Assert.assertFalse(building2Exists);
    }

    @Test
    public void addAndContainsRoomTest() {
        LocationsViewModel locationsViewModel = new LocationsViewModel(null);

        Room room1 = new Room("HLL", "101");
        Room room2 = new Room("HLL", "102");
        Room room3 = new Room("AB", "1000");
        Room room4 = new Room("AB", "2000");

        locationsViewModel.addRoom(room1);
        locationsViewModel.addRoom(room3);

        Assert.assertTrue(locationsViewModel.containsRoom(room1));
        Assert.assertFalse(locationsViewModel.containsRoom(room2));
        Assert.assertTrue(locationsViewModel.containsRoom(room3));
        Assert.assertFalse(locationsViewModel.containsRoom(room4));
    }

    @Test
    public void downloadLocationsTest() {
        DataDownloadProcessor dataDownloadProcessor = new DataDownloadProcessor(null, null);
        dataDownloadProcessor.setSelectedOptions(new Option(9, 2019, "NB", "U"));
        LocationsViewModel locationsViewModel = new LocationsViewModel(dataDownloadProcessor);
        locationsViewModel.downloadLocations();

        final int SECONDS_TO_TEST = 120;
        for (int i = 0; i < SECONDS_TO_TEST; i++) {
            Log.i("APPDEBUG", (SECONDS_TO_TEST - i) + " seconds left...");
            try {
                Thread.sleep(1000);
            }
            catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        Assert.assertThat(locationsViewModel.getBuildings().size(), Matchers.greaterThan(0));
        Assert.assertThat(locationsViewModel.getRooms().size(), Matchers.greaterThan(0));
        Assert.assertFalse(hasBuildingDuplicates(locationsViewModel.getBuildings()));
        Assert.assertFalse(hasRoomDuplicates(locationsViewModel.getRooms()));

        assertValidBuildings(locationsViewModel.getBuildings());
        assertValidRooms(locationsViewModel.getRooms());

        Log.i("APPDEBUG", String.valueOf(locationsViewModel.getBuildings().size()));
        Log.i("APPDEBUG", String.valueOf(locationsViewModel.getRooms().size()));

        Log.i("APPDEBUG", "--- LIST BUILDINGS ---");
        for (int b = 0; b < locationsViewModel.getBuildings().size(); b++) {
            Log.i("APPDEBUG", locationsViewModel.getBuildings().get(b).toString());
        }
        Log.i("APPDEBUG", "--- LIST ROOMS ---");
        for (int r = 0; r < locationsViewModel.getRooms().size(); r++) {
            Log.i("APPDEBUG", locationsViewModel.getRooms().get(r).toString());
        }
    }

    private static void assertValidBuildings(List<Building> buildings) {
        for (Building building : buildings) {
            Assert.assertNotNull(building.getCode());

            Assert.assertThat(building.getCode().length(), Matchers.greaterThan(0));
            if (building.getName() != null) {
                Assert.assertThat(building.getName().length(), Matchers.greaterThan(0));
            }
            if (building.getCampusCode() != null) {
                Assert.assertThat(building.getCampusCode().length(), Matchers.greaterThan(0));
            }
            Assert.assertFalse(building.isFavorite());
        }
    }

    private static void assertValidRooms(List<Room> rooms) {
        for (Room room : rooms) {
            Assert.assertNotNull(room.getBuildingCode());
            Assert.assertNotNull(room.getNumber());

            Assert.assertThat(room.getBuildingCode().length(), Matchers.greaterThan(0));
            Assert.assertThat(room.getNumber().length(), Matchers.greaterThan(0));
        }
    }

    private static boolean hasBuildingDuplicates(List<Building> buildings) {
        HashSet<String> existingBuildings = new HashSet<>();
        for (Building building : buildings) {
            if (existingBuildings.contains(building.getCode())) {
                return true;
            }
            else {
                existingBuildings.add(building.getCode());
            }
        }

        return false;
    }

    private static boolean hasRoomDuplicates(List<Room> rooms) {
        HashSet<String> existingRooms = new HashSet<>();
        for (Room room : rooms) {
            if (existingRooms.contains(room.getBuildingCode() + "-" + room.getNumber())) {
                return true;
            }
            else {
                existingRooms.add(room.getBuildingCode() + "-" + room.getNumber());
            }
        }

        return false;
    }
}
