
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

[Yakında eklenecek]
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

