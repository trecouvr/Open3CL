import enums from './enums.js';

const COEFS_G_H = {
  'chaudière gaz': [20, 1.6],
  'chaudière fioul': [20, 1.6],
  // TODO chaudiere bois atmosphérique: 0, 0
  // TODO chaudiere bois assité par ventilateur: 73.3, 10.5
  'générateur à air chaud': [0, 4],
  'radiateur à gaz': [40, 0]
  // TODO Chauffe-eau gaz: 0, 0
  // TODO Accumulateur gaz: 0, 0
};

export function conso_aux_gen(di, de, type, bch, bch_dep) {
  const type_generateur = enums[`type_generateur_${type}`][de[`enum_type_generateur_${type}_id`]];
  // find key in G that starts with type_generateur_ch
  const coef_key = Object.keys(COEFS_G_H).find((key) => type_generateur.startsWith(key));
  const [g, h] = COEFS_G_H[coef_key] ?? [0, 0];
  const Paux_g_ch = g + h * (di.pn / 1000);
  di[`conso_auxiliaire_generation_${type}`] = (Paux_g_ch * bch) / di.pn || 0;
  di[`conso_auxiliaire_generation_${type}_depensier`] = (Paux_g_ch * bch_dep) / di.pn || 0;
}
