// API olmadan çalışan demo plan örnekleri
export const getDemoLearningPlan = (learningStyle, topic, hoursPerWeek, weeks) => {
  // Öğrenme stiline göre aktivite örnekleri
  const styleActivities = {
    visual: [
      { title: "Video İçerik", description: "Konuyla ilgili eğitim videoları izleyerek temel kavramları öğrenme", type: "Video" },
      { title: "İnfografik İnceleme", description: "Görsel özet ve infografikler ile konuyu pekiştirme", type: "Görsel Materyal" },
      { title: "Beyin Haritası", description: "Öğrenilen kavramları görsel olarak haritalandırma ve bağlantılar kurma", type: "Görsel Çalışma" },
      { title: "Animasyon Öğretici", description: "Etkileşimli animasyonlar ile kavramları görselleştirme", type: "Animasyon" },
      { title: "Görsel Sunu", description: "Konuyu görsel bir sunum şeklinde hazırlama ve inceleme", type: "Sunum" }
    ],
    auditory: [
      { title: "Sesli Anlatım", description: "Podcast veya sesli kitap ile konuyu dinleyerek öğrenme", type: "Ses" },
      { title: "Grup Tartışması", description: "Konuyu sesli olarak tartışma ve fikirlerini paylaşma", type: "Tartışma" },
      { title: "Sesli Tekrar", description: "Öğrenilen kavramları yüksek sesle tekrar ederek pekiştirme", type: "Tekrar" },
      { title: "Podcast Dinleme", description: "Uzmanların konuşmalarını dinleyerek farklı perspektifler kazanma", type: "Podcast" },
      { title: "Sesli Özet", description: "Öğrenilen bilgileri sesli olarak özetleme ve kaydetme", type: "Özet" }
    ],
    kinesthetic: [
      { title: "Pratik Uygulama", description: "Öğrenilen kavramları gerçek dünya senaryolarında uygulama", type: "Uygulama" },
      { title: "Simülasyon", description: "İnteraktif simülasyonlar ile konuyu deneyimleme", type: "Simülasyon" },
      { title: "Rol Yapma", description: "Konuyu canlandırarak ve rol yaparak öğrenme", type: "Rol Yapma" },
      { title: "Model Oluşturma", description: "Kavramları temsil eden fiziksel modeller oluşturma", type: "Model" },
      { title: "Etkileşimli Çalışma", description: "Konuyu hareket ve fiziksel aktivitelerle ilişkilendirme", type: "Etkileşim" }
    ],
    reading: [
      { title: "Makale Okuma", description: "Akademik makaleler ve kaynaklar okuyarak kavramları öğrenme", type: "Okuma" },
      { title: "Not Alma", description: "Okurken detaylı notlar alma ve özetleme", type: "Not Alma" },
      { title: "Yazılı Ödev", description: "Konuyla ilgili yazılı bir ödev veya rapor hazırlama", type: "Yazma" },
      { title: "Literatür Taraması", description: "Farklı kaynaklardan bilgi toplayıp karşılaştırma", type: "Araştırma" },
      { title: "Kavram Haritası", description: "Okunan kavramları yazılı olarak haritalandırma", type: "Kavram Haritası" }
    ]
  };

  // Genel aktiviteler
  const commonActivities = [
    { title: "Değerlendirme Testi", description: "Öğrenilen bilgileri ölçmek için kısa bir değerlendirme", type: "Test" },
    { title: "Konu Tekrarı", description: "Hafta boyunca öğrenilen kavramların genel tekrarı", type: "Tekrar" },
    { title: "Pratik Alıştırma", description: "Konuyu pekiştirmeye yönelik pratik alıştırma", type: "Alıştırma" }
  ];

  // Öğrenme stillerine göre sertifika önerileri
  const styleCertifications = {
    visual: [
      `Udemy Video Kursu: "${topic} Temelleri" - Görsel öğrenenler için özel olarak hazırlanmış, bol ekran görüntüleri ve video anlatımları içeren sertifika programı`,
      `Coursera Görsel Eğitim Sertifikası: "${topic} için Görsel Öğrenme Yolu" - İnteraktif videolar ve görsel laboratuvarlar içeren kapsamlı program`,
      `YouTube Learning Path: "${topic} Video Serisi" - Görsel öğrenenler için adım adım video eğitimleri ve görsel alıştırmalar`
    ],
    auditory: [
      `Audible Eğitim Programı: "${topic} Sesli Anlatım Kursu" - Tamamen sesli anlatıma dayalı, dinleyerek öğrenmeye odaklı sertifika programı`,
      `Podcast Akademisi: "${topic} Podcast Serisi" - Profesyonel eğitmenlerle sesli tartışma ve anlatımlara dayalı program`,
      `Sesli Webinar Sertifikası: "${topic} için İnteraktif Ses Eğitimi" - Canlı sesli eğitimler ve grup tartışmalarıyla öğrenme`
    ],
    kinesthetic: [
      `Pratik Workshop Sertifikası: "${topic} Uygulamalı Eğitim Kampı" - Tamamen uygulamalı, fiziksel aktivitelerle desteklenmiş sertifika programı`,
      `Bootcamp Sertifikası: "${topic} için Pratik Çalışma Grubu" - Yoğun uygulamalı projeler ve fiziksel aktivitelerle öğrenme`,
      `Simülasyon Tabanlı Sertifika: "${topic} Deneyimsel Öğrenme Programı" - Gerçek dünya simülasyonları ve etkileşimli uygulama odaklı`
    ],
    reading: [
      `Akademik Sertifika: "${topic} Literatür Programı" - Kapsamlı okuma materyalleri ve yazılı ödevlerle ilerleyen sertifika`,
      `Dokümantasyon Odaklı Kurs: "${topic} için Yazılı Rehber ve Sertifika" - Detaylı eğitim dokümanları ve yazılı sınavlara dayalı`,
      `Research-Based Sertifika: "${topic} Araştırma ve Yazma Programı" - Akademik makaleler ve yazılı projelerle öğrenme`
    ]
  };

  // Öğrenme stiline göre aktivite havuzu
  const activityPool = styleActivities[learningStyle] || styleActivities.visual;

  // Haftaları oluştur
  const weekPlans = Array.from({ length: weeks }, (_, weekIndex) => {
    // Her hafta için 2-3 aktivite seç
    const weekActivities = [];
    
    // Ana stilden 1-2 aktivite
    const numStyleActivities = Math.min(weekIndex < weeks / 2 ? 2 : 1, activityPool.length);
    for (let i = 0; i < numStyleActivities; i++) {
      const activityIndex = (weekIndex + i) % activityPool.length;
      const activity = activityPool[activityIndex];
      
      // Zorluk seviyesi belirle (haftalar ilerledikçe zorluk artsın)
      const difficulty = weekIndex < weeks / 3 ? "Başlangıç" : 
                         weekIndex < (2 * weeks) / 3 ? "Orta" : "İleri";
      
      // Aktivite tips - öğrenme stiline özel ipuçları
      const styleTips = {
        visual: [`${activity.title} aktivitesi için görsel öğrenme ipucu: Konuyu şekiller ve diyagramlarla görselleştirin`],
        auditory: [`${activity.title} aktivitesi için işitsel öğrenme ipucu: Öğrendiklerinizi sesli olarak tekrar edin`],
        kinesthetic: [`${activity.title} aktivitesi için kinestetik öğrenme ipucu: Pratik uygulamalarla kavramları pekiştirin`],
        reading: [`${activity.title} aktivitesi için okuma/yazma öğrenme ipucu: Öğrendiklerinizi yazarak tekrar edin`]
      };
      
      // Beklenen kazanımlar
      const expectedOutcomes = [
        `${topic} konusunda ${activity.type.toLowerCase()} yoluyla temel kavramları öğrenme`,
        `${activity.description.split('.')[0].toLowerCase()} becerisini geliştirme`
      ];
      
      // Öğrenme stiline uygun kaynaklar
      const styleResources = {
        visual: [
          `YouTube: "${topic} Görsel Eğitim Serisi" - Video dersleri`,
          `Udemy: "${activity.title} için Görsel Rehber" - İnteraktif görsel kurs`
        ],
        auditory: [
          `Spotify: "${topic} Podcast Serisi" - Sesli anlatım`,
          `Audible: "${activity.title} Sesli Kitabı" - Detaylı sesli anlatım`
        ],
        kinesthetic: [
          `Pratik Uygulama Platformu: "${topic} İnteraktif Çalışması" - Uygulamalı alıştırmalar`,
          `Workshop: "${activity.title} için Pratik Etkinlikler" - Etkileşimli aktiviteler`
        ],
        reading: [
          `Akademik Makale: "${topic} Üzerine Kapsamlı İnceleme" - PDF dokümanı`,
          `E-Kitap: "${activity.title} için Yazılı Rehber" - Detaylı okuma materyali`
        ]
      };
      
      weekActivities.push({
        title: `${activity.title}: ${topic} - Bölüm ${weekIndex + 1}`,
        description: `${activity.description}. ${topic} konusunun ${weekIndex + 1}. haftasına uygun içerik.`,
        type: activity.type,
        duration: `${Math.max(1, Math.floor(hoursPerWeek / 3))} saat`,
        difficulty: difficulty,
        expectedOutcomes: expectedOutcomes,
        resources: styleResources[learningStyle] || styleResources.visual,
        learningStyleTips: styleTips[learningStyle] || styleTips.visual
      });
    }
    
    // Ortak aktivitelerden 1 tane ekle
    const commonActivity = commonActivities[weekIndex % commonActivities.length];
    weekActivities.push({
      title: `${commonActivity.title}: ${topic} - Hafta ${weekIndex + 1}`,
      description: `${commonActivity.description}. Bu haftanın konuları üzerine odaklanır.`,
      type: commonActivity.type,
      duration: `${Math.max(1, Math.floor(hoursPerWeek / 3))} saat`,
      difficulty: "Orta",
      expectedOutcomes: [`${topic} konusunda öğrenilen bilgilerin pekiştirilmesi`, "Eksik noktaların tespit edilmesi"],
      resources: [
        `${learningStyle === 'visual' ? 'İnteraktif görsel quiz platformu' : 
          learningStyle === 'auditory' ? 'Sesli tekrar uygulaması' :
          learningStyle === 'kinesthetic' ? 'Pratik uygulama platformu' : 'Yazılı pratik testi'}`,
        `${topic} için ${learningStyle} öğrenme stiline uygun değerlendirme aracı`
      ]
    });
    
    return {
      weekNumber: weekIndex + 1,
      weekTitle: `${topic} - Hafta ${weekIndex + 1}`,
      weekDescription: `${topic} konusunun ${weekIndex + 1}. haftasında ${weekIndex < weeks / 2 ? 'temel kavramlar' : 'ileri seviye konular'} ele alınacaktır.`,
      activities: weekActivities,
      weekSummary: `${weekIndex + 1}. haftada ${topic} konusunun ${weekIndex < weeks / 2 ? 'temel' : 'ileri'} kavramları üzerinde duruldu. Öğrenilen konuların pekiştirilmesi için tekrar yapılması faydalı olacaktır.`,
      reflectionQuestions: [
        `Bu hafta öğrendiğiniz ${topic} konusundaki en önemli kavram neydi?`,
        `${topic} konusunda hangi alanlarda daha fazla pratik yapmanız gerekiyor?`,
        `Öğrendiğiniz bilgileri günlük hayatta nasıl uygulayabilirsiniz?`
      ]
    };
  });

  // Öğrenme stiline uygun sertifikalar
  const certifications = styleCertifications[learningStyle] || styleCertifications.visual;

  // Öğrenme stili açıklamaları
  const learningStyleSummaries = {
    visual: "Görsel öğrenme stili, bilgiyi görsel olarak algılamaya ve işlemeye odaklanır. Bu stil, diyagramlar, videolar, grafikler ve resimler gibi görsel yardımcılarla en iyi şekilde öğrenir. Görsel öğrenenler için, bilginin görselleştirilmesi ve görsel ipuçlarıyla desteklenmesi kritik önem taşır.",
    auditory: "İşitsel öğrenme stili, bilgiyi dinleyerek ve konuşarak en iyi şekilde işler. Bu stil, sesli anlatımlar, tartışmalar, podcast'ler ve sesli kitaplar aracılığıyla en etkili öğrenmeyi sağlar. İşitsel öğrenenler için, bilginin sesli olarak ifade edilmesi ve duyulabilir formatta sunulması önemlidir.",
    kinesthetic: "Kinestetik öğrenme stili, yaparak ve deneyimleyerek öğrenmeye odaklanır. Bu stil, pratik uygulamalar, simülasyonlar, fiziksel aktiviteler ve el becerileri gerektiren görevlerle en iyi şekilde öğrenir. Kinestetik öğrenenler için, teorinin pratiğe dökülmesi ve fiziksel etkileşim içeren aktiviteler büyük önem taşır.",
    reading: "Okuma/yazma öğrenme stili, yazılı metinler aracılığıyla en iyi şekilde öğrenir. Bu stil, kitaplar, makaleler, raporlar ve yazılı notlar gibi metin bazlı kaynaklarla en etkili öğrenmeyi sağlar. Okuma/yazma öğrenenler için, bilginin yazılı formatta sunulması ve metin odaklı çalışma stratejileri kritik önem taşır."
  };

  // Öğrenme stili ipuçları
  const learningStyleTips = {
    visual: [
      "Çalışırken renkli vurgulamalar ve işaretlemeler kullanın",
      "Kavramları akılda tutmak için görsel şemalar ve diyagramlar oluşturun",
      "Öğrendiğiniz konuları görselleştirmeye çalışın ve zihin haritaları çizin",
      "Video eğitimlerini ve görsel sunumları tercih edin",
      "Not alırken renkli kalemler ve görsel semboller kullanın"
    ],
    auditory: [
      "Öğrendiğiniz bilgileri sesli olarak tekrar edin",
      "Grup çalışmalarına ve tartışmalara katılın",
      "Ses kayıtları yapın ve düzenli olarak dinleyin",
      "Konuları kendi kendinize veya başkalarına anlatın",
      "Çalışma ortamında hafif bir fon müziği açabilirsiniz"
    ],
    kinesthetic: [
      "Öğrenirken hareket halinde olun veya kısa yürüyüşler yapın",
      "Kavramları fiziksel modeller veya nesneler üzerinde uygulayın",
      "Teorik bilgileri hemen pratiğe dökmeye çalışın",
      "Uzun çalışma oturumları yerine kısa, aktif seanslar yapın",
      "Not alırken veya problem çözerken elle yazın ve çizim yapın"
    ],
    reading: [
      "Öğrendiğiniz konuları yazılı olarak özetleyin",
      "Detaylı notlar alın ve düzenli olarak gözden geçirin",
      "Kendi kelimelerinizle açıklamalar yazın",
      "Farklı kaynaklardan yazılı materyaller okuyun",
      "Kavramları yazarak tekrar edin ve çalışma sayfaları oluşturun"
    ]
  };

  return {
    topic: topic,
    learningStyle: learningStyle,
    weeklyHours: hoursPerWeek,
    totalWeeks: weeks,
    weeks: weekPlans,
    overview: `${topic} konusunda ${learningStyle} öğrenme stiline odaklanan ${weeks} haftalık öğrenme programı.`,
    learningStyleSummary: learningStyleSummaries[learningStyle] || learningStyleSummaries.visual,
    preRequisites: [`${topic} konusunda temel bilgi`, `${learningStyle} öğrenme stiline uygun öğrenme araçları`],
    recommendedTools: [
      `${learningStyle === 'visual' ? 'Görsel not alma uygulamaları' : 
        learningStyle === 'auditory' ? 'Ses kayıt ve dinleme uygulamaları' :
        learningStyle === 'kinesthetic' ? 'Etkileşimli öğrenme platformları' : 'Not alma uygulamaları'}`,
      `${learningStyle === 'visual' ? 'Ekran kaydedici yazılımlar' : 
        learningStyle === 'auditory' ? 'Podcast uygulamaları' :
        learningStyle === 'kinesthetic' ? 'Pratik uygulama platformları' : 'E-kitap okuyucular'}`
    ],
    additionalResources: [
      `${learningStyle === 'visual' ? 'YouTube Eğitim Kanalları' : 
        learningStyle === 'auditory' ? 'İlgili Podcast Serileri' :
        learningStyle === 'kinesthetic' ? 'İnteraktif Öğrenme Platformları' : 'Akademik Makale Veritabanları'}`,
      `${learningStyle === 'visual' ? 'İnfografik Siteleri' : 
        learningStyle === 'auditory' ? 'Sesli Kitap Platformları' :
        learningStyle === 'kinesthetic' ? 'Simülasyon Araçları' : 'Dijital Kütüphaneler'}`
    ],
    nextSteps: `${topic} konusunda ileri seviye öğrenme için ${learningStyle} öğrenme stiline uygun kaynaklar`,
    certificationOptions: certifications,
    learningStyleTips: learningStyleTips[learningStyle] || learningStyleTips.visual
  };
}; 