import { calcul_3cl } from '../src/engine.js';
import corpus from './corpus.json';
import { getAdemeFileJson, getResultFile, saveResultFile } from './test-helpers.js';
import { jest } from '@jest/globals';
import { PRECISION } from './constant.js';

describe('Test Open3CL engine compliance on corpus', () => {
  describe.each([
    'enum_type_energie_id',
    'conso_ch',
    'conso_ecs',
    'conso_5_usages',
    'emission_ges_ch',
    'emission_ges_ecs',
    'emission_ges_5_usages',
    'cout_ch',
    'cout_ecs',
    'cout_5_usages'
  ])('check "sortie_par_energie_collection.%s" value', (attr) => {
    test.each(corpus)('dpe %s', (ademeId) => {
      const exceptedDpe = getAdemeFileJson(ademeId);
      const calculatedDpe = getResultFile(ademeId);

      expect(
        calculatedDpe.logement.sortie.sortie_par_energie_collection.sortie_par_energie
      ).toHaveLength(
        exceptedDpe.logement.sortie.sortie_par_energie_collection.sortie_par_energie.length
      );

      calculatedDpe.logement.sortie.sortie_par_energie_collection.sortie_par_energie.forEach(
        (sortie_par_energie, idx) => {
          expect(sortie_par_energie[attr]).toBeCloseTo(
            exceptedDpe.logement.sortie.sortie_par_energie_collection.sortie_par_energie[idx][attr],
            PRECISION
          );
        }
      );
    });
  });
});
