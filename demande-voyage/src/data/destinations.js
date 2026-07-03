// Textes basés sur des faits réels (géographie, lieux, altitudes) plutôt que
// sur des formules inventées. Personnalise librement selon vos souvenirs.
export const destinations = [
  {
    id: "santorin",
    nom: "Santorin, Grèce",
    region: "Cyclades, mer Égée",
    phrase:
      "Le village d'Oia perché à 300 m au-dessus d'une caldeira volcanique, ses maisons cycladiques blanches et bleues, et l'un des couchers de soleil les plus regardés au monde depuis les remparts du fort.",
    faits: ["Îles volcaniques", "Coucher de soleil à Oia", "Villages troglodytes"],
    img: "/images/destinations/santorin.jpg",
  },
  {
    id: "kyoto",
    nom: "Kyoto, Japon",
    region: "Honshū, région du Kansai",
    phrase:
      "Ancienne capitale impériale du Japon pendant plus de mille ans, avec plus de 1600 temples bouddhistes, la forêt de bambous d'Arashiyama et le pavillon d'or du Kinkaku-ji qui se reflète dans son étang.",
    faits: ["1600+ temples", "Forêt de bambous d'Arashiyama", "Quartier des geishas de Gion"],
    img: "/images/destinations/kyoto.jpg",
  },
  {
    id: "amalfi",
    nom: "Côte Amalfitaine, Italie",
    region: "Campanie, golfe de Salerne",
    phrase:
      "Positano accroché à sa falaise, la route panoramique SS163 qui longe la mer sur 50 km, et les citronniers à sfusato qui parfument des dîners qui s'éternisent. Classée au patrimoine mondial de l'UNESCO.",
    faits: ["Classée UNESCO", "Villages suspendus", "Citronneraies en terrasses"],
    img: "/images/destinations/amalfi.jpg",
  },
  {
    id: "bali",
    nom: "Bali, Indonésie",
    region: "Archipel indonésien",
    phrase:
      "Les rizières en terrasses de Tegalalang, le temple de Tanah Lot bâti sur un rocher battu par les vagues, et le volcan Mont Batur (1717 m) à gravir avant l'aube pour un lever de soleil au sommet.",
    faits: ["Rizières de Tegalalang", "Temple de Tanah Lot", "Lever de soleil au Mont Batur"],
    img: "/images/destinations/bali.jpg",
  },
  {
    id: "laponie",
    nom: "Laponie, Finlande",
    region: "Cercle polaire arctique",
    phrase:
      "Au nord du cercle polaire, jusqu'à 200 nuits d'aurores boréales par an entre septembre et mars, des chalets en rondins au milieu de la neige, et le silence total de la forêt boréale.",
    faits: ["Aurores boréales", "Cercle polaire arctique", "Nuits polaires"],
    img: "/images/destinations/laponie.jpg",
  },
  {
    id: "maldives",
    nom: "Maldives",
    region: "Océan Indien",
    phrase:
      "1192 îles coralliennes réparties sur 26 atolls, une eau turquoise si transparente qu'on y distingue les poissons à 20 m de profondeur, et des bungalows sur pilotis posés au-dessus du lagon.",
    faits: ["1192 îles coralliennes", "Bungalows sur pilotis", "Récifs coralliens"],
    img: "/images/destinations/maldives.jpg",
  },
  {
    id: "islande",
    nom: "Islande",
    region: "Atlantique Nord",
    phrase:
      "Le Cercle d'Or : la cascade de Gullfoss, les geysers de Geysir et la faille de Þingvellir où se séparent les plaques nord-américaine et eurasienne. Sources chaudes naturelles et aurores boréales d'octobre à mars.",
    faits: ["Cercle d'Or", "Sources chaudes naturelles", "~30 volcans actifs"],
    img: "/images/destinations/islande.jpg",
  },
  {
    id: "fer-a-cheval",
    nom: "Cirque du Fer à Cheval",
    region: "Sixt-Fer-à-Cheval, Haute-Savoie — aux portes de la Suisse",
    phrase:
      "Un cirque glaciaire naturel de 5 km de diamètre et 700 m de haut, dans les Alpes françaises, à quelques kilomètres de la frontière suisse. À la fonte des neiges, une trentaine de cascades dévalent la falaise. Réserve naturelle classée, calme et sauvage.",
    faits: ["Cirque glaciaire de 5 km", "~30 cascades au printemps", "Réserve naturelle protégée"],
    img: "/images/destinations/fer-a-cheval.jpg",
    sportif: true,
    niveauEffort: "Rando facile à modérée (2-4h) au fond du cirque, variantes plus engagées vers le Grenier de Villy.",
  },
  {
    id: "breche-de-roland",
    nom: "Brèche de Roland",
    region: "Cirque de Gavarnie, Hautes-Pyrénées — frontière franco-espagnole",
    phrase:
      "Une entaille naturelle de 40 m de large et 100 m de haut, à 2807 m d'altitude, dans la barre rocheuse du Cirque de Gavarnie classé UNESCO. La légende raconte que Roland l'aurait ouverte d'un coup d'épée pour ne pas la laisser aux Sarrasins. Isards et gypaètes barbus veillent sur le sentier.",
    faits: ["2807 m d'altitude", "Cirque de Gavarnie, UNESCO", "~1000 m de dénivelé"],
    img: "/images/destinations/breche-de-roland.jpg",
    sportif: true,
    niveauEffort: "Randonnée sportive (6-7h aller-retour, ~1000 m D+) depuis le refuge des Sarradets.",
  },
  {
    id: "surprise",
    nom: "Surprends-moi",
    region: "",
    phrase: "Laisse-moi t'emmener quelque part… ferme les yeux et fais-moi confiance.",
    faits: [],
    img: "/images/destinations/surprise.jpg",
    special: true,
  },
];
