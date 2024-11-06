import { calcul_3cl } from '../src/engine.js';
import corpus from './corpus.json';
import { getAdemeFileJson, getResultFile, saveResultFile } from './test-helpers.js';
import { jest } from '@jest/globals';
import { PRECISION } from './constant.js';

describe('Test Open3CL engine compliance on corpus', () => {
  describe.each([
    'isolation_toiture',
    'protection_solaire_exterieure',
    'aspect_traversant',
    'brasseur_air',
    'inertie_lourde',
    'enum_indicateur_confort_ete_id'
  ])('check "confort_ete.%s" value', (attr) => {
    test.each(corpus)('dpe %s', (ademeId) => {
      const exceptedDpe = getAdemeFileJson(ademeId);
      const calculatedDpe = getResultFile(ademeId);
      expect(calculatedDpe.logement.sortie.confort_ete[attr]).toBeCloseTo(
        exceptedDpe.logement.sortie.confort_ete[attr],
        PRECISION
      );
    });
  });
});
