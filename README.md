# HealthTrack — Premium Health & Vitals Dashboard

A modern, responsive Health and Vitals tracking application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## 🚀 Live Demo & Deployment on Vercel

### 1-Click Deploy or Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select the **`healthtrack`** repository.
3. Configure the **Environment Variables** (Optional, fallback is included):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://mopragbtlvqaafemkuam.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<your-supabase-anon-key>`
4. Click **Deploy**.

---

## 🛠 Local Development

```bash
# Clone the repository
git clone https://github.com/mahalakshmi149014-create/healthtrack.git

# Navigate to project directory
cd healthtrack

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Features
- 📊 **Real-time Vitals & Metrics**: Heart rate, Blood Pressure, Blood Glucose, SpO2, and Sleep duration.
- 🎯 **Daily Goals & Progress Rings**: Track steps, calories burned, and active hydration.
- 📅 **Interactive Charts**: Responsive analytics using Recharts.
- ⏰ **Medication & Habit Reminders**: Built-in notifications, audio chimes, and completion tracking.
- 📥 **Export Health Reports**: Download records in CSV or formatted print/PDF reports.
- ☁️ **Supabase Integration**: Cloud sync with instant local storage fallbacks.
