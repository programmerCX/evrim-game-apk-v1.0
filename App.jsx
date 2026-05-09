/** @jsxRuntime classic */
import React, { useEffect, useMemo, useState, useRef, useCallback, Fragment } from "react";
import { Atom, Orbit, Sparkles, Lock, ChevronRight, RefreshCw, Zap, Telescope,
  BarChart3, Info, ArrowUpCircle, Volume2, VolumeX, Flame, Trophy, AlertTriangle,
  TrendingUp, Settings, Target, BookOpen, FlaskConical, NotebookPen, X, ChevronUp } from "lucide-react";

// ─── Keyframe Animations ────────────────────────────────────────────────────
const KF = `
@keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-54px) scale(0.75)}}
@keyframes rippleOut{0%{transform:translate(-50%,-50%) scale(0);opacity:0.55}100%{transform:translate(-50%,-50%) scale(5);opacity:0}}
@keyframes twinkle{0%,100%{opacity:0.08;transform:scale(1)}50%{opacity:0.9;transform:scale(1.6)}}
@keyframes toastIn{0%{opacity:0;transform:translateY(10px) scale(0.92)}15%{opacity:1;transform:translateY(0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-6px)}}
@keyframes stageEnter{from{opacity:0;transform:translateX(22px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulseGold{0%,100%{box-shadow:0 0 18px rgba(250,204,21,0.25)}50%{box-shadow:0 0 36px rgba(250,204,21,0.65)}}
@keyframes cosmicTick{0%{opacity:0;letter-spacing:0.08em}30%{color:rgb(253,224,71)}100%{opacity:1;letter-spacing:0.06em}}
@keyframes extinctionPulse{0%,100%{opacity:0.12}50%{opacity:0.55}}
@keyframes eventGlow{0%,100%{opacity:0.5}50%{opacity:1}}
@keyframes savedPop{0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
@keyframes quantumShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}
@keyframes cinemaIn{0%{opacity:0}8%{opacity:1}80%{opacity:1}100%{opacity:0}}
@keyframes cinemaEmoji{0%{transform:scale(0.2) rotate(-20deg);opacity:0}35%{transform:scale(1.2) rotate(4deg);opacity:1}55%{transform:scale(1) rotate(0)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes cinemaTitle{0%,25%{opacity:0;transform:translateY(16px)}40%{opacity:1;transform:translateY(0)}100%{opacity:1}}
@keyframes particleFly{from{opacity:1;transform:translate(0,0) scale(1)}to{opacity:0;transform:translate(var(--pdx),var(--pdy)) scale(0)}}
@keyframes branchDrawerUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes capsuleOpen{from{opacity:0;transform:translateY(24px) scale(0.93)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes prereqSlide{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}

/* ── S24 Ultra Enhanced Visuals ── */
@keyframes nebulaFloat{
  0%,100%{transform:scale(1) translate(0%,0%);opacity:0.22}
  25%{transform:scale(1.08) translate(1.5%,0.8%);opacity:0.32}
  50%{transform:scale(0.96) translate(-0.8%,1.5%);opacity:0.18}
  75%{transform:scale(1.04) translate(0.6%,-1%);opacity:0.28}
}
@keyframes nebulaFloat2{
  0%,100%{transform:scale(1) translate(0%,0%);opacity:0.16}
  33%{transform:scale(1.1) translate(-2%,1%);opacity:0.26}
  66%{transform:scale(0.94) translate(1.5%,-0.5%);opacity:0.20}
}
@keyframes energyRing{
  0%{transform:translate(-50%,-50%) scale(0.6);opacity:0.7}
  100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}
}
@keyframes hudBlink{0%,88%,100%{opacity:1}94%{opacity:0.4}}
@keyframes scanLine{
  0%{transform:translateY(-100%)}
  100%{transform:translateY(100vh)}
}
@keyframes cardSelectGlow{
  0%,100%{box-shadow:0 0 0 1px rgba(255,255,255,0.18)}
  50%{box-shadow:0 0 12px 2px rgba(150,200,255,0.25),0 0 0 1px rgba(255,255,255,0.28)}
}
@keyframes statPop{
  0%{transform:scale(1)}
  50%{transform:scale(1.06)}
  100%{transform:scale(1)}
}
@keyframes branchGlow{
  0%,100%{box-shadow:none}
  50%{box-shadow:0 0 16px 3px rgba(96,165,250,0.3)}
}
@keyframes cosmicCursor{
  0%,100%{opacity:1}50%{opacity:0}
}
@keyframes headerShimmer{
  0%{background-position:200% center}
  100%{background-position:-200% center}
}
`;


// ─── Stage Metadata ──────────────────────────────────────────────────────────
const STAGE_META = {
  big_bang:        { emoji: "💥", poem: "Hiçlikten her şey doğdu.\nZaman ve uzay başladı." },
  first_stars:     { emoji: "⭐", poem: "Karanlığı delen ilk ışıklar\nsonsuz uzayda yandı." },
  before_earth:    { emoji: "🪐", poem: "Toz ve gaz bir araya geldi;\nbir yıldız sistemi biçimlendi." },
  earth_prep:      { emoji: "🌊", poem: "Eriyip soğuyan kaya yerini\nokyanuslara bıraktı." },
  first_life:      { emoji: "🦠", poem: "Kimyasal bir sıradan\nyaşam kıvılcımı çıktı." },
  prokaryot:       { emoji: "🔬", poem: "Milyarlarca yıl boyunca\nhücreler dünyaya hükmetti." },
  okaryot:         { emoji: "🧬", poem: "Hücre içinde hücre;\nevrim dev bir sıçrama yaptı." },
  kambriya:        { emoji: "🦑", poem: "Göz ilk kez açıldı.\nAvcı ve av savaşı başladı." },
  omurgalilar:     { emoji: "🐟", poem: "Kemik ve kıkırdak güçlendi;\nyaşam karaya ayak bastı." },
  perm_dinos:      { emoji: "🦕", poem: "Yıkımdan güç doğar.\nDinozorlar çağa damga vurdu." },
  memeliler:       { emoji: "🦁", poem: "Memeli sıcaklığı\nasteroidin soğuğunu yendi." },
  paleolitik:      { emoji: "🔥", poem: "Ateş yandı.\nİnsan doğanın efendisi oldu." },
  neolitik:        { emoji: "🌾", poem: "Tohumlar toprakla buluştu;\nuygarlık doğdu." },
  antik_bilim:     { emoji: "📐", poem: "Akıl sordu, gözlem cevapladı.\nBilim başladı." },
  altin_cag:       { emoji: "📚", poem: "Bağdat'ta yanan mum\nAvrupa'yı da aydınlattı." },
  bilimsel_devrim: { emoji: "🔭", poem: "Dünya güneşin etrafında döndü.\nHer şey değişti." },
  elektrik_kimya:  { emoji: "⚡", poem: "Maddenin sırrı ve elektriğin gücü\nele geçirildi." },
  endustriyel:     { emoji: "⚙️", poem: "Makineler çalıştı.\nModern dünya kapıda bekledi." },
};

// ─── Stages ─────────────────────────────────────────────────────────────────
const STAGES = [
  { id: "big_bang",        title: "Kozmik Başlangıç",     subtitle: "Big Bang ve ilk parçacıklar",       color: "from-indigo-900 via-black to-violet-950",     gate: "hydrogen_helium"   },
  { id: "first_stars",     title: "İlk Yıldızlar",        subtitle: "Füzyon, süpernova, ağır elementler", color: "from-slate-950 via-blue-950 to-black",         gate: "heavy_elements"    },
  { id: "before_earth",    title: "Dünya'dan Önce",       subtitle: "Güneş Sistemi oluşum koridoru",      color: "from-black via-stone-950 to-amber-950",        gate: "proto_earth"       },
  { id: "earth_prep",      title: "Dünya Hazırlanıyor",   subtitle: "Kabuk, atmosfer, okyanus",           color: "from-slate-950 via-cyan-950 to-emerald-950",   gate: "primitive_ocean"   },
  { id: "first_life",      title: "İlk Yaşam",            subtitle: "Kimyasal evrimden LUCA'ya",          color: "from-emerald-950 via-teal-900 to-green-950",   gate: "luca"              },
  { id: "prokaryot",       title: "Prokaryot Dünyası",    subtitle: "İlk hücreler ve oksijen devrimi",    color: "from-lime-950 via-green-950 to-emerald-900",   gate: "buyuk_oksidasyon"  },
  { id: "okaryot",         title: "Ökaryot Devrimi",      subtitle: "Endosimbiyoz ve çok hücreli yaşam",  color: "from-purple-950 via-violet-950 to-blue-950",   gate: "cok_hucreli_yasam" },
  { id: "kambriya",        title: "Kambriya Patlaması",   subtitle: "Göz, iskelet ve hayvan ağacı",       color: "from-blue-950 via-cyan-950 to-teal-900",       gate: "kambriya_patlamasi"},
  { id: "omurgalilar",     title: "Omurgalılar & Kara",   subtitle: "Balıklar, tetrapodlar, kara",        color: "from-blue-950 via-slate-900 to-indigo-950",    gate: "amniotik_yumurta"  },
  { id: "perm_dinos",      title: "Perm'den Dinozorlara", subtitle: "Büyük Ölüm ve K/Pg felaketi",        color: "from-red-950 via-orange-950 to-amber-950",     gate: "kpg_yok_olusu"     },
  { id: "memeliler",       title: "Memelilerin Çağı",     subtitle: "Primatlar ve Homo sapiens",          color: "from-amber-950 via-yellow-950 to-lime-950",    gate: "homo_sapiens"      },
  { id: "paleolitik",      title: "Paleolitik",           subtitle: "Ateş, taş alet, dil, göç",          color: "from-stone-950 via-amber-950 to-orange-950",   gate: "goc_yayilma"       },
  { id: "neolitik",        title: "Neolitik & Uygarlık",  subtitle: "Tarım, yazı ve ilk şehirler",        color: "from-green-950 via-lime-950 to-emerald-950",   gate: "yazinin_icadi"     },
  { id: "antik_bilim",     title: "Antik Bilim",          subtitle: "Yunan, Mısır ve Helenistik bilgi",   color: "from-slate-900 via-blue-950 to-indigo-900",    gate: "iskenderiye"       },
  { id: "altin_cag",       title: "İslam Altın Çağı",     subtitle: "Cebir, optik, tıp, astronomi",       color: "from-amber-950 via-yellow-900 to-orange-950",  gate: "bilgi_aktarimi"    },
  { id: "bilimsel_devrim", title: "Bilimsel Devrim",      subtitle: "Kopernik, Galileo, Newton",          color: "from-indigo-950 via-purple-950 to-violet-900", gate: "newton_sentezi"    },
  { id: "elektrik_kimya",  title: "Elektrik & Kimya",     subtitle: "Franklin, Lavoisier, Volta, Faraday",color: "from-cyan-950 via-blue-950 to-indigo-950",     gate: "faraday"           },
  { id: "endustriyel",     title: "Endüstriyel Bilim",    subtitle: "Carnot, Darwin, Maxwell, Edison",    color: "from-zinc-950 via-slate-900 to-neutral-950",   gate: "elektrik_sebekesi" },
];

// ─── Helper to build discovery entry ────────────────────────────────────────
function disc(id, stage, name, domain, ct, conf, uc, lcb, gps, gg, req, opts = {}) {
  return { id, stage, name, domain, ct, conf, uc, lcb, gps, gg, req, ...opts };
}

