export const carBrandsAndModels: {
    [brand: string]: { [modelSeries: string]: string[] } | string[];
} = {
    "Mercedes Benz": {
"A Class": ["A 140", "A 150", "A 160", "A 170", "A 180", "A 190", "A 200", "A 210", "A 220", "A 250","A 250e", "A 35 AMG", "A 45 AMG", "A 45 S AMG"],
"B Class": ["B 150", "B 160", "B 170", "B 180", "B 200", "B 220", "B 250", "B electric drive", "B 55 AMG"],
"C Class": ["C 160", "C 180", "C 200", "C 220", "C 230", "C 240", "C 250", "C 270", "C 280", "C 300", "C 300 E", "C 320", "C 32 AMG", "C 350", "C 350 E", "C 36 AMG", "C 400", "C 450 AMG", "C 43 AMG", "C 63 AMG", "C 63 S AMG", "C 63 AMG E PERFORMANCE"],
"CE": ["CE 200", "CE 220", "CE 230", "CE 280", "CE 300", "CE 320"],
"CL": ["CL 420", "CL 500", "CL 600", "CL 55 AMG", "CL 63 AMG", "CL 65 AMG"],
"CL Coupe": ["CL coupe 420", "CL coupe 500", "CL coupe 600"],
"CLA": ["CLA 180", "CLA 200", "CLA 220", "CLA 250", "CLA 250e", "CLA 35 AMG", "CLA 45 AMG", "CLA 45 S AMG"],
"CLE": ["CLE 180", "CLE 200", "CLE 220", "CLE 300", "CLE 450", "CLE 53 AMG", "CLE 63 AMG"],
"CLK": ["CLK 220", "CLK 230", "CLK 2440", "CLK 270", "CLK 280", "CLK 320", "CLK 350", "CLK 430", "CLK 500", "CLK 55 AMG", "CLK 63 AMG", "CLK GTR"],
"CLS": ["CLS 220", "CLS 250", "CLS 280", "CLS 300", "CLS 320", "CLS 350", "CLS 400", "CLS 450", "CLS 500", "CLS 53 AMG", "CLS 55 AMG", "CLS 63 AMG", "CLS 63S AMG"],
"E Class": ["E 200", "E 220", "E 230", "E 240", "E 250", "E 260", "E 270", "E 280", "E 290", "E 300", "E 320", "E 350", "E 36 AMG", "E 400", "E 420", "E 43 AMG", "E 430", "E 450", "E 50 AMG", "E 500", "E 53 AMG", "E 55 AMG", "E 550", "E 60 AMG", "E 63 AMG", "E 63 S AMG"],
"EQ": ["EQS sedan 450+", "EQS sedan 580", "EQB 300", "EQB 350", "EQA 250", "EQA 250+", "EQA 300", "EQA 350", "EQT 45", "EQS SUV 450", "EQS SUV 450+", "EQS SUV 580", "EQS SUV 680", "EQC 400", "EQE 350 215 KW", "EQE SUV 350", "EQE SUV 350+", "EQE SUV 500"],
"G Class": ["G 230", "G 240", "G 250", "G 270", "G 280", "G 290", "G 300", "G 320", "G 350", "G 400", "G 450", "G 500", "G 55 AMG", "G 580", "G 63 AMG", "G 65 AMG", "G 650"],
"GL": ["GL 320", "GL 350", "GL 400", "GL 420", "GL 450", "GL 500", "GL 55 AMG", "GL 63 AMG"],
"GLA": ["GLA 180", "GLA 200", "GLA 220", "GLA 250", "GLA 35 AMG", "GLA 45 AMG", "GLA 45 S AMG"],
"GLB": ["GLB 180", "GLB 200", "GLB 220", "GLB 250", "GLB 35 AMG"],
"GLC": ["GLC 200", "GLC 220", "GLC 250", "GLC 300", "GLC 350", "GLC 400", "GLC 43 AMG", "GLC 450", "GLC 63 AMG", "GLC 63 S AMG"],
"GLE": ["GLE 250", "GLE 300", "GLE 350", "GLE 400", "GLE 43 AMG", "GLE 450", "GLE 500", "GLE 53 AMG", "GLE 580", "GLE 63 AMG", "GLE 63 S AMG"],
"GLK": ["GLK 200", "GLK 220", "GLK 250", "GLK 280", "GLK 300", "GLK 320", "GLK 350"],
"GLS": ["GLD 350", "GLS 400", "GLS 450", "GLS 500", "GLS 63 AMG"],
"ML": ["ML 230", "ML 250", "ML 270", "ML 280", "ML 300", "ML 320", "ML 350", "ML 400", "ML 420", "ML 430", "ML 450", "ML 500", "ML 55 AMG", "ML 63 AMG"],
"R Class": ["R 280", "R 300", "R 320", "R 350", "R 500", "R 63 AMG"],
"S Class": ["S 250", "S 260", "S 280", "S 300", "S 320", "S 350", "S 380", "S 400", "S 420", "S 430", "S 450", "S 500", "S 55 AMG", "S 550", "S 560", "S 560 e", "S 580", "S 600", "S 63 AMG", "S 63 AMG e", "S 65 AMG"],
"SL": ["SL 230", "SL 250", "SL 280", "SL 300", "SL 320", "SL 350", "SL 380", "SL 400", "SL 420", "SL 43 AMG", "SL 450", "SL 500", "SL 55 AMG", "SL 560", "SL 60 AMG", "SL 600", "SL 63 AMG", "SL 65 AMG", "SL 70 AMG", "SL 73 AMG"],
"SLK": ["SLK 200", "SLK 230", "SLK 250", "SLK 280", "SLK 300", "SLK 320", "SLK 350", "SLK 32 AMG", "SLK 55 AMG"],
"SLC": ["SLC 180", "SLC 200", "SLC 250", "SLC 280", "SLC 300", "SLC 350", "SLC 380", "SLC 43 AMG", "SLC 450", "SLC 500"],
"SLR": ["SLR Stirling Moss", "SLR McLaren Roadster", "SLR McLaren"],
"SLS": ["SLS AMG Black Series", "SLS AMG GT", "SLS AMG Roadster"],
"V Class": ["V-class 200", "V-Class 220", "V-class 230", "V-class 250", "V-class 280", "V-class 300"],
"X Class": ["X Class 200", "X Class 220", "X Class 250", "X Class 350"]
    },

    "BMW": { 
"Series 1": ["1 Series 114", "1 Series 116", "1 Series 118", "1 Series 120", "1 Series 123", "1 Series 125", "1 Series 128", "1 Series 130", "1 Series 135", "1 Series 140", "1 Series 1er M coupe"],
"Series 2": ["2 Series 214", "2 Series 216", "2 Series 218", "2 Series 220", "2 Series 223", "2 Series 225", "2 Series 228", "2 Series 230", "2 Series 235", "2 Series 240", "M235", "M240", "M2", "M2 Competition", "M2 CS"],
"Series 3": ["3 Series 315", "3 Series 316", "3 Series 318", "3 Series 320", "3 Series 323", "3 Series 325", "3 Series 328", "3 Series 330", "3 Series 335", "3 Series 340", "3 Series active hybrid 3", "M340", "M3", "M3 Competition", "M3 CS", "i3"],
"Series 4": ["4 Series 418", "4 Series 420", "4 Series 425", "4 Series 428", "4 Series 430", "4 Series 435", "4 Series 440", "M440", "M4", "M4 Competition", "M4 CSL", "i4"],
"Series 5": ["5 Series 518", "5 Series 520", "5 Series 523", "5 Series 524", "5 Series 528", "5 Series 530", "5 Series 535", "5 Series 540", "5 Series 545", "5 Series 550", "M550", "M5", "M5 Competition", "M5 CS", "i5"],
"Series 6": ["6 Series 620", "6 Series 628", "6 Series 630", "6 Series 633", "6 Series 635", "6 Series 640", "6 Series 645", "6 Series 650", "M640", "M650", "M6"],
"Series 7": ["7 Series 725", "7 Series 728", "7 Series 730", "7 Series 732", "7 Series 735", "7 Series 740", "7 Series 745", "7 Series 750", "7 Series 760", "7 Series 760e", "i7"],
"Series 8": ["8 Series 830", "8 Series 840", "8 Series 850", "M850", "M8", "M8 Competition", "i8"], 
"X1": ["X1 16", "X1 18", "X1 20", "X1 25", "X1 28", "X1 30", "X1 35", "iX1", "X1 M35"],
"X2": ["X2 16", "X2 18", "X2 20", "X2 25", "X2 28", "X2 35", "iX2", "X2 M35"],
"X3": ["X3 16", "X3 18", "X3 20", "X3 25", "X3 28", "X3 30", "X3 35", "X3 40", "X3 50", "iX3", "X3 M40", "X3M", "X3 M Competition"],
"X4": ["X4 20", "X4 25", "X4 28", "X4 30", "X4 35", "X4 40", "X4 M40" ,"X4M", "X4 M Competition"],
"X5": ["X5 30", "X5 35", "X5 40", "X5 45", "X5 50", "X5 60", "X5 M50", "X5 M60", "X5M", "X5M Competition"],
"X6": ["X6 30", "X6 35", "X6 40", "X6 50", "X6 M50", "X6 M60", "X6M Competition"],
"X7": ["X7 30", "X7 35", "X7 40", "X7 50", "X7 60", "X7 M50", "X7 M60"],
"XM": ["XM", "XM 50e", "XM Label"],
"Z Series": ["Z1", "Z3", "Z3M", "Z4", "Z4 M40", "Z4M", "Z8"]
    },

    "Audi": {
"A1": ["A1 1.0", "A1 1.2", "A1 1.4", "A1 1.5", "A1 1.6", "A1 1.8", "A1 2.0", "A1 25", "A1 30", "A1 35", "A1 40", "S1"],
"A2": ["A2 1.2", "A2 1.4", "A2 1.6", "S2", "RS2"],
"A3": ["A3 1.0", "A3 1.2", "A3 1.4", "A3 1.5", "A3 1.6", "A3 1.8", "A3 1.9", "A3 2.0", "A3 30", "A3 35", "A3 45", "S3", "RS3"],
"A4": ["A4 1.6", "A4 1.8", "A4 1.9", "A4 2.0", "A4 2.4", "A4 2.5", "A4 2.6", "A4 2.7", "A4 2.8", "A4 3.0", "A4 3.2", "A4 30", "A4 35", "A4 40", "A4 45", "A4 50", "S4", "RS4"],
"A5": ["A5 1.4", "A5 1.8", "A5 2.0", "A5 2.7", "A5 3.0", "A5 3.2", "A5 35", "A5 40", "A5 45", "A5 50", "S5", "RS5"],
"A6": ["A6 1.8", "A6 1.9", "A6 2.0", "A6 2.2", "A6 2.3", "A6 2.4", "A6 2.5", "A6 2.6", "A6 2.7", "A6 2.8", "A6 3.0", "A6 3.2", "A6 35", "A6 40", "A6 45", "A6 50", "A6 55", "A6 Hybrid", "S6", "RS6", "A6 e-tron", "S6 e-tron"],
"A7": ["A7 1.8", "A7 2.0", "A7 2.5", "A7 2.8", "A7 3.0", "A7 40", "A7 45", "A7 50", "A7 55", "S7", "RS7"],
"A8": ["A8 2.0", "A8 2.5", "A8 2.8", "A8 3.0", "A8 3.1", "A8 3.3", "A8 3.7", "A8 3.9", "A8 4.0", "A8 4.1", "A8 4.2", "A8 6.0", "A8 6.3", "A8 50", "A8 55", "A8 60", "A8 60e", "S8"],
"Q2": ["Q2 1.0", "Q2 1.4", "Q2 1.6", "Q2 2.0", "Q2 30", "Q2 35", "Q2 40"],
"Q3": ["Q3 1.4", "Q3 2.0", "Q3 2.5", "Q3 30", "Q3 35", "Q3 40", "SQ3", "RSQ3"],
"Q4": ["Q4 e-tron"],
"Q5 ": ["Q5 2.0", "Q5 3.0", "Q5 3.2", "Q5 40", "Q5 45", "Q5 45 hybrid", "Q5 50", "Q5 55e", "SQ5"],
"Q6 ":["Q6 e-tron"],
"Q7 ": ["Q7 2.0", "Q7 2.0 e-tron", "Q7 3.0", "Q7 3.6", "Q7 4.2", "Q7 6.0", "Q7 45", "Q7 50", "Q7 55", "Q7 55e", "Q7 60e", "SQ7"],
"Q8 ": ["Q8 45", "Q8 50", "Q8 55", "Q8 60", "SQ8", "RSQ8", "Q8 e-tron", "Sq8 e-tron"],
"R8":["R8"],
"TT models": ["TT s", "TT RS"],
"E-tron models": ["E-tron", "E-tron GT", "RS e-tron GT"],
"Other models":["Cabriolet", "Coupe", "Quatro", "V8", "80", "90", "100", "200"]
},

"Volkswagen": [
    "Amarok", "Arteon", "Beetle", "Bora", "Buggy", "Caddy", "Caddy Maxi", "CC", "Corrado", "Crafter", "Eos", "e-up",
    "Escarabajo", "Fox", "Cross Golf", "Golf", "Golf Cabriolet", "Golf GTD", "Golf GTE", "Golf GTI", "Golf Plus", 
    "Golf R", "Gols Sportsvan", "Golf Variant", "e-Golf", "Grand California", "ID.3", "ID.4", "ID.5", "ID.6", "ID.7", 
    "ID.Buzz", "ID.Buzz Cargo", "Iltis", "Jetta", "Käfer", "Karman Ghia", "Kever", "L80", "LT", "Lupo", "Maggiolino", 
    "New Beetle", "Passat", "Passat Alltrack", "Passat CC", "Passat Variant", "Phaeton", "Pointer", "Polo", 
    "Polo Cross", "Polo GTI", "Polo Plus", "Polo R WRC", "Polo Sedan", "Polo Variant", "Routan", "Santana", 
    "Scirocco", "Sharan", "T-Cross", "T-Roc", "T1", "T2", "T3", "T3 Blue Star", "T3 California", "T3 Caravelle", 
    "T3 Kombi", "T3 Multivan", "T3 White Star", "T4 Allstar", "T4 California", "T4 Caravelle", "T4 Kombi", "T4 Multivan",
    "T5 California", "T5 Caravelle", "T5 Kombi", "T5 Multivan", "T5 Shuttle", "T5 Transporter", "T6", "T6 California",
    "T6 Caravelle", "T6 Kombi", "T6 Multivan", "T6 Transporter", "T6.1", "T6.1 California", "T6.1 Caravelle", 
    "T6.1 Kombi", "T6.1 Multivan", "T6.1 Transporter", "T7", "T7 California", "T7 Kastenwagen", "T7 Multivan", 
    "Tiguan", "Tiguan Allspace", "Taigo", "Taro", "Touareg", "Touran", "Transporter", "up", "Vento", "Viloran", "XL1"
],

"Toyota": ["4-Runner", "Allion", "Alphard", "Altezza", "Aristo", "Auris", "Avalon", "Avensis", "Avensis Verso", "Aygo", "Aygo X", "BB", "Belta", "bZ4X", "C-HR", "Caldina", "Cami", "Camry", "Carina", "Celica", "Chaser", "Coaster", "Corolla", "Corolla Cross", "Corolla Verso", "Corona", "Corsa", "Cressida", "Cresta", "Crown", "Duet", "Dyna", "Estima", "FJ Cruiser", "FJ40", "Fortuner", "Fun Cruiser", "Funcargo", "Gaia", "GR86", "GT86", "Harrier", "HDJ", "Hiace", "Highlander", "Hilux", "Ipsum", "iQ", "Ist", "KJ", "Land Cruiser", "Land Cruiser Prado", "Lite-Ace", "Mark ll", "Mark X", "Matrix", "Mirai", "Model F", "MR 2", "Nadia", "Noah", "Opa", "Paseo", "Passo", "Pick up", "Picnic", "Platz", "Premio", "Previa", "Prius", "Prius+", "Proace", "Proace City", "Ractis", "Raum", "RAV 4", "Sequoia", "Sienna", "Solara", "Sprinter", "Starlet", "Supra", "Tacoma", "Tercel", "Town Ace", "Tundra", "Urban Cruiser", "Venza", "Verossa", "Verso", "Verso-S", "Vista", "Vitz", "Voxy", "Will", "Windom", "Wish", "Yaris", "Yaris Cross"],
"Land Rover": ["Defender", "Discovery", "Discovery Sport", "Freelander", "LRX", "Range Rover", "Range Rover Evoque", "Range Rover Velar", "Range Rover Vogue", "Range Rover Vogue Autobiography", "Range Rover Vogue SV", "Range Rover Vogue SVO", "Serie 1", "Serie 2", "Serie 3", "Range Rover Sport", "Range Rover Sport SVR", "Range Rover Sport SV", "Range Rover Sport S", "Range Rover Sport SE", "Range Rover Sport Dynamic SE"],
"Hyundai": ["ACCENT", "Atos", "AVENTE", "AZERA", "BAYON", "Coupe", "CRETA", "ELANTRA", "Equus", "Excel", "Galloper", "Genesis", "Genesis Coupe", "Getz", "Grace", "Grand Santa Fe", "GRANDEUR", "H 100", "H 200", "H 300", "H 350", "H-1", "Highway", "i10", "i20", "i30", "i40", "i50", "i800", "IONIQ", "IONIQ 5",  "IONIQ 6", "iX20", "iX35", "iX55", "KONA", "Lantra", "Matrix", "NEXO",  "NF", "PALISADE", "Pony", "Porter", "S-coupe", "Santa FE", "Santamo", "Satellite", "Solaris", "SONATA", "Sonica", "Starex", "SATRIA", "Stellar", "Terracan", "Tiburon", "Trajet", "TUCSON", "VELOSTER", "Veracruz", "Verna", "XG 250", "XG 30", "XG 350"],
"Skoda": ["Citigo", "Enyaq", "Fabia", "Favorit", "Felicia", "Forman", "Kamiq", "Karoq", "Kodiaq", "Octavia", "Pick-up", "Praktik", "Rapid/Spaceback", "Roomster", "Scala", "Snowman", "Superb", "Yeti", "105", "120", "130", "135"],
"Fiat": ["Albera", "Argenta", "Barchetta", "Brava", "Bravo", "Campagnola", "Cinquecento", "Coupe", "Croma", "Dino", "Doblo", "E-Doblo", "Ducato", "Duna", "E-Ulysse", "Fiorino", "Freemont", "Fullback", "Grande Punto", "Idea", "Linea", "Marea", "Marengo", "Maxi", "Multipla", "New Pada", "Palio", "Panda", "Penny", "Pininfarina", "Punto", "Punto Evo", "Qubo", "Regata", "Ritmo", "Scudo", "Sedici", "Seicento", "Spider Europa", "Stilo", "Strada", "Talento", "Tempra", "Tipo", "Topolino", "Ulysse", "Uno", "X1/9", "124 Coupe", "124 Spider", "126", "127", "130", "131", "132", "133", "2300", "242", "500", "500 Abarth", "500C", "500C Abarth", "500e", "500L", "500X", "595 Abarth", "600", "850", "900"],

"Porsche":{
"Cayenne": ["Cayenne", "Cayenne E-Hybrid", "Cayenne S", "Cayenne S E-Hybrid", "Cayenne Turbo", "Cayenne Turbo E-Hybrid", "Cayenne Turbo S", "Cayenne Turbo S E-Hybrid", "Cayenne GTS", "Cayenne Turbo GT"],
"Macan": ["Macan", "Macan T", "Macan S", "Macan GTS", "Macan Turbo", "Macan Turbo Electric", "Macan Electric"],
"Panamera": ["Panamera", "Panamera 4", "Panamera 4 E-Hybrid", "Panamera S", "Panamera S Hybrid", "Panamera S E-Hybrid", "Panamera 4S", "Panamera 4S E-Hybrid", "Panamera GTS", "Panamera Turbo", "Panamera Turbo S", "Panamera Turbo S E-Hybrid", "Panamera Turbo S Executive"],
"Taycan": ["Taycan", "Taycan 4S", "Taycan Turbo", "Taycan Turbo S", "Taycan Turbo GT"],
"911": ["911", "930", "964", "991", "992", "993", "994", "996", "997"],
"Other models":["Boxter", "Carrera GT", "Cayman", "Targa", "718", "718 Spyder","356", "550", "912", "914", "98", "924", "928", "944", "959", "962", "968"]
},

"Abarth": [
  "124 GT",
  "124 Rally Tribute",
  "124 Spider",
  "500",
  "500C",
  "500e",
  "595",
  "595 Competizione",
  "595 Pista",
  "595 Turismo",
  "695",
  "695C",
  "Grande Punto",
  "Punto",
  "Punto Evo",
  "Punto Supersport"
],

"Honda": [
  "Accord",
  "Ascot",
  "Avancier",
  "Beat",
  "Capa",
  "City",
  "Civic",
  "Clarity",
  "Concerto",
  "CR-V",
  "CR-Z",
  "CRZ",
  "Crosstour",
  "e",
  "e:Ny1",
  "Element",
  "Fit",
  "FR-V",
  "HR-V",
  "Insight",
  "Inspire",
  "Integra",
  "Jazz",
  "Legend",
  "Life",
  "Logo",
  "Mobilio",
  "NSX",
  "Odyssey",
  "Orthia",
  "Partner",
  "Pilot",
  "Prelude",
  "Quintet",
  "Ridgeline",
  "S 2000",
  "Saber",
  "Sabre",
  "Shuttle",
  "Sm-x",
  "Stepwgn",
  "Stream",
  "Torneo",
  "ZR-V"
],

"Maserati": [
  "222",
  "224",
  "228",
  "3200",
  "418",
  "420",
  "4200",
  "422",
  "424",
  "430",
  "Alfieri",
  "Biturbo",
  "Bora",
  "Coupe",
  "Ghibli",
  "Gran Turismo",
  "Grecale",
  "Indy",
  "Karif",
  "Levante",
  "MC12",
  "MC20",
  "Merak",
  "Quattroporte",
  "Racing",
  "Shamal",
  "Spyder",
  "TC"
],

"Ford": ["Aerostar", "B-Max", "Bronco", "C-Max", "Capri", "Connect Elekto", "Consul", "Cougar", "Courier", "Crown", "Customline", "Econoline", "Econovan", "EcoSport", "Edge", "Escape", "Escort", "Excursion", "Expedition", "Explorer", "Express", "F1", "F 100", "F 150", "F 250", "F 350", "F 360", "F 450", "F 550", "F 650", "F Super Duty", "Fairlane", "Falcon", "Fiesta", "Flex", "Focus", "Focus C-Max", "Focus CC", "Freestar", "Freestyle", "Fusion", "Galaxy", "Gran Torino", "Granada", "Grand C-Max", "Grand Tourneo", "GT", "Ka/Ka+", "Kuga", "M", "Maverick", "Mercury", "Mondeo", "Mustang", "Mustang Mach-E", "Orion", "Probe", "Puma", "RS 200", "Ranger", "Ranger Raptor", "S-Max", "Scorpio", "Sierra", "Sportka", "Streetka", "Taunus", "Taurus",
"E-Transit", "Transit", "Transit Bus", "Transit Connect", "Transit Courier", "Transit Custom","Thunderbird", "Torino", "Tourneo", "Tourneo Connect", "Tourneo Courier", "Tourneo Custom","Windstar"],

"Alfa Romeo": ["145", "146", "147", "155", "156", "159", "164", "166", "1750", "2000", "33", "4C", "75", "8C", "90", "Alfa 6", "Alfasud", "Alfetta", "Brera", "Crosswagon", "Giulia", "Giulietta", "GT", "GTV", "Junior", "MiTo", "Montreal", "Quadrofoglio", "RZ", "Spider", "Sportwagon", "Sprint", "Stelvio", "SZ", "Tonale"],

"Aston Martin": ["AR1", "Cygnet", "DB", "DB11", "DB12", "DB7", "DB9", "DBS", "DBX", "Lagonda", "Rapide", "V8", "Valkyrie", "Vanquish", "Vantage", "Virage", "Volante"],

"Bentley": ["Arnage", "Azure", "Bacalar", "Bentayga", "Brooklands", "Continental GT", "Continental GTC", "Eight", "Flying Spur", "Mulsanne", "S1", "S2", "S3", "Turbo R", "Turbo RT", "Turbo S"],

"Bugatti": ["Centodieci", "Chiron", "Divo", "EB 110", "EB 112", "Veyron"],

"BYD": ["Atto 2", "Dolphin", "e6", "F1", "F3", "F6", "F8", "Han", "Seal", "Seal U", "Tang"],

"Cadillac": ["Allante", "Ats", "BLS", "Brougham", "CT4", "CT5", "CT6", "CTS", "Deville", "DTS", "Eldorado", "Escalade", "Fleetwood", "LaSalle", "Lyriq", "Series 62", "Series 6200", "Seville", "SRX", "STS", "XLR", "XT4", "XT5", "XT6", "XTS"],

"Chevrolet": ["2500", "Alero", "Astro", "Avalanche", "Aveo", "Bel Air", "Beretta", "Blazer", "Bolt", "C1500", "Camaro", "Caprice", "Captiva", "Cavalier", "Celebrity", "Chevelle", "Chevy Van", "Citation", "Colorado", "Corsica", "Corvair", "Monza", "Monza coupe", "Monza Sport Sedan", "Corvette", "Crew cab", "Cruze", "Dixie van", "El Camino", "Epica", "Equinox", "Evanda", "Express", "G", "HHR", "Impala", "K1500", "K30", "Kalos", "Lacetti", "Lanos", "Lumina", "Malibu", "Matiz", "Monte Carlo", "Niva", "Nubira", "Orlando", "Rezzo", "S-10", "Silverado", "Spark", "SSR", "Suburban", "Tacuma", "Tahoe", "Tracker", "Trailblazer", "Trans Sport", "Traverse", "Trax", "Uplander", "Viva", "Volt"],

"Chrysler": ["200", "300 M", "300 SRT", "300C", "Aspen", "Crossfire", "Dytona", "ES", "Grand Voyager", "GS", "GTS", "Imperial", "Le Baron", "Neon", "New York", "Pacifica", "Prowler", "PT Cruiser", "Ram Van", "Saratoga", "Sebring", "Stratus", "Town & Country", "Valiant", "Viper", "Vision", "Voyager"],

"Citroen": ["2CV", "Acadiane", "Ami", "AX", "Axel", "Berlingo", "BX", "C-Crosser", "C-Elvsee", "C-Zero", "C1", "C15", "C2", "C25", "C3", "C3 Aircross", "C3 Picasso", "C35", "C4", "C4 Aircross", "C4 Cactus", "C4 Picasso", "C4 SpaceTourer", "C4 X", "E-C4 Electric", "E-C4 X", "Grand C4 Picasso", "Grand C4 SpaceTourer", "C5", "C5 Aircrpss", "C5 X", "C6", "C8", "CX", "DS", "DS3", "DS4", "DS5", "Dyane", "E-Mehari", "Evasion", "GSA", "Holidays", "Jumper", "Jumpy", "LNA", "Mehari", "Nemo", "SAXO", "SM", "Spacetourer", "Traction", "Visa", "Xantia", "XM", "Xsara", "Xsara Picasso", "ZX"],

"Corvette": ["C1", "C2", "C3", "C4", "C5", "C6 Convertible", "C6 Coupe", "C7", "C8", "CZ6", "Grand Sport", "Stingray", "Z06", "ZR1"],

"Dacia": ["1310", "Berlina", "Bigster", "Break", "Dokker", "Double Cab", "Drop Side", "Duster", "Jogger", "Lodgy", "Logan", "Nova", "Pick Up", "Sandero", "Solenza", "Spring"],

"Dodge": ["Avenger", "Caliber", "Carvan", "Challenger", "Charger", "Coronet", "Dakota", "Dart", "Demon", "Durango", "Grand Caravan", "Intrepid", "Journey", "Magnum", "Neon", "Nitro", "RAM", "Stealth", "Stratus", "Van", "Viper"],

"Ferrari": ["12 Cilindri", "195", "206", "208", "246", "250", "275", "288", "296", "296 GTB", "308", "328", "330", "348", "360", "365", "400", "412", "430 Scuderia", "456", "458", "488", "512", "550", "575", "599", "612", "750", "812", "California", "Daytona", "Dino GT4", "Enzo Ferrari", "F12", "F355", "F40", "F430", "F50", "F5112", "F8 Spider", "F8 Tributo", "FF", "FXX", "GTC4 Lusso", "LaFerrari", "Mondial", "Monza", "Protofino", "Purosangue", "Roma", "Scuderia Spider 16M", "SF90 Spider", "SF90 Stradale", "Superamerica", "Testarossa"],

"Genesis": ["Electrified G80", "G70", "G70 Shooting Brake", "G80", "G90", "GV60", "GV70", "GV80"],"GMC": ["Acadia", "Canyon", "Envoy", "Safari", "Savana", "Sierra", "Sonoma", "Syclone", "Terrain", "Typhoon", "Vandura", "Yukon"],

"Hummer": ["H1", "H2", "H3", "HX"],

"Jaguar": ["420", "D-Type", "Daimler", "E-Pace", "E-Type", "F-Pace", "F-Type", "I-Pace", "MK ||", "S-Type", "Sovereign", "X-Type", "X300", "XE", "XF", "XJ", "XJ12", "XJ40", "XJ6", "XJ8", "XJR", "XJS", "XJSC", "XK", "XKR"],

"Jeep": ["Avenger", "Cherokee", "CJ-5", "CJ-7", "CJ-8", "Comanche", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Liberty", "Patriot", "Renegade", "Wagoneer", "Willys", "Wrangler"],

"KIA": ["Besta", "Carens", "Carnival", "Ceed/cee'd", "Ceed SW/cee'd SW", "Cerato", "Clarus", "e-Niro", "Elan", "EV3", "EV6", "EV9", "Joice", "K2500", "K2700", "K2900", "Leo", "Magentis", "Mentor", "Mohave/Borrego", "Niro", "Opirus", "Optima", "Picanto", "Pregio", "ProCeed/ pro_cee'd", "Retona", "Rio", "Roadster", "Rocsta", "Sephia", "Shuma", "Sorento", "Soul", "Spectra", "Sportage", "Stinger", "Stonic", "Venga", "XCeed"],

"Koenigsegg": ["Agera", "CC", "Jesko", "One:1", "Regera"],

"Lexus": { 
"ES series": ["ES 300", "ES 330", "ES 350"],
 "GS series": ["GS 200t", "GS 250", "GS 300", "GS 350", "GS 430", "GS 450h", "GS 460", "GS F"],
 "GX series": ["GX 460", "GX 470"],
 "IS series": ["IS 200", "IS 220d", "IS 250", "IS 300", "IS 350", "IS F"], 
 "LC series": ["LC 500", "LC 500h", "LC F"],
 "LS series": ["LS 400", "LS 430", "LS 460", "LS 500", "LS 600"],
 "LX series": ["LX 450d", "LX 470", "LX 500d", "LX 570", "LX 600"],
 "NX series": ["NX 200t", "NX 300", "NX 300h", "NX 350h", "NX 450h+"],
 "RC series": ["RC 200t", "RC 300h", "RC 350", "RC F"], 
 "RX series": ["RX 200t", "RX 300", "RX 330", "RX 350", "RX 350h", "RX 400", "RX 450h", "RX 500h"], 
 "SC series": ["SC 400", "SC 430"], "UX series": ["UX 200", "UX 250h", "UX 300e", "UX 300h"],
 "Other models":["CT 200h", "LFA", "LM", "LBX", "RZ"]
},
"Lotus": ["2-Eleven", "3-Eleven", "340 R", "Cortina", "Elan", "Eletre", "Elise", "Elite", "Emeya", "Europa", "Evija", "Evora", "Excel", "Exige", "Omega", "Super Seven", "Type 130", "V8", "Venturi"],

"Lamborghini": ["Asterion", "Aventador", "Centenario", "Countach", "Diablo", "Espada", "Estouqe", "Gallardo", "Huracan", "Jalpa", "LM", "Miura", "Mucielago", "Reventon", "Revuelto", "Sian FKP 37", "Terzo Millennio", "Urraco P250", "Urus", "Veneo"],

"Mazda": ["121", "2", "3", "323", "5", "6", "626", "929", "Atenza", "Axela", "B series", "Bongo", "BT-50", "Capella", "CX-3", "CX-30", "CX-5", "CX-60", "CX-7", "CX-80", "CX-9", "Demio", "E Series", "Familia", "Millenia", "MPV", "MX-3", "MX-30", "MX-5", "MX-6", "Pick Up", "Premacy", "Protege", "RX-7", "RX-8", "RX-9", "Tribute", "Xedos"],

"McLaren": ["12 C", "540C", "570GT", "570S", "600LT", "620R", "650S Coupe", "650S Spider", "675LT", "720S", "750S", "765LT coupe", "765LT Spider", "Artura", "Elva", "F1", "GT", "MP4-12C", "P1", "Senna", "Speedtail"],

"MG": ["EHS", "HS", "Marvel R", "Metro", "Metro", "MG3", "MG4", "MG5", "MGA", "MGB", "MGC", "MGF", "Midget", "RV8", "TD", "TF", "ZR", "ZS", "ZT"],

"Mitsubishi": ["3000 GT", "400", "Airtrek", "ASX", "Attrage", "Canter", "Carisma", "Chariot", "Colt", "Cordia", "Cosmos", "Delica", "Diamante", "Dingo", "Dion", "Eclipse", "Eclipse Cross", "FTO", "Galant", "Galloper", "Grandis", "I-MiEV", "L200", "L300", "L400", "Lancer", "Legnum", "Libero", "Mirage", "Montero", "Outlander", "Pajero", "Pajero Pinin", "Pajero Sport", "PICK UP", "RVR", "Santamo", "Sapporo", "Shogun", "Sigma", "Space Gear", "Space Star", "Space Wagon", "Starion"],

"Nissan": ["100 NX", "200 SX", "280 ZX", "300 ZX", "350Z", "370Z", "AD", "Almera", "Almera Tino", "Altima", "Ariya", "Armada", "Avenir", "Bassara", "Cabstar", "Cargo", "Cedric", "Cefiro", "Chery", "Cube", "Datsun", "E-NV200", "Elgrand", "Evalia", "Expert", "Firago", "Frontier", "Gloria", "GT-R", "Interstar", "Juke", "King Cab", "Kubistar", "Laurel", "Leaf", "Liberty", "March", "Maxima", "Micra", "Murano", "Navara", "Note", "NP300", "NV200", "NV250", "NV300", "NV400", "Pathfinder", "Patrol", "Pick Up", "Pixo", "Prairie", "Presage", "Presea", "Primastar", "Primera", "Pulsar", "Qashqau", "Qashqai+2", "Quest", "R Nessa", "Rouge", "Safari", "Sentra", "Serena", "Silvia", "Skyline", "Stagea", "Stanza", "Sunny", "Teana", "Terrano", "Tiida"],

"Peugeot": ["1007", "104", "106", "107", "108", "2008", "204", "205", "206", "207", "208", "3008", "301", "304", "305", "306", "307", "308", "309", "4007", "4008", "404", "405", "406", "407", "408", "5008", "504", "505", "508", "604", "605", "607", "806", "807", "Bipper", "Boxer", "Camper", "e-2008", "e-208", "e-Expert", "Expert", "iOn", "J5", "J9", "Partner", "Ranch", "RCZ", "Rifter", "Traveller"],

"Opel": ["Adam", "Aglia", "Ampera", "Ampera-E", "Antara", "Arena", "Ascona", "Astra", "Calinra", "Campo", "Combo", "Combo Life", "Combo-e", "Combo-e Life", "Commodore", "Corsa", "Corse-e", "Crossland", "Crossland X", "Diplomat", "Frontera", "Grandland", "Grandland X", "GT", "Insignia", "Kadett", "Karl", "Manta", "Meriva", "Mokka", "Mokka X", "Mokka-E", "Monterey", "Monza", "Movano", "Movano-e", "Omega", "Pick Up Sportscap", "Rekord", "Rocks-e", "Senator", "Signum", "Sintra", "Speedster", "Tigra", "Vectra", "Vivaro", "Vivaro-e", "Zafira", "Zafira Life", "Zafira Tourer"],

"Polestar": ["1", "2", "3", "4"],

"Rolls Royce": ["Arnage Green Label", "Arnage Red Label", "Azure", "Azure Mulliner", "Camargue", "Cloud", "Continental R Mulliner", "Continental R", "Continental SC", "Corniche", "Cullinan", "Dawn", "Flying Spur", "Ghost", "LE Mains Series", "Park Ward", "Phantom", "Phanntom Drophead", "Silver Dawn", "Silver Shadow", "Silver Spirit", "Silver Spur", "Silver Wraith", "Silver Wraith ||", "Spectre", "T", "Touring", "Wraith"],

"Rover": ["100", "111", "114", "115", "200", "213", "214", "216", "2118", "220", "25", "400", "414", "416", "418", "420", "45", "600", "618", "620", "623", "75", "800", "820", "825", "827", "City Rover", "Estate", "Metro", "MINI", "Montego", "Rover", "SD", "Streewise", "Tourer"],

"Saab": ["9-2X", "9-3", "9-4X", "9-5", "9-7X", "90", "900", "9000", "92", "93", "95", "96", "99", "GT 750", "Sonett", "Sport / GT 850"],

"Seat": ["Alhambra", "Altea", "Altea XL", "Arona", "Arosa", "Ateca", "Cordoba", "Exeo", "Fura", "Ibiza", "Inca", "Leon", "Leon e-Hybrid", "Malaga", "Marbella", "Mii", "Panda", "Ronda", "Tarraco", "Terra", "Toledo"],

"Smart": ["#1", "#3", "brabus", "city-cupe/city-cabrio", "crossblade", "forFour", "forTwo", "roadster"],

"Subaru": ["1200", "1800", "Ascent", "Baja", "BRZ", "Crosstrek", "E10", "E12", "Forester", "Impreza", "Justy", "Legacy", "Leone", "Levorg", "Libero", "M60", "M70", "M80", "Mini", "OUTBACK", "Solterra", "SVX", "Trezia", "Tribeca", "Vanille", "Vivio", "WRX", "XT", "XV"],

"Suzuki": ["Across", "Alto", "Baleno", "Capuccino", "Carry", "Celerio", "Escudo", "Grand Vitara", "Ignis", "Ik-2", "Jimny", "Kizashi", "Liana", "LJ 80", "Maruti", "S-Cross", "SA 310", "Samurai", "Sanatana", "SJ 410", "Sj 413", "SJ Samurai", "Splash", "Super-Carry", "Swace", "Swift", "SX4", "SX4 S-Cross", "Vitara", "Wagon R+", "X-90", "XL-7"],

"Tesla": ["Cybertruck", "Model 3", "Model S", "Model X", "Model X", "Model Y", "Roadster"],


"Volvo": ["240", "244", "245", "262", "264", "265", "340", "360", "440", "460", "480", "740", "744", "745", "760", "764", "780", "850", "855", "940", "944", "945", "960", "965", "Amazon", "C30", "C40", "C70", "EC40", "EX30", "EX90", "P1800", "Polar", "PV544", "S40", "S60", "S60 Cross Country", "S70", "S80", "S90", "V40", "V40 Cross Country", "V50", "V60", "V60 Cross Country", "V70", "V90", "V90 Cross Country", "XC40", "XC60", "XC70", "XC90"],

"Mansory": ["Aston Martin Cryus", "Aston Martin DB9", "Aston Martin Vanquish", "Aston Martin Vantage", "Audi R8", "Bentley Continental GT", "Bentley Flying Spur", "Bentley Le Mansory", "Bentley Vitesse Rose", "BMW 7 Series", "BMW X5", "BMW X6", "Bugatti Veyron", "Ferrari 458", "Ferrari 599 GTB", "Ferrari F12", "Ferrari La Revoluzione", "Ferrari Siracusa", "Land Rover Range Rover", "Lotus Elise", "Lotus Evora", "Maserati Ghibli", "Maserati Gran Turismo", "McLaren 12C", "Mercedes Benz C", "Mercedes Benz CLS", "Mercedes Benz E", "Mercedes Benz G", "Mercedes Benz GL", "Mercedes Benz M", "Mercedes Benz ML", "Mercedes Benz S", "Mercedes Benz SL", "Mercedes Benz SLK", "Mercedes Benz SLR", "Mercedes Benz SLS", "Mercedes Benz Viano", "Porsche 918", "Porsche 991", "Porsche 997", "Porsche Cayenne", "Porsche Macan", "Porsche Panamera", "Rolls Royce Ghost", "Rolls Royce Phantom", "Rolls Royce Wraith", "Tesla Model S"],

"Renault": ["Alaskan", "Alpine A110", "Alpine A310", "Alpine A610", "Alpine V6", "Arkana", "Austral", "Avantime", "Captur", "Clio", "Duster", "Escape", "Express", "Fluence", "Fluence Z.E", "Fuego", "Grand Escape", "Grand Modus", "Grand Scenic", "Kadjar", "Kangoo", "Kangoo E-TECH", "Kangoo Z.E", "KOleos", "Laguna", "Latitude", "Logan", "Mascott", "Master", "Megane", "Megane E-TECH", "Messenger", "Modus", "P 1400", "R 11", "R 14", "R 18", "R 19", "R 20", "R 21", "R 25", "R 30", "R 4", "R 6", "R 9", "Rafale", "Rapid", "Safrane", "Sandero", "Sandero Stepway", "Scenic", "Spider", "Super 5", "Symbioz", "Symbol", "Talisman", "Trafic", "Twingo", "Twizy", "Vel Satis", "Wind", "ZOE"],

"Lincoln": ["Aviator", "Continental", "Crosair", "Cosmopolitan", "LS", "Mark", "MKC", "MKT", "MKX", "MKZ", "Nautilus", "Navigator", "Town Car", "Zephyr"],

"Pagani": ["Huayra", "Zonda"],

"Lancia": ["A 112", "Appia", "Beta", "Dedra", "Delta", "Flamina", "Flavia", "Fulvia", "Gamma", "HPE", "K", "Kappa", "Lybra", "MUSA", "Phedra", "Prisma", "Stratos", "Thema", "Thesis", "Trevi", "Voyager", "Y", "Ypsilon", "Z", "Zeta"],
"Cupra": ["Terramar", "Terramar VZ", "Tavascan endurance", "Tavascan VZ", "Born E-boost", "Born VZ", "Formentor", "Formentor VZ", "Leon", "Leon VZ", "Leon Sportstourer", "Leon Sportstourer VZ", "Ateca", "Ateca VZ", "Arona", "Ibiza"],

"Acura": ["ILX", "MDX", "NSX", "RDX", "RL", "RLX", "RSX", "TL", "TLX", "TSX", "ZDX"],

"Changan": ["Eado Plus", "ALSVIN", "CS95", "CS85", "CS75 Plus", "CS35 PLUS", "Hunter", "UNI-K", "UNI-T", "UNI-S", "UNI-V"],

"Daihatsu": ["Applause", "Charade", "Charmant", "Copen", "Coure", "Domino", "Extol", "F Modelle", "Feroza", "Freeclimber", "Gran Move", "Hijet", "Materia", "Move", "Pionier", "Rocky", "Sirion", "Taft", "Terios", "Trevis", "Valera", "YRV"],

"Delorean": ["DMC-12"],

"Geely": ["GX3PRO", "Preface", "Monjaro", "Starray", "New Coolray", "Tugella", "Coolray", "Okavango", "Azkarra", "Emgrand", "EX5", "Okavango", "Geomtery C", "Geometry IC"],

"Great Wall Motors": ["Haval M6", "Haval Chitu", "Haval Shenshou", "Haval H5", "Haval H6", "Haval H9", "Haval Big Dog", "Haval Xiaolong", "Haval Xiaolong Max", "Haval Raptor", "Haval Cool Dog", "Haval Jolion", "Haval H6S", "Wey Lanshan", "Wey Latte", "Wey Mocha", "Wey Gaoshan", "Ora Ballet Cat", "Ora Good Cat", "Ora Lightning Cat", "Tank 300", "Tank 400", "Tank 500", "Tank 700", "Tank 800", "Great Wall King Kong Cannon", "Great Wall Shanhai Cannon", "Great Wall Pao", "Great Wall Wingle 7", "Great Wall Peri", "Great Wall Voleex C20R", "Great Wall Voleex C10/Great Wall Phenom", "Great Wall Coolbear", "Great Wall Florid", "Great Wall Voleex C30/C30", "Great Wall Voleex C50/C50", "Great Wall Haval M1", "Great Wall Haval M2", "Great Wall Haval M4", "Great Wall Hover/Great Wall Haval H3", "Great Wall Pegasus", "Great Wall Safe", "Great Wall Sing", "Great Wall Cowry/Voleex V80", "Great Wall Deer", "Great Wall SoCool", "Great Wall Sailor", "Great Wall Wingle 3", "Great Wall Wingle 5", "Great Wall Wingle 6", "Haval H1", "Haval H2", "Haval H2s", "Haval H4", "Haval F5", "Haval F7", "Haval F7X", "Haval H6 Coupe", "Haval H7", "Haval H8", "Wey Macchiato", "Wey VV5", "Wey VV6", "Wey VV7", "Wey VV7 GT", "Wey P8", "Mecha Dragon", "Ora R1/Black Cat", "Ora R2/White Cat", "Ora iQ"],

"Hongqi": ["H9", "Ousado", "H6", "HS3", "E-HS9", "EH7", "EHS7", "HS5", "HS7", "E-QM5"],

"Infiniti": ["135", "EX25", "EX30", "EX35", "EX37", "FX", "GX25", "GX35", "GX37", "I35", "JX35", "M30", "M35", "M37", "M45", "Q30", "Q45", "Q50", "Q60", "Q70", "Q80", "QX30", "QX50", "QX55", "QX56", "QX60", "QX70", "QX80"],

"Lada": ["110", "111", "112", "1200", "1300/1500/1600", "2106", "4x4", "Aleko", "C-cross", "Carlota", "Forma", "Granta", "Kalina", "Largus", "Natacha", "Niva", "Nova", "Priora", "Sagona", "Samara", "Sprint", "Taiga", "Universal", "Urban", "VAZ 215", "Vesta", "X-Ray"],

"Lynk & Co": ["Lynk & Co 01", "Lynk & Co 03", "Lynk & Co 05", "Lynk & Co 06", "Lynk & Co 07", "Lynk & Co 08", "Lynk & Co 09", "Lynk & Co 900", "Lynk & Co Z10", "Lynk & Co Z20"],

"Maybach": ["125", "W1", "W3", "W5", "12", "DS7 Zeppelin", "DSH", "W6", "DS8 Zeppelin", "W6 DSG", "SW35", "SW38", "SW42", "JW61", "57", "62", "Exelero", "57S", "62S", "62 Landaulet", "57 Zeppelin", "62 Zeppelin", "Guard", "Mercedes-Maybach S600", "Mercedes-Maybach S400", "Mercedes-Maybach S500", "Mercedes-Maybach S550", "Mercedes-Maybach S600 Pullman", "Mercedes-Maybach S650 Cabriolet", "Mercedes-Maybach S560", "Mercedes-Maybach S650", "Mercedes-Maybach S680", "Mercedes-Maybach G 650 Landaulet", "Mercedes-Maybach GLS580", "Mercedes-Maybach GLS600", "Mercedes-Maybach S480", "Mercedes-Maybach S580", "Mercedes-Maybach S680", "Mercedes-Maybach EQS680 SUV", "Mercedes-Maybach Project Maybach", "Mercedes-Maybach SL580", "Mercedes-Maybach SL680"],

"Mini": ["1000", "1300", "Aceman", "Clubvan", "Cooper", "Cooper D", "Cooper S", "Cooper SD", "Cooper SE", "John Cooper Works", "One", "One D", "Cooper Cabrio", "Cooper D Cabrio", "Cooper S Cabrio", "Cooper SD Cabrio", "John Cooper Works Cabrio", "One Cabrio", "Cooper Clubman", "Cooper D Clubman", "Cooper S Clubman", "Cooper SD Clubman", "John Cooper Works Clubman", "One Clubman", "One D Clubman", "Cooper Countryman", "Cooper D Countryman", "Cooper S Countryman", "Cooper SD Countryman", "Cooper SE Countryman", "Countryman C", "Countryman D", "Countryman S All4", "JCW Countryman All4", "John Cooper Works Countryman", "One Countryman", "One D Countryman", "Cooper Coupe", "Cooper D Coupe", "Cooper S Coupe", "Cooper SD Coupe", "John Cooper Works Coupe", "Cooper D Paceman", "Cooper Paceman", "Cooper S Paceman", "Cooper SD Paceman", "John Cooper Works Paceman", "Cooper Roadster", "Cooper S Roadster", "Cooper SD Roadster", "John Cooper Works Roadster"],

"Nio": ["ET9", "ET7", "ET5", "ET5 electric tourer", "ES8", "ES6", "EC7", "EC6", "ES7"],

"Ram": ["1500", "2500", "3500", "Chassis Cab", "Promaster"],

"Rimac": ["Concepts one", "Concepts S", "Nevera"],

"Roewe": ["360", "950", "i5", "i6", "iMAX8", "Marvel X", "RX3", "RX5", "RX8", "RX9"],

"Wuling": ["Wuling Hongguang mini", "Wuling Binguo", "Wuling Yep", "Wuling Air RHD&LHD", "Wuling E10 Cargo Van", "G050 LHD&RHD", "Wuling Xingguang", "Wuling E5", "Wuling Binguo Bingo EV", "Wuling Binguo RHD&LHD", "Wuling Hongguang Mini", "Wuling Mini Gameboy", "Wuling Mini Cabrio", "Wuling 2025 Mini EV", "Baojun Yep", "Baojun Yep Plus", "Wuling Binguo Plus", "Wuling Nebula Xingyun", "Wuling Xingguang S", "Baojun Yunhai", "Wuling Alvez RHD&LHD", "Wuling Kaijie Victory", "Wuling HongGuang PLUS", "Wuling Hongguang S", "Wuling HongGuang S3", "Wuling Almaz RHD&LHD", "Wuling Hongguang MPV Electric Minivan", "Wuling Hongguang PLUS 2024 Model", "Wuling Hongguang S3 Wuling Cortez", "Wuling Hongguang V Chevrolet N400", "New Wuling HONGGUANG S 2024 Model"],

"Xiaomi": [
  "YU7",
  "YU7 Pro",
  "YU7 Max",
  "SU7",
  "SU7 Pro",
  "SU7 Max",
  "SU7 Ultra"
],

"Xpeng": ["G3i", "G6", "G9", "P5", "P7"]

};