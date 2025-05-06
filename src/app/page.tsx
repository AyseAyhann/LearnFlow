"use client";

import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDemoLearningPlan } from './handleGoalSubmit';

// Öğrenme planı için tip tanımı
interface Activity {
  title: string;
  description: string;
  type: string;
  duration: string;
  resources?: string[];
  difficulty?: string;
  expectedOutcomes?: string[];
}

interface WeekPlan {
  weekNumber: number;
  weekTitle?: string;
  weekDescription?: string;
  activities: Activity[];
  weekSummary?: string;
  reflectionQuestions?: string[];
}

interface LearningPlan {
  topic: string;
  learningStyle: string;
  weeklyHours: number;
  totalWeeks: number;
  overview?: string;
  preRequisites?: string[];
  recommendedTools?: string[];
  weeks: WeekPlan[];
  additionalResources?: string[];
  nextSteps?: string;
  certificationOptions?: string[];
  learningStyleSummary?: string;
  recommendedChannels?: { name: string; type: string; description: string; url: string }[];
}

// Öğrenme stilleri için sorular
const learningStyleQuestions = [
  {
    id: 1,
    question: "Which approach do you prefer when learning a new skill?",
    options: [
      { id: "a", text: "Watch visual guides and diagrams", type: "visual" },
      { id: "b", text: "Listen to verbal explanations", type: "auditory" },
      { id: "c", text: "Practice through trial and error", type: "kinesthetic" },
      { id: "d", text: "Read written instructions", type: "reading" },
    ]
  },
  {
    id: 2,
    question: "What do you usually do to remember something?",
    options: [
      { id: "a", text: "Visualize it as images or diagrams", type: "visual" },
      { id: "b", text: "Repeat the information to yourself", type: "auditory" },
      { id: "c", text: "Connect it with physical movements", type: "kinesthetic" },
      { id: "d", text: "Take notes and write summaries", type: "reading" },
    ]
  },
  {
    id: 3,
    question: "What do you do when you struggle to understand a topic?",
    options: [
      { id: "a", text: "Look for drawings, maps, or graphs", type: "visual" },
      { id: "b", text: "Discuss the topic with someone", type: "auditory" },
      { id: "c", text: "Learn by applying it in real life", type: "kinesthetic" },
      { id: "d", text: "Read more about the topic", type: "reading" },
    ]
  },
  {
    id: 4,
    question: "What do you enjoy doing in your free time?",
    options: [
      { id: "a", text: "Watching movies or taking photos", type: "visual" },
      { id: "b", text: "Listening to music or chatting", type: "auditory" },
      { id: "c", text: "Playing sports or doing crafts", type: "kinesthetic" },
      { id: "d", text: "Reading books or writing", type: "reading" },
    ]
  },
  {
    id: 5,
    question: "What is your preferred method for learning about a topic?",
    options: [
      { id: "a", text: "Watching videos or reviewing infographics", type: "visual" },
      { id: "b", text: "Listening to podcasts or presentations", type: "auditory" },
      { id: "c", text: "Attending workshops or experiencing it", type: "kinesthetic" },
      { id: "d", text: "Reading articles or guides", type: "reading" },
    ]
  }
];

// Gemini API ile entegrasyon - güncel model kullanıyoruz
const generateAILearningPlan = async (learningStyle: string, topic: string, hoursPerWeek: number, weeks: number): Promise<LearningPlan> => {
  try {
    // API anahtarını çevresel değişkenden al
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    
    if (!API_KEY) {
      console.error("API key not found. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.");
      throw new Error("API key is missing");
    }
    
    console.log("API key is being used from environment variables");

    const genAI = new GoogleGenerativeAI(API_KEY);
    
    try {
      // Güncel model isimlerini deniyoruz
      console.log("Gemini modelini yüklüyoruz...");
      
      // Farklı bir model ismi deneyelim - güncel model ismi
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Öğrenme stillerine göre yönlendirme ve detaylı istekler
    let styleGuidance = "";
      let styleSpecificPrompt = "";
      
    switch (learningStyle) {
      case "visual":
        styleGuidance = "görsel öğrenme stiline sahip (diyagramlar, grafikler, videolar)";
            styleSpecificPrompt = `
              GÖRSEL ÖĞRENME STİLİNE SAHİP öğrenciler için öğrenme planını tamamen optimize et:
              - HER BİR aktivite mutlaka görsel unsurlar içermeli (video eğitimler, infografikler, diyagramlar, akış şemaları)
              - Tüm açıklamalar ve kavramlar görselleştirilmiş olmalı, soyut metin açıklamaları minimumda tutulmalı
              - Önerilen kaynaklar MUTLAKA videoları, görselleri ve infografikleri olan platformlar olmalı
              - Özellikle YouTube, Khan Academy, Udemy video kursları, görsel animasyonlar, görsel kitaplar gibi kaynaklar önerilmeli
              - Düşünce haritaları, renkli kod şemaları, zaman çizelgeleri gibi görsel organizasyon araçları tavsiye edilmeli
              - Platform önerilerinde MUTLAKA demo videoları, ekran görüntüleri, görsel kod örnekleri sunanlar tercih edilmeli
              - Notlar için renkli kalemler ve görsel notlama teknikleri önerilmeli
              - İstisna olmaksızın tüm aktiviteler ve ek kaynaklar görsel ağırlıklı olarak önerilmeli

              SERTİFİKA ÖNERİLERİ HAKKINDA:
              - YALNIZCA görsel içeriği zengin kurslar ve sertifikalar öner (videolu dersler, görsel simulasyonlar, ekran kayıtları)
              - Sertifika programları mutlaka video dersler, görsel laboratuvarlar, interaktif görseller içermeli
              - Görsel öğrenen için en etkili sertifika programlarını tam isimleriyle listele
              - Adım adım ekran görüntüleri ve video eğitimlerle desteklenen sertifikalar öncelikli olmalı
              - Her sertifika önerisi için neden görsel öğrenenlere uygun olduğunu belirt
              - Sanal laboratuvarlar, görsel simülasyonlar ve interaktif görsel arayüzleri olan platformların sertifikaları tercih edilmeli

              Şunları ASLA yapma:
              - Yalnızca metin içeren kitaplar/makaleler önerme
              - Görsel olmayan platformlar önerme
              - Sertifikalar dahil tüm kaynakların görsel olması şart
              - Görsel öğrenme stili için uygun olmayan aktiviteler önerme

              EKSİKSİZ ŞEKİLDE tüm bölümlerde (aktiviteler, kaynaklar, ek kaynaklar, sertifikalar) MUTLAKA görsel odaklı içerik olmalıdır.
            `;
        break;
      case "auditory":
        styleGuidance = "işitsel öğrenme stiline sahip (sesli anlatımlar, tartışmalar, podcast'ler)";
            styleSpecificPrompt = `
              İŞİTSEL ÖĞRENME STİLİNE SAHİP öğrenciler için öğrenme planını tamamen optimize et:
              - HER BİR aktivite mutlaka sesli unsurlar içermeli (podcast'ler, sesli kitaplar, sesli anlatımlar, tartışmalar)
              - Tüm açıklamalar ve kavramlar işitsel formatta sunulmalı, yazılı metin açıklamaları minimumda tutulmalı
              - Önerilen kaynaklar MUTLAKA sesli içeriği olan platformlar olmalı (Spotify, Audible, podcast platformları)
              - Özellikle podcast'ler, sesli kurslar, webinarlar, grup tartışmaları, sesli kitaplar önerilmeli
              - Sesli tekrar teknikleri, sesli özet çıkarma yöntemleri ve yüksek sesle okuma teknikleri tavsiye edilmeli
              - Platform önerilerinde MUTLAKA sesli anlatımlar, podcast bölümleri, sesli tartışma forumları önerilmeli
              - Notlar için ses kayıt teknikleri ve düşünceleri sesli ifade etme yöntemleri vurgulanmalı
              - İstisna olmaksızın tüm aktiviteler ve ek kaynaklar işitsel ağırlıklı olarak önerilmeli

              SERTİFİKA ÖNERİLERİ HAKKINDA:
              - YALNIZCA sesli eğitim içeriği zengin sertifika programları öner
              - Sertifika programları sesli anlatımlar, sesli rehberler, grup tartışmaları ve sesli eğitimlere dayalı olmalı
              - İşitsel öğrenenler için en etkili sertifika programlarını tam isimleriyle listele
              - Podcast serileri, webinar kayıtları, sesli ders serileri ve interaktif konuşmalarla desteklenen sertifikalar öncelikli olmalı
              - Her sertifika önerisi için neden işitsel öğrenenlere uygun olduğunu belirt
              - Sözlü sınavlar, sesli projeler ve grup tartışmalarıyla değerlendirme yapan sertifika programları tercih edilmeli

              Şunları ASLA yapma:
              - Yalnızca görsel içeren kaynaklar önerme
              - İşitsel olmayan platformlar önerme
              - Sertifikalar dahil tüm kaynakların işitsel yönü olmalı
              - İşitsel öğrenme stili için uygun olmayan aktiviteler önerme

              EKSİKSİZ ŞEKİLDE tüm bölümlerde (aktiviteler, kaynaklar, ek kaynaklar, sertifikalar) MUTLAKA işitsel odaklı içerik olmalıdır.
            `;
        break;
      case "kinesthetic":
        styleGuidance = "kinestetik öğrenme stiline sahip (uygulamalı aktiviteler, deneyimsel öğrenme)";
            styleSpecificPrompt = `
              KİNESTETİK ÖĞRENME STİLİNE SAHİP öğrenciler için öğrenme planını tamamen optimize et:
              - HER BİR aktivite mutlaka fiziksel etkileşim ve uygulama içermeli (pratik egzersizler, kodlama, simülasyonlar)
              - Tüm açıklamalar ve kavramlar pratik uygulamalarla öğretilmeli, pasif öğrenme minimumda tutulmalı
              - Önerilen kaynaklar MUTLAKA pratik yapma imkanı sunan platformlar olmalı
              - Özellikle interaktif projeler, yaparak öğrenme fırsatları, uygulamalı workshop'lar önerilmeli
              - El becerisi gerektiren aktiviteler, fiziksel modelleme çalışmaları, simülasyonlar tavsiye edilmeli
              - Platform önerilerinde MUTLAKA etkileşimli kodlama platformları, pratik yapılabilen ortamlar sunulmalı
              - Notlar için fiziksel hareket içeren teknikler ve yaparak öğrenme stratejileri vurgulanmalı
              - İstisna olmaksızın tüm aktiviteler ve ek kaynaklar kinestetik, uygulamalı, etkileşimli öğrenmeye yönelik olmalı

              SERTİFİKA ÖNERİLERİ HAKKINDA:
              - YALNIZCA pratik uygulama ve el becerisi gerektiren sertifika programları öner
              - Sertifika programları mutlaka proje bazlı, uygulamalı sınavlar, fiziksel beceri gösterileri içermeli
              - Kinestetik öğrenenler için en etkili sertifika programlarını tam isimleriyle listele
              - Laboratuvar çalışmaları, pratik projeler, gerçek dünya simülasyonları içeren sertifikalar öncelikli olmalı
              - Her sertifika önerisi için neden kinestetik öğrenenlere uygun olduğunu belirt
              - Fiziksel etkileşim, gerçek teknikler uygulama ve uygulamalı beceri gösterimi gerektiren sertifikalar tercih edilmeli
              - Bootcamp tarzı, hackathon odaklı, pratik uygulamalı çalışma içeren programlar öncelikli olmalı

              Şunları ASLA yapma:
              - Yalnızca pasif izleme/dinleme gerektiren kaynaklar önerme
              - Fiziksel etkileşim içermeyen platformlar önerme
              - Sertifikalar dahil tüm kaynakların pratik uygulama yönü olmalı
              - Kinestetik öğrenme stili için uygun olmayan pasif aktiviteler önerme

              EKSİKSİZ ŞEKİLDE tüm bölümlerde (aktiviteler, kaynaklar, ek kaynaklar, sertifikalar) MUTLAKA uygulama ve etkileşim odaklı içerik olmalıdır.
            `;
        break;
      case "reading":
        styleGuidance = "okuma/yazma öğrenme stiline sahip (metinler, makaleler, notlar)";
            styleSpecificPrompt = `
              OKUMA/YAZMA ÖĞRENME STİLİNE SAHİP öğrenciler için öğrenme planını tamamen optimize et:
              - HER BİR aktivite mutlaka metin bazlı öğrenme içermeli (kitaplar, makaleler, blog yazıları, dokümantasyon)
              - Tüm açıklamalar ve kavramlar yazılı materyallerle detaylı olarak sunulmalı
              - Önerilen kaynaklar MUTLAKA kaliteli yazılı içerik sunan platformlar olmalı
              - Özellikle kapsamlı rehberler, teknik makaleler, akademik kaynaklar, e-kitaplar önerilmeli
              - Not alma, anlama haritaları çıkarma, metin özetleme teknikleri tavsiye edilmeli
              - Platform önerilerinde MUTLAKA dokümantasyon kaynakları, dijital kütüphaneler, blog serileri sunulmalı
              - Notlar için detaylı yazma ve özetleme teknikleri vurgulanmalı
              - İstisna olmaksızın tüm aktiviteler ve ek kaynaklar okuma/yazma odaklı olarak önerilmeli

              SERTİFİKA ÖNERİLERİ HAKKINDA:
              - YALNIZCA kapsamlı dokümantasyon, yazılı içerik ve metin bazlı eğitim materyalleri içeren sertifika programları öner
              - Sertifika programları mutlaka detaylı kitaplar, yazılı kılavuzlar ve kapsamlı okuma materyalleri içermeli
              - Okuma/yazma öğrenenler için en etkili sertifika programlarını tam isimleriyle listele
              - Yazılı sınavlar, makale yazımı, dokümantasyon hazırlama ve yazılı proje raporu gerektiren sertifikalar öncelikli olmalı
              - Her sertifika önerisi için neden okuma/yazma öğrenenlere uygun olduğunu belirt
              - Kapsamlı dokümantasyon, teknik kılavuzlar, akademik kitaplar ve yazılı alıştırmalar içeren programlar tercih edilmeli
              - Yazılı ödevler, araştırma raporları ve yazılı sınavlarla değerlendirilen sertifikalar öncelikli olmalı

              Şunları ASLA yapma:
              - Metin içermeyen veya az metin içeren kaynaklar önerme
              - Okuma/yazma pratiği sunmayan platformlar önerme
              - Sertifikalar dahil tüm kaynakların yazılı detaylı içeriğe sahip olması gerekir
              - Okuma/yazma öğrenme stili için uygun olmayan aktiviteler önerme

              EKSİKSİZ ŞEKİLDE tüm bölümlerde (aktiviteler, kaynaklar, ek kaynaklar, sertifikalar) MUTLAKA okuma ve yazma odaklı içerik olmalıdır.
            `;
        break;
      default:
        styleGuidance = "karma öğrenme stiline sahip";
            styleSpecificPrompt = `
              KARMA ÖĞRENME STİLİNE SAHİP öğrenciler için öğrenme planını optimize et:
              - Aktiviteler farklı öğrenme stillerine hitap eden çeşitli unsurlar içermeli
              - Her öğrenme stilinden (görsel, işitsel, kinestetik, okuma/yazma) dengeli bir şekilde aktiviteler eklenmeli
              - Önerilen kaynaklar çeşitli öğrenme stillerine hitap eden platformlardan seçilmeli
              - Her bir aktivite farklı öğrenme stillerini bir arada kullanan multimodal kaynaklar içermeli
              
              SERTİFİKA ÖNERİLERİ HAKKINDA:
              - Çeşitli öğrenme stillerine hitap eden karma sertifika programları öner
              - Hem görsel, hem işitsel, hem kinestetik, hem de okuma/yazma öğeleri içeren sertifikalar tercih edilmeli
              - Farklı öğrenme modalitelerini birleştiren, çok yönlü eğitim programları sunan sertifikalar önerilmeli
              - Esnek öğrenme yolları sunan, farklı öğrenme stillerine göre kişiselleştirilebilen sertifikalar öncelikli olmalı
            `;
    }

      // AI modeline giden prompt sonunda güçlü uyarı ekleyin
      const finalStyleWarning = `
        ÇOK ÖNEMLİ: Bu öğrenme planı ${learningStyle} öğrenme stiline sahip bir öğrenci için optimize edilmiştir.
        Planda yer alan BÜTÜN tavsiyeler, kaynaklar, aktiviteler ve sertifikalar MUTLAKA bu öğrenme stiline uygun olmalıdır.
        Her bölümde (aktiviteler, kaynaklar, ek kaynaklar, sertifikalar) istisnasız ${learningStyle} öğrenme stiline uygun içerik bulunmalıdır.
        Hiçbir bölümde bu stile uygun olmayan içerik olmamalıdır. TÜM PLAN boyunca bu stili tutarlı bir şekilde koruyun.
      `;

      // API isteği için basitleştirilmiş prompt yapısı
    const prompt = `
        Bir eğitim uzmanı olarak, ${styleGuidance} bir öğrenci için ${topic} konusunda ${weeks} haftalık mikro-öğrenme planı oluştur.
      Öğrenci haftada ${hoursPerWeek} saat ayırabilir.
      
        ${styleSpecificPrompt}
        
        Yanıtın JSON formatında olmalı ve şu yapıda alanlar içermeli:
      {
        "topic": "${topic}",
        "learningStyle": "${learningStyle}",
        "weeklyHours": ${hoursPerWeek},
        "totalWeeks": ${weeks},
          "overview": "Genel bakış...",
          "learningStyleSummary": "${learningStyle} stili özeti...",
          "preRequisites": ["Önkoşul 1", "Önkoşul 2"],
          "recommendedTools": ["Araç 1", "Araç 2"],
        "weeks": [
          {
            "weekNumber": 1,
              "weekTitle": "Hafta başlığı",
              "weekDescription": "Hafta açıklaması",
            "activities": [
              {
                "title": "Aktivite başlığı",
                "description": "Aktivite açıklaması",
                "type": "Aktivite tipi",
                  "duration": "Süre",
                  "difficulty": "Zorluk",
                  "resources": [
                    {
                      "name": "Kaynak adı",
                      "description": "Kaynak açıklaması",
                      "url": "https://example.com",
                      "type": "Video/Makale/Podcast/Uygulama"
                    }
                  ],
                  "expectedOutcomes": ["Kazanım 1", "Kazanım 2"]
          }
              ],
              "weekSummary": "Hafta özeti",
              "reflectionQuestions": ["Soru 1", "Soru 2"]
      }
          ],
          "additionalResources": [
            {
              "name": "Kaynak adı",
              "description": "Kaynak açıklaması",
              "url": "https://example.com",
              "type": "Video/Makale/Podcast/Uygulama"
            }
          ],
          "nextSteps": "Sonraki adımlar",
          "certificationOptions": [
            {
              "name": "Sertifika adı",
              "provider": "Sağlayıcı kurum",
              "description": "Sertifika açıklaması ve neden bu öğrenme stiline uygun olduğu",
              "url": "https://example.com/certification",
              "duration": "Süre bilgisi",
              "level": "Başlangıç/Orta/İleri"
            }
          ],
          "learningStyleTips": ["İpucu 1", "İpucu 2"],
          "recommendedChannels": [
            {
              "name": "Kanal/Platform adı",
              "type": "${learningStyle === "visual" ? "Video Kanalı" : 
                        learningStyle === "auditory" ? "Podcast/Sesli İçerik" :
                        learningStyle === "kinesthetic" ? "Etkileşimli Platform" : "Blog/Yazılı Kaynak"}",
              "description": "Bu kanal neden ${learningStyle} stiline uygun",
              "url": "https://example.com"
            }
          ]
        }
        
        ${finalStyleWarning}
        
        ÖNEMLİ: TAM OLARAK ${weeks} HAFTALIK bir plan oluştur. Eksik hafta kabul edilmez. Her hafta için ayrı bir weekNumber, weekTitle, weekDescription alanları ve activities içeriği olmalıdır. TAM ${weeks} HAFTA olduğundan emin ol.
        
        ÖNEMLİ: Her kaynak için anlamlı bir başlık, kısa bir açıklama ve mutlaka gerçek ve erişilebilir bir URL ekle (URL'ler "https://" ile başlamalı). Tüm kaynak ve sertifika önerileri ${learningStyle} öğrenme stiline özel olmalı. Her kaynağın türünü belirt (Video, Makale, Uygulama, vb.).
        
        SADECE GEÇERLİ JSON FORMATI KULLAN. Hiçbir açıklama, giriş veya ek metin ekleme. Sadece JSON.
    `;

      console.log("API isteği gönderiliyor...");
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        }
      });
      
    const response = await result.response;
    const responseText = response.text();
      console.log("API yanıtı alındı, uzunluk:", responseText.length);
    
    try {
        // Olası düzeltmeler yaparak JSON ayrıştırma dene
        let jsonString = responseText;
        
        // ```json ve ``` işaretlerini temizleme (bazen API yanıtı bu şekilde gelebiliyor)
        if (jsonString.includes('```json')) {
          jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (jsonString.includes('```')) {
          jsonString = jsonString.replace(/```/g, '').trim();
        }
        
        // JSON içeriğini düzgün bir şekilde çıkar
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        }
        
        console.log("JSON ayrıştırılıyor: İlk 100 karakter:", jsonString.substring(0, 100));
        
        // JSON'ı parse et
        const plan = JSON.parse(jsonString) as LearningPlan;
        
        // Hafta sayısını kontrol et ve gerekiyorsa eksik haftaları tamamla
        if (plan.weeks?.length !== weeks) {
          console.warn(`API tam ${weeks} hafta dönmedi, dönen hafta sayısı: ${plan.weeks?.length || 0}`);
          
          // Mevcut plan içeriği korunsun
          const existingWeeks = plan.weeks || [];
          
          // Eksik haftaları oluştur
          const missingWeekCount = weeks - existingWeeks.length;
          
          if (missingWeekCount > 0) {
            // Son mevcut haftayı şablon olarak kullan
            const lastWeek = existingWeeks.length > 0 
              ? existingWeeks[existingWeeks.length - 1] 
              : null;
            
            // Eksik haftaları ekle
            for (let i = 1; i <= missingWeekCount; i++) {
              const weekNumber = existingWeeks.length + i;
              
              // Son haftadan şablon al veya yeni oluştur
              if (lastWeek) {
                const newWeek = JSON.parse(JSON.stringify(lastWeek));
                newWeek.weekNumber = weekNumber;
                newWeek.weekTitle = `${topic} - Hafta ${weekNumber}`;
                newWeek.weekDescription = `${topic} konusunun ${weekNumber}. haftasında ileri seviye konular ele alınacaktır.`;
                
                // Her aktivitenin başlığını ve açıklamasını güncelle
                newWeek.activities = newWeek.activities.map((activity: any) => {
                  return {
                    ...activity,
                    title: `${activity.title.split(':')[0]}: ${topic} - Bölüm ${weekNumber}`,
                    description: `${activity.description.split('.')[0]}. ${topic} konusunun ${weekNumber}. haftasına uygun içerik.`,
                    difficulty: weekNumber > weeks/2 ? "İleri" : "Orta"
                  };
                });
                
                existingWeeks.push(newWeek);
              } else {
                // Şablon yoksa yeni bir hafta oluştur
                const newActivities = [
                  {
                    title: `${topic} İleri Seviye - Bölüm ${weekNumber}`,
                    description: `${topic} konusunun ${weekNumber}. haftasında ileri düzey konular işlenecektir.`,
                    type: learningStyle === "visual" ? "Video" : 
                          learningStyle === "auditory" ? "Ses" :
                          learningStyle === "kinesthetic" ? "Uygulama" : "Okuma",
                    duration: `${Math.max(2, Math.floor(hoursPerWeek / 3))} saat`,
                    difficulty: "İleri",
                    resources: [
                      `${learningStyle === "visual" ? "Video eğitim" : 
                        learningStyle === "auditory" ? "Podcast" :
                        learningStyle === "kinesthetic" ? "Pratik Uygulama" : "Makale"}: ${topic} İleri Seviye`
                    ],
                    expectedOutcomes: [`${topic} konusunda ileri düzey bilgi edinme`]
                  }
                ];
                
                existingWeeks.push({
                  weekNumber: weekNumber,
                  weekTitle: `${topic} - Hafta ${weekNumber}`,
                  weekDescription: `${topic} konusunun ${weekNumber}. haftasında ileri seviye konular ele alınacaktır.`,
                  activities: newActivities,
                  weekSummary: `${weekNumber}. haftada ${topic} konusunun ileri seviye kavramları üzerinde durulacaktır.`,
                  reflectionQuestions: [
                    `Bu haftaki ${topic} konuları hakkında ne düşünüyorsunuz?`,
                    `${topic} konusundaki ilerlemenizi nasıl değerlendirirsiniz?`
                  ]
                });
              }
            }
            
            // Güncellenmiş hafta listesini plana ata
            plan.weeks = existingWeeks;
            console.log(`Plan tamamlandı, toplam hafta sayısı: ${plan.weeks.length}`);
          }
        }
        
        // Eksik alanlar için ön tanımlı değerler ekle
        if (!plan.learningStyleSummary) {
          plan.learningStyleSummary = `${learningStyle} öğrenme stili özeti`;
        }
        
        // Geçerli planı döndür
        console.log("Plan oluşturuldu, haftalar:", plan.weeks?.length || 0);
        return plan;
      } catch (jsonError) {
        console.error("JSON parse hatası:", jsonError);
        console.log("Ham API yanıtının ilk 500 karakteri:", responseText.substring(0, 500));
        
        // JSON ayrıştırılamadıysa alternatif yöntem dene - JSON içeren kısmı bul
        try {
          const startPos = responseText.indexOf('{');
          const endPos = responseText.lastIndexOf('}') + 1;
          
          if (startPos !== -1 && endPos > startPos) {
            const extractedJson = responseText.substring(startPos, endPos);
            console.log("Alternatif JSON çıkarma deneniyor, uzunluk:", extractedJson.length);
            
            const plan = JSON.parse(extractedJson) as LearningPlan;
            return plan;
          }
        } catch (e) {
          console.error("Alternatif JSON çıkarma başarısız:", e);
        }
        
        // Halen başarısız ise demo planı döndür
        alert("API yanıtı doğru formatta alınamadı. Örnek bir plan oluşturulacak.");
        return getDemoLearningPlan(learningStyle, topic, hoursPerWeek, weeks);
      }
    } catch (modelError: any) {
      console.error("Model hatası:", modelError);
      
      // Hata mesajında model adı varsa
      if (modelError.message && modelError.message.includes("not found for API version")) {
        console.log("Model bulunamadı, yedek model kullanılıyor");
        alert("Seçilen model bulunamadı. Örnek bir plan oluşturulacak.");
      } else {
        alert(`Model hatası: ${modelError.message}. Örnek bir plan oluşturulacak.`);
      }
      
      // Hata durumunda demo veri döndür
      return getDemoLearningPlan(learningStyle, topic, hoursPerWeek, weeks);
    }
  } catch (error: any) {
    console.error("Gemini API error:", error);
    // API hatası durumunda demo veri döndür
    alert(`API hatası: ${error.message}. Örnek bir plan oluşturulacak.`);
    return getDemoLearningPlan(learningStyle, topic, hoursPerWeek, weeks);
  }
};

// Mock veri oluşturucu (API çağrısı başarısız olursa)
const createMockLearningPlan = (learningStyle: string, topic: string, hoursPerWeek: number, weeks: number): LearningPlan => {
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

  // Öğrenme stiline göre aktivite havuzu
  const activityPool = styleActivities[learningStyle as keyof typeof styleActivities] || styleActivities.visual;

  // Haftaları oluştur
  const weekPlans = Array.from({ length: weeks }, (_, weekIndex) => {
    // Her hafta için 2-3 aktivite seç
    const weekActivities = [];
    
    // Ana stilden 1-2 aktivite
    const numStyleActivities = Math.min(weekIndex < weeks / 2 ? 2 : 1, activityPool.length);
    for (let i = 0; i < numStyleActivities; i++) {
      const activityIndex = (weekIndex + i) % activityPool.length;
      const activity = activityPool[activityIndex];
      
      weekActivities.push({
        title: `${activity.title}: ${topic} - Bölüm ${weekIndex + 1}`,
        description: `${activity.description}. ${topic} konusunun ${weekIndex + 1}. haftasına uygun içerik.`,
        type: activity.type,
        duration: `${Math.max(1, Math.floor(hoursPerWeek / 3))} saat`
      });
    }
    
    // Ortak aktivitelerden 1 tane ekle
    const commonActivity = commonActivities[weekIndex % commonActivities.length];
    weekActivities.push({
      title: `${commonActivity.title}: ${topic} - Hafta ${weekIndex + 1}`,
      description: `${commonActivity.description}. Bu haftanın konuları üzerine odaklanır.`,
      type: commonActivity.type,
      duration: `${Math.max(1, Math.floor(hoursPerWeek / 3))} saat`
    });
    
    return {
      weekNumber: weekIndex + 1,
      activities: weekActivities
    };
  });

  return {
    topic: topic,
    learningStyle: learningStyle,
    weeklyHours: hoursPerWeek,
    totalWeeks: weeks,
    weeks: weekPlans
  };
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [learningStyle, setLearningStyle] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [weeks, setWeeks] = useState(8);
  const [learningPlan, setLearningPlan] = useState<LearningPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Hydration hatası için istemci tarafında olduğumuzu kontrol edelim
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAnswer = (questionId: number, optionType: string) => {
    setAnswers({
      ...answers,
      [questionId]: optionType
    });
  };

  const determineLearningStyle = () => {
    const styles = Object.values(answers);
    const styleCounts = styles.reduce((acc: Record<string, number>, style) => {
      acc[style] = (acc[style] || 0) + 1;
      return acc;
    }, {});

    let dominantStyle = "visual"; // Varsayılan
    let maxCount = 0;
    
    Object.entries(styleCounts).forEach(([style, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantStyle = style;
      }
    });

    return dominantStyle;
  };

  const handleQuizComplete = () => {
    if (Object.keys(answers).length < 5) {
      alert("Lütfen tüm soruları cevaplayın.");
      return;
    }
    
    const style = determineLearningStyle();
    setLearningStyle(style);
    setStep(2);
  };

  const handleGoalSubmit = async () => {
    if (!learningGoal) {
      alert("Lütfen öğrenme hedefinizi belirtin.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Gerçek API çağrısı
      const plan = await generateAILearningPlan(learningStyle, learningGoal, weeklyHours, weeks);
      setLearningPlan(plan);
      setStep(3);
    } catch (error) {
      console.error("Plan generation error:", error);
      alert("Öğrenme planı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Input değerlerini güvenli bir şekilde alın (NaN hatası için)
  const handleWeeklyHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setWeeklyHours(isNaN(value) ? 5 : value); // NaN ise varsayılan değer
  };

  const handleWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setWeeks(isNaN(value) ? 8 : value); // NaN ise varsayılan değer
  };

  // Eğer istemci tarafında değilsek boş sayfa göster (hydration hatası için)
  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">LearnFlow</h1>
          <p className="text-blue-100">AI-Powered Personalized Micro-Learning Planner</p>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-4xl">
        {step === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Determine Your Learning Style</h2>
            <p className="mb-6 text-gray-600">Answer the following questions to help us identify the best learning methods for you.</p>
            
            {learningStyleQuestions.map((q) => (
              <div key={q.id} className="mb-8">
                <h3 className="font-medium mb-2">{q.id}. {q.question}</h3>
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <label key={option.id} className="flex items-start p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option.type}
                        onChange={() => handleAnswer(q.id, option.type)}
                        className="mt-1 mr-3"
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleQuizComplete}
              disabled={Object.keys(answers).length < 5}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Define Your Learning Goal</h2>
            <p className="mb-6 text-gray-600">
              Your learning style: <span className="font-medium">
                {learningStyle === "visual" ? "Visual" :
                 learningStyle === "auditory" ? "Auditory" :
                 learningStyle === "kinesthetic" ? "Kinesthetic" : "Reading/Writing"}
              </span>
            </p>

            <div className="mb-4">
              <label className="block mb-2">Topic you want to learn:</label>
              <input
                type="text"
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="E.g.: Python programming, Spanish, Web design"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-2">Hours you can dedicate per week:</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={weeklyHours}
                  onChange={handleWeeklyHoursChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2">Learning duration (weeks):</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={weeks}
                  onChange={handleWeeksChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <button
              onClick={handleGoalSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Generate Learning Plan"}
            </button>
          </div>
        )}

        {step === 3 && learningPlan && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Your Personalized Learning Plan</h2>
            
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-2">Summary</h3>
              <p>Topic: <strong>{learningPlan.topic}</strong></p>
              <p>Learning Style: <strong>
                {learningPlan.learningStyle === "visual" ? "Visual" :
                 learningPlan.learningStyle === "auditory" ? "Auditory" :
                 learningPlan.learningStyle === "kinesthetic" ? "Kinesthetic" : "Reading/Writing"}
              </strong></p>
              <p>Duration: <strong>{learningPlan.weeklyHours} hours per week, {learningPlan.totalWeeks} weeks total</strong></p>
              {learningPlan.overview && (
                <div className="mt-2">
                  <p className="font-medium">Overview:</p>
                  <p className="text-gray-700">{learningPlan.overview}</p>
                </div>
              )}
              {learningPlan.learningStyleSummary && (
                <div className="mt-2">
                  <p className="font-medium">Learning Style Description:</p>
                  <p className="text-gray-700">{learningPlan.learningStyleSummary}</p>
                </div>
              )}
              {!learningPlan.learningStyleSummary && (
                <div className="mt-3 p-3 rounded border border-dashed" style={{
                  backgroundColor: learningPlan.learningStyle === "visual" ? "#EFF6FF" : 
                                  learningPlan.learningStyle === "auditory" ? "#F5F3FF" :
                                  learningPlan.learningStyle === "kinesthetic" ? "#ECFDF5" : "#FFFBEB",
                  borderColor: learningPlan.learningStyle === "visual" ? "#BFDBFE" : 
                                  learningPlan.learningStyle === "auditory" ? "#DDD6FE" :
                                  learningPlan.learningStyle === "kinesthetic" ? "#A7F3D0" : "#FDE68A",
                }}>
                  <h4 className="text-sm font-medium mb-1" style={{
                    color: learningPlan.learningStyle === "visual" ? "#1D4ED8" : 
                           learningPlan.learningStyle === "auditory" ? "#7C3AED" :
                           learningPlan.learningStyle === "kinesthetic" ? "#047857" : "#B45309"
                  }}>
                    {learningPlan.learningStyle === "visual" ? "Visual Learning Style" :
                     learningPlan.learningStyle === "auditory" ? "Auditory Learning Style" :
                     learningPlan.learningStyle === "kinesthetic" ? "Kinesthetic Learning Style" : "Reading/Writing Learning Style"}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {learningPlan.learningStyle === "visual" && "Visual learners process information best through visualization. They tend to process information using pictures, diagrams, graphs, videos, and graphic organizers."}
                    {learningPlan.learningStyle === "auditory" && "Auditory learners learn best by listening and speaking. They tend to process information through verbal instructions, discussions, podcasts, and verbal narrations."}
                    {learningPlan.learningStyle === "kinesthetic" && "Kinesthetic learners learn best by doing and experiencing. They tend to process information through physical activity, hands-on tasks, simulations, and practical experiments."}
                    {learningPlan.learningStyle === "reading" && "Reading/writing learners learn best by reading and writing written words. They tend to process information through articles, books, notes, and written summaries."}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {learningPlan.learningStyle === "visual" && (
                      <>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Visualization</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Diagrams</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Videos</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Infographics</span>
                      </>
                    )}
                    {learningPlan.learningStyle === "auditory" && (
                      <>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">Listening</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">Discussion</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">Podcasts</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">Audio Narration</span>
                      </>
                    )}
                    {learningPlan.learningStyle === "kinesthetic" && (
                      <>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800">Practical</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800">Simulation</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800">Hands-on</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800">Experience</span>
                      </>
                    )}
                    {learningPlan.learningStyle === "reading" && (
                      <>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Reading</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Writing</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Notes</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Articles</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              {learningPlan.preRequisites && learningPlan.preRequisites.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Prerequisites:</p>
                  <ul className="list-disc pl-5">
                    {learningPlan.preRequisites.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {learningPlan.recommendedTools && learningPlan.recommendedTools.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Recommended Tools:</p>
                  <ul className="list-disc pl-5">
                    {learningPlan.recommendedTools.map((tool, index) => (
                      <li key={index} className="text-gray-700">{tool}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {learningPlan.weeks.map((week) => (
                <div key={week.weekNumber} className="border border-gray-200 p-4 rounded-md hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg text-blue-700">
                    Week {week.weekNumber}{week.weekTitle ? `: ${week.weekTitle}` : ''}
                  </h3>
                  {week.weekDescription && (
                    <p className="text-gray-600 mb-3">{week.weekDescription}</p>
                  )}
                  <div className="mt-2 space-y-3">
                    {week.activities.map((activity, index) => (
                      <div key={index} className="border-t pt-3 first:border-t-0 first:pt-0">
                        <h4 className="font-medium text-gray-800">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        {activity.resources && activity.resources.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-500">Önerilen Kaynaklar:</p>
                            <div className="pl-3 space-y-2 mt-1">
                              {activity.resources.map((resource, idx) => {
                                // Resource değişken tipini kontrol et
                                if (typeof resource === 'string') {
                                  // Eski tip kaynak (string)
                                  return <div key={idx} className="text-xs text-gray-500">• {resource}</div>;
                                } else if (typeof resource === 'object' && resource !== null) {
                                  // Yeni tip kaynak (nesne)
                                  const resourceObj = resource as any;
                                  return (
                                    <div key={idx} className={`p-2 rounded ${
                                      learningPlan.learningStyle === "visual" ? "bg-blue-50" :
                                      learningPlan.learningStyle === "auditory" ? "bg-purple-50" :
                                      learningPlan.learningStyle === "kinesthetic" ? "bg-green-50" : 
                                      "bg-amber-50"
                                    }`}>
                                      <div className="font-medium text-xs">{resourceObj.name}</div>
                                      <p className="text-xs text-gray-600">{resourceObj.description}</p>
                                      {resourceObj.type && (
                                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                                          resourceObj.type.includes("Video") ? "bg-blue-100 text-blue-700" :
                                          resourceObj.type.includes("Podcast") || resourceObj.type.includes("Ses") ? "bg-purple-100 text-purple-700" :
                                          resourceObj.type.includes("Uygulama") ? "bg-green-100 text-green-700" :
                                          "bg-amber-100 text-amber-700"
                                        }`}>
                                          {resourceObj.type}
                                        </span>
                                      )}
                                      {resourceObj.url && (
                                        <div className="mt-1">
                                          <a href={resourceObj.url} target="_blank" rel="noopener noreferrer" 
                                            className={`inline-flex items-center text-sm ${
                                              learningPlan.learningStyle === "visual" ? "text-blue-600 hover:text-blue-800" :
                                              learningPlan.learningStyle === "auditory" ? "text-purple-600 hover:text-purple-800" :
                                              learningPlan.learningStyle === "kinesthetic" ? "text-green-600 hover:text-green-800" : 
                                              "text-amber-600 hover:text-amber-800"
                                            }`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                            </svg>
                                            Kaynağa Git
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                                
                                // Tip bilinmiyorsa
                                return <div key={idx} className="text-xs text-gray-500">• {JSON.stringify(resource)}</div>;
                              })}
                            </div>
                          </div>
                        )}
                        {activity.expectedOutcomes && activity.expectedOutcomes.length > 0 && (
                          <div className="mt-1">
                            <p className="text-xs font-medium text-gray-500">Beklenen Kazanımlar:</p>
                            <ul className="list-disc pl-5 text-xs text-gray-500">
                              {activity.expectedOutcomes.map((outcome, idx) => (
                                <li key={idx}>{outcome}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                            {activity.type}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {activity.duration}
                          </span>
                          {activity.difficulty && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              activity.difficulty.includes("Beginner") || activity.difficulty.includes("Başlangıç") ? "bg-green-100" :
                              activity.difficulty.includes("Intermediate") || activity.difficulty.includes("Orta") ? "bg-yellow-100" :
                              "bg-red-100"
                            }`}>
                              {activity.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {week.weekSummary && (
                    <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                      <p className="text-xs font-medium text-gray-500">Week Summary:</p>
                      <p className="text-xs text-gray-500">{week.weekSummary}</p>
                    </div>
                  )}
                  {week.reflectionQuestions && week.reflectionQuestions.length > 0 && (
                    <div className="mt-3 pt-2">
                      <p className="text-xs font-medium text-gray-500">Reflection Questions:</p>
                      <ul className="list-disc pl-5 text-xs text-gray-500">
                        {week.reflectionQuestions.map((question, idx) => (
                          <li key={idx}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {learningPlan.additionalResources && learningPlan.additionalResources.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium text-lg mb-3">Ek Kaynaklar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {learningPlan.additionalResources.map((resource, index) => {
                    // Resource değişken tipini kontrol et
                    if (typeof resource === 'string') {
                      // Eski tip kaynak (string)
                      return <div key={index} className="text-gray-600">• {resource}</div>;
                    } else if (typeof resource === 'object' && resource !== null) {
                      // Yeni tip kaynak (nesne)
                      const resourceObj = resource as any;
                      return (
                        <div key={index} className={`p-3 rounded-md border ${
                          learningPlan.learningStyle === "visual" ? "border-blue-200" :
                          learningPlan.learningStyle === "auditory" ? "border-purple-200" :
                          learningPlan.learningStyle === "kinesthetic" ? "border-green-200" : 
                          "border-amber-200"
                        }`}>
                          <div className="font-medium">{resourceObj.name}</div>
                          <p className="text-sm text-gray-600 mt-1">{resourceObj.description}</p>
                          
                          {resourceObj.type && (
                            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${
                              resourceObj.type.includes("Video") ? "bg-blue-100 text-blue-700" :
                              resourceObj.type.includes("Podcast") || resourceObj.type.includes("Ses") ? "bg-purple-100 text-purple-700" :
                              resourceObj.type.includes("Uygulama") ? "bg-green-100 text-green-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {resourceObj.type}
                            </span>
                          )}
                          
                          {resourceObj.url && (
                            <div className="mt-2">
                              <a href={resourceObj.url} target="_blank" rel="noopener noreferrer" 
                                className={`inline-flex items-center text-sm ${
                                  learningPlan.learningStyle === "visual" ? "text-blue-600 hover:text-blue-800" :
                                  learningPlan.learningStyle === "auditory" ? "text-purple-600 hover:text-purple-800" :
                                  learningPlan.learningStyle === "kinesthetic" ? "text-green-600 hover:text-green-800" : 
                                  "text-amber-600 hover:text-amber-800"
                                }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                                Kaynağa Git
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    // Tip bilinmiyorsa
                    return <div key={index} className="text-gray-600">• {JSON.stringify(resource)}</div>;
                  })}
                </div>
              </div>
            )}

            {learningPlan.nextSteps && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">İleri Seviye Konular</h3>
                <p className="text-gray-600">{learningPlan.nextSteps}</p>
              </div>
            )}
            
            {learningPlan.certificationOptions && learningPlan.certificationOptions.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium text-lg mb-3">Öğrenme Stilinize Uygun Sertifika Seçenekleri</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Aşağıdaki sertifika programları <strong>{
                    learningPlan.learningStyle === "visual" ? "görsel" :
                    learningPlan.learningStyle === "auditory" ? "işitsel" :
                    learningPlan.learningStyle === "kinesthetic" ? "kinestetik" : "okuma/yazma"
                  } öğrenme stilinize</strong> özel olarak seçilmiştir.
                </p>
                <div className="space-y-3">
                  {learningPlan.certificationOptions.map((cert, index) => {
                    // Sertifika değişken tipini kontrol et
                    if (typeof cert === 'string') {
                      // Eski tip sertifika (string)
                      return (
                        <div key={index} className={`p-3 rounded-lg border ${
                          learningPlan.learningStyle === "visual" ? "bg-blue-50 border-blue-200" :
                          learningPlan.learningStyle === "auditory" ? "bg-purple-50 border-purple-200" :
                          learningPlan.learningStyle === "kinesthetic" ? "bg-green-50 border-green-200" : 
                          "bg-amber-50 border-amber-200"
                        }`}>
                          <div className="flex items-start">
                            <div className={`p-2 rounded mr-3 ${
                              learningPlan.learningStyle === "visual" ? "bg-blue-100" :
                              learningPlan.learningStyle === "auditory" ? "bg-purple-100" :
                              learningPlan.learningStyle === "kinesthetic" ? "bg-green-100" : 
                              "bg-amber-100"
                            }`}>
                              {learningPlan.learningStyle === "visual" && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {learningPlan.learningStyle === "auditory" && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-700" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                              )}
                              {learningPlan.learningStyle === "kinesthetic" && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                                  <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z" clipRule="evenodd" />
                                  <path fillRule="evenodd" d="M10 10a1 1 0 011 1c0 2.236-.46 4.368-1.29 6.304a1 1 0 01-1.838-.789A13.952 13.952 0 009 11a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              )}
                              {learningPlan.learningStyle === "reading" && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-800">{cert}</p>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (typeof cert === 'object' && cert !== null) {
                      // Yeni tip sertifika (nesne)
                      const certObj = cert as any;
                      return (
                        <div key={index} className={`p-4 rounded-lg border ${
                          learningPlan.learningStyle === "visual" ? "bg-blue-50 border-blue-200" :
                          learningPlan.learningStyle === "auditory" ? "bg-purple-50 border-purple-200" :
                          learningPlan.learningStyle === "kinesthetic" ? "bg-green-50 border-green-200" : 
                          "bg-amber-50 border-amber-200"
                        }`}>
                          <div className="flex items-start">
                            <div className={`p-2 rounded mr-3 ${
                              learningPlan.learningStyle === "visual" ? "bg-blue-100" :
                              learningPlan.learningStyle === "auditory" ? "bg-purple-100" :
                              learningPlan.learningStyle === "kinesthetic" ? "bg-green-100" : 
                              "bg-amber-100"
                            }`}>
                              {learningPlan.learningStyle === "visual" && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {learningPlan.learningStyle === "auditory" && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-700" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                              )}
                              {learningPlan.learningStyle === "kinesthetic" && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                                  <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z" clipRule="evenodd" />
                                  <path fillRule="evenodd" d="M10 10a1 1 0 011 1c0 2.236-.46 4.368-1.29 6.304a1 1 0 01-1.838-.789A13.952 13.952 0 009 11a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              )}
                              {learningPlan.learningStyle === "reading" && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h4 className="font-semibold text-gray-800">{certObj.name}</h4>
                                {certObj.level && (
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    certObj.level.includes("Beginner") ? "bg-green-100 text-green-800" :
                                    certObj.level.includes("Intermediate") || certObj.level.includes("Orta") ? "bg-yellow-100 text-yellow-800" :
                                    "bg-red-100 text-red-800"
                                  }`}>
                                    {certObj.level}
                                  </span>
                                )}
                              </div>
                              
                              {certObj.provider && (
                                <p className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Provider:</span> {certObj.provider}
                                </p>
                              )}
                              
                              {certObj.duration && (
                                <p className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Duration:</span> {certObj.duration}
                                </p>
                              )}
                              
                              {certObj.description && (
                                <p className="text-sm text-gray-600 mt-2">{certObj.description}</p>
                              )}
                              
                              {certObj.url && (
                                <div className="mt-3">
                                  <a href={certObj.url} target="_blank" rel="noopener noreferrer" 
                                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                                      learningPlan.learningStyle === "visual" ? "bg-blue-600 text-white hover:bg-blue-700" :
                                      learningPlan.learningStyle === "auditory" ? "bg-purple-600 text-white hover:bg-purple-700" :
                                      learningPlan.learningStyle === "kinesthetic" ? "bg-green-600 text-white hover:bg-green-700" : 
                                      "bg-amber-600 text-white hover:bg-amber-700"
                                    }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                    Go to Certificate Page
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    // Tip bilinmiyorsa
                    return <div key={index} className="text-gray-600">• {JSON.stringify(cert)}</div>;
                  })}
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  Bu sertifikalar, {
                    learningPlan.learningStyle === "visual" ? "görsel materyaller, video dersler ve grafik içerikler kullanarak" :
                    learningPlan.learningStyle === "auditory" ? "sesli anlatımlar, podcast'ler ve etkileşimli tartışmalar yoluyla" :
                    learningPlan.learningStyle === "kinesthetic" ? "pratik uygulamalar, etkileşimli alıştırmalar ve gerçek dünya projeleri vasıtasıyla" : 
                    "kapsamlı okuma materyalleri, detaylı dokümanlar ve yazılı projeler aracılığıyla"
                  } öğrenme sürecinizi desteklemek için özel olarak seçilmiştir.
                </div>
              </div>
            )}

            {learningPlan.recommendedChannels && learningPlan.recommendedChannels.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium text-lg mb-3">Öğrenme Stilinize Uygun Önerilen Platformlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {learningPlan.recommendedChannels.map((channel, index) => {
                    const channelObj = channel as any;
                    return (
                      <div key={index} className={`p-3 rounded-md shadow-sm border-l-4 ${
                        learningPlan.learningStyle === "visual" ? "border-l-blue-500" :
                        learningPlan.learningStyle === "auditory" ? "border-l-purple-500" :
                        learningPlan.learningStyle === "kinesthetic" ? "border-l-green-500" : 
                        "border-l-amber-500"
                      }`}>
                        <div className="font-medium">{channelObj.name}</div>
                        
                        {channelObj.type && (
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                            channelObj.type.includes("Video") ? "bg-blue-100 text-blue-700" :
                            channelObj.type.includes("Podcast") || channelObj.type.includes("Sesli") ? "bg-purple-100 text-purple-700" :
                            channelObj.type.includes("Etkileşimli") ? "bg-green-100 text-green-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {channelObj.type}
                          </span>
                        )}
                        
                        {channelObj.description && (
                          <p className="text-sm text-gray-600 mt-1">{channelObj.description}</p>
                        )}
                        
                        {channelObj.url && (
                          <div className="mt-2">
                            <a href={channelObj.url} target="_blank" rel="noopener noreferrer" 
                              className={`inline-flex items-center text-sm ${
                                learningPlan.learningStyle === "visual" ? "text-blue-600 hover:text-blue-800" :
                                learningPlan.learningStyle === "auditory" ? "text-purple-600 hover:text-purple-800" :
                                learningPlan.learningStyle === "kinesthetic" ? "text-green-600 hover:text-green-800" : 
                                "text-amber-600 hover:text-amber-800"
                              }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                              Platforma Git
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Start Over
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Print Plan
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 p-4 mt-12 text-center text-gray-600">
        LearnFlow - AI-Powered Personalized Micro-Learning Planner | Hackathon Project
      </footer>
    </div>
  );
}