// ─── Discoveries ─────────────────────────────────────────────────────────────
const DISCOVERIES = [
  disc("spacetime_expansion",   "big_bang",        "Uzay-Zaman Genişlemesi",    "Kozmoloji",         "13.80 milyar yıl önce", "Yüksek",   25,        16,       0.05,  0.045,  [],                                   { q: "Uzay-zaman, madde ve enerjiyle dans eder.",                  ms: "Sv5: +%5"       }),
  disc("fundamental_particles", "big_bang",        "Temel Parçacıklar",         "Parçacık fiziği",   "13.80 milyar yıl önce", "Yüksek",   75,        42,       0.12,  0.08,   ["spacetime_expansion"],               { qt: true, ms: "Sv10: Tıklama +1"                                                                    }),
  disc("protons_neutrons",      "big_bang",        "Proton ve Nötronlar",       "Nükleer fizik",     "13.80 milyar yıl önce", "Yüksek",   150,       84,       0.22,  0.13,   ["fundamental_particles"],             { qt: true, ms: "Sv5: -%5 maliyet"                                                                    }),
  disc("hydrogen_helium",       "big_bang",        "Hidrojen ve Helyum",        "Nükleosentez",      "13.80 milyar yıl önce", "Yüksek",   320,       160,      0.40,  0.20,   ["protons_neutrons"],                  { ms: "Sv10: +%8"                                                                                     }),
  disc("gas_clouds",            "first_stars",     "Gaz Bulutları",             "Astrofizik",        "13.50 milyar yıl önce", "Yüksek",   520,       260,      0.55,  0.28,   ["hydrogen_helium"],                   { ms: "Sv5: +%5"                                                                                      }),
  disc("first_stars",           "first_stars",     "İlk Yıldızlar",             "Yıldız evrimi",     "13.20 milyar yıl önce", "Orta-Y.",  1100,      560,      0.95,  0.42,   ["gas_clouds"],                        { ms: "Sv10: +%10"                                                                                    }),
  disc("supernova",             "first_stars",     "Süpernova",                 "Yıldız ölümü",      "12.00 milyar yıl önce", "Yüksek",   2600,      1280,     2.05,  0.80,   ["first_stars"],                       { ms: "Sv5: -%8 maliyet"                                                                              }),
  disc("heavy_elements",        "first_stars",     "Karbon, Oksijen, Demir",    "Kozmokimya",        "10.00 milyar yıl önce", "Yüksek",   5200,      2600,     3.60,  1.15,   ["supernova"],                         { ms: "Sv10: +%12"                                                                                    }),
  disc("cai_first_solids",      "before_earth",    "CAI — İlk Katılar",         "Kozmokimya",        "4.567 milyar yıl önce", "Yüksek",   7600,      3100,     4.2,   1.30,   ["heavy_elements"],                    { ms: "Sv5: +%5"                                                                                      }),
  disc("young_sun",             "before_earth",    "Genç Güneş",                "Yıldız oluşumu",    "4.60 milyar yıl önce",  "Yüksek",   10000,     4600,     6.2,   1.75,   ["heavy_elements"],                    { ms: "Sv10: x1.15"                                                                                   }),
  disc("protoplanetary_disk",   "before_earth",    "Protoplanet Diski",         "Gezegen oluşumu",   "4.56 milyar yıl önce",  "Yüksek",   15500,     7200,     9.4,   2.20,   ["young_sun","cai_first_solids"],       { ms: "Sv5: +%8"                                                                                      }),
  disc("jupiter_core",          "before_earth",    "Jüpiter Çekirdeği",         "Gezegen bilimi",    "4.55 milyar yıl önce",  "Orta-Y.",  25500,     12200,    15.5,  3.40,   ["protoplanetary_disk"],               { ms: "Sv10: +%10"                                                                                    }),
  disc("vesta_planetesimals",   "before_earth",    "Vesta ve Gezegenimsiler",   "Meteoritik kayıt",  "4.54 milyar yıl önce",  "Orta-Y.",  28500,     13500,    16.2,  3.20,   ["protoplanetary_disk"],               { ms: "Sv5: +%7"                                                                                      }),
  disc("mars_embryo",           "before_earth",    "Mars Embriyosu",            "Karasal gezegenler","4.52 milyar yıl önce",  "Orta-Y.",  34000,     15800,    18.5,  3.80,   ["jupiter_core","vesta_planetesimals"],{ ms: "Sv10: -%10"                                                                                    }),
  disc("proto_earth",           "before_earth",    "Proto-Dünya",               "Gezegen akresyonu", "4.51 milyar yıl önce",  "Orta",     52000,     25000,    31.0,  5.50,   ["mars_embryo"],                       { ms: "Sv5: +%10"                                                                                     }),
  disc("molten_earth",          "earth_prep",      "Erimiş Yüzey",              "Jeoloji",           "4.50 milyar yıl önce",  "Orta-Y.",  68000,     32000,    39.0,  6.80,   ["proto_earth"],                       { ms: "Sv5: +%8"                                                                                      }),
  disc("moon_formation",        "earth_prep",      "Ay Oluşumu",                "Gezegen bilimi",    "4.45 milyar yıl önce",  "Orta",     90000,     44000,    48.0,  8.00,   ["molten_earth"],                      { ms: "Sv10: +%12"                                                                                    }),
  disc("crust_cooling",         "earth_prep",      "Kabuk Soğuması",            "Jeokimya",          "4.20 milyar yıl önce",  "Orta",     120000,    62000,    60.0,  9.50,   ["moon_formation"],                    { ms: "Sv5: +%10"                                                                                     }),
  disc("primitive_ocean",       "earth_prep",      "İlkel Okyanus",             "Jeobiyoloji",       "4.00 milyar yıl önce",  "Orta",     160000,    82000,    75.0,  12.0,   ["crust_cooling"],                     { ms: "İlk Yaşam açılır"                                                                              }),
  disc("hydrothermal_vents",    "first_life",      "Hidrotermal Bacalar",       "Jeobiyoloji",       "3.90 milyar yıl önce",  "Orta",     200000,    100000,   95.0,  15.0,   ["primitive_ocean"],                   { ms: "Sv5: +%10"                                                                                     }),
  disc("rna_world",             "first_life",      "RNA Dünyası",               "Mol. biyoloji",     "3.80 milyar yıl önce",  "Orta",     310000,    155000,   125.0, 20.0,   ["hydrothermal_vents"],                { qt: true, q: "RNA hem bilgi taşıdı hem katalizör oldu.", ms: "Sv10: +%15"                          }),
  disc("protocell",             "first_life",      "Protohücre",                "Hücre biyolojisi",  "3.70 milyar yıl önce",  "Düşük-O.", 480000,    240000,   175.0, 28.0,   ["rna_world"],                         { qt: true, ms: "Sv5: +%8"                                                                            }),
  disc("first_metabolism",      "first_life",      "İlk Metabolizma",           "Biyokimya",         "3.60 milyar yıl önce",  "Düşük-O.", 750000,    380000,   250.0, 40.0,   ["protocell"],                         { qt: true, ms: "Sv10: +%20"                                                                          }),
  disc("luca",                  "first_life",      "LUCA",                      "Evrimsel biyoloji", "3.50 milyar yıl önce",  "Orta",     1200000,   600000,   380.0, 60.0,   ["first_metabolism"],                  { q: "Tüm yaşam, tek ve ortak bir atadan gelir.", ms: "Prestij açılır 🌳"                           }),
  disc("ilk_prokaryotlar",      "prokaryot",       "İlk Prokaryotlar",          "Mikrobiyoloji",     "3.50 milyar yıl önce",  "Yüksek",   1800000,   900000,   500,   80,     ["luca"],                              { ms: "Sv5: +%10"                                                                                     }),
  disc("arke_metabolizması",    "prokaryot",       "Arke Metabolizması",        "Biyokimya",         "3.40 milyar yıl önce",  "Orta-Y.",  2800000,   1400000,  680,   110,    ["ilk_prokaryotlar"],                  { ms: "Sv10: +%12"                                                                                    }),
  disc("stromatolit",           "prokaryot",       "Stromatolit",               "Paleobiyoloji",     "3.50 milyar yıl önce",  "Yüksek",   4500000,   2200000,  900,   145,    ["ilk_prokaryotlar"],                  { ms: "Sv5: +%8"                                                                                      }),
  disc("oksijensiz_fotosentez", "prokaryot",       "Oksijensiz Fotosentez",     "Fotosentez evrimi", "3.40 milyar yıl önce",  "Orta-Y.",  7000000,   3500000,  1200,  190,    ["stromatolit"],                       { ms: "Sv10: +%15"                                                                                    }),
  disc("buyuk_oksidasyon",      "prokaryot",       "Büyük Oksidasyon Olayı",    "Atmosfer bilimi",   "2.40 milyar yıl önce",  "Yüksek",   12000000,  6000000,  1650,  260,    ["oksijensiz_fotosentez"],             { q: "Oksijen zamanında zehirdi. Şimdi nefes alıyoruz.", ms: "Ökaryot açılır!", isExt: true         }),
  disc("mitokondri_endo",       "okaryot",         "Mitokondri Endosimbiyozu",  "Hücre evrimi",      "2.10 milyar yıl önce",  "Yüksek",   20000000,  10000000, 2200,  350,    ["buyuk_oksidasyon"],                  { ms: "Sv5: +%12"                                                                                     }),
  disc("kloroplast_endo",       "okaryot",         "Kloroplast Endosimbiyozu",  "Bitki evrimi",      "1.50 milyar yıl önce",  "Yüksek",   32000000,  16000000, 2900,  460,    ["ilk_okaryot"],                       { ms: "Sv10: +%15"                                                                                    }),
  disc("ilk_okaryot",           "okaryot",         "İlk Ökaryot Hücresi",       "Sitoloji",          "1.80 milyar yıl önce",  "Orta-Y.",  50000000,  25000000, 3900,  620,    ["mitokondri_endo"],                   { qt: true, ms: "Sv5: +%10"                                                                            }),
  disc("cinsiyet_rekombinasyon","okaryot",         "Cinsiyet ve Rekombinasyon", "Evrimsel biyoloji", "1.20 milyar yıl önce",  "Orta",     80000000,  40000000, 5200,  830,    ["ilk_okaryot"],                       { qt: true, ms: "Sv10: +%20"                                                                          }),
  disc("cok_hucreli_yasam",     "okaryot",         "Çok Hücreli Yaşam",         "Gelişim biyolojisi","800 milyon yıl önce",   "Yüksek",   130000000, 65000000, 7000,  1100,   ["cinsiyet_rekombinasyon"],            { ms: "Kambriya açılır!"                                                                              }),
  disc("kar_topu_dunya",        "kambriya",        "Kar Topu Dünya",            "Klimatoloji",       "700 milyon yıl önce",   "Yüksek",   175000000, 87000000, 7800,  1200,   ["cok_hucreli_yasam"],                 { ms: "Sv5: +%10", isExt: true                                                                        }),
  disc("ediyakara_biyotasi",    "kambriya",        "Ediyakara Biyotası",        "Paleontoloji",      "600 milyon yıl önce",   "Orta-Y.",  250000000, 125000000,9500,  1500,   ["kar_topu_dunya"],                    { ms: "Sv10: +%12"                                                                                    }),
  disc("iskelet_evrimi",        "kambriya",        "İskelet Evrimi",            "Paleontoloji",      "541 milyon yıl önce",   "Yüksek",   400000000, 200000000,13000, 2000,   ["ediyakara_biyotasi"],                { ms: "Sv5: +%8"                                                                                      }),
  disc("goz_evrimi",            "kambriya",        "Göz Evrimi",                "Nörobiyoloji",      "541 milyon yıl önce",   "Orta-Y.",  600000000, 300000000,17500, 2800,   ["iskelet_evrimi"],                    { ms: "Sv10: +%15"                                                                                    }),
  disc("kambriya_patlamasi",    "kambriya",        "Kambriya Patlaması",        "Makroevolüsyon",    "538 milyon yıl önce",   "Yüksek",   800000000, 400000000,25000, 4000,   ["goz_evrimi","iskelet_evrimi"],       { q: "Doğa, birkaç milyon yılda hayvanlar alemini çeşitlendirdi.", ms: "Omurgalılar açılır 🦑"            }),
  disc("ilk_baliklar",          "omurgalilar",     "İlk Balıklar",              "Vertebrat biyoloji","500 milyon yıl önce",   "Yüksek",   1.5e9,     7.5e8,    32000, 5000,   ["kambriya_patlamasi"],                { ms: "Sv5: +%8"                                                                                      }),
  disc("ordovisyen_yok_olusu",  "omurgalilar",     "Ordovisyen Yok Oluşu",     "Paleontoloji",      "443 milyon yıl önce",   "Yüksek",   2.5e9,     1.25e9,   42000, 6500,   ["ilk_baliklar"],                      { ms: "Sv10: +%15", isExt: true                                                                       }),
  disc("ceneli_baliklar",       "omurgalilar",     "Çeneli Balıklar",           "Vertebrat biyoloji","420 milyon yıl önce",   "Yüksek",   4e9,       2e9,      56000, 8500,   ["ordovisyen_yok_olusu"],              { ms: "Sv5: +%10"                                                                                     }),
  disc("devon_yok_olusu",       "omurgalilar",     "Devon Yok Oluşu",          "Paleontoloji",      "375 milyon yıl önce",   "Yüksek",   6.5e9,     3.25e9,   75000, 11500,  ["ilk_ormanlar"],                      { ms: "Sv10: +%15", isExt: true                                                                       }),
  disc("ilk_ormanlar",          "omurgalilar",     "İlk Ormanlar",              "Paleobotanik",      "385 milyon yıl önce",   "Yüksek",   1.4e10,    7e9,      120000,18500,  ["ceneli_baliklar"],                   { ms: "Sv10: +%12"                                                                                    }),
  disc("tetrapod_gecisi",       "omurgalilar",     "Tetrapod Geçişi",           "Evrimsel biyoloji", "375 milyon yıl önce",   "Yüksek",   1e10,      5e9,      100000,15000,  ["devon_yok_olusu"],                   { ms: "Sv5: +%10"                                                                                     }),
  disc("amniotik_yumurta",      "omurgalilar",     "Amniotik Yumurta",          "Vertebrat biyoloji","310 milyon yıl önce",   "Yüksek",   2e10,      1e10,     155000,24000,  ["ilk_ormanlar"],                      { ms: "Perm/Dinos açılır!"                                                                            }),
  disc("perm_yok_olusu",        "perm_dinos",      "Perm Yok Oluşu",           "Paleontoloji",      "252 milyon yıl önce",   "Yüksek",   3.2e10,    1.6e10,   205000,32000,  ["amniotik_yumurta"],                  { q: "Türlerin %96'sı silindi. Dünya neredeyse hiçten yeniden başladı.", ms: "Sv10: +%20", isExt: true }),
  disc("ilk_memeliler",         "perm_dinos",      "İlk Memeliler",             "Vertebrat biyoloji","225 milyon yıl önce",   "Yüksek",   5e10,      2.5e10,   270000,42000,  ["perm_yok_olusu"],                    { ms: "Sv5: +%10"                                                                                     }),
  disc("triyas_yok_olusu",      "perm_dinos",      "Triyas Yok Oluşu",         "Paleontoloji",      "201 milyon yıl önce",   "Yüksek",   8e10,      4e10,     360000,55000,  ["dinozor_yukelisi"],                  { ms: "Sv10: +%15", isExt: true                                                                       }),
  disc("dinozor_yukelisi",      "perm_dinos",      "Dinozorların Yükselişi",    "Paleontoloji",      "230 milyon yıl önce",   "Yüksek",   1.2e11,    6e10,     480000,72000,  ["perm_yok_olusu"],                    { ms: "Sv5: +%10"                                                                                     }),
  disc("kpg_yok_olusu",         "perm_dinos",      "K/Pg Yok Oluşu",           "Paleontoloji",      "66 milyon yıl önce",    "Yüksek",   1.8e11,    9e10,     640000,96000,  ["triyas_yok_olusu"],                   { q: "Bir asteroid, 160 milyon yıllık egemenliği sona erdirdi.", ms: "Memeliler açılır!", isExt: true }),
  disc("memelilerin_patlamasi", "memeliler",       "Memelilerin Patlaması",     "Evrimsel biyoloji", "65 milyon yıl önce",    "Yüksek",   2.8e11,    1.4e11,   850000,128000, ["kpg_yok_olusu"],                     { ms: "Sv5: +%10"                                                                                     }),
  disc("primat_evrimi",         "memeliler",       "Primat Evrimi",             "Primatolog",        "55 milyon yıl önce",    "Yüksek",   4.4e11,    2.2e11,   1130000,170000,["memelilerin_patlamasi"],             { ms: "Sv10: +%15"                                                                                    }),
  disc("buyuk_maymunlar",       "memeliler",       "Büyük Maymunlar",           "Antropoloji",       "15 milyon yıl önce",    "Yüksek",   7e11,      3.5e11,   1500000,225000,["primat_evrimi"],                     { ms: "Sv5: +%10"                                                                                     }),
  disc("homo_habilis",          "memeliler",       "Homo habilis",              "Paleoantropolog",   "2.5 milyon yıl önce",   "Orta-Y.",  1.1e12,    5.5e11,   2000000,300000,["buyuk_maymunlar"],                   { qt: true, ms: "Sv10: +%15"                                                                          }),
  disc("homo_erectus",          "memeliler",       "Homo erectus",              "Paleoantropolog",   "1.9 milyon yıl önce",   "Yüksek",   1.35e12,   6.75e11,  2300000,345000,["homo_habilis"],                     { ms: "Sv5: +%10"                                                                                     }),
  disc("homo_sapiens",          "memeliler",       "Homo sapiens",              "Paleoantropolog",   "300 bin yıl önce",      "Yüksek",   1.8e12,    9e11,     2700000,405000,["homo_erectus"],                      { q: "İnsanlık, evrenin kendini anlayan ilk sistemi olabilir.", ms: "Paleolitik açılır 🎨"          }),
  disc("atesi_kontrol",         "paleolitik",      "Ateşin Kontrollü Kullanımı", "Arkeoloji",         "400 bin yıl önce",      "Yüksek",   2.8e12,    1.4e12,   3600000,540000,["homo_erectus"],                      { q: "Ateş, hominin davranışını dönüştüren temel teknolojik eşiktir.", ms: "Sv5: +%10"                  }),
  disc("tas_aletler",           "paleolitik",      "Taş Alet Teknolojisi",      "Arkeoloji",         "100 bin yıl önce",      "Yüksek",   4.4e12,    2.2e12,   4800000,720000,["atesi_kontrol"],                     { ms: "Sv10: +%12"                                                                                    }),
  disc("sembolik_dusunce",      "paleolitik",      "Sembolik Düşünce ve Sanat", "Bilişsel arkeoloji","70 bin yıl önce",       "Orta-Y.",  7e12,      3.5e12,   6400000,960000,["tas_aletler"],                       { ms: "Sv5: +%10"                                                                                     }),
  disc("dil_iletisim",          "paleolitik",      "Dil ve İletişim",           "Dilbilim",          "50 bin yıl önce",       "Orta",     1.1e13,    5.5e12,   8500000,1280000,["sembolik_dusunce"],                 { qt: true, ms: "Sv10: +%18"                                                                          }),
  disc("goc_yayilma",           "paleolitik",      "Göç ve Coğrafi Yayılma",    "Arkeoloji",         "50 bin yıl önce",       "Yüksek",   1.7e13,    8.5e12,   1.13e7,1.7e6,  ["dil_iletisim"],                      { ms: "Neolitik açılır!"                                                                              }),
  disc("tarim_baslangici",      "neolitik",        "Tarımın Başlangıcı",        "Arkeoloji",         "MÖ 10.000",             "Yüksek",   2.7e13,    1.35e13,  1.5e7, 2.25e6, ["goc_yayilma"],                       { ms: "Sv5: +%10"                                                                                     }),
  disc("hayvan_evcilestirme",   "neolitik",        "Hayvan Evcilleştirme",      "Zooarkeoloji",      "MÖ 8.000",              "Yüksek",   4.3e13,    2.15e13,  2e7,   3e6,    ["tarim_baslangici"],                  { ms: "Sv10: +%15"                                                                                    }),
  disc("canak_comlek",          "neolitik",        "Çanak Çömlek",              "Arkeoloji",         "MÖ 7.000",              "Yüksek",   6.8e13,    3.4e13,   2.65e7,4e6,    ["hayvan_evcilestirme"],               { ms: "Sv5: +%8"                                                                                      }),
  disc("tekerlek",              "neolitik",        "Tekerleğin İcadı",          "Müh. tarihi",       "MÖ 3.500",              "Yüksek",   1.05e14,   5.25e13,  3.5e7, 5.25e6, ["canak_comlek"],                      { ms: "Sv10: +%15"                                                                                    }),
  disc("yazinin_icadi",         "neolitik",        "Yazının İcadı",             "Filoloji",          "MÖ 3.200",              "Yüksek",   1.65e14,   8.25e13,  4.65e7,7e6,    ["tekerlek"],                          { q: "Yazı, insanlığın ilk ve en uzun bellekidir.", ms: "Antik Bilim açılır 📜"                    }),
  disc("atom_teorisi",          "antik_bilim",     "Atom Teorisi",              "Antik felsefe",     "MÖ 400",                "Tarihsel", 2.6e14,    1.3e14,   6.2e7, 9.3e6,  ["yazinin_icadi"],                     { qt: true, ms: "Sv5: +%8"                                                                            }),
  disc("geometri_oklid",        "antik_bilim",     "Öklid Geometrisi",          "Matematik",         "MÖ 300",                "Yüksek",   4.1e14,    2.05e14,  8.2e7, 1.23e7, ["atom_teorisi"],                      { ms: "Sv10: +%15"                                                                                    }),
  disc("gunes_merkezli_ant",    "antik_bilim",     "Güneş Merkezli Model",      "Astronomi",         "MÖ 270",                "Tarihsel", 6.5e14,    3.25e14,  1.09e8,1.64e7, ["geometri_oklid"],                    { qt: true, ms: "Sv5: +%10"                                                                           }),
  disc("arsimed",               "antik_bilim",     "Arşimed Prensibi",          "Fizik/Matematik",   "MÖ 250",                "Yüksek",   1.03e15,   5.15e14,  1.45e8,2.18e7, ["gunes_merkezli_ant"],                { ms: "Sv10: +%12"                                                                                    }),
  disc("iskenderiye",           "antik_bilim",     "İskenderiye Okulu",         "Bilim tarihi",      "MÖ 240",                "Yüksek",   1.63e15,   8.15e14,  1.93e8,2.9e7,  ["arsimed"],                           { ms: "Altın Çağ açılır!"                                                                             }),
  disc("cebir_harezmi",         "altin_cag",       "Cebir (El-Harezmi)",        "Matematik",         "MS 820",                "Yüksek",   2.6e15,    1.3e15,   2.57e8,3.85e7, ["iskenderiye"],                       { ms: "Sv5: +%10"                                                                                     }),
  disc("optik_ibn_heysem",      "altin_cag",       "Optik (İbn el-Heysem)",     "Fizik/Optik",       "MS 1015",               "Yüksek",   4.1e15,    2.05e15,  3.43e8,5.15e7, ["cebir_harezmi"],                     { ms: "Sv10: +%15"                                                                                    }),
  disc("tip_ibn_sina",          "altin_cag",       "Tıp Kanunu (İbn Sina)",     "Tıp",               "MS 1025",               "Yüksek",   6.5e15,    3.25e15,  4.57e8,6.85e7, ["optik_ibn_heysem"],                  { ms: "Sv5: +%10"                                                                                     }),
  disc("bilgi_aktarimi",        "altin_cag",       "Kağıt ve Bilgi Aktarımı",   "Bilim tarihi",      "MS 900",                "Yüksek",   1.63e16,   8.15e15,  8.11e8,1.22e8, ["cebir_harezmi"],                     { ms: "Bilimsel Devrim açılır!"                                                                       }),
  disc("gozlemevi_ast",         "altin_cag",       "Gözlemevi Astronomisi",     "Astronomi",         "MS 1420",               "Yüksek",   1.03e16,   5.15e15,  6.09e8,9.13e7, ["tip_ibn_sina"],                      { ms: "Sv10: +%12"                                                                                    }),
  disc("kopernik_modeli",       "bilimsel_devrim", "Güneş Merkezli Sistem",     "Astronomi",         "MS 1543",               "Yüksek",   2.6e16,    1.3e16,   1.08e9,1.62e8, ["bilgi_aktarimi"],                    { ms: "Sv5: +%10"                                                                                     }),
  disc("galileo_gozlem",        "bilimsel_devrim", "Galileo'nun Gözlemleri",    "Astronomi/Fizik",   "MS 1610",               "Yüksek",   4.1e16,    2.05e16,  1.44e9,2.16e8, ["kopernik_modeli"],                   { q: "Yine de hareket ediyor. — Galileo", ms: "Sv10: +%15"                                          }),
  disc("kan_dolasimi",          "bilimsel_devrim", "Kan Dolaşımı (Harvey)",     "Fizyoloji",         "MS 1628",               "Yüksek",   6.5e16,    3.25e16,  1.92e9,2.88e8, ["galileo_gozlem"],                    { ms: "Sv5: +%10"                                                                                     }),
  disc("hucre_hooke",           "bilimsel_devrim", "Hücre (Hooke)",             "Biyoloji",          "MS 1665",               "Yüksek",   1.03e17,   5.15e16,  2.56e9,3.84e8, ["kan_dolasimi"],                      { ms: "Sv10: +%12"                                                                                    }),
  disc("newton_sentezi",        "bilimsel_devrim", "Newton Sentezi",            "Fizik/Matematik",   "MS 1687",               "Yüksek",   1.63e17,   8.15e16,  3.41e9,5.12e8, ["hucre_hooke"],                       { q: "Omuzlarında durduğum devler vardı. — Newton", ms: "Elektrik açılır 🍎"                       }),
  disc("elektrik_yuk",          "elektrik_kimya",  "Elektriksel Yük (Franklin)","Elektrik",          "MS 1752",               "Yüksek",   2.6e17,    1.3e17,   4.54e9,6.81e8, ["newton_sentezi"],                    { ms: "Sv5: +%10"                                                                                     }),
  disc("yanma_oksijen",         "elektrik_kimya",  "Yanma ve Oksijen",          "Kimya",             "MS 1777",               "Yüksek",   4.1e17,    2.05e17,  6.05e9,9.07e8, ["elektrik_yuk"],                      { ms: "Sv10: +%15"                                                                                    }),
  disc("voltaik_pil",           "elektrik_kimya",  "Voltaik Pil (Volta)",       "Elektrokimya",      "MS 1800",               "Yüksek",   6.5e17,    3.25e17,  8.06e9,1.21e9, ["yanma_oksijen"],                     { ms: "Sv5: +%10"                                                                                     }),
  disc("periyodik_temel",       "elektrik_kimya",  "Periyodik Tablo Temeli",    "Kimya",             "MS 1817",               "Yüksek",   1.03e18,   5.15e17,  1.07e10,1.61e9,["voltaik_pil"],                       { ms: "Sv10: +%12"                                                                                    }),
  disc("faraday",               "elektrik_kimya",  "Elektromanyetik İndüksiyon","Elektromagnetizma", "MS 1831",               "Yüksek",   1.63e18,   8.15e17,  1.43e10,2.15e9,["periyodik_temel"],                   { q: "Elektromanyetik indüksiyon, modern uygarlığın kalbini döktü.", ms: "Endüstriyel açılır ⚡" }),
  disc("termodinamik",          "endustriyel",     "Termodinamik (Carnot)",     "Fizik",             "MS 1824",               "Yüksek",   2.6e18,    1.3e18,   1.9e10,2.85e9, ["yanma_oksijen"],                     { ms: "Sv5: +%10"                                                                                     }),
  disc("evrim_darwin",          "endustriyel",     "Evrim Teorisi (Darwin)",    "Biyoloji",          "MS 1859",               "Yüksek",   4.1e18,    2.05e18,  2.53e10,3.8e9, ["termodinamik"],                      { q: "En güzel formlar bu görüşten doğar. — Darwin", ms: "Sv10: +%18 + Dal 🐢"                   }),
  disc("maxwell_denklemleri",   "endustriyel",     "Maxwell Denklemleri",       "Elektromagnetizma", "MS 1865",               "Yüksek",   6.5e18,    3.25e18,  3.37e10,5.06e9,["evrim_darwin"],                      { ms: "Sv5: +%12 + Dal 📡"                                                                            }),
  disc("elektrik_motoru",       "endustriyel",     "Pratik Elektrik Motoru",    "Elektrik müh.",     "MS 1873",               "Yüksek",   1.03e19,   5.15e18,  4.49e10,6.73e9,["maxwell_denklemleri"],               { ms: "Sv10: +%15"                                                                                    }),
  disc("elektrik_sebekesi",     "endustriyel",     "Elektrik Şebekesi",         "Uygulamalı müh.",   "MS 1882",               "Yüksek",   1.63e19,   8.15e18,  5.98e10,8.97e9,["elektrik_motoru"],                   { q: "Elektrik, şehir gecesini mühendisliğin ışığıyla değiştirdi. — Pearl Street, 4 Eylül 1882", ms: "Büyük Prestij + Fermi açılır!"          }),
];

// ─── Branch System ────────────────────────────────────────────────────────────
const BRANCHES = [
  {
    id: "yasam_agaci", name: "Yaşam Ağacı", icon: "🌳", gateId: "luca",
    color: "from-emerald-950 to-teal-950", accent: "#34d399",
    desc: "LUCA'dan yayılan temel biyokimyasal süreçler.",
    children: [
      { id: "biyokimya_path",   name: "Biyokimyasal Yolaklar", ct: "~3.5 milyar yıl", by: "Evrim",    uc: 2e6,   lcb: 1e6,    gps: 600,    gg: 90,    sum: "Glikoliz ve TCA döngüsü gibi temel enerji yolakları evrimlenir." },
      { id: "dna_replikasyon",  name: "DNA Replikasyonu",       ct: "~3.4 milyar yıl", by: "Evrim",    uc: 5e6,   lcb: 2.5e6,  gps: 1200,   gg: 180,   sum: "Hücrenin genetik bilgiyi kopyalama makinesi optimize olur." },
      { id: "protein_sentez",   name: "Protein Sentezi",        ct: "~3.3 milyar yıl", by: "Evrim",    uc: 9e6,   lcb: 4.5e6,  gps: 2000,   gg: 300,   sum: "Ribozom-bazlı protein üretimi yaşamın temel fabrikasıdır." },
    ]
  },
  {
    id: "hayvan_agaci", name: "Hayvan Ağacı", icon: "🦑", gateId: "kambriya_patlamasi",
    color: "from-teal-950 to-cyan-950", accent: "#22d3ee",
    desc: "Kambriya patlamasının açtığı hayvan çeşitliliği.",
    children: [
      { id: "predator_av",     name: "Predatör-Av Dinamiği",  ct: "~538 milyon yıl", by: "Evrim",    uc: 2e8,   lcb: 1e8,    gps: 18000,  gg: 2700,  sum: "İlk karmaşık ekosistemler evrimsel baskıyı artırır." },
      { id: "biyocesitlilik",  name: "Biyolojik Çeşitlilik",  ct: "~530 milyon yıl", by: "Evrim",    uc: 5e8,   lcb: 2.5e8,  gps: 30000,  gg: 4500,  sum: "Hayvan filumlarının patlaması yaşam çeşitliliğini zirveye taşır." },
      { id: "sindirim_sis",    name: "Karmaşık Sindirim",     ct: "~520 milyon yıl", by: "Evrim",    uc: 9e8,   lcb: 4.5e8,  gps: 50000,  gg: 7500,  sum: "Karmaşık sindirim sistemi büyük organizmalara enerji sağlar." },
    ]
  },
  {
    id: "yazili_bilgi", name: "Yazılı Bilgi", icon: "📜", gateId: "yazinin_icadi",
    color: "from-amber-950 to-yellow-950", accent: "#fbbf24",
    desc: "Yazının açtığı bilgi birikimi ve aktarımı.",
    children: [
      { id: "mat_sistemi",     name: "Matematik Sistemi",    ct: "MÖ 3.000",   by: "Sümer",    uc: 3e13,  lcb: 1.5e13, gps: 7e6,    gg: 1.05e6,sum: "Sayısal sistemler ticaret, inşaat ve astronomiye zemin hazırlar." },
      { id: "ast_kayitlar",    name: "Astronomi Kayıtları",  ct: "MÖ 2.800",   by: "Babil",    uc: 5e13,  lcb: 2.5e13, gps: 1.1e7,  gg: 1.65e6,sum: "Gökyüzü olayları düzenli kaydedilir; takvimler oluşur." },
      { id: "tip_yazitlari",   name: "Tıp Yazıtları",        ct: "MÖ 1.550",   by: "Mısır",    uc: 8e13,  lcb: 4e13,   gps: 1.6e7,  gg: 2.4e6, sum: "Ebers Papirüsü 700'den fazla tıbbi tarifi barındırır." },
    ]
  },
  {
    id: "insanlik_agaci", name: "İnsanlık Çiçeklenmesi", icon: "🎨", gateId: "homo_sapiens",
    color: "from-orange-950 to-amber-950", accent: "#fb923c",
    desc: "Homo sapiens'in kültürel patlamasından doğan ilkler.",
    children: [
      { id: "kaya_sanati",     name: "Kaya Sanatı",           ct: "45.000 BCE", by: "H.sapiens",uc: 2.5e12,lcb: 1.25e12,gps: 1.5e6,  gg: 225000,sum: "Mağara duvarlarına yansıyan ilk simgesel düşünce." },
      { id: "muzik_aleti",     name: "Müzik Aletleri",        ct: "40.000 BCE", by: "H.sapiens",uc: 4e12,  lcb: 2e12,   gps: 2.5e6,  gg: 375000,sum: "Kemik flütler insanın ritmik ve melodik düşüncesini belgeler." },
      { id: "rituel_gomme",    name: "Ritüel ve Gömme",       ct: "100.000 BCE",by: "H.sapiens",uc: 6e12,  lcb: 3e12,   gps: 4e6,    gg: 600000,sum: "Ölü gömme pratikleri, soyut düşünce ve toplumsal hafızanın erken izlerini gösterir." },
    ]
  },
  {
    id: "newton_mirasi", name: "Newton'un Mirası", icon: "🍎", gateId: "newton_sentezi",
    color: "from-indigo-950 to-violet-950", accent: "#a78bfa",
    desc: "Principia Mathematica'nın açtığı bilimsel çığırlar.",
    children: [
      { id: "diferansiyel",    name: "Diferansiyel Hesap",    ct: "MS 1684",    by: "Leibniz",  uc: 5e16,  lcb: 2.5e16, gps: 5e8,    gg: 7.5e7, sum: "Değişimin matematiği mühendisliği mümkün kılar." },
      { id: "gok_mekanigi",    name: "Gök Mekaniği",          ct: "MS 1799",    by: "Laplace",  uc: 8e16,  lcb: 4e16,   gps: 8e8,    gg: 1.2e8, sum: "Laplace evrensel çekim yasasını tüm gezegenlere uygular." },
      { id: "newton_optik",    name: "Newton Optiği",         ct: "MS 1704",    by: "Newton",   uc: 1.2e17,lcb: 6e16,   gps: 1.1e9,  gg: 1.65e8,sum: "Prizmayla beyaz ışık renklerine ayrıştırılır." },
      { id: "isi_teorisi",     name: "Isı Teorisi",           ct: "MS 1822",    by: "Fourier",  uc: 2e17,  lcb: 1e17,   gps: 1.8e9,  gg: 2.7e8, sum: "Isı transferi matematiksel olarak modellenir." },
    ]
  },
  {
    id: "darwin_mirasi", name: "Darwin'in Mirası", icon: "🐢", gateId: "evrim_darwin",
    color: "from-green-950 to-lime-950", accent: "#a3e635",
    desc: "Evrim teorisinden filizlenen bilim dalları.",
    children: [
      { id: "mendel",          name: "Kalıtım Yasaları",      ct: "MS 1866",    by: "Mendel",   uc: 8e17,  lcb: 4e17,   gps: 3e9,    gg: 4.5e8, sum: "Bezelye deneyleri kalıtım yasalarını ortaya koyar; genetik doğar." },
      { id: "mikrop_teorisi",  name: "Mikrop Teorisi",        ct: "MS 1857",    by: "Pasteur",  uc: 1.3e18,lcb: 6.5e17, gps: 5e9,    gg: 7.5e8, sum: "Hastalıkların mikroorganizmalardan kaynaklandığı kanıtlanır." },
      { id: "hucre_bolunme",   name: "Hücre Bölünmesi",      ct: "MS 1855",    by: "Virchow",  uc: 2e18,  lcb: 1e18,   gps: 7.5e9,  gg: 1.1e9, sum: "Her hücre başka bir hücreden doğar." },
      { id: "dogal_rec",       name: "Wallace-Darwin Sentezi",ct: "MS 1870",    by: "Wallace",  uc: 3.5e18,lcb: 1.75e18,gps: 1.1e10, gg: 1.65e9,sum: "Wallace bağımsız olarak doğal seçilimi keşfeder." },
    ]
  },
  {
    id: "maxwell_mirasi", name: "Elektromanyetik Keşifler", icon: "📡", gateId: "maxwell_denklemleri",
    color: "from-blue-950 to-cyan-950", accent: "#60a5fa",
    desc: "Maxwell denklemlerinin açtığı fizik sınırları.",
    children: [
      { id: "hertz_dalgalari", name: "Hertz Dalgaları",       ct: "MS 1887",    by: "Hertz",    uc: 1.5e18,lcb: 7.5e17, gps: 5.5e9,  gg: 8.25e8,sum: "Elektromanyetik dalgalar laboratuvarda üretilip algılanır." },
      { id: "elektron",        name: "Elektronun Keşfi",      ct: "MS 1897",    by: "Thomson",  uc: 2.5e18,lcb: 1.25e18,gps: 9e9,    gg: 1.35e9,sum: "Atom altı parçacıkların keşfi modern fiziği başlatır." },
      { id: "foto_elektrik",   name: "Fotoelektrik Etki",     ct: "MS 1887",    by: "Hertz",    uc: 4e18,  lcb: 2e18,   gps: 1.4e10, gg: 2.1e9, sum: "Işığın metal yüzeyden elektron koparması kuantum fiziğine kapı açar." },
    ]
  },
  {
    id: "elektrik_cagi", name: "Elektrik Çağı", icon: "⚡", gateId: "faraday",
    color: "from-cyan-950 to-blue-950", accent: "#38bdf8",
    desc: "Faraday'ın elektromanyetik indüksiyonuyla başlayan pratik elektrik devrimi.",
    children: [
      { id: "telegraf",        name: "Telegraf",               ct: "MS 1837",    by: "Morse",    uc: 5e17,  lcb: 2.5e17, gps: 2e9,    gg: 3e8,   sum: "Uzun mesafe elektrikli haberleşme çağını açar." },
      { id: "ampul",           name: "Ampul",                  ct: "MS 1879",    by: "Edison",   uc: 8e17,  lcb: 4e17,   gps: 3.5e9,  gg: 5e8,   sum: "Elektrik ışığı endüstriyel üretimi ve günlük yaşamı devrimleştirir." },
      { id: "telefon",         name: "Telefon",                ct: "MS 1876",    by: "Bell",     uc: 1.2e18,lcb: 6e17,   gps: 5e9,    gg: 7.5e8, sum: "Sesli iletişim elektrikle küreselleşir." },
      { id: "ac_motor",        name: "AC Motor",               ct: "MS 1888",    by: "Tesla",    uc: 2e18,  lcb: 1e18,   gps: 8e9,    gg: 1.2e9, sum: "Alternatif akım endüstriyel gücü kökten dönüştürür." },
      { id: "xray",            name: "X-Işını",                ct: "MS 1895",    by: "Röntgen",  uc: 3e18,  lcb: 1.5e18, gps: 1.2e10, gg: 1.8e9, sum: "Görünmez ışınımla iç yapılar keşfedilir." },
      { id: "radyoaktivite",   name: "Radyoaktivite",          ct: "MS 1898",    by: "Curie",    uc: 5e18,  lcb: 2.5e18, gps: 1.8e10, gg: 2.7e9, sum: "Atom çekirdeğinin enerjisi gün yüzüne çıkar." },
    ]
  },
];

// ─── Other Game Data ──────────────────────────────────────────────────────────
const SYNERGIES = [
  { id: "cosmic_origin",   name: "Kozmik Köken",            icon: "🌌", bonus: 0.20, ids: ["spacetime_expansion","heavy_elements","proto_earth"] },
  { id: "life_secret",     name: "Yaşamın Sırrı",           icon: "🧬", bonus: 0.25, ids: ["rna_world","first_metabolism","luca"] },
  { id: "extinction_surv", name: "Yok Oluş Hayatta Kalanı", icon: "☄️", bonus: 0.50, ids: ["buyuk_oksidasyon","ordovisyen_yok_olusu","perm_yok_olusu","kpg_yok_olusu"] },
  { id: "em_unity",        name: "Elektromanyetik Birlik",   icon: "⚡", bonus: 0.35, ids: ["elektrik_yuk","voltaik_pil","faraday","maxwell_denklemleri"] },
  { id: "science_peak",    name: "Bilimsel Devrim Zirvesi",  icon: "🔭", bonus: 0.30, ids: ["galileo_gozlem","newton_sentezi","evrim_darwin"] },
  { id: "life_tree",       name: "Yaşam Ağacı",              icon: "🌳", bonus: 0.40, ids: ["luca","ilk_prokaryotlar","mitokondri_endo","ilk_okaryot","cok_hucreli_yasam","kambriya_patlamasi"] },
];

const EVENTS = [
  { id: "solar_flare",    name: "Güneş Fırtınası",      icon: "⚡", color: "yellow", dur: 20000, desc: "Tıklama x3!",             type: "click_mult", val: 3 },
  { id: "cosmic_ray",     name: "Kozmik Işın",           icon: "🌟", color: "cyan",   dur: 15000, desc: "Üretim x2.5!",            type: "prod_mult",  val: 2.5 },
  { id: "dark_energy",    name: "Karanlık Enerji",       icon: "🌑", color: "violet", dur: 20000, desc: "Açılış maliyetleri -%50!", type: "discount",   val: 0.5 },
  { id: "asteroid_minor", name: "Asteroid Yaklaşıyor",  icon: "☄️", color: "red",    dur: 12000, desc: "Üretim -%70!",            type: "prod_mult",  val: 0.3 },
  { id: "time_wave",      name: "Zaman Dalgası",         icon: "⏰", color: "purple", dur: 0,     desc: "60 saniyelik üretim!",    type: "instant",    val: 60  },
  { id: "free_upgrade",   name: "Süpernova Yakını",      icon: "💥", color: "orange", dur: 0,     desc: "Rastgele +2 seviye!",     type: "free_level", val: 2   },
];

const PATHS = [
  { id: "multiply", name: "Hızlı Çoğalma",    icon: "⚡", desc: "Tıklama x2, Pasif x1.1", clickM: 2,   passM: 1.1 },
  { id: "select",   name: "Doğal Seleksiyon", icon: "🧬", desc: "Pasif x2, Tıklama x1.1", clickM: 1.1, passM: 2   },
  { id: "mutate",   name: "Mutasyon",          icon: "🎲", desc: "Rastgele x1.5-x3",       clickM: null, passM: null },
];

const SCIENTISTS = [
  { id: "archimedes", name: "Arşimed",       icon: "⚙️", link: "arsimed",        type: "passive", val: 0.10, desc: "Kaldıraç prensibi pasif üretime +%10" },
  { id: "harezmi",    name: "El-Harezmi",    icon: "📐", link: "cebir_harezmi",  type: "passive", val: 0.10, desc: "Cebir matematik keşiflerine +%10" },
  { id: "avicenna",   name: "İbn Sina",      icon: "📖", link: "tip_ibn_sina",   type: "passive", val: 0.12, desc: "Tıp kanunu pasif üretime +%12" },
  { id: "galileo_s",  name: "Galileo",       icon: "🔭", link: "galileo_gozlem", type: "passive", val: 0.15, desc: "Gözlemsel astronomi pasif üretime +%15" },
  { id: "harvey",     name: "W. Harvey",     icon: "🫀", link: "kan_dolasimi",   type: "passive", val: 0.10, desc: "Kan dolaşımı biyoloji keşiflerine +%10" },
  { id: "newton_s",   name: "I. Newton",     icon: "🍎", link: "newton_sentezi", type: "passive", val: 0.18, desc: "Hareket yasaları tüm pasif üretime +%18" },
  { id: "faraday_s",  name: "M. Faraday",    icon: "⚡", link: "faraday",        type: "click",   val: 0.25, desc: "Elektromanyetizm tıklama gücüne +%25" },
  { id: "darwin_s",   name: "C. Darwin",     icon: "🐢", link: "evrim_darwin",   type: "passive", val: 0.20, desc: "Evrim teorisi biyoloji keşiflerine +%20" },
];

const QUESTS = [
  { id: "q_tap50",    name: "Meraklı Gözlemci",  icon: "👆", desc: "50 kez dokun",        obj: { type: "clicks",    tgt: 50    }, reward: { val: 5  } },
  { id: "q_tap300",   name: "Tıklama Maratonu",  icon: "👆", desc: "300 kez dokun",       obj: { type: "clicks",    tgt: 300   }, reward: { val: 15 } },
  { id: "q_unlock5",  name: "Keşifçi",           icon: "🔬", desc: "5 yeni keşif aç",     obj: { type: "unlocks",   tgt: 5     }, reward: { val: 8  } },
  { id: "q_unlock20", name: "Araştırmacı",        icon: "🔬", desc: "20 yeni keşif aç",    obj: { type: "unlocks",   tgt: 20    }, reward: { val: 20 } },
  { id: "q_combo4",   name: "Combo Ustası",       icon: "🔥", desc: "x4 comboya ulaş",     obj: { type: "max_combo", tgt: 4     }, reward: { val: 10 } },
  { id: "q_level10",  name: "Yükseltici",         icon: "⬆️", desc: "10 seviye yükselt",   obj: { type: "levelups",  tgt: 10    }, reward: { val: 8  } },
  { id: "q_ext1",     name: "Hayatta Kalan",      icon: "☄️", desc: "1 yok oluş yaşa",     obj: { type: "extincts",  tgt: 1     }, reward: { val: 12 } },
  { id: "q_syn1",     name: "Sinerjist",          icon: "🌟", desc: "1 sinerji tamamla",    obj: { type: "synergies", tgt: 1     }, reward: { val: 20 } },
  { id: "q_prestige1",name: "Yeniden Doğuş",      icon: "🏆", desc: "İlk prestij",          obj: { type: "prestiges", tgt: 1     }, reward: { val: 30 } },
  { id: "q_branch3",  name: "Dal Açıcı",          icon: "🌿", desc: "3 dal çocuğu aç",     obj: { type: "branches",  tgt: 3     }, reward: { val: 20 } },
  { id: "q_gps1m",    name: "Devasa Üretim",      icon: "🚀", desc: "1M GP/sn üret",       obj: { type: "gps",       tgt: 1e6   }, reward: { val: 40 } },
];

const DM_UP = [
  { id: "click_b", name: "Kuantum Tıklama",  icon: "⚡", cost: 5,  max: 8, desc: "+%25 tıklama/alım" },
  { id: "pass_b",  name: "Entropi Azaltımı", icon: "🌀", cost: 5,  max: 8, desc: "+%10 pasif/alım"  },
  { id: "combo_b", name: "Rezonans",         icon: "🔥", cost: 10, max: 3, desc: "Combo maks +10"   },
  { id: "auto_b",  name: "Hızlı Evrim",      icon: "⚙️", cost: 8,  max: 4, desc: "Oto-yükseltme 2x" },
];

const FERMI = [
  { id: "great_filter_past", name: "Büyük Filtre — Gerideyiz",  icon: "🔭", cost: 30,  req: ["elektrik_sebekesi"],  gpsB: 0.10 },
  { id: "rare_earth",        name: "Nadir Dünya Hipotezi",       icon: "🌍", cost: 50,  req: ["great_filter_past"],  gpsB: 0.12 },
  { id: "dark_forest",       name: "Karanlık Orman Teorisi",     icon: "🌑", cost: 80,  req: ["rare_earth"],          gpsB: 0.15 },
  { id: "zoo_hypothesis",    name: "Zoo Hipotezi",               icon: "👁️", cost: 120, req: ["dark_forest"],         gpsB: 0.18 },
  { id: "simulation",        name: "Simülasyon Hipotezi",        icon: "💻", cost: 200, req: ["zoo_hypothesis"],      gpsB: 0.25 },
];

const STARS = Array.from({ length: 120 }, (_, idx) => ({
  id: idx, x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 8,
  dur: 1.5 + Math.random() * 4,
  opacity: 0.3 + Math.random() * 0.7,
}));

const NEBULAE = [
  { id: 0, color: "rgba(139,92,246,0.18)",  size: "70%", top: "-20%", left: "-10%", dur: "22s", delay: "0s"  },
  { id: 1, color: "rgba(59,130,246,0.14)",   size: "60%", top: "20%",  right: "-15%",dur: "28s", delay: "4s"  },
  { id: 2, color: "rgba(16,185,129,0.10)",   size: "50%", top: "60%",  left: "10%",  dur: "35s", delay: "8s"  },
  { id: 3, color: "rgba(245,158,11,0.08)",   size: "40%", top: "10%",  left: "40%",  dur: "40s", delay: "12s" },
];

const AMBIENT_FREQS = [55,62,69,78,88,98,110,123,138,155,174,196,220,247,277,311,349,392];

// ─── Safe Browser Storage Adapter ───────────────────────────────────────────
const SAVE_SCHEMA_VERSION = 2;
const SAVE_KEY = "evrim_v8";
const LEGACY_SAVE_KEYS = ["evrim_v7"];
const DOUBLE_TAP_WINDOW_MS = 300;

// ─── Safe Browser Storage Adapter ───────────────────────────────────────────
const storageAPI = {
  async get(key) {
    if (typeof window === "undefined") return null;
    if (window.storage && typeof window.storage.get === "function") return window.storage.get(key);
    try {
      const value = window.localStorage ? window.localStorage.getItem(key) : null;
      return value ? { value } : null;
    } catch (_) {
      return null;
    }
  },
  async set(key, value) {
    if (typeof window === "undefined") return;
    if (window.storage && typeof window.storage.set === "function") return window.storage.set(key, value);
    try {
      if (window.localStorage) window.localStorage.setItem(key, value);
    } catch (_) {}
  }
};

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

function checksumText(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function createSaveEnvelope(payload) {
  const normalized = stableStringify(payload);
  return JSON.stringify({
    schemaVersion: SAVE_SCHEMA_VERSION,
    savedAt: Date.now(),
    checksum: checksumText(normalized),
    payload,
  });
}

function readSaveEnvelope(raw) {
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object") return null;
  if (parsed.payload && parsed.schemaVersion) {
    const normalized = stableStringify(parsed.payload);
    if (parsed.checksum !== checksumText(normalized)) {
      throw new Error("Save integrity check failed");
    }
    return parsed.payload;
  }
  return parsed;
}

function safeNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function normalizeSavePayload(s) {
  if (!s || typeof s !== "object") return null;
  return {
    gp: safeNumber(s.gp, 0),
    unlocked: s.unlocked && typeof s.unlocked === "object" ? s.unlocked : {},
    levels: s.levels && typeof s.levels === "object" ? s.levels : {},
    stageIdx: Number.isInteger(s.stageIdx) ? s.stageIdx : 0,
    paths: Array.isArray(s.paths) ? s.paths : [],
    cosmicTime: typeof s.cosmicTime === "string" ? s.cosmicTime : "13.80 milyar yıl önce",
    selectedId: typeof s.selectedId === "string" ? s.selectedId : "spacetime_expansion",
    stats: s.stats && typeof s.stats === "object" ? s.stats : null,
    autoUpgrade: Boolean(s.autoUpgrade),
    dm: safeNumber(s.dm, 0),
    dmUpgrades: s.dmUpgrades && typeof s.dmUpgrades === "object" ? s.dmUpgrades : {},
    fermiUnlocked: s.fermiUnlocked && typeof s.fermiUnlocked === "object" ? s.fermiUnlocked : {},
    quests: Array.isArray(s.quests) ? s.quests : [],
    doneQuestIds: Array.isArray(s.doneQuestIds) ? s.doneQuestIds : [],
    capsules: s.capsules && typeof s.capsules === "object" ? s.capsules : {},
    branchUnlocked: s.branchUnlocked && typeof s.branchUnlocked === "object" ? s.branchUnlocked : {},
    branchLevels: s.branchLevels && typeof s.branchLevels === "object" ? s.branchLevels : {},
  };
}

function parseChronologyToYearsBeforePresent(ct) {
  if (!ct || typeof ct !== "string") return null;
  const text = ct.toLowerCase().replace(/,/g, ".");
  const raw = (text.match(/[0-9]+(?:\.[0-9]+)?/) || [""])[0];
  if (!raw) return null;
  const hasThousandsDot = /^\d{1,3}(?:\.\d{3})+$/.test(raw) && !/(milyar|milyon)/.test(text);
  const num = Number.parseFloat(hasThousandsDot ? raw.replace(/\./g, "") : raw);
  if (!Number.isFinite(num)) return null;
  if (text.includes("milyar")) return num * 1_000_000_000;
  if (text.includes("milyon")) return num * 1_000_000;
  if (text.includes("bin")) return num * 1_000;
  if (text.includes("bce") || text.includes("mö")) return num + 2026;
  if (text.includes("ms")) return Math.max(0, 2026 - num);
  return num;
}

const SANITIZED_TERMS = [
  { pattern: /\b(?:dini|dinî|inanç|mucize|yarattı|yaratıldı)\b/i, replacement: "bilimsel/seküler terminoloji" },
];

function validateDiscoveryGraph(discoveries, stages, branches) {
  const errors = [];
  const warnings = [];
  const byId = new Map(discoveries.map(d => [d.id, d]));
  const visiting = new Set();
  const visited = new Set();

  discoveries.forEach(d => {
    if (!d.id || typeof d.id !== "string") errors.push("Discovery id eksik veya geçersiz.");
    if (!stages.some(s => s.id === d.stage)) errors.push(`${d.id}: stage bulunamadı (${d.stage}).`);
    (d.req || []).forEach(reqId => {
      const req = byId.get(reqId);
      if (!req) errors.push(`${d.id}: bilinmeyen ön koşul (${reqId}).`);
      if (reqId === d.id) errors.push(`${d.id}: kendi kendine ön koşul olamaz.`);
      const reqTime = req ? parseChronologyToYearsBeforePresent(req.ct) : null;
      const curTime = parseChronologyToYearsBeforePresent(d.ct);
      if (reqTime !== null && curTime !== null && reqTime < curTime) {
        warnings.push(`${d.id}: kronoloji kontrolü — ${reqId} daha yeni görünüyor.`);
      }
    });

    const corpus = [d.name, d.domain, d.q, d.ms].filter(Boolean).join(" ");
    SANITIZED_TERMS.forEach(rule => {
      if (rule.pattern.test(corpus)) warnings.push(`${d.id}: terminoloji kontrolü — ${rule.replacement} önerilir.`);
    });
  });

  branches.forEach(b => {
    (b.children || []).forEach(child => {
      const corpus = [child.name, child.sum].filter(Boolean).join(" ");
      SANITIZED_TERMS.forEach(rule => {
        if (rule.pattern.test(corpus)) warnings.push(`${child.id}: terminoloji kontrolü — ${rule.replacement} önerilir.`);
      });
    });
  });

  function dfs(id, path = []) {
    if (visiting.has(id)) {
      errors.push(`Döngü algılandı: ${[...path, id].join(" -> ")}`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    const node = byId.get(id);
    (node?.req || []).forEach(reqId => { if (byId.has(reqId)) dfs(reqId, [...path, id]); });
    visiting.delete(id);
    visited.add(id);
  }
  discoveries.forEach(d => dfs(d.id));

  stages.forEach(stage => {
    if (stage.gate && !byId.has(stage.gate)) errors.push(`${stage.id}: gate discovery bulunamadı (${stage.gate}).`);
  });

  return { errors, warnings };
}

const DATA_VALIDATION_REPORT = validateDiscoveryGraph(DISCOVERIES, STAGES, BRANCHES);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtGP(num) {
  if (num < 1000)  return num.toFixed(num < 100 ? 1 : 0);
  if (num < 1e6)   return (num / 1e3).toFixed(1) + "K";
  if (num < 1e9)   return (num / 1e6).toFixed(2) + "M";
  if (num < 1e12)  return (num / 1e9).toFixed(2) + "B";
  if (num < 1e15)  return (num / 1e12).toFixed(2) + "T";
  if (num < 1e18)  return (num / 1e15).toFixed(2) + "P";
  if (num < 1e21)  return (num / 1e18).toFixed(2) + "E";
  return (num / 1e21).toFixed(2) + "Z";
}

function fmtTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0 ? `${h}s ${m}d` : `${m}d ${s}sn`;
}

function DiscIcon({ type, className }) {
  const cls = className || "w-4 h-4";
  if (type === "atom")  return <Atom className={cls} />;
  if (type === "orbit") return <Orbit className={cls} />;
  if (type === "zap")   return <Zap className={cls} />;
  return <Sparkles className={cls} />;
}

// ─── Sound Hook ───────────────────────────────────────────────────────────────
function useSound() {
  const audioCtxRef  = useRef(null);
  const enabledRef   = useRef(true);
  const ambOscRef    = useRef(null);
  const ambGainRef   = useRef(null);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => { enabledRef.current = soundOn; }, [soundOn]);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }, []);

  const playNote = useCallback((ctx, freq, startOffset, duration, vol, wave) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = wave || "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol || 0.1, ctx.currentTime + startOffset);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
    osc.start(ctx.currentTime + startOffset);
    osc.stop(ctx.currentTime + startOffset + duration + 0.01);
  }, []);

  const play = useCallback((type) => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      const n = (f, s, d, v, w) => playNote(ctx, f, s, d, v, w);
      if (type === "click")     n(280 + Math.random() * 90, 0, 0.07, 0.07);
      if (type === "unlock")    [523,659,784,1047].forEach((f, i) => n(f, i * 0.08, 0.18, 0.12, "triangle"));
      if (type === "burst")     { n(180, 0, 0.06, 0.1, "sawtooth"); n(360, 0.06, 0.06, 0.12, "sawtooth"); n(720, 0.12, 0.18, 0.1); }
      if (type === "levelup")   { n(440, 0, 0.08, 0.1); n(554, 0.09, 0.12, 0.1); }
      if (type === "milestone") [330,440,550,660,880].forEach((f, i) => n(f, i * 0.07, 0.2, 0.12, "triangle"));
      if (type === "stage")     [261,329,392,523,659].forEach((f, i) => n(f, i * 0.1, 0.3, 0.13));
      if (type === "prestige")  [261,329,392,523,659,784,1047].forEach((f, i) => n(f, i * 0.08, 0.4, 0.13, "triangle"));
      if (type === "extinction"){ n(55, 0, 0.5, 0.2, "sawtooth"); n(80, 0.1, 0.4, 0.15, "square"); n(40, 0, 0.8, 0.2); }
      if (type === "event")     { n(440, 0, 0.1, 0.12); n(660, 0.1, 0.15, 0.1); }
      if (type === "synergy")   [330,415,523,659,830].forEach((f, i) => n(f, i * 0.06, 0.25, 0.13, "triangle"));
      if (type === "quantum")   { n(200, 0, 0.15, 0.15, "sawtooth"); n(150, 0.1, 0.2, 0.12, "square"); }
      if (type === "branch")    [262,330,392].forEach((f, i) => n(f, i * 0.06, 0.18, 0.1, "triangle"));
      if (type === "cinema")    [196,247,294,392,494].forEach((f, i) => n(f, i * 0.15, 0.4, 0.08, "triangle"));
    } catch (_) {}
  }, [getCtx, playNote]);

  const startAmbient = useCallback((stageIndex) => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      if (!ambOscRef.current) {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        const filt = ctx.createBiquadFilter();
        osc.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
        filt.type = "lowpass"; filt.frequency.value = 350;
        osc.type = "sine"; osc.frequency.value = AMBIENT_FREQS[0];
        gain.gain.value = 0; osc.start();
        ambOscRef.current  = osc;
        ambGainRef.current = gain;
      }
      const freq = AMBIENT_FREQS[Math.min(stageIndex || 0, AMBIENT_FREQS.length - 1)];
      ambOscRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 3);
      ambGainRef.current.gain.setTargetAtTime(0.018, ctx.currentTime, 2);
    } catch (_) {}
  }, [getCtx]);

  const updateAmbient = useCallback((stageIndex) => {
    if (!audioCtxRef.current || !ambOscRef.current) return;
    const ctx  = audioCtxRef.current;
    const freq = AMBIENT_FREQS[Math.min(stageIndex || 0, AMBIENT_FREQS.length - 1)];
    ambOscRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 3);
    if (!enabledRef.current && ambGainRef.current) {
      ambGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
    }
  }, []);

  const stopAmbient = useCallback(() => {
    if (audioCtxRef.current && ambGainRef.current) {
      ambGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
    }
  }, []);

  return { soundOn, setSoundOn, play, startAmbient, updateAmbient, stopAmbient };
}

