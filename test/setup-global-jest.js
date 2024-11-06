import { calcul_3cl } from '../src/index.js';
import corpus from './corpus.json' with { type: 'json' };
import { getAdemeFileJson, saveResultFile } from './test-helpers.js';

export default async function (globalConfig, projectConfig) {
  corpus.forEach((ademeId) => {
    console.log(`Compute DPE ${ademeId}`);
    const dpeRequest = getAdemeFileJson(ademeId);
    try {
      const dpeResult = calcul_3cl(structuredClone(dpeRequest));
      saveResultFile(ademeId, dpeResult);
    } catch (err) {
      console.warn(`3CL Engine failed for file ${ademeId}`, err);
      saveResultFile(ademeId, {});
    }
  });
}
