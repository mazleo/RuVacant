package blog.mazleo.ruvacant.service.model;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

/** A Rutgers classroom. */
@Entity
public final class RuClassroom {

  /** Format: "BUILDING.ROOM" */
  @PrimaryKey @NonNull public String key;

  public String code;
  public String buildingCode;
  public String campusName;
  public String uniCampusCode;

  public RuClassroom(
      String key, String code, String buildingCode, String campusName, String uniCampusCode) {
    this.key = key;
    this.code = code;
    this.buildingCode = buildingCode;
    this.campusName = campusName;
    this.uniCampusCode = campusName;
  }

  @Ignore
  public RuClassroom(String code, String buildingCode, String campusName, String uniCampusCode) {
    key = String.format("%s.%s", buildingCode, code);
    this.code = code;
    this.buildingCode = buildingCode;
    this.campusName = campusName;
    this.uniCampusCode = uniCampusCode;
  }
}
