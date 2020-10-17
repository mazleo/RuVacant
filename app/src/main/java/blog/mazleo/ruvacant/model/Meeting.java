package blog.mazleo.ruvacant.model;

public class Meeting {
    private String classIndex;
    private String buildingCode;
    private String roomNumber;
    private String meetingDay;
    private int startTime;
    private int endTime;

    public Meeting(String classIndex, String buildingCode, String roomNumber, String meetingDay, int startTime, int endTime) {
        this.classIndex = classIndex;
        this.buildingCode = buildingCode;
        this.roomNumber = roomNumber;
        this.meetingDay = meetingDay;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getClassIndex() {
        return classIndex;
    }

    public void setClassIndex(String classIndex) {
        this.classIndex = classIndex;
    }

    public String getBuildingCode() {
        return buildingCode;
    }

    public void setBuildingCode(String buildingCode) {
        this.buildingCode = buildingCode;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getMeetingDay() {
        return meetingDay;
    }

    public void setMeetingDay(String meetingDay) {
        this.meetingDay = meetingDay;
    }

    public int getStartTime() {
        return startTime;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public int getEndTime() {
        return endTime;
    }

    public void setEndTime(int endTime) {
        this.endTime = endTime;
    }
}