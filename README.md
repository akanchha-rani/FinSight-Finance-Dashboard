# 💰 FinSight — Personal Finance Dashboard

A clean, modern personal finance tracker built with React and Node.js. FinSight gives you a clear, at-a-glance view of your financial health — tracking your balance, income, expenses, and spending habits all in one place.

🔗 **Live Demo:** [fin-sight-finance-dashboard-seven.vercel.app](https://fin-sight-finance-dashboard-seven.vercel.app)

---

## 📸 Preview

![FinSight Dashboard Overview](./public/preview.png)

---

## ✨ Features

- **Overview Dashboard** — See your total balance, monthly income, monthly expenses, and savings rate at a glance with trend indicators vs. the previous month
- **Balance Trend Chart** — A 6-month area chart showing balance, income, and expense trends over time
- **Spending Breakdown** — A donut chart that categorizes your spending (Food & Dining, Shopping, Utilities, Transport, Entertainment) for the last 30 days
- **Monthly Comparison** — A bar chart comparing income vs. expenses month by month
- **Recent Transactions** — A live feed of your latest transactions with category labels and amounts
- **Transactions Page** — Full transaction history with filtering and management
- **Insights Page** — Deeper financial analytics and trends
- **Export CSV** — Download your financial data as a CSV file
- **Dark Mode** — Toggle between light and dark themes
- **Role-based Demo** — Switch between Admin and Viewer roles to explore different access levels

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router DOM v7 |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Node.js, Express |
| Build Tool | Vite |
| Deployment | Vercel |

---

## 📁 Project Structure

```
FinSight-Finance-Dashboard/
├── public/              # Static assets
├── src/                 # React source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Overview, Transactions, Insights
│   └── main.jsx         # App entry point
├── server.js            # Express backend server
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vercel.json          # Vercel deployment config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akanchha-rani/FinSight-Finance-Dashboard.git
   cd FinSight-Finance-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Add your environment variables here
   PORT=3000
   ```

4. **Run the development server**

   Start the frontend:
   ```bash
   npm run dev
   ```

   Start the backend (in a separate terminal):
   ```bash
   npm run server
   ```

5. **Open in your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📊 Pages

### Overview
Your financial command center. Displays KPI cards (total balance, monthly income, expenses, savings rate), a 6-month balance trend chart, category spending breakdown, monthly income vs. expenses comparison, and recent transactions.

### Transactions
Full transaction history with details like category, date, and amount. Supports browsing and filtering all recorded activity.

### Insights
Advanced analytics to help you understand your financial patterns and make smarter decisions.

---

## 🌐 Deployment

This project is deployed on **Vercel**. The `vercel.json` config handles routing for the SPA frontend and the Express backend.

To deploy your own instance:

1. Fork this repository
2. Connect it to your [Vercel](https://vercel.com) account
3. Set any required environment variables in the Vercel dashboard
4. Deploy!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 👩‍💻 Author

**Akanchha Rani**
- GitHub: [@akanchha-rani](https://github.com/akanchha-rani)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
