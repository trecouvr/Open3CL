import { jest } from '@jest/globals';
import { calcul_3cl } from '../src/index.js';
import corpus from './corpus.json';
import { getAdemeFileJson, saveResultFile } from './test-helpers.js';

global.jest = jest;

jest.unstable_mockModule('fs', () => ({
  readFile: (filePath, callback) => {
    callback(null, 'content');
  },
  writeFile: (filePath, content, opts, callback) => {
    callback();
  }
}));
