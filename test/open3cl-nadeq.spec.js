import { calcul_3cl } from '../src/engine.js';
import corpus from './corpus.json';
import { getAdemeFileJson, saveResultFile } from './test-helpers.js';
import { jest } from '@jest/globals';
import { Nadeq } from '../src/11_nadeq.js';

describe('Test Open3CL engine compliance on corpus', () => {
  const nadeq = new Nadeq();

  test.each(corpus)('check nadeq for dpe %s', (ademeId) => {
    const exceptedDpe = getAdemeFileJson(ademeId);
    const calculatedNadeq = nadeq.calculateNadeq(exceptedDpe.logement);

    expect(calculatedNadeq).toBeCloseTo(exceptedDpe.logement.sortie.apport_et_besoin.nadeq, 2);
  });
});
