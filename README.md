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
### 2. Google Gemini API Anahtarı Alın

Uygulama, kişiselleştirilmiş öğrenme planları oluşturmak için Google Gemini AI kullanmaktadır. Kendi API anahtarınızı almanız gerekiyor:

1. [Google AI Studio](https://aistudio.google.com/app/apikey) adresini ziyaret edin
2. Google hesabınızla giriş yapın
3. "Create API Key" (API Anahtarı Oluştur) butonuna tıklayın (ücretsiz oluşturabilirsiniz)
4. Oluşturulan API anahtarınızı kopyalayın

### API Anahtarını Projeye Ekleyin (İki Seçenek)

#### Seçenek 1: Çevresel Değişken Kullanma (Güvenlik için önerilir)

1. Projenin kök dizininde `.env.local` adında bir dosya oluşturun
2. Dosyaya şu satırı ekleyin (gerçek API anahtarınızla değiştirin):
 NEXT_PUBLIC_GEMINI_API_KEY=API_ANAHTARINIZ_BURAYA

### Get a Google Gemini API Key

The application uses Google's Gemini AI to generate personalized learning plans. You need to get your own API key:

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" (it's free to create)
4. Copy your generated API key

### 3. Add the API Key to the Project (Two Options)

#### Option 1: Using Environment Variables (Recommended for security)

1. Create a file named `.env.local` in the root directory of the project
2. Add this line to the file, replacing with your actual API key:
   NEXT_PUBLIC_GEMINI_API_KEY=YOUR_API_KEY_HERE


## Ekran Görüntüleri

### Öğrenme Hedefi Belirleme
![Öğrenme Hedefi Belirleme](assets/images/Screenshot%202025-05-06%20225910.png)

### Öğrenme Planı Oluşturma
![Öğrenme Planı Oluşturma](assets/images/Screenshot%202025-05-06%20225929.png)

### Kişiselleştirilmiş Öğrenme Planı
![Kişiselleştirilmiş Öğrenme Planı](assets/images/Screenshot%202025-05-06%20225946.png)

### Haftalık Öğrenme Modülleri
![Haftalık Öğrenme Modülleri](assets/images/Screenshot%202025-05-06%20230009.png)

### Öğrenme Stilinize Uygun Sertifika Seçenekleri
![Öğrenme Stilinize Uygun Sertifika Seçenekleri](assets/images/Screenshot%202025-05-06%20230023.png)

### Öğrenme Stilinize Uygun Önerilen Platformlar
![Öğrenme Stilinize Uygun Önerilen Platformlar](assets/images/Screenshot%202025-05-06%20230042.png)

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

