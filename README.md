# VocalCash

**VocalCash** is a smart, voice-assisted expense tracker designed to help you take control of your finances quickly and naturally. Powered by speech recognition, it allows users to add transactions and view visual summaries of their income and spending—without ever typing a word.

---

## 🚀 Features

- **Voice Input** – Add expenses and income using voice commands
- **Real-time Charts** – Visualize your financial activity with pie and bar charts
- **Secure Authentication** – Sign up or log in with Supabase Auth
- **User Dashboard** – Personalized financial dashboard with a welcome message
- **Add Transactions** – Simple interface to record new transactions
- **Track Spending** – Instantly see your expenses vs. income breakdown

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 13+ App Router](https://nextjs.org/)
- **Auth:** [Supabase](https://supabase.io/)
- **Database:** Supabase PostgreSQL
- **Charts:** Recharts
- **Voice Recognition:** Web Speech API
- **Deployment:** Vercel

---

## ⚙️ Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/vocalcash.git
cd vocalcash
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env.local file in the root and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at <http://localhost:3000>.

## Testing the App

⚠️ IMPORTANT: Please test the app on Google Chrome only for now.
Firefox does not fully support the Web Speech API, which is required for the voice command feature to work.

## Roadmap / Planned Improvements

Here's what's coming next:

- Improved voice command feedback (e.g., show transcript live)
- Categorize transactions (e.g., Food, Transport, etc.)
- Make the app fully responsive on mobile
- Add daily/weekly spending notifications
- Support multiple languages for voice input
- Export transaction history as PDF or CSV
- Multi-user role support (admin, standard user)

## Screenshots

Coming soon...

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE)

## 💬 Feedback

Have suggestions or found bugs? Open an issue or reach out on GitHub Issues.
