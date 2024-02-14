# Progression

Pour le moment, on évalue le moteur par comparaison avec des DPE éxistants, on a selectioné 100 DPE dans la base de donnée de l'ademe (voir [corpus100.txt](./corpus100.txt)).

Pour chacuns de ces DPE, on fait le calcul avec notre moteur, puis on compare les valeurs des champs de sortie avec les valeurs originales (calculées par des moteurs certifiés).

```
100% .logement.sortie.production_electricite.production_pv
100% .logement.sortie.apport_et_besoin.v40_ecs_journalier
100% .logement.sortie.apport_et_besoin.nadeq
97% .logement.sortie.apport_et_besoin.surface_sud_equivalente
79% .logement.sortie.confort_ete.enum_indicateur_confort_ete_id
79% .logement.sortie.apport_et_besoin.besoin_ecs
75% .logement.enveloppe.inertie.enum_classe_inertie_id
74% .logement.sortie.apport_et_besoin.apport_solaire_ch
74% .logement.sortie.apport_et_besoin.apport_interne_ch
52% .logement.sortie.qualite_isolation.ubat
40% .logement.sortie.ef_conso.conso_ecs
37% .logement.sortie.deperdition.deperdition_enveloppe
20% .logement.sortie.emission_ges.emission_ges_5_usages_m2
14% .logement.sortie.apport_et_besoin.besoin_ch
7% .logement.sortie.ef_conso.conso_ch
5% .logement.sortie.ep_conso.ep_conso_5_usages_m2
3% .logement.sortie.cout.cout_5_usages
```