# LearnFlow: AI Destekli Kişiselleştirilmiş Mikro-Öğrenme Planlayıcı

LearnFlow, bireyin öğrenme stilini ve hedeflediği konuyu temel alarak, kişiye özel mikro-öğrenme planları sunan bir yapay zeka destekli web uygulamasıdır.

## Proje Özellikleri

- 📊 Öğrenme stili belirleme testi
- 🎯 Kişiselleştirilmiş öğrenme hedefi ve süre tanımlama
- 🤖 Google Gemini API ile öğrenme planı oluşturma
- 📅 Haftalık modüller halinde planlama
- 🔄 Geri bildirimlerle planın güncellenebilmesi
- 📄 Öğrenme planının PDF olarak indirilebilmesi

## Teknolojiler

- Frontend: Next.js, Tailwind CSS
- AI: Google Gemini API
- Geliştirme Süresi: Hackathon projesi (3 gün)

## Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/AyseAyhann/LearnFlow.git

# Proje dizinine gidin
cd LearnFlow

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Ekran Görüntüleri

[Yakında eklenecek]

## ⚠️ IMPORTANT: API Key Requirement

**This application REQUIRES a Google Gemini API key to function properly.** 

Without an API key, the app will show an error and only generate demo learning plans. Each user must obtain their own API key.

### Setting Up Your API Key Securely

The API key should NEVER be committed to your Git repository. Follow these steps to set it up securely:

1. Create a file named `.env.local` in the root directory of the project
2. Add this line to the file, replacing with your actual API key:
```
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_API_KEY_HERE
```
3. The `.env.local` file is automatically excluded from Git by the `.gitignore` file
4. NEVER commit your actual API key to any public repository

## Running the Project: Step-by-Step Guide

```bash
# Repository'yi klonlayın
git clone https://github.com/AyseAyhann/LearnFlow.git

# Proje dizinine gidin
cd LearnFlow

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

