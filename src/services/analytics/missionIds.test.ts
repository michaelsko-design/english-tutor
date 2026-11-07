import { describe, expect, it } from 'vitest';
import { loadAllGrades } from '../../data/curriculum/loader';
import { MISSION_ID_PATTERN, isMissionId } from './events';

describe('mission ids in analytics', () => {
  it('accepts every curriculum mission id, so no real mission is dropped from the stuck-missions table', async () => {
    const grades = Object.values(await loadAllGrades());
    const ids = grades.flatMap((grade) => grade?.units.flatMap((unit) => unit.missions.map((mission) => mission.id)) ?? []);
    expect(ids.length).toBeGreaterThan(100);
    expect(ids.filter((id) => !isMissionId(id))).toEqual([]);
  });

  it('keeps the document-id length within what the rules allow', () => {
    // docId = day(10) + _ + uid(<=128) + _ + missionId(<=60) + _ + tier(<=10): well under Firestore's 1500 bytes
    expect(MISSION_ID_PATTERN.source).toContain('{1,60}');
  });
});
