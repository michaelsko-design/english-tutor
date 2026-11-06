import { describe, expect, it } from 'vitest';
import { checkHeading, ruleFor, type GrammarHeading } from './grammarRules';

const heading = (text: string): GrammarHeading => ({ band: 'band-2', heading: text, firstLevel: 'GRADE 7 (A2)', descriptors: [] });
const grades = [
  { grade: 7, topics: ['Past Simple Questions & Negatives (Did / Didn’t + Base Verb)', 'Future Simple (Will) vs. Be Going To'] },
  { grade: 8, topics: ['Past Simple vs. Past Continuous (While / When)'] },
  { grade: 10, topics: ['Non-Defining Relative Clauses (which, who with commas)'] },
];

describe('ruleFor', () => {
  it('picks the specific rule before the general one', () => {
    expect(ruleFor('VERBS: Past simple - questions')?.appTopic?.source).toContain('did');
    expect(ruleFor('CLAUSES: Relative - non-defining')?.appTopic?.source).toContain('non-defining');
  });
});

describe('checkHeading', () => {
  it('finds the first grade that names the structure', () => {
    expect(checkHeading(heading('VERBS: Past continuous'), grades, 9)).toMatchObject({ status: 'covered', appGrade: 8 });
  });

  it('marks a structure first taught after the band as later', () => {
    expect(checkHeading(heading('CLAUSES: Relative - non-defining'), grades, 9)).toMatchObject({ status: 'later', appGrade: 10 });
  });

  it('does not take the "was / were" mission for the past passive', () => {
    const wasWere = [{ grade: 6, topics: ['Past Simple of "to be": was / were'] }];
    expect(checkHeading(heading('PASSIVES: Past simple'), wasWere, 9).status).toBe('missing');
    expect(checkHeading(heading('VERBS: Past simple - lexical verbs (regular)'), wasWere, 9).status).toBe('missing');
  });

  it('marks a structure no mission names as missing', () => {
    expect(checkHeading(heading('MODALITY: Used to'), grades, 9).status).toBe('missing');
  });

  it('treats plain declarative clauses as part of every mission', () => {
    expect(checkHeading(heading('CLAUSES: Declarative'), grades, 9).status).toBe('implicit');
  });
});
