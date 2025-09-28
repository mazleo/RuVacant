import { UniversityDataBuilder } from '../../src/data/university_data_builder.js';

describe('getRecentSemesterCodes', () => {
  it('all semesters within the same year with starting semester month', () => {
    const semesterCodes = UniversityDataBuilder.getRecentSemesterCodes(9, 2025);

    expect(semesterCodes).toEqual(['92025', '72025', '12025']);
  });
  it('all semesters within the same year with middle semester month', () => {
    const semesterCodes = UniversityDataBuilder.getRecentSemesterCodes(8, 2025);

    expect(semesterCodes).toEqual(['72025', '12025', '02025']);
  });
  it('semesters in different years', () => {
    const semesterCodes = UniversityDataBuilder.getRecentSemesterCodes(
      12,
      2025,
    );

    expect(semesterCodes).toEqual(['02025', '92024', '72024']);
  });
});