// ─── Toast Colors ─────────────────────────────────────────────────────────────
const TC = {
  white:   "bg-white/12 border-white/20 text-white",
  cyan:    "bg-cyan-400/15 border-cyan-400/30 text-cyan-100",
  emerald: "bg-emerald-400/15 border-emerald-400/30 text-emerald-100",
  gold:    "bg-yellow-400/15 border-yellow-400/30 text-yellow-100",
  yellow:  "bg-yellow-300/15 border-yellow-300/30 text-yellow-100",
  red:     "bg-red-500/20 border-red-400/40 text-red-200",
  violet:  "bg-violet-400/15 border-violet-400/30 text-violet-100",
  orange:  "bg-orange-400/15 border-orange-400/30 text-orange-100",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EvrimGame() {
  const [gp,            setGp]            = useState(0);
  const [unlocked,      setUnlocked]      = useState({});
  const [levels,        setLevels]        = useState({});
  const [stageIdx,      setStageIdx]      = useState(0);
  const [tapCount,      setTapCount]      = useState(0);
  const [burstUntil,    setBurstUntil]    = useState(0);
  const [extinctUntil,  setExtUntil]      = useState(0);
  const [selectedId,    setSelectedId]    = useState("spacetime_expansion");
  const [log,           setLog]           = useState(["Gözlem başladı."]);
  const [combo,         setCombo]         = useState(1);
  const [floats,        setFloats]        = useState([]);
  const [ripples,       setRipples]       = useState([]);
  const [toasts,        setToasts]        = useState([]);
  const [paths,         setPaths]         = useState([]);
  const [stageKey,      setStageKey]      = useState(0);
  const [cosmicTime,    setCosmicTime]    = useState("13.80 milyar yıl önce");
  const [ctKey,         setCtKey]         = useState(0);
  const [activeTab,     setActiveTab]     = useState("disc");
  const [autoUpgrade,   setAutoUpgrade]   = useState(false);
  const [activeEvent,   setActiveEvent]   = useState(null);
  const [prestigeModal, setPrestigeModal] = useState(false);
  const [pendingBig,    setPendingBig]    = useState(false);
  const [dm,            setDm]            = useState(0);
  const [dmUpgrades,    setDmUpgrades]    = useState({});
  const [fermiUnlocked, setFermiUnlocked] = useState({});
  const [quests,        setQuests]        = useState([]);
  const [doneQuestIds,  setDoneQuestIds]  = useState([]);
  const [capsules,      setCapsules]      = useState({});
  const [capsuleEdit,   setCapsuleEdit]   = useState(null);
  const [capsuleText,   setCapsuleText]   = useState("");
  const [ambStarted,    setAmbStarted]    = useState(false);
  const [particles,     setParticles]     = useState([]);
  const [cinema,        setCinema]        = useState(null);
  const [branchUnlocked,setBranchUnlocked]= useState({});
  const [branchLevels,  setBranchLevels]  = useState({});
  const [activeBranchId,setActiveBranchId]= useState(null);
  const [stats,         setStats]         = useState({ clicks:0, maxCombo:1, extincts:0, levelUps:0, startTime: Date.now() });
  const [loaded,        setLoaded]        = useState(false);
  const [savedFlash,    setSavedFlash]    = useState(false);
  const [pinnedId,      setPinnedId]      = useState(null);
  const [autoTarget,    setAutoTarget]    = useState(null);
  const [autoTargetModal,setAutoTargetModal] = useState(false);
  const [batchFlash,    setBatchFlash]    = useState(false);

  const lastTapTime  = useRef(0);
  const lastDiscoveryTap = useRef({ id: null, at: 0 });
  const comboTimer   = useRef(null);
  const comboRef     = useRef(1);
  const gpRef        = useRef(0);
  const gpsRef       = useRef(0);
  const justLoaded   = useRef(false);
  const prevBranches = useRef([]);

  const { soundOn, setSoundOn, play, startAmbient, updateAmbient, stopAmbient } = useSound();

  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { gpRef.current = gp; }, [gp]);

  useEffect(() => {
    if (DATA_VALIDATION_REPORT.errors.length || DATA_VALIDATION_REPORT.warnings.length) {
      console.groupCollapsed("EvrimGame data validation report");
      DATA_VALIDATION_REPORT.errors.forEach(e => console.error(e));
      DATA_VALIDATION_REPORT.warnings.forEach(w => console.warn(w));
      console.groupEnd();
    }
  }, []);

  const activeStage   = STAGES[stageIdx];
  const burstActive   = burstUntil > Date.now();
  const extinctActive = extinctUntil > Date.now();
  const totalPrestiges = paths.length;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const addToast = useCallback((msg, color = "white") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-2), { id, msg, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const addLog = useCallback((text) => {
    setLog(prev => [text, ...prev].slice(0, 5));
  }, []);

  const spawnParticles = useCallback(() => {
    const ps = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const dist  = 25 + Math.random() * 25;
      return {
        id:    Date.now() + i + Math.random(),
        x: 50, y: 40,
        dx:    Math.cos(angle) * dist,
        dy:    Math.sin(angle) * dist,
        color: ['#60a5fa','#a78bfa','#34d399','#fbbf24','#f87171','#f472b6'][i % 6],
        size:  3 + Math.random() * 4,
      };
    });
    setParticles(prev => [...prev.slice(-24), ...ps]);
    setTimeout(() => setParticles(prev => prev.filter(p => !ps.find(n => n.id === p.id))), 900);
  }, []);

  // ── Derived Computations ──────────────────────────────────────────────────
  const stageUnlocked = useCallback((stageId) => {
    const idx = STAGES.findIndex(s => s.id === stageId);
    if (idx === 0) return true;
    return !!unlocked[STAGES[idx - 1]?.gate];
  }, [unlocked]);

  const isAvailable = useCallback((d) => {
    return stageUnlocked(d.stage) && d.req.every(id => unlocked[id]);
  }, [stageUnlocked, unlocked]);

  const activeBranches = useMemo(() =>
    BRANCHES.filter(b => unlocked[b.gateId]),
    [unlocked]
  );

  const branchProd = useMemo(() => {
    const results = [];
    BRANCHES.forEach(b => {
      b.children.forEach(c => {
        if (!branchUnlocked[c.id]) return;
        const lv  = branchLevels[c.id] || 1;
        const amt = c.gps + Math.max(0, lv - 1) * c.gg;
        results.push({ ...c, amount: amt, lv, branchName: b.name, accent: b.accent });
      });
    });
    return results;
  }, [branchUnlocked, branchLevels]);

  const bChildCost = useCallback((child) => {
    return Math.round(child.lcb * Math.pow(1.18, (branchLevels[child.id] || 1) - 1));
  }, [branchLevels]);

  const totalBranchDone = useMemo(() =>
    Object.values(branchUnlocked).filter(Boolean).length,
    [branchUnlocked]
  );

  const pathMults = useMemo(() => {
    let click = 1; let pass = 1;
    paths.forEach(p => {
      if (p.type === "multiply") { click *= 2;   pass  *= 1.1; }
      else if (p.type === "select")   { pass  *= 2;   click *= 1.1; }
      else if (p.type === "mutate")   { click *= p.r; pass  *= p.r; }
    });
    return { click, pass };
  }, [paths]);

  const sciMults = useMemo(() => {
    let click = 1; let pass = 1;
    SCIENTISTS.forEach(s => {
      if (!unlocked[s.link]) return;
      if (s.type === "click")   click *= (1 + s.val);
      if (s.type === "passive") pass  *= (1 + s.val);
    });
    return { click, pass };
  }, [unlocked]);

  const dmMults = useMemo(() => ({
    click:     1 + (dmUpgrades.click_b || 0) * 0.25,
    pass:      1 + (dmUpgrades.pass_b  || 0) * 0.10,
    comboMax:  100 + (dmUpgrades.combo_b || 0) * 10,
    autoSpeed: Math.pow(2, dmUpgrades.auto_b || 0),
  }), [dmUpgrades]);

  const fermiBonus = useMemo(() => {
    let mult = 1;
    FERMI.forEach(f => { if (fermiUnlocked[f.id]) mult *= (1 + f.gpsB); });
    return mult;
  }, [fermiUnlocked]);

  const synergyMult = useMemo(() => {
    let mult = 1;
    SYNERGIES.forEach(s => {
      if (s.ids.every(id => unlocked[id])) mult *= (1 + s.bonus);
    });
    return mult;
  }, [unlocked]);

  const activeSynergies = useMemo(() =>
    SYNERGIES.filter(s => s.ids.every(id => unlocked[id])),
    [unlocked]
  );

  const mileMult = useMemo(() => {
    let all = pathMults.pass * sciMults.pass * dmMults.pass * synergyMult * fermiBonus;
    const byStage = {};
    DISCOVERIES.forEach(d => {
      const lv = levels[d.id] || 0;
      if (!unlocked[d.id]) return;
      if (lv >= 5)  byStage[d.stage] = (byStage[d.stage] || 1) * 1.05;
      if (lv >= 10) all *= 1.04;
      if (d.id === "first_metabolism" && lv >= 10) all *= 1.16;
      if (d.id === "evrim_darwin"     && lv >= 10) all *= 1.18;
    });
    return { all, byStage };
  }, [levels, unlocked, pathMults, sciMults, dmMults, synergyMult, fermiBonus]);

  const prodBreakdown = useMemo(() => {
    const burstMult  = burstActive ? 1.25 : 1;
    const extinMult  = extinctActive ? 0.4 : 1;
    const eventMult  = (activeEvent && activeEvent.type === "prod_mult") ? activeEvent.val : 1;
    return DISCOVERIES.filter(d => unlocked[d.id]).map(d => {
      const lv  = levels[d.id] || 1;
      const raw = d.gps + Math.max(0, lv - 1) * d.gg;
      const amt = raw * mileMult.all * (mileMult.byStage[d.stage] || 1) * burstMult * extinMult * eventMult;
      return { ...d, amount: amt, lv };
    });
  }, [levels, unlocked, mileMult, burstActive, extinctActive, activeEvent]);

  const gpsPerSec = useMemo(() => {
    const burstMult  = burstActive ? 1.25 : 1;
    const extinMult  = extinctActive ? 0.4 : 1;
    const eventMult  = (activeEvent && activeEvent.type === "prod_mult") ? activeEvent.val : 1;
    const base       = 0.5 * burstMult * extinMult * eventMult;
    const mainProd   = prodBreakdown.reduce((s, d) => s + d.amount, 0);
    const bProd      = branchProd.reduce((s, d) => s + d.amount, 0);
    return base + mainProd + bProd;
  }, [prodBreakdown, branchProd, burstActive, extinctActive, activeEvent]);

  useEffect(() => { gpsRef.current = gpsPerSec; }, [gpsPerSec]);

  const levelCost = useCallback((d) => {
    return Math.round(d.lcb * Math.pow(1.18, (levels[d.id] || 1) - 1));
  }, [levels]);

  const bestUpgrade = useMemo(() => {
    let best = null; let bestRatio = 0;
    if (autoTarget && unlocked[autoTarget]) {
      return DISCOVERIES.find(d => d.id === autoTarget) || null;
    }
    DISCOVERIES.forEach(d => {
      if (!unlocked[d.id]) return;
      const cost  = Math.round(d.lcb * Math.pow(1.18, (levels[d.id] || 1) - 1));
      const gain  = d.gg * mileMult.all * (mileMult.byStage[d.stage] || 1);
      const ratio = gain / cost;
      if (ratio > bestRatio) { bestRatio = ratio; best = d; }
    });
    return best;
  }, [unlocked, levels, mileMult, autoTarget]);

  // ── Smart computations ─────────────────────────────────────────────────────

  const clickVal = useMemo(() => {
    let val = pathMults.click * sciMults.click * dmMults.click;
    if ((levels.fundamental_particles || 0) >= 10) val += 1;
    if ((levels.young_sun || 0) >= 10) val *= 1.15;
    if (burstActive) val *= 1.25;
    if (activeEvent && activeEvent.type === "click_mult") val *= activeEvent.val;
    return val;
  }, [levels, burstActive, pathMults, sciMults, dmMults, activeEvent]);

  const canPrestige    = useMemo(() => !!unlocked["luca"] && !unlocked["elektrik_sebekesi"], [unlocked]);
  const canBigPrestige = useMemo(() => !!unlocked["elektrik_sebekesi"], [unlocked]);
  const fermiAvail     = useMemo(() => !!unlocked["elektrik_sebekesi"], [unlocked]);
  const done           = useMemo(() => DISCOVERIES.filter(d => unlocked[d.id]).length, [unlocked]);

  const prereqChain = useMemo(() => {
    const selDisc = DISCOVERIES.find(d => d.id === selectedId);
    if (!selDisc || selDisc.req.length === 0) return [];
    const chain = []; const visited = new Set();
    function walk(id) {
      if (visited.has(id)) return;
      visited.add(id);
      const d = DISCOVERIES.find(x => x.id === id);
      if (!d) return;
      d.req.forEach(walk);
      chain.push(d);
    }
    selDisc.req.forEach(walk);
    return chain.slice(-5);
  }, [selectedId, unlocked]);

  // ── Quest Helpers ─────────────────────────────────────────────────────────
  const getQuestVal = useCallback((type) => {
    if (type === "clicks")    return stats.clicks;
    if (type === "unlocks")   return done;
    if (type === "max_combo") return stats.maxCombo;
    if (type === "levelups")  return stats.levelUps;
    if (type === "extincts")  return stats.extincts;
    if (type === "synergies") return activeSynergies.length;
    if (type === "gps")       return gpsRef.current;
    if (type === "prestiges") return totalPrestiges;
    if (type === "branches")  return totalBranchDone;
    return 0;
  }, [stats, done, activeSynergies, totalPrestiges, totalBranchDone]);

  const getQuestProg = useCallback((aq) => {
    const q = QUESTS.find(x => x.id === aq.questId);
    if (!q) return 0;
    const abs = ["max_combo","gps","synergies","prestiges","unlocks","branches"].includes(q.obj.type);
    return abs ? getQuestVal(q.obj.type) : Math.max(0, getQuestVal(q.obj.type) - (aq.startVal || 0));
  }, [getQuestVal]);

  const genQuests = useCallback((count, existing = []) => {
    const avail = QUESTS.filter(q => !existing.find(e => e.questId === q.id));
    return avail.sort(() => Math.random() - 0.5).slice(0, count).map(q => ({
      questId: q.id, startVal: getQuestVal(q.obj.type)
    }));
  }, [getQuestVal]);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setGp(g => g + gpsPerSec / 5), 200);
    return () => clearInterval(t);
  }, [gpsPerSec]);

  // Stage advance + cinema
  useEffect(() => {
    const gate = activeStage.gate;
    if (unlocked[gate] && stageIdx < STAGES.length - 1) {
      const next = STAGES[stageIdx + 1];
      setStageIdx(i => i + 1);
      setStageKey(k => k + 1);
      addLog(`Yeni çağ: ${next.title}`);
      addToast(`✨ ${next.title} açıldı!`, "gold");
      play("stage");
      if (!justLoaded.current) {
        setCinema(next);
        play("cinema");
        setTimeout(() => setCinema(null), 3200);
      }
    }
  }, [unlocked, stageIdx, activeStage.gate]);

  // Branch unlock notification
  useEffect(() => {
    const curIds = activeBranches.map(b => b.id);
    const newIds = curIds.filter(id => !prevBranches.current.includes(id));
    if (newIds.length > 0 && !justLoaded.current) {
      newIds.forEach(id => {
        const b = BRANCHES.find(x => x.id === id);
        if (b) addToast(`🌿 Yeni dal: ${b.name}!`, "emerald");
      });
    }
    prevBranches.current = curIds;
  }, [activeBranches]);

  // Synergy notifications
  const prevSynCount = useRef(0);
  useEffect(() => {
    const cur = activeSynergies.length;
    if (cur > prevSynCount.current) {
      const s = activeSynergies[cur - 1];
      addToast(`🌟 Sinerji: ${s.name} +${Math.round(s.bonus * 100)}%`, "emerald");
      play("synergy");
    }
    prevSynCount.current = cur;
  }, [activeSynergies]);

  // Scientist notifications
  const prevSciCount = useRef(0);
  useEffect(() => {
    const cur = SCIENTISTS.filter(s => unlocked[s.link]).length;
    if (cur > prevSciCount.current) {
      const newest = SCIENTISTS.filter(s => unlocked[s.link])[cur - 1];
      if (newest) addToast(`👨‍🔬 ${newest.name} aktif!`, "cyan");
    }
    prevSciCount.current = cur;
  }, [unlocked]);

  // Ambient on stage change
  useEffect(() => { if (ambStarted) updateAmbient(stageIdx); }, [stageIdx, ambStarted]);
  useEffect(() => { if (!soundOn && ambStarted) stopAmbient(); }, [soundOn]);

  // Auto-upgrade
  useEffect(() => {
    if (!autoUpgrade || !effectiveBestUpgrade) return;
    const interval = Math.round(800 / dmMults.autoSpeed);
    const t = setInterval(() => {
      const cost = Math.round(effectiveBestUpgrade.lcb * Math.pow(1.18, (levels[effectiveBestUpgrade.id] || 1) - 1));
      if (gpRef.current >= cost) {
        setGp(g => g - cost);
        setLevels(lv => ({ ...lv, [effectiveBestUpgrade.id]: (lv[effectiveBestUpgrade.id] || 1) + 1 }));
        setStats(s => ({ ...s, levelUps: s.levelUps + 1 }));
      }
    }, interval);
    return () => clearInterval(t);
  }, [autoUpgrade, effectiveBestUpgrade, levels, dmMults.autoSpeed]);

  // Random events
  useEffect(() => {
    if (!loaded) return;
    const t = setInterval(() => {
      if (activeEvent && Date.now() < activeEvent.until) return;
      if (Math.random() > 0.35) return;
      handleEvent(EVENTS[Math.floor(Math.random() * EVENTS.length)]);
    }, 60000);
    return () => clearInterval(t);
  }, [activeEvent, loaded, unlocked]);

  // Quest init
  useEffect(() => {
    if (!loaded) return;
    if (quests.length === 0) setQuests(genQuests(3, []));
  }, [loaded]);

  // Quest check
  useEffect(() => {
    if (!loaded || quests.length === 0) return;
    const t = setInterval(() => {
      setQuests(prev => {
        let changed = false;
        const next = prev.map(aq => {
          if (aq.completed) return aq;
          const q = QUESTS.find(x => x.id === aq.questId);
          if (!q) return aq;
          if (getQuestProg(aq) >= q.obj.tgt) {
            changed = true;
            setDm(d => d + q.reward.val);
            addToast(`✅ ${q.name} +${q.reward.val}◆`, "emerald");
            play("milestone");
            setDoneQuestIds(c => [...c, q.id]);
            return { ...aq, completed: true };
          }
          return aq;
        });
        if (changed) {
          setTimeout(() => setQuests(cur => {
            const keep = cur.filter(x => !x.completed);
            return [...keep, ...genQuests(3 - keep.length, keep)];
          }), 2000);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [loaded, quests, getQuestProg, genQuests]);

  // Save
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      try {
        const save = { gp, unlocked, levels, stageIdx, paths, cosmicTime, selectedId,
          stats, autoUpgrade, dm, dmUpgrades, fermiUnlocked, quests, doneQuestIds,
          capsules, branchUnlocked, branchLevels };
        await storageAPI.set(SAVE_KEY, createSaveEnvelope(save));
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
      } catch (_) {}
    }, 2000);
    return () => clearTimeout(t);
  }, [gp, unlocked, levels, stageIdx, paths, cosmicTime, loaded, dm, dmUpgrades,
      fermiUnlocked, capsules, branchUnlocked, branchLevels]);

  // Load
  useEffect(() => {
    (async () => {
      justLoaded.current = true;
      try {
        let r = await storageAPI.get(SAVE_KEY);
        if (!r || !r.value) {
          for (const legacyKey of LEGACY_SAVE_KEYS) {
            r = await storageAPI.get(legacyKey);
            if (r && r.value) break;
          }
        }
        if (r && r.value) {
          const s = normalizeSavePayload(readSaveEnvelope(r.value));
          if (!s) throw new Error("Save payload is invalid");
          if (s.gp           != null) setGp(s.gp);
          if (s.unlocked)              setUnlocked(s.unlocked);
          if (s.levels)                setLevels(s.levels);
          if (s.stageIdx     != null) setStageIdx(s.stageIdx);
          if (s.paths)                 setPaths(s.paths);
          if (s.cosmicTime)            setCosmicTime(s.cosmicTime);
          if (s.selectedId)            setSelectedId(s.selectedId);
          if (s.stats)                 setStats(p => ({ ...p, ...s.stats }));
          if (s.autoUpgrade  != null) setAutoUpgrade(s.autoUpgrade);
          if (s.dm           != null) setDm(s.dm);
          if (s.dmUpgrades)            setDmUpgrades(s.dmUpgrades);
          if (s.fermiUnlocked)         setFermiUnlocked(s.fermiUnlocked);
          if (s.quests)                setQuests(s.quests);
          if (s.doneQuestIds)          setDoneQuestIds(s.doneQuestIds);
          if (s.capsules)              setCapsules(s.capsules);
          if (s.branchUnlocked)        setBranchUnlocked(s.branchUnlocked);
          if (s.branchLevels)          setBranchLevels(s.branchLevels);
        }
      } catch (_) {}
      setLoaded(true);
      setTimeout(() => { justLoaded.current = false; }, 500);
    })();
  }, []);

  // ── Action Handlers ───────────────────────────────────────────────────────
  const handleEvent = useCallback((ev) => {
    if (ev.type === "instant") {
      const gained = gpsRef.current * ev.val;
      setGp(g => g + gained);
      addToast(`${ev.icon} ${ev.name}: +${fmtGP(gained)} GP!`, ev.color);
    } else if (ev.type === "free_level") {
      const ids = Object.keys(unlocked).filter(id => unlocked[id]);
      if (ids.length > 0) {
        const rid  = ids[Math.floor(Math.random() * ids.length)];
        const disc = DISCOVERIES.find(d => d.id === rid);
        setLevels(lv => ({ ...lv, [rid]: (lv[rid] || 1) + ev.val }));
        addToast(`${ev.icon} ${ev.name}: ${disc ? disc.name : ""} +${ev.val}!`, ev.color);
      }
    } else {
      const until = Date.now() + ev.dur;
      setActiveEvent({ ...ev, until });
      addToast(`${ev.icon} ${ev.name}: ${ev.desc}`, ev.color);
      setTimeout(() => setActiveEvent(null), ev.dur);
    }
    addLog(`Olay: ${ev.name}`);
    play("event");
  }, [unlocked]);

  const discountedCost = useCallback((uc) => {
    if (activeEvent && activeEvent.type === "discount") return Math.round(uc * activeEvent.val);
    return uc;
  }, [activeEvent]);

  const unlockDisc = useCallback((d, prevent = false) => {
    const base = discountedCost(d.uc);
    const cost = prevent ? d.uc * 5 : base;
    if (!isAvailable(d) || unlocked[d.id] || gpRef.current < cost) return;
    if (d.qt && !prevent && Math.random() < 0.30) {
      const refund = Math.round(cost * 0.60);
      setGp(g => g - cost + refund);
      addToast(`⚛️ Kuantum belirsizliği! Başarısız — ${fmtGP(refund)} GP iade`, "violet");
      play("quantum");
      return;
    }
    setGp(g => g - cost);
    setUnlocked(u => ({ ...u, [d.id]: true }));
    setLevels(lv => ({ ...lv, [d.id]: 1 }));
    setSelectedId(d.id);
    setCosmicTime(d.ct);
    setCtKey(k => k + 1);
    addLog(`Keşif: ${d.name}`);
    spawnParticles();
    if (["big_bang","first_stars"].includes(d.stage)) setDm(x => x + 1);
    if (d.isExt && !prevent) {
      setExtUntil(Date.now() + 15000);
      addToast(`☄️ ${d.name} — Üretim 15sn -%60!`, "red");
      play("extinction");
      setStats(s => ({ ...s, extincts: s.extincts + 1 }));
    } else if (d.isExt && prevent) {
      addToast(`🛡️ ${d.name} önlendi!`, "emerald");
      play("unlock");
    } else {
      addToast(`🔬 ${d.name} açıldı`, "cyan");
      play("unlock");
    }
  }, [isAvailable, unlocked, activeEvent, spawnParticles, discountedCost]);

  const handleDiscoveryCardClick = useCallback((d) => {
    const now = performance.now();
    const isSameTarget = lastDiscoveryTap.current.id === d.id;
    const isDoubleTap = isSameTarget && (now - lastDiscoveryTap.current.at) <= DOUBLE_TAP_WINDOW_MS;
    lastDiscoveryTap.current = { id: d.id, at: now };
    setSelectedId(d.id);

    if (!isDoubleTap || unlocked[d.id]) return;
    if (!isAvailable(d)) {
      addToast("Bu keşif için ön koşullar tamamlanmadı", "red");
      play("error");
      return;
    }
    const cost = discountedCost(d.uc);
    if (gpRef.current < cost) {
      const remaining = cost - gpRef.current;
      const eta = gpsRef.current > 0 ? Math.ceil(remaining / gpsRef.current) : null;
      addToast(eta ? `Yetersiz GP · ~${fmtTime(eta)}` : "Yetersiz GP", "yellow");
      play("error");
      return;
    }
    unlockDisc(d);
    addToast(`⚡ Çift dokunuş keşfi: ${d.name}`, "gold");
  }, [unlocked, isAvailable, discountedCost, unlockDisc, addToast, play]);

  const upgradeDisc = useCallback((d) => {
    if (!unlocked[d.id]) return;
    const cost = levelCost(d);
    if (gpRef.current < cost) return;
    const newLv = (levels[d.id] || 1) + 1;
    setGp(g => g - cost);
    setLevels(lv => ({ ...lv, [d.id]: newLv }));
    setStats(s => ({ ...s, levelUps: s.levelUps + 1 }));
    if (newLv === 5 || newLv === 10) {
      addToast(`⭐ ${d.name} Sv.${newLv}`, "emerald");
      play("milestone");
    } else {
      play("levelup");
    }
    addLog(`${d.name} → Sv.${newLv}`);
  }, [unlocked, levelCost, levels]);

  // Batch: upgrade all affordable by ROI order
  const upgradeAllAffordable = useCallback(() => {
    const sorted = DISCOVERIES
      .filter(d => unlocked[d.id])
      .map(d => {
        const cost  = Math.round(d.lcb * Math.pow(1.18, (levels[d.id] || 1) - 1));
        const gain  = d.gg * mileMult.all * (mileMult.byStage[d.stage] || 1);
        return { d, cost, roi: gain / cost };
      })
      .filter(x => x.cost <= gpRef.current)
      .sort((a, b) => b.roi - a.roi);

    if (sorted.length === 0) return;

    let remaining = gpRef.current;
    const newLevels = { ...levels };
    let count = 0;

    sorted.forEach(({ d, cost }) => {
      const actualCost = Math.round(d.lcb * Math.pow(1.18, (newLevels[d.id] || 1) - 1));
      if (remaining >= actualCost) {
        remaining -= actualCost;
        newLevels[d.id] = (newLevels[d.id] || 1) + 1;
        count++;
      }
    });

    if (count > 0) {
      setGp(remaining);
      setLevels(newLevels);
      setStats(s => ({ ...s, levelUps: s.levelUps + count }));
      addToast(`⬆️ ${count} keşif yükseltildi`, "emerald");
      play("milestone");
    }
  }, [unlocked, levels, mileMult]);

  // Quick upgrade single disc without opening detail
  const quickUpgradeDisc = useCallback((d, e) => {
    e.stopPropagation();
    upgradeDisc(d);
  }, [upgradeDisc]);


  const unlockBranchChild = useCallback((child) => {
    if (branchUnlocked[child.id] || gpRef.current < child.uc) return;
    setGp(g => g - child.uc);
    setBranchUnlocked(x => ({ ...x, [child.id]: true }));
    setBranchLevels(x => ({ ...x, [child.id]: 1 }));
    addToast(`🌿 ${child.name} açıldı`, "emerald");
    addLog(`Dal keşfi: ${child.name}`);
    play("branch");
    spawnParticles();
  }, [branchUnlocked, spawnParticles]);

  const upgradeBranchChild = useCallback((child) => {
    if (!branchUnlocked[child.id]) return;
    const cost = bChildCost(child);
    if (gpRef.current < cost) return;
    const newLv = (branchLevels[child.id] || 1) + 1;
    setGp(g => g - cost);
    setBranchLevels(x => ({ ...x, [child.id]: newLv }));
    setStats(s => ({ ...s, levelUps: s.levelUps + 1 }));
    addLog(`${child.name} → Sv.${newLv}`);
    play("levelup");
  }, [branchUnlocked, bChildCost, branchLevels]);

  const unlockFermi = useCallback((f) => {
    if (fermiUnlocked[f.id]) return;
    if (!f.req.every(id => unlocked[id] || fermiUnlocked[id])) return;
    if (dm < f.cost) return;
    setDm(d => d - f.cost);
    setFermiUnlocked(x => ({ ...x, [f.id]: true }));
    addToast(`🌌 ${f.name} keşfedildi!`, "violet");
    addLog(`Fermi: ${f.name}`);
    play("unlock");
  }, [fermiUnlocked, unlocked, dm]);

  const buyDmUpgrade = useCallback((up) => {
    const cur = dmUpgrades[up.id] || 0;
    if (cur >= up.max || dm < up.cost) return;
    setDm(d => d - up.cost);
    setDmUpgrades(x => ({ ...x, [up.id]: cur + 1 }));
    addToast(`◆ ${up.name} satın alındı`, "cyan");
    play("levelup");
  }, [dmUpgrades, dm]);

  const handleTap = useCallback((e) => {
    if (!ambStarted) { setAmbStarted(true); startAmbient(stageIdx); }
    const now2   = performance.now();
    const diff   = now2 - lastTapTime.current;
    lastTapTime.current = now2;
    if (comboTimer.current) clearTimeout(comboTimer.current);
    const newCombo = parseFloat(Math.min(diff < 650 ? comboRef.current + 0.3 : 1, dmMults.comboMax).toFixed(1));
    setCombo(newCombo);
    comboTimer.current = setTimeout(() => setCombo(1), 1400);
    const earned = clickVal * newCombo;
    setGp(g => g + earned);
    setStats(s => ({ ...s, clicks: s.clicks + 1, maxCombo: Math.max(s.maxCombo, newCombo) }));

    // Double-tap discovery: if an available discovery is already affordable, unlock it.
    if (diff > 0 && diff < DOUBLE_TAP_WINDOW_MS) {
      const selectedDisc = DISCOVERIES.find(d => d.id === selectedId);
      const selectedReady = selectedDisc && isAvailable(selectedDisc) && !unlocked[selectedDisc.id] && gpRef.current >= discountedCost(selectedDisc.uc);
      const fallbackReady = DISCOVERIES
        .filter(d => isAvailable(d) && !unlocked[d.id] && gpRef.current >= discountedCost(d.uc))
        .sort((a, b) => discountedCost(a.uc) - discountedCost(b.uc))[0];
      const doubleTapTarget = selectedReady ? selectedDisc : fallbackReady;
      if (doubleTapTarget) {
        unlockDisc(doubleTapTarget);
        addToast(`⚡ Çift dokunuş: ${doubleTapTarget.name}`, "gold");
      }
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const fx   = ((e.clientX - rect.left) / rect.width)  * 100;
    const fy   = ((e.clientY - rect.top)  / rect.height) * 100;
    const fid  = Date.now() + Math.random();
    setFloats(prev => [...prev.slice(-10), { id: fid, text: `+${fmtGP(earned)}`, x: fx, y: fy }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== fid)), 900);
    const rid = Date.now();
    setRipples(prev => [...prev.slice(-3), { id: rid, x: fx, y: fy }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rid)), 700);
    play("click");
    setTapCount(c => {
      const next = c + 1;
      if (next % 20 === 0) {
        setBurstUntil(Date.now() + 10000);
        addToast("⚡ Yoğun Gözlem: 10sn +%25!", "yellow");
        play("burst");
        addLog("Yoğun Gözlem aktif");
      }
      return next;
    });
  }, [clickVal, dmMults.comboMax, ambStarted, startAmbient, stageIdx, selectedId, unlocked, isAvailable, discountedCost, unlockDisc]);

  const openPrestige = (big) => { setPendingBig(big); setPrestigeModal(true); };
  const confirmPrestige = (pathType) => {
    setPrestigeModal(false);
    const rand = pathType === "mutate" ? 1.5 + Math.random() * 1.5 : null;
    setPaths(prev => [...prev, { type: pathType, ...(rand ? { r: rand } : {}) }]);
    setDm(d => d + 5);
    setGp(pendingBig ? 5000 : 500);
    setUnlocked({}); setLevels({}); setStageIdx(0); setStageKey(k => k + 1);
    setSelectedId("spacetime_expansion"); setCombo(1);
    setCosmicTime("13.80 milyar yıl önce"); setCtKey(k => k + 1); setQuests([]);
    addLog(`Prestij ${totalPrestiges + 1}`);
    addToast(`🏆 Prestij! +5◆`, "gold");
    play("prestige");
  };

  const handleBatchUpgrade = useCallback((topN = null) => {
    let candidates = DISCOVERIES
      .filter(d => unlocked[d.id] && gpRef.current >= levelCost(d))
      .sort((a, b) => upgradeGain(b) / levelCost(b) - upgradeGain(a) / levelCost(a));
    if (topN) candidates = candidates.slice(0, topN);
    let totalCost = 0;
    candidates.forEach(d => { totalCost += levelCost(d); });
    if (gpRef.current < totalCost) {
      // Afford what we can greedily
      candidates = [];
      let remaining = gpRef.current;
      DISCOVERIES
        .filter(d => unlocked[d.id] && remaining >= levelCost(d))
        .sort((a, b) => upgradeGain(b) / levelCost(b) - upgradeGain(a) / levelCost(a))
        .forEach(d => {
          const c = levelCost(d);
          if (remaining >= c) { candidates.push(d); remaining -= c; }
        });
    }
    if (candidates.length === 0) return;
    let spent = 0;
    const newLevels = { ...levels };
    candidates.forEach(d => {
      const c = Math.round(d.lcb * Math.pow(1.18, (newLevels[d.id] || 1) - 1));
      newLevels[d.id] = (newLevels[d.id] || 1) + 1;
      spent += c;
    });
    setGp(g => g - spent);
    setLevels(newLevels);
    setStats(s => ({ ...s, levelUps: s.levelUps + candidates.length }));
    setBatchFlash(true);
    setTimeout(() => setBatchFlash(false), 800);
    addToast(`⬆️ ${candidates.length} keşif yükseltildi`, "emerald");
  }, [unlocked, levels, levelCost, upgradeGain]);

  const handlePin = useCallback((id) => {
    setPinnedId(prev => prev === id ? null : id);
  }, []);

  const handleReset = () => {
    setGp(0); setUnlocked({}); setLevels({}); setStageIdx(0); setTapCount(0);
    setBurstUntil(0); setExtUntil(0); setSelectedId("spacetime_expansion"); setCombo(1);
    setPaths([]); setCosmicTime("13.80 milyar yıl önce"); setActiveEvent(null);
    setDm(0); setDmUpgrades({}); setFermiUnlocked({}); setQuests([]); setDoneQuestIds([]);
    setCapsules({}); setBranchUnlocked({}); setBranchLevels({}); setActiveBranchId(null);
    setStats({ clicks: 0, maxCombo: 1, extincts: 0, levelUps: 0, startTime: Date.now() });
    setLog(["Sıfırlandı."]);
  };

  // ── Derived UI ────────────────────────────────────────────────────────────
  const visibleDiscs = DISCOVERIES.filter(d => d.stage === activeStage.id || unlocked[d.id]);
  const selDisc      = DISCOVERIES.find(d => d.id === selectedId) || DISCOVERIES[0];
  const selUnlocked  = !!unlocked[selDisc.id];
  const selLevel     = levels[selDisc.id] || 0;
  const isBestSel    = bestUpgrade && bestUpgrade.id === selDisc.id;
  const pct          = Math.round((done / DISCOVERIES.length) * 100);
  const extinctSec   = Math.max(0, Math.ceil((extinctUntil - Date.now()) / 1000));
  const eventSec     = activeEvent ? Math.max(0, Math.ceil((activeEvent.until - Date.now()) / 1000)) : 0;
  const playtime     = Math.floor((Date.now() - stats.startTime) / 1000);
  const allProd      = [...prodBreakdown, ...branchProd];
  const totalProd    = allProd.reduce((s, d) => s + d.amount, 0) || 1;
  const cinemaMeta   = cinema ? STAGE_META[cinema.id] : null;
  const activeBranchObj = activeBranchId ? BRANCHES.find(b => b.id === activeBranchId) : null;
  const unlockedScientists = SCIENTISTS.filter(s => unlocked[s.link]);

  // ── Smart helpers ─────────────────────────────────────────────────────────
  const timeToAfford = useCallback((cost) => {
    const remaining = Math.max(0, cost - gp);
    if (remaining <= 0) return 0;
    if (gpsPerSec <= 0) return null;
    return Math.ceil(remaining / gpsPerSec);
  }, [gp, gpsPerSec]);

  const fmtEta = (secs) => {
    if (secs === 0) return null;
    if (secs === null) return "∞";
    if (secs < 60)  return `${secs}sn`;
    if (secs < 3600) return `${Math.floor(secs/60)}dk`;
    return `${Math.floor(secs/3600)}s`;
  };

  const nextAffordable = useMemo(() => {
    return DISCOVERIES
      .filter(d => isAvailable(d) && !unlocked[d.id])
      .sort((a, b) => discountedCost(a.uc) - discountedCost(b.uc))[0] || null;
  }, [unlocked, isAvailable, discountedCost]);

  const upgradeGain = useCallback((d) => {
    if (!unlocked[d.id]) return 0;
    const bm = burstActive ? 1.25 : 1;
    const em = extinctActive ? 0.4 : 1;
    return d.gg * mileMult.all * (mileMult.byStage[d.stage] || 1) * bm * em;
  }, [unlocked, mileMult, burstActive, extinctActive]);

  const burstProgress = (tapCount % 20);

  // Pinned discovery
  const pinnedDisc = pinnedId ? DISCOVERIES.find(d => d.id === pinnedId) : null;
  const pinnedCost = pinnedDisc ? discountedCost(pinnedDisc.uc) : 0;
  const pinnedEta  = pinnedDisc && !unlocked[pinnedId] ? timeToAfford(pinnedCost) : null;
  const pinnedPct  = pinnedDisc && !unlocked[pinnedId]
    ? Math.min(100, (gp / pinnedCost) * 100) : 100;

  // Effective auto-upgrade target
  const effectiveBestUpgrade = useMemo(() => {
    if (autoTarget) {
      const d = DISCOVERIES.find(x => x.id === autoTarget);
      if (d && unlocked[d.id]) return d;
    }
    return bestUpgrade;
  }, [autoTarget, bestUpgrade, unlocked]);

  // Affordable discoveries for batch operations
  const affordableDiscs = useMemo(() =>
    DISCOVERIES.filter(d => isAvailable(d) && !unlocked[d.id] && gp >= discountedCost(d.uc)),
    [unlocked, isAvailable, gp, discountedCost]
  );
  const affordableUpgrades = useMemo(() =>
    DISCOVERIES.filter(d => unlocked[d.id] && gp >= levelCost(d)),
    [unlocked, gp, levelCost]
  );

  // Tab notification badges
  const tabBadges = useMemo(() => ({
    disc:   affordableDiscs.length > 0 || affordableUpgrades.length > 0,
    quests: quests.some(aq => !aq.completed && getQuestProg(aq) >= (QUESTS.find(q=>q.id===aq.questId)?.obj.tgt||0)),
    sci:    unlockedScientists.length > 0 && FERMI.some(f => !fermiUnlocked[f.id] && f.req.every(id=>unlocked[id]||fermiUnlocked[id]) && dm >= f.cost),
  }), [affordableDiscs, affordableUpgrades, quests, getQuestProg, unlockedScientists, fermiUnlocked, unlocked, dm]);

  const TABS = [
    { id: "disc",   label: "Keşif",  icon: <Telescope className="w-3.5 h-3.5" />,   badge: tabBadges.disc   },
    { id: "prod",   label: "Üretim", icon: <TrendingUp className="w-3.5 h-3.5" />                           },
    { id: "quests", label: "Görev",  icon: <BookOpen className="w-3.5 h-3.5" />,     badge: tabBadges.quests },
    { id: "sci",    label: "Bilim",  icon: <FlaskConical className="w-3.5 h-3.5" />, badge: tabBadges.sci    },
    { id: "sys",    label: "Sistem", icon: <Settings className="w-3.5 h-3.5" />                             },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white flex items-center justify-center p-3">
      <style>{KF}</style>
      <div className="relative w-full max-w-[430px] aspect-[9/16] overflow-hidden rounded-[2.4rem] flex flex-col"
        style={{ border: "1px solid rgba(139,92,246,0.35)", boxShadow: "0 0 0 1px rgba(0,0,0,0.8), 0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(139,92,246,0.15)", background: "#000" }}>

        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${activeStage.color} transition-all duration-1200`} />

        {/* Nebula layers — S24 Ultra GPU-accelerated */}
        {NEBULAE.map(n => (
          <div key={n.id} className="absolute pointer-events-none"
            style={{
              width: n.size, paddingBottom: n.size,
              top: n.top, left: n.left, right: n.right,
              background: `radial-gradient(circle, ${n.color} 0%, transparent 70%)`,
              animation: `${n.id % 2 === 0 ? "nebulaFloat" : "nebulaFloat2"} ${n.dur} ${n.delay} ease-in-out infinite`,
              willChange: "transform, opacity",
              borderRadius: "50%",
            }} />
        ))}

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {STARS.map(s => (
            <div key={s.id} className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.size, height: s.size,
                opacity: s.opacity * 0.7,
                animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
                willChange: "opacity, transform",
              }} />
          ))}
        </div>

        {/* Scan line — subtle sci-fi effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]"
          style={{ zIndex: 1 }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: "2px",
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)",
            animation: "scanLine 8s linear infinite",
          }} />
        </div>
        {extinctActive && (
          <div className="absolute inset-0 z-20 pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(220,38,38,0.18),transparent 70%)", animation: "extinctionPulse 1s ease-in-out infinite" }} />
        )}

        {/* Particles */}
        <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
          {particles.map(p => (
            <div key={p.id} className="absolute rounded-full"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
                background: p.color, '--pdx': `${p.dx}%`, '--pdy': `${p.dy}%`,
                animation: "particleFly 0.9s ease-out forwards" }} />
          ))}
        </div>

        {/* Cinema overlay */}
        {cinema && cinemaMeta && (
          <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.85),rgba(0,0,0,0.92))", animation: "cinemaIn 3.2s ease-in-out forwards" }}>
            <div className="relative text-center px-8">
              <div className="text-7xl mb-3" style={{ animation: "cinemaEmoji 3s ease-out forwards" }}>{cinemaMeta.emoji}</div>
              <div className="text-[10px] uppercase tracking-[.3em] text-white/50 mb-2" style={{ animation: "cinemaTitle 3s ease-out forwards" }}>✨ Yeni Çağ</div>
              <h2 className="text-2xl font-bold mb-2" style={{ animation: "cinemaTitle 3s ease-out forwards" }}>{cinema.title}</h2>
              <p className="text-sm text-white/65 leading-relaxed whitespace-pre-line" style={{ animation: "cinemaTitle 3s ease-out forwards" }}>{cinemaMeta.poem}</p>
            </div>
          </div>
        )}

        {/* Toasts */}
        <div className="absolute top-3 left-3 right-3 z-50 flex flex-col gap-1 pointer-events-none">
          {toasts.map(t => (
            <div key={t.id} className={`rounded-2xl border px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md ${TC[t.color] || TC.white}`}
              style={{ animation: "toastIn 3.2s ease-out forwards" }}>{t.msg}</div>
          ))}
        </div>
        {savedFlash && (
          <div className="absolute top-3 right-3 z-50 rounded-xl bg-emerald-400/20 border border-emerald-400/30 px-2 py-1 text-[10px] text-emerald-200"
            style={{ animation: "savedPop 0.4s ease-out" }}>✓ Kaydedildi</div>
        )}

        {/* Branch drawer */}
        {activeBranchObj && (
          <div className="absolute inset-0 z-35 flex flex-col justify-end"
            onClick={(e) => { if (e.target === e.currentTarget) setActiveBranchId(null); }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveBranchId(null)} />
            <div className="relative rounded-t-[2rem] bg-zinc-950 border-t border-white/15 flex flex-col max-h-[72%]"
              style={{ animation: "branchDrawerUp 0.32s ease-out" }}>
              <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeBranchObj.icon}</span>
                  <div>
                    <h3 className="font-bold text-[16px]">{activeBranchObj.name}</h3>
                    <p className="text-[10px] text-white/45">{activeBranchObj.desc}</p>
                  </div>
                </div>
                <button onClick={() => setActiveBranchId(null)} className="p-1.5 rounded-full bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-4 pb-6 flex flex-col gap-2">
                {activeBranchObj.children.map(child => {
                  const isUnlocked = !!branchUnlocked[child.id];
                  const lv         = branchLevels[child.id] || 0;
                  const prod       = branchProd.find(p => p.id === child.id);
                  const upgCost    = bChildCost(child);
                  const accentColor = activeBranchObj.accent;
                  return (
                    <div key={child.id} className={`rounded-2xl border p-3 ${isUnlocked ? "bg-white/8 border-white/15" : "bg-white/[0.04] border-white/8"}`}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="min-w-0">
                          <div className="font-semibold text-[13px]">{child.name}</div>
                          <div className="text-[10px] text-white/40">{child.by} · {child.ct}</div>
                          <p className="text-[10px] text-white/55 leading-relaxed mt-1 line-clamp-2">{child.sum}</p>
                        </div>
                        {isUnlocked && (
                          <div className="text-right shrink-0">
                            <div className="text-[11px] font-semibold">Sv.{lv}</div>
                            <div className="text-[10px]" style={{ color: accentColor }}>+{fmtGP(prod ? prod.amount : 0)}/sn</div>
                          </div>
                        )}
                      </div>
                      {!isUnlocked ? (
                        <button onClick={() => unlockBranchChild(child)} disabled={gp < child.uc}
                          className="w-full rounded-2xl py-2 text-[12px] font-semibold text-black disabled:bg-white/12 disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
                          style={{ background: gp >= child.uc ? accentColor : "" }}>
                          Keşfet · {fmtGP(child.uc)} GP
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => upgradeBranchChild(child)} disabled={gp < upgCost}
                            className="flex-1 rounded-2xl py-2 text-[12px] font-semibold text-black disabled:bg-white/12 disabled:text-white/30 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors"
                            style={{ background: gp >= upgCost ? accentColor : "" }}>
                            <ArrowUpCircle className="w-3.5 h-3.5" /> Sv.Artır · {fmtGP(upgCost)}
                          </button>
                          <div className="rounded-2xl bg-white/8 border border-white/10 px-3 py-2 text-right">
                            <div className="text-[9px] text-white/38">Üretim</div>
                            <div className="text-[12px] font-bold" style={{ color: accentColor }}>+{fmtGP(prod ? prod.amount : 0)}/sn</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Prestige modal */}
        {prestigeModal && (
          <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full rounded-t-[2rem] bg-zinc-900 border-t border-white/15 p-5 pb-8">
              <h2 className="text-lg font-bold text-center mb-1">Prestij Yolu Seç</h2>
              <p className="text-[11px] text-white/50 text-center mb-4">Dal ilerlemeleri korunur. +5◆ garantili.</p>
              <div className="flex flex-col gap-2">
                {PATHS.map(p => (
                  <button key={p.id} onClick={() => confirmPrestige(p.id)}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-white/15 bg-white/8 hover:bg-white/14 transition-colors">
                    <span className="text-xl">{p.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{p.name}</div>
                      <div className="text-[10px] text-white/50">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setPrestigeModal(false)} className="w-full mt-3 py-2 rounded-2xl bg-white/8 text-[12px] text-white/50">İptal</button>
            </div>
          </div>
        )}

        {/* Capsule modal */}
        {capsuleEdit && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full rounded-[1.8rem] bg-zinc-900 border border-white/15 p-5" style={{ animation: "capsuleOpen 0.3s ease-out" }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[11px] text-white/45">Zaman Kapsülü</div>
                  <h3 className="font-semibold text-[14px]">{DISCOVERIES.find(d => d.id === capsuleEdit) ? DISCOVERIES.find(d => d.id === capsuleEdit).name : ""}</h3>
                </div>
                <button onClick={() => { setCapsuleEdit(null); setCapsuleText(""); }} className="p-1.5 rounded-full bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea value={capsuleText} onChange={e => setCapsuleText(e.target.value)} maxLength={200}
                placeholder="Bu keşifle ilgili düşünceni yaz..."
                className="w-full h-24 bg-white/8 border border-white/15 rounded-2xl p-3 text-[12px] text-white/80 resize-none focus:outline-none focus:border-white/30 placeholder:text-white/25" />
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-white/30">{capsuleText.length}/200</span>
                <button onClick={() => {
                  setCapsules(c => ({ ...c, [capsuleEdit]: capsuleText.trim().slice(0, 200) }));
                  setCapsuleEdit(null); setCapsuleText("");
                }} className="rounded-2xl bg-emerald-400 text-black font-semibold px-4 py-1.5 text-[12px]">Kaydet 📝</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ MAIN CONTENT ═══ */}
        <div key={stageKey} className="relative z-10 flex flex-col flex-1 overflow-hidden" style={{ animation: "stageEnter 0.45s ease-out" }}>

          {/* Header */}
          <header className="px-4 pt-10 pb-2 shrink-0">
            {/* HUD top bar */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                {/* HUD label */}
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" style={{ animation: "hudBlink 3s ease-in-out infinite" }} />
                  <div className="text-[9px] uppercase tracking-[0.3em] text-white/35 font-mono">EVRİM · 13.8 MYA · AKTIF</div>
                </div>

                {/* Cosmic clock — HUD style */}
                <div key={ctKey} className="flex items-center gap-2 mt-1.5"
                  style={{ animation: "cosmicTick 0.6s ease-out" }}>
                  <div className="flex items-center gap-1 rounded-lg px-2 py-0.5"
                    style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.04))", border: "1px solid rgba(251,191,36,0.25)" }}>
                    <span className="text-[10px] text-amber-400">⏱</span>
                    <span className="text-[11px] font-mono font-bold text-amber-200 tracking-wide">{cosmicTime}</span>
                    <span className="text-[9px] text-amber-400/50" style={{ animation: "cosmicCursor 1.2s step-end infinite" }}>▊</span>
                  </div>
                </div>

                {/* Stage title with shimmer */}
                <h1 className="text-[19px] font-bold leading-tight mt-1.5 tracking-tight"
                  style={{ background: "linear-gradient(90deg, #fff 0%, rgba(200,220,255,0.95) 50%, #fff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "headerShimmer 6s linear infinite" }}>
                  {activeStage.title}
                </h1>
                <p className="text-[10px] text-white/45 mt-0.5">{activeStage.subtitle}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 mt-1 shrink-0">
                {totalPrestiges > 0 && (
                  <div className="flex items-center gap-1 rounded-xl px-2 py-1"
                    style={{ background: "linear-gradient(135deg,rgba(250,204,21,0.18),rgba(250,204,21,0.06))", border: "1px solid rgba(250,204,21,0.3)" }}>
                    <Trophy className="w-3 h-3 text-yellow-300" />
                    <span className="text-[10px] text-yellow-200 font-bold">{totalPrestiges}x</span>
                  </div>
                )}
                <div className="flex items-center gap-1 rounded-xl px-2 py-1"
                  style={{ background: "linear-gradient(135deg,rgba(167,139,250,0.18),rgba(167,139,250,0.06))", border: "1px solid rgba(167,139,250,0.3)" }}>
                  <span className="text-[10px] text-violet-300">◆</span>
                  <span className="text-[10px] text-violet-200 font-bold">{Math.floor(dm)}</span>
                </div>
                <button onClick={() => { setSoundOn(v => !v); if (soundOn) stopAmbient(); }}
                  className="p-1.5 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-white/35" />}
                </button>
                <button onClick={handleReset}
                  className="p-1.5 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stats cards — glassmorphism */}
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[
                { label: "GP",      value: fmtGP(gp),                 color: "rgba(96,165,250,0.2)",  border: "rgba(96,165,250,0.3)",  text: "#93c5fd" },
                { label: "Üretim",  value: `+${fmtGP(gpsPerSec)}/sn`, color: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.28)", text: "#6ee7b7" },
                { label: "Tıklama", value: `+${fmtGP(clickVal * combo)}`,color: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.28)", text: "#fdba74" },
              ].map(({ label, value, color, border, text }) => (
                <div key={label} className="rounded-2xl p-2.5 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${color}, rgba(0,0,0,0.2))`, border: `1px solid ${border}`, backdropFilter: "blur(12px)" }}>
                  <div className="absolute inset-0 opacity-10"
                    style={{ background: `radial-gradient(circle at 80% 20%, ${text}, transparent 60%)` }} />
                  <div className="relative">
                    <div className="text-[9px] uppercase tracking-wide font-mono" style={{ color: text, opacity: 0.7 }}>{label}</div>
                    <div className="text-[13px] font-bold tabular-nums truncate text-white mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </header>

          {/* Middle scrollable content */}
          <div className="flex-1 overflow-hidden flex flex-col px-4 gap-1.5 min-h-0">

            {/* Smart Tap Zone */}
            <button onClick={handleTap}
              className="relative w-full overflow-hidden active:scale-[0.982] shrink-0"
              style={{
                height: "24%", minHeight: 128,
                borderRadius: "1.6rem",
                background: extinctActive
                  ? "linear-gradient(135deg,rgba(220,38,38,0.15),rgba(0,0,0,0.45))"
                  : burstActive
                    ? "linear-gradient(135deg,rgba(6,182,212,0.18),rgba(0,0,0,0.38))"
                    : "linear-gradient(135deg,rgba(139,92,246,0.13),rgba(0,0,0,0.38))",
                border: extinctActive ? "1px solid rgba(220,38,38,0.35)"
                  : burstActive ? "1px solid rgba(6,182,212,0.35)"
                  : "1px solid rgba(139,92,246,0.28)",
                backdropFilter: "blur(16px)",
                transition: "transform 0.1s, border-color 0.3s",
              }}>

              {/* Dot grid */}
              <div className="absolute inset-0 opacity-[0.12]"
                style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />

              {/* Ripples */}
              {ripples.map(r => (
                <div key={r.id} className="absolute rounded-full pointer-events-none"
                  style={{ left: `${r.x}%`, top: `${r.y}%`, width: 64, height: 64,
                    border: `2px solid ${burstActive ? "rgba(6,182,212,0.6)" : "rgba(167,139,250,0.6)"}`,
                    animation: "energyRing 0.7s ease-out forwards" }} />
              ))}

              {/* Float labels */}
              {floats.map(f => (
                <div key={f.id} className="absolute font-bold pointer-events-none select-none"
                  style={{ left: `${f.x}%`, top: `${f.y}%`, transform: "translateX(-50%)", fontSize: "13px",
                    color: combo > 3 ? "#fbbf24" : combo > 1.5 ? "#34d399" : "#e2e8f0",
                    textShadow: "0 0 8px rgba(255,255,255,0.4)", animation: "floatUp 0.9s ease-out forwards" }}>
                  {f.text}
                </div>
              ))}

              {/* Center glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 45%,${extinctActive?"rgba(220,38,38,0.15)":burstActive?"rgba(6,182,212,0.12)":"rgba(139,92,246,0.10)"} 0%,transparent 65%)` }} />

              {/* ── TOP BAR: Burst progress ── */}
              <div className="absolute top-2.5 left-3 right-3 flex items-center gap-2">
                <span className="text-[9px] font-mono text-white/40 shrink-0">BURST</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-full transition-all duration-100"
                    style={{ width: `${(burstProgress / 20) * 100}%`,
                      background: burstActive ? "#06b6d4" : "linear-gradient(90deg,#7c3aed,#06b6d4)",
                      boxShadow: burstActive ? "0 0 6px rgba(6,182,212,0.8)" : "none" }} />
                </div>
                <span className="text-[9px] font-mono shrink-0" style={{ color: burstActive ? "#67e8f9" : "rgba(255,255,255,0.35)" }}>
                  {burstActive ? "⚡ AKTİF" : `${burstProgress}/20`}
                </span>
              </div>

              {/* ── CENTER: Icon + combo ring ── */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ top: 12 }}>
                <div className="relative text-center">
                  {/* Combo ring */}
                  {combo > 1.2 && (
                    <div className="absolute rounded-full pointer-events-none"
                      style={{ inset: -12, border: `2px solid rgba(251,146,60,${Math.min(0.8,(combo-1)*0.3)})`,
                        borderRadius: "50%", filter: `blur(${(combo-1)*1.5}px)`,
                        boxShadow: `0 0 ${(combo-1)*8}px rgba(251,146,60,0.4)` }} />
                  )}
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ inset: -18, borderRadius: "50%",
                      background: `radial-gradient(circle,${extinctActive?"rgba(220,38,38,0.32)":burstActive?"rgba(6,182,212,0.28)":"rgba(139,92,246,0.20)"} 0%,transparent 70%)`,
                      filter: "blur(10px)" }} />
                  {extinctActive
                    ? <AlertTriangle className="relative mx-auto" style={{ width: 42, height: 42, color:"rgba(248,113,113,0.92)", filter:"drop-shadow(0 0 8px rgba(220,38,38,0.6))" }} />
                    : <Telescope className="relative mx-auto" style={{ width: 42, height: 42, color:"rgba(255,255,255,0.92)", filter:`drop-shadow(0 0 10px ${burstActive?"rgba(6,182,212,0.7)":"rgba(167,139,250,0.5)"})` }} />}
                  <div className="relative mt-1 text-[10px] font-semibold tracking-wide"
                    style={{ color: extinctActive?"#fca5a5":burstActive?"#67e8f9":"rgba(255,255,255,0.75)" }}>
                    {extinctActive ? `☄️ Yok Oluş! -%60 (${extinctSec}sn)` : !ambStarted ? "Dokun ♪" : "Topla"}
                  </div>
                </div>
              </div>

              {/* ── COMBO badge ── */}
              {combo > 1.2 && !extinctActive && (
                <div className="absolute top-8 right-3 flex items-center gap-1 px-2 py-0.5 rounded-xl"
                  style={{ background:"rgba(251,146,60,0.2)", border:"1px solid rgba(251,146,60,0.4)",
                    boxShadow:`0 0 ${combo*4}px rgba(251,146,60,0.4)` }}>
                  <Flame className="w-3 h-3 text-orange-300" />
                  <span className="text-[11px] font-bold text-orange-200" style={{ textShadow:"0 0 6px rgba(251,146,60,0.8)" }}>
                    x{combo.toFixed(1)}
                  </span>
                </div>
              )}

              {/* ── BOTTOM BAR: Smart target ── */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-2"
                style={{ background: "linear-gradient(to top,rgba(0,0,0,0.5),transparent)", borderRadius: "0 0 1.6rem 1.6rem" }}>
                {extinctActive ? (
                  <span className="text-[10px] text-red-300 flex-1 text-center font-semibold">Üretim -%60 — {extinctSec}sn kaldı</span>
                ) : pinnedDisc && !unlocked[pinnedId] ? (
                  <>
                    <span className="text-[9px]">📍</span>
                    <span className="text-[10px] text-white/70 truncate flex-1">{pinnedDisc.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width:`${pinnedPct}%`, background:"#a78bfa" }} />
                      </div>
                      {pinnedEta !== null && pinnedEta > 0 && (
                        <span className="text-[9px] font-mono" style={{ color:"#a78bfa" }}>~{fmtEta(pinnedEta)}</span>
                      )}
                      {pinnedEta === 0 && <span className="text-[9px] text-emerald-300 font-bold">✓ Hazır!</span>}
                    </div>
                  </>
                ) : nextAffordable ? (
                  <>
                    <span className="text-[9px] text-emerald-400">✓</span>
                    <span className="text-[10px] text-emerald-300 truncate flex-1 font-semibold">{nextAffordable.name} — satın alınabilir!</span>
                  </>
                ) : (() => {
                    const nearestDisc = DISCOVERIES
                      .filter(d => isAvailable(d) && !unlocked[d.id])
                      .sort((a, b) => discountedCost(a.uc) - discountedCost(b.uc))[0];
                    if (!nearestDisc) return <span className="text-[10px] text-white/30 flex-1 text-center">Tüm keşifler açık</span>;
                    const eta = timeToAfford(discountedCost(nearestDisc.uc));
                    return (
                      <>
                        <span className="text-[9px] text-white/40">▶</span>
                        <span className="text-[10px] text-white/60 truncate flex-1">{nearestDisc.name}</span>
                        <span className="text-[9px] font-mono shrink-0" style={{ color:"#a78bfa" }}>~{fmtEta(eta)}</span>
                      </>
                    );
                  })()
                }
              </div>
            </button>

            {/* Event banner */}
            {activeEvent && activeEvent.dur > 0 && (
              <div className="shrink-0 rounded-2xl px-3 py-2 flex items-center gap-2 text-[11px] font-semibold"
                style={{
                  background: "linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  animation: "eventGlow 1.5s ease-in-out infinite",
                }}>
                <span className="text-lg">{activeEvent.icon}</span>
                <span className="flex-1">{activeEvent.name}: {activeEvent.desc}</span>
                <span className="rounded-lg px-1.5 py-0.5 text-[10px] font-bold"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  {eventSec}sn
                </span>
              </div>
            )}

            {/* Progress bar */}
            <div className="shrink-0">
              <div className="flex justify-between text-[10px] text-white/40 mb-1.5 font-mono">
                <span>⬡ {done}/{DISCOVERIES.length} · {pct}% · 🌿 {totalBranchDone}</span>
                {autoUpgrade && bestUpgrade && (
                  <span className="flex items-center gap-1" style={{ color: "#6ee7b7" }}>
                    <Target className="w-3 h-3" /> Auto: {bestUpgrade.name.slice(0, 12)}
                  </span>
                )}
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7c3aed, #2563eb, #0891b2, #059669)" }}>
                  <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)", backgroundSize: "200% 100%", animation: "headerShimmer 2s linear infinite" }} />
                </div>
              </div>
            </div>

            {/* Batch upgrade buttons */}
            {(affordableUpgrades.length > 0 || affordableDiscs.length > 0) && (
              <div className="shrink-0 flex gap-1.5">
                {affordableDiscs.length > 0 && (
                  <button onClick={() => {
                    affordableDiscs.forEach(d => unlockDisc(d));
                  }} className="flex-1 py-1.5 rounded-2xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                    style={{ background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.35)", color:"#6ee7b7" }}>
                    <span>🔬</span> {affordableDiscs.length} Keşif Al
                  </button>
                )}
                {affordableUpgrades.length > 0 && (
                  <button onClick={() => handleBatchUpgrade(null)}
                    className="flex-1 py-1.5 rounded-2xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                    style={{ background: batchFlash?"rgba(96,165,250,0.28)":"rgba(96,165,250,0.12)", border:`1px solid rgba(96,165,250,${batchFlash?0.6:0.3})`, color:"#93c5fd" }}>
                    <ArrowUpCircle className="w-3.5 h-3.5" /> Tümünü Artır ({affordableUpgrades.length})
                  </button>
                )}
              </div>
            )}

            {/* Prestige button */}
            {(canPrestige || canBigPrestige) && (
              <button onClick={() => openPrestige(canBigPrestige)}
                className="w-full rounded-2xl py-2 text-[12px] font-bold flex items-center justify-center gap-2 shrink-0 transition-all"
                style={{
                  background: canBigPrestige
                    ? "linear-gradient(135deg,rgba(251,146,60,0.25),rgba(251,146,60,0.10))"
                    : "linear-gradient(135deg,rgba(250,204,21,0.22),rgba(250,204,21,0.08))",
                  border: canBigPrestige ? "1px solid rgba(251,146,60,0.45)" : "1px solid rgba(250,204,21,0.4)",
                  color: canBigPrestige ? "#fed7aa" : "#fef08a",
                  animation: "pulseGold 2s ease-in-out infinite",
                  backdropFilter: "blur(8px)",
                }}>
                <Trophy className="w-4 h-4" />
                {canBigPrestige ? "⭐ Büyük Prestij — Evrim yolunu seç" : "🔄 Prestij — Evrim yolunu seç"}
              </button>
            )}

            {/* Tabs */}
            <div className="shrink-0 flex rounded-2xl p-0.5 gap-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all text-[9px] relative"
                  style={activeTab === tab.id ? {
                    background: "linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                  } : { color: "rgba(255,255,255,0.45)" }}>
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && activeTab !== tab.id && (
                    <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400"
                      style={{ boxShadow: "0 0 4px rgba(248,113,113,0.8)" }} />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto min-h-0">

              {/* ── DISCOVERIES TAB ─────────────────────────────────────── */}
              {activeTab === "disc" && (
                <div className="flex flex-col gap-1.5 pb-1">
                  {visibleDiscs.map(d => {
                    const isUnlocked = !!unlocked[d.id];
                    const avail      = isAvailable(d);
                    const lv         = levels[d.id] || 0;
                    const prod       = prodBreakdown.find(p => p.id === d.id);
                    const isBest     = bestUpgrade && bestUpgrade.id === d.id && isUnlocked;
                    const cost       = discountedCost(d.uc);
                    const hasCapsule = !!capsules[d.id];
                    const isPinned   = pinnedId === d.id;
                    const eta        = !isUnlocked && avail ? timeToAfford(cost) : null;
                    const gain       = isUnlocked ? upgradeGain(d) : 0;
                    const canAfford  = !isUnlocked && avail && gp >= cost;
                    return (
                      <button key={d.id} onClick={() => handleDiscoveryCardClick(d)}
                        className="text-left rounded-2xl p-2.5 transition-all shrink-0 touch-manipulation"
                        style={{
                          background: selectedId === d.id
                            ? "linear-gradient(135deg,rgba(96,165,250,0.18),rgba(96,165,250,0.06))"
                            : isPinned
                              ? "linear-gradient(135deg,rgba(167,139,250,0.15),rgba(0,0,0,0.3))"
                              : canAfford
                                ? "linear-gradient(135deg,rgba(52,211,153,0.12),rgba(0,0,0,0.3))"
                                : !avail && !isUnlocked
                                  ? "rgba(255,255,255,0.02)"
                                  : d.isExt && !isUnlocked
                                    ? "linear-gradient(135deg,rgba(220,38,38,0.12),rgba(0,0,0,0.3))"
                                    : "linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
                          border: selectedId === d.id
                            ? "1px solid rgba(96,165,250,0.35)"
                            : isPinned ? "1px solid rgba(167,139,250,0.45)"
                            : canAfford ? "1px solid rgba(52,211,153,0.35)"
                            : d.isExt && !isUnlocked ? "1px solid rgba(220,38,38,0.2)"
                            : "1px solid rgba(255,255,255,0.08)",
                          boxShadow: selectedId === d.id ? "0 0 12px rgba(96,165,250,0.15)"
                            : canAfford ? "0 0 8px rgba(52,211,153,0.12)"
                            : "none",
                          opacity: !avail && !isUnlocked ? 0.4 : 1,
                          animation: isBest && isUnlocked ? "cardSelectGlow 2.5s ease-in-out infinite" : "none",
                        }}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center relative ${d.isExt && !isUnlocked ? "bg-red-900/30" : isUnlocked ? "bg-white/15" : canAfford ? "bg-emerald-900/30" : "bg-white/7"}`}>
                              {isUnlocked
                                ? (d.isExt ? <AlertTriangle className="w-3.5 h-3.5 text-red-300" /> : <DiscIcon type={d.icon} />)
                                : canAfford ? <span className="text-[14px]">✓</span>
                                : <Lock className="w-3.5 h-3.5 text-white/45" />}
                            </div>
                            <div className="min-w-0">
                              <div className={`font-semibold text-[12px] truncate ${d.isExt && !isUnlocked ? "text-red-200" : canAfford ? "text-emerald-200" : ""}`}>
                                {isPinned && <span className="mr-1 text-[9px] text-violet-300">📍</span>}
                                {d.qt && !isUnlocked && <span className="mr-1 text-[9px] text-violet-300">⚛️</span>}
                                {hasCapsule && <span className="mr-1 text-[9px]">📝</span>}
                                {d.name}
                                {isBest && isUnlocked && <span className="ml-1 text-[9px] text-yellow-300">★</span>}
                              </div>
                              <div className="text-[10px] text-white/40 truncate">{d.domain}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            {isUnlocked ? (
                              <>
                                <div className="text-[11px] font-semibold">Sv.{lv}</div>
                                <div className="text-[10px] text-emerald-300">+{fmtGP(prod ? prod.amount : 0)}/sn</div>
                              </>
                            ) : canAfford ? (
                              <>
                                <div className="text-[11px] font-bold text-emerald-300">Hazır!</div>
                                <div className="text-[10px] text-white/40">{fmtGP(cost)}</div>
                              </>
                            ) : (
                              <>
                                <div className={`text-[11px] font-semibold ${d.isExt ? "text-red-300" : activeEvent && activeEvent.type === "discount" ? "text-yellow-300" : ""}`}>
                                  {fmtGP(cost)}
                                </div>
                                {eta !== null && (
                                  <div className="text-[10px] font-mono" style={{ color: "#a78bfa" }}>
                                    ~{fmtEta(eta)}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Detail panel */}
                  <div className="rounded-[1.4rem] p-3 mt-1"
                    style={{ background: "linear-gradient(135deg,rgba(0,0,0,0.55),rgba(0,0,0,0.35))", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(20px)" }}>
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {selDisc.isExt ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <DiscIcon type={selDisc.icon} className="w-4 h-4" />}
                          <h2 className="font-semibold text-[13px] truncate">
                            {selDisc.name}
                            {selDisc.qt && !selUnlocked && <span className="ml-1 text-[10px] text-violet-300">⚛️</span>}
                          </h2>
                        </div>
                        <div className="mt-0.5 text-[10px] text-white/45">{selDisc.domain} · {selDisc.ct}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Pin button */}
                        {!selUnlocked && isAvailable(selDisc) && (
                          <button onClick={() => handlePin(selDisc.id)}
                            className="p-1.5 rounded-xl transition-all"
                            style={{ background: pinnedId === selDisc.id ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.08)", border: `1px solid ${pinnedId===selDisc.id?"rgba(167,139,250,0.5)":"rgba(255,255,255,0.12)"}` }}>
                            <span className="text-[13px]">{pinnedId === selDisc.id ? "📍" : "🔖"}</span>
                          </button>
                        )}
                        {/* Capsule button */}
                        <button onClick={() => { setCapsuleEdit(selDisc.id); setCapsuleText(capsules[selDisc.id] || ""); }}
                          className="shrink-0 p-1.5 rounded-xl bg-white/10 hover:bg-white/15">
                          <NotebookPen className="w-3.5 h-3.5 text-white/50" />
                        </button>
                      </div>
                    </div>

                    {selDisc.q && <p className="mt-1.5 text-[10px] text-amber-200/70 italic">"{selDisc.q}"</p>}
                    {capsules[selDisc.id] && (
                      <div className="mt-1.5 rounded-xl bg-emerald-900/25 border border-emerald-500/25 px-2.5 py-1.5 flex gap-1.5">
                        <span className="text-[10px] shrink-0">📝</span>
                        <p className="text-[10px] text-emerald-200/80">{capsules[selDisc.id]}</p>
                      </div>
                    )}

                    {/* Prereq chain */}
                    {prereqChain.length > 0 && (
                      <div className="mt-1.5 overflow-x-auto" style={{ animation: "prereqSlide 0.3s ease-out" }}>
                        <div className="flex items-center gap-1 min-w-max pb-0.5">
                          {prereqChain.map((d, i) => (
                            <Fragment key={d.id}>
                              <span onClick={() => setSelectedId(d.id)}
                                className={`cursor-pointer text-[9px] px-2 py-0.5 rounded-full ${unlocked[d.id] ? "bg-emerald-900/40 text-emerald-300" : "bg-white/8 text-white/35"}`}>
                                {d.name.length > 12 ? d.name.slice(0, 11) + "…" : d.name}
                              </span>
                              {i < prereqChain.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-white/20 shrink-0" />}
                            </Fragment>
                          ))}
                          <ChevronRight className="w-2.5 h-2.5 text-white/40 shrink-0" />
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300">
                            {selDisc.name.length > 12 ? selDisc.name.slice(0, 11) + "…" : selDisc.name}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    {selDisc.isExt && !selUnlocked ? (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button onClick={() => unlockDisc(selDisc, false)}
                          disabled={!isAvailable(selDisc) || gp < discountedCost(selDisc.uc)}
                          className="rounded-2xl bg-red-400 text-black font-semibold py-2 text-[11px] disabled:bg-white/12 disabled:text-white/30 disabled:cursor-not-allowed">
                          ☄️ Yaşa · {fmtGP(discountedCost(selDisc.uc))}
                        </button>
                        <button onClick={() => unlockDisc(selDisc, true)}
                          disabled={!isAvailable(selDisc) || gp < selDisc.uc * 5}
                          className="rounded-2xl bg-emerald-500 text-black font-semibold py-2 text-[11px] disabled:bg-white/12 disabled:text-white/30 disabled:cursor-not-allowed">
                          🛡️ Önle · {fmtGP(selDisc.uc * 5)}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {!selUnlocked ? (
                          <button onClick={() => unlockDisc(selDisc)}
                            disabled={!isAvailable(selDisc) || gp < discountedCost(selDisc.uc)}
                            className="rounded-2xl font-semibold py-2 text-[12px] disabled:bg-white/12 disabled:text-white/30 disabled:cursor-not-allowed"
                            style={{ background: gp >= discountedCost(selDisc.uc) ? "#ffffff" : "rgba(255,255,255,0.1)", color: gp >= discountedCost(selDisc.uc) ? "#000" : "rgba(255,255,255,0.4)" }}>
                            {gp >= discountedCost(selDisc.uc)
                              ? `✓ Keşfet · ${fmtGP(discountedCost(selDisc.uc))}`
                              : `${fmtGP(discountedCost(selDisc.uc))} GP · ~${fmtEta(timeToAfford(discountedCost(selDisc.uc)))}`}
                          </button>
                        ) : (
                          <button onClick={() => upgradeDisc(selDisc)}
                            disabled={gp < levelCost(selDisc)}
                            className="rounded-2xl font-semibold py-2 text-[12px] disabled:bg-white/12 disabled:text-white/30 disabled:cursor-not-allowed flex flex-col items-center justify-center transition-all"
                            style={{ background: gp >= levelCost(selDisc) ? "rgba(52,211,153,0.85)" : "rgba(255,255,255,0.08)", color: gp >= levelCost(selDisc) ? "#000" : "rgba(255,255,255,0.3)" }}>
                            <span className="flex items-center gap-1"><ArrowUpCircle className="w-3.5 h-3.5" /> Sv.{selLevel+1} · {fmtGP(levelCost(selDisc))}</span>
                            {upgradeGain(selDisc) > 0 && <span className="text-[9px] opacity-70">+{fmtGP(upgradeGain(selDisc))}/sn kazanç</span>}
                          </button>
                        )}
                        <div className="rounded-2xl bg-white/8 border border-white/10 px-2.5 py-2">
                          <div className="text-[10px] text-white/38">Üretim</div>
                          <div className="text-[12px] font-semibold text-emerald-300">
                            +{fmtGP(prodBreakdown.find(p => p.id === selDisc.id) ? prodBreakdown.find(p => p.id === selDisc.id).amount : 0)}/sn
                          </div>
                          {selUnlocked && isBestSel && <div className="text-[8px] text-yellow-300 mt-0.5">★ En verimli</div>}
                        </div>
                      </div>
                    )}

                    <div className="mt-1.5 rounded-2xl bg-white/[0.05] border border-white/10 px-2.5 py-1.5 flex gap-2">
                      <Info className="w-3.5 h-3.5 text-white/35 shrink-0 mt-0.5" />
                      <div className="text-[10px] text-white/50">{selDisc.ms}</div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-white/38">
                      <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                      <div className="truncate">{log[0]}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRODUCTION TAB ──────────────────────────────────────── */}
              {activeTab === "prod" && (
                <div className="flex flex-col gap-1.5 pb-1">
                  <div className="text-[10px] text-white/40 mb-1">+{fmtGP(gpsPerSec)}/sn · Ana: {prodBreakdown.length} · Dal: {branchProd.length}</div>
                  {[...allProd].sort((a, b) => b.amount - a.amount).map((d, i) => {
                    const share      = Math.min(100, (d.amount / totalProd) * 100);
                    const isBranch   = !!d.branchId;
                    const accentColor = isBranch ? d.accent : "#34d399";
                    return (
                      <div key={d.id} className={`rounded-2xl border p-2.5 ${isBranch ? "bg-blue-950/30 border-blue-500/20" : "bg-white/[0.05] border-white/10"}`}>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] text-white/30 w-4 shrink-0">#{i + 1}</span>
                            <div className="min-w-0">
                              <div className="text-[12px] font-semibold truncate">
                                {d.name}
                                {isBranch && <span className="ml-1 text-[9px] opacity-60">🌿</span>}
                              </div>
                              <div className="text-[10px] text-white/40">Sv.{d.lv}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[11px] font-semibold" style={{ color: accentColor }}>+{fmtGP(d.amount)}/sn</div>
                            <div className="text-[10px] text-white/35">%{share.toFixed(1)}</div>
                          </div>
                        </div>
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${share}%`, background: accentColor }} />
                        </div>
                      </div>
                    );
                  })}
                  {allProd.length === 0 && <div className="text-center text-white/30 text-sm mt-8">Henüz üretim yok.</div>}
                </div>
              )}

              {/* ── QUESTS TAB ───────────────────────────────────────────── */}
              {activeTab === "quests" && (
                <div className="flex flex-col gap-2 pb-1">
                  <div className="rounded-2xl bg-violet-900/25 border border-violet-500/25 p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-violet-300/70">Karanlık Madde</div>
                      <div className="text-xl font-bold text-violet-200">◆ {Math.floor(dm)}</div>
                    </div>
                    <div className="text-[10px] text-white/40 text-right">Görev · Prestij<br />Dal keşfi · Fermi</div>
                  </div>
                  <div className="text-[11px] font-semibold text-white/60">Aktif Görevler</div>
                  {quests.map(aq => {
                    const q    = QUESTS.find(x => x.id === aq.questId);
                    if (!q) return null;
                    const prog = Math.min(getQuestProg(aq), q.obj.tgt);
                    const pct2 = Math.min(100, (prog / q.obj.tgt) * 100);
                    const done2 = prog >= q.obj.tgt;
                    return (
                      <div key={aq.questId} className={`rounded-2xl border p-3 ${done2 ? "bg-emerald-900/25 border-emerald-500/30" : "bg-white/[0.05] border-white/10"} ${aq.completed ? "opacity-50" : ""}`}>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg">{q.icon}</span>
                            <div className="min-w-0">
                              <div className="text-[12px] font-semibold truncate">{q.name}</div>
                              <div className="text-[10px] text-white/45">{q.desc}</div>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-[11px] font-bold text-violet-300">+{q.reward.val}◆</div>
                            <div className="text-[10px] text-white/35">{Math.floor(prog)}/{q.obj.tgt}</div>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${done2 ? "bg-emerald-400" : "bg-violet-400"}`}
                            style={{ width: `${pct2}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-[11px] font-semibold text-white/60 mt-1">Karanlık Madde Mağazası</div>
                  {DM_UP.map(up => {
                    const cur   = dmUpgrades[up.id] || 0;
                    const maxed = cur >= up.max;
                    return (
                      <button key={up.id} onClick={() => buyDmUpgrade(up)} disabled={maxed || dm < up.cost}
                        className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${maxed ? "bg-white/5 border-white/8 opacity-50" : dm >= up.cost ? "bg-violet-900/20 border-violet-500/25 hover:bg-violet-900/30" : "bg-white/5 border-white/10"}`}>
                        <span className="text-lg shrink-0">{up.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-semibold truncate">{up.name}</div>
                          <div className="text-[10px] text-white/45">{up.desc}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] font-bold text-violet-300">{maxed ? "MAX" : `◆ ${up.cost}`}</div>
                          <div className="text-[10px] text-white/35">{cur}/{up.max}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── SCIENCE TAB ──────────────────────────────────────────── */}
              {activeTab === "sci" && (
                <div className="flex flex-col gap-2 pb-1">
                  <div className="text-[11px] font-semibold text-white/60">Bilim İnsanları ({unlockedScientists.length}/{SCIENTISTS.length})</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SCIENTISTS.map(s => {
                      const isActive = !!unlocked[s.link];
                      const linkDisc = DISCOVERIES.find(d => d.id === s.link);
                      return (
                        <div key={s.id} className={`rounded-2xl border p-2.5 ${isActive ? "bg-white/12 border-white/20" : "bg-white/[0.04] border-white/8 opacity-55"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{isActive ? s.icon : "❓"}</span>
                            <div className="min-w-0">
                              <div className="text-[11px] font-semibold truncate">{isActive ? s.name : "???"}</div>
                            </div>
                          </div>
                          {isActive ? (
                            <>
                              <div className="text-[10px] text-white/55">{s.desc}</div>
                              <div className={`mt-1 text-[10px] font-bold ${s.type === "click" ? "text-yellow-300" : "text-cyan-300"}`}>
                                {s.type === "click" ? "Tıklama" : "Pasif"} +{Math.round(s.val * 100)}%
                              </div>
                            </>
                          ) : (
                            <div className="text-[10px] text-white/35">Kilit: {linkDisc ? linkDisc.name : "?"}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {fermiAvail ? (
                    <>
                      <div className="text-[11px] font-semibold text-white/60 mt-1">🌌 Fermi Paradoksu</div>
                      {FERMI.map(f => {
                        const isUnlocked = !!fermiUnlocked[f.id];
                        const avail      = f.req.every(id => unlocked[id] || fermiUnlocked[id]);
                        return (
                          <button key={f.id} onClick={() => unlockFermi(f)} disabled={isUnlocked || !avail || dm < f.cost}
                            className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${isUnlocked ? "bg-violet-900/25 border-violet-500/30" : avail && dm >= f.cost ? "bg-white/8 border-white/15 hover:bg-white/12" : "bg-white/[0.03] border-white/8 opacity-50"}`}>
                            <span className="text-lg shrink-0">{f.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px] font-semibold truncate">{f.name}</div>
                            </div>
                            <div className="text-right shrink-0">
                              {isUnlocked
                                ? <div className="text-[10px] text-emerald-300 font-bold">+{Math.round(f.gpsB * 100)}%</div>
                                : <div className="text-[11px] font-bold text-violet-300">◆{f.cost}</div>}
                            </div>
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-4 text-center">
                      <div className="text-2xl mb-2">🌌</div>
                      <div className="text-[11px] text-white/40">Fermi Paradoksu<br />Elektrik Şebekesi açılınca aktif</div>
                    </div>
                  )}
                </div>
              )}

              {/* ── SYSTEM TAB ───────────────────────────────────────────── */}
              {activeTab === "sys" && (
                <div className="flex flex-col gap-2 pb-1">
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Oyun Süresi",    value: fmtTime(playtime),               color: "#93c5fd" },
                      { label: "Tıklama",         value: fmtGP(stats.clicks),             color: "#6ee7b7" },
                      { label: "Max Combo",       value: `x${stats.maxCombo.toFixed(1)}`, color: "#fbbf24" },
                      { label: "Yükseltme",       value: fmtGP(stats.levelUps),           color: "#a78bfa" },
                      { label: "Yok Oluş",        value: `${stats.extincts}`,             color: "#f87171" },
                      { label: "Prestij",         value: `${totalPrestiges}x`,            color: "#fde68a" },
                      { label: "Dal Keşifleri",   value: `${totalBranchDone}`,            color: "#34d399" },
                      { label: "Aktif Dal",       value: `${activeBranches.length}/${BRANCHES.length}`, color: "#67e8f9" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="rounded-2xl p-2.5 relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${color}18, rgba(0,0,0,0.2))`,
                          border: `1px solid ${color}28`,
                          backdropFilter: "blur(8px)",
                        }}>
                        <div className="text-[9px] uppercase tracking-wide font-mono" style={{ color, opacity: 0.65 }}>{label}</div>
                        <div className="text-[14px] font-bold mt-0.5 text-white">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Auto-upgrade toggle */}
                  <div className="rounded-2xl bg-white/8 border border-white/10 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-[12px] font-semibold">Otomatik Yükseltme</div>
                        <div className="text-[10px] text-white/40">En verimli keşifi otomatik sever</div>
                      </div>
                      <button onClick={() => setAutoUpgrade(v => !v)}
                        className={`w-11 h-6 rounded-full border transition-colors ${autoUpgrade ? "bg-emerald-400 border-emerald-300" : "bg-white/15 border-white/20"}`}>
                        <div className={`w-4 h-4 rounded-full bg-white mx-1 transition-transform ${autoUpgrade ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                    {bestUpgrade && (
                      <div className="rounded-xl bg-white/8 p-2 flex items-center gap-2">
                        <Target className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold truncate">{bestUpgrade.name}</div>
                          <div className="text-[10px] text-white/40">{fmtGP(levelCost(bestUpgrade))} GP</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Synergies */}
                  <div className="rounded-2xl bg-white/8 border border-white/10 p-3">
                    <div className="text-[11px] font-semibold mb-2">Sinerjiler</div>
                    {SYNERGIES.map(s => {
                      const cnt    = s.ids.filter(id => unlocked[id]).length;
                      const active = s.ids.every(id => unlocked[id]);
                      return (
                        <div key={s.id} className={`rounded-xl p-2 mb-1.5 border ${active ? "bg-emerald-900/25 border-emerald-500/25" : "bg-white/5 border-white/10"}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span>{s.icon}</span>
                              <span className="text-[11px] font-semibold">{s.name}</span>
                            </div>
                            <span className={`text-[10px] font-bold ${active ? "text-emerald-300" : "text-white/40"}`}>
                              {active ? `+${Math.round(s.bonus * 100)}%` : `${cnt}/${s.ids.length}`}
                            </span>
                          </div>
                          {!active && (
                            <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full rounded-full bg-blue-400/60" style={{ width: `${(cnt / s.ids.length) * 100}%` }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ═══ BRANCH STRIP (bottom) ═══ */}
          <div className="shrink-0 px-3 pb-3 pt-1.5">
            {activeBranches.length > 0 ? (
              <div>
                {/* Strip header */}
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-400/70" style={{ animation: "hudBlink 2.5s ease-in-out infinite" }} />
                  <div className="text-[9px] uppercase tracking-[.22em] text-white/35 font-mono">
                    Büyük Keşifler · {activeBranches.length} dal · {totalBranchDone} türev
                  </div>
                </div>

                {/* Branch cards row */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {activeBranches.map(branch => {
                    const childCount    = branch.children.length;
                    const unlockedCount = branch.children.filter(c => branchUnlocked[c.id]).length;
                    const allDone       = unlockedCount === childCount;
                    const totalBGps     = branchProd.filter(p => p.branchId === branch.id).reduce((s, p) => s + p.amount, 0);
                    const isActive      = activeBranchId === branch.id;
                    return (
                      <button key={branch.id}
                        onClick={() => { setActiveBranchId(isActive ? null : branch.id); if (!isActive) play("branch"); }}
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl shrink-0 transition-all"
                        style={{
                          minWidth: 72,
                          background: isActive
                            ? `linear-gradient(135deg, ${branch.accent}28, ${branch.accent}0a)`
                            : "linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))",
                          border: isActive
                            ? `1px solid ${branch.accent}55`
                            : "1px solid rgba(255,255,255,0.10)",
                          boxShadow: isActive
                            ? `0 0 16px ${branch.accent}33, inset 0 1px 0 rgba(255,255,255,0.08)`
                            : allDone
                              ? `0 0 8px ${branch.accent}22`
                              : "none",
                          backdropFilter: "blur(10px)",
                          animation: !allDone && !isActive && unlockedCount > 0 ? "branchGlow 3s ease-in-out infinite" : "none",
                        }}>
                        <div className="text-[20px]" style={{ filter: isActive ? `drop-shadow(0 0 6px ${branch.accent}88)` : "none" }}>
                          {branch.icon}
                        </div>
                        <div className="text-[9px] font-semibold text-center leading-tight max-w-[64px] text-white/85">{branch.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="text-[8px] font-mono" style={{ color: allDone ? branch.accent : "rgba(255,255,255,0.4)" }}>
                            {unlockedCount}/{childCount}
                          </div>
                          {totalBGps > 0 && (
                            <div className="text-[8px] font-bold" style={{ color: branch.accent }}>
                              +{fmtGP(totalBGps)}/sn
                            </div>
                          )}
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-1 rounded-full overflow-hidden mt-0.5" style={{ background: "rgba(255,255,255,0.1)" }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(unlockedCount / childCount) * 100}%`, background: branch.accent,
                              boxShadow: unlockedCount > 0 ? `0 0 4px ${branch.accent}88` : "none" }} />
                        </div>
                        {isActive && <ChevronUp className="w-3 h-3 mt-0.5" style={{ color: branch.accent }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-[10px] text-white/20 py-1 font-mono tracking-wide">
                🌿 Büyük keşifler açıldıkça dallar belirir
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
