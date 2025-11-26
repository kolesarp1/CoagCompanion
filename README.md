# CoagCompanion 💊

A comprehensive Warfarin tracking web application for patients with mechanical heart valves. Track your INR levels, medication doses, injections, and manage your anticoagulation therapy with intelligent dose suggestions and predictions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ⚠️ Medical Disclaimer

**This application is for tracking purposes only and is not a substitute for professional medical advice.** Always consult your doctor before making any changes to your medication or treatment plan. The dose suggestions provided are based on general guidelines and should be reviewed by your healthcare provider.

## ✨ Features

### Core Functionality
- **INR Tracking**: Log both lab and home CoaguCheck INR measurements
- **Dose Management**: Track daily Warfarin doses with full edit/delete capabilities
- **Injection Logging**: Record Fraxiparine bridging therapy when INR is below range
- **Vitamin K Tracking**: Monitor dietary vitamin K intake (High/Medium/Low categories)
- **Comments & Notes**: Add observations, side effects, and dietary changes

### Intelligent Analytics
- **Dose Suggestion Algorithm**: AC Forum nomogram-based dose recommendations
  - Automatic calculation based on current INR and maintenance dose
  - Safety warnings for critically low or high INR values
  - Maintenance dose adjustment suggestions
- **INR Predictions**: Linear regression predictions for the next 3 days
- **Dashboard Statistics**:
  - Current INR status with color-coded ranges
  - 30-day average INR
  - Total doses logged
  - Recent alerts and warnings

### Data Visualization
- **INR Trend Chart**: Interactive line chart showing lab and home INR readings
- **Dose History Chart**: Bar chart visualizing Warfarin dose patterns
- **Target Range Indicators**: Visual representation of your INR target (2.0-3.0)

### Data Management
- **CSV Export**: Export all logs for use in spreadsheets
- **JSON Backup/Restore**: Full data backup and import functionality
- **Search & Filter**: Find logs by date, type, or content
- **Seed Data**: Pre-populated with sample data for demonstration

### User Experience
- **Dark/Light Mode**: Beautiful theme toggle with smooth transitions
- **Responsive Design**: Mobile-first design that works on all devices
- **Toast Notifications**: Real-time feedback for all actions
- **Smooth Animations**: Framer Motion animations for polished UX
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with localStorage support

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:kolesarp1/CoagCompanion.git
   cd CoagCompanion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   If you encounter network issues, ensure you have access to npm registry and try:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Getting Started

1. **Home Page**: Overview of your therapy with quick stats and reminders
2. **Dashboard**: Comprehensive analytics, charts, and dose suggestions
3. **Logs**: Add, edit, delete, and filter your daily logs

### Adding a Log

1. Click "Add Log" on the Logs page
2. Fill in the form:
   - **Date**: Select the date (defaults to today)
   - **Lab INR**: Optional - laboratory INR measurement
   - **Home INR**: Optional - CoaguCheck home measurement (measured at 10am)
   - **Warfarin Dose**: Dose in mg (taken at 1pm)
   - **Injections**: e.g., "ráno večer 0.9 ml" for bridging therapy
   - **Vitamin K Intake**: Select Low/Medium/High
   - **Notes**: Any symptoms, dietary changes, or observations
3. Click "Add Log"

### Understanding Dose Suggestions

The app uses the AC Forum nomogram algorithm:

- **INR < 1.5**: Increase dose by 75% (one-time), increase maintenance by 15%
- **INR 1.5-1.9**: Increase dose by 50% (one-time), increase maintenance by 10%
- **INR 2.0-3.0**: Continue current dose (in target range)
- **INR 3.1-4.0**: Decrease dose by 50% (one-time), decrease maintenance by 7.5%
- **INR > 4.0**: **HOLD DOSE** and contact doctor immediately

### INR Predictions

The dashboard shows predicted INR for the next 3 days using linear regression based on your last 7 readings. This helps you anticipate trends and plan ahead.

### Data Export/Import

- **CSV Export**: Download your logs as a CSV file for use in Excel or Google Sheets
- **JSON Backup**: Create a complete backup of all data and settings
- **JSON Import**: Restore from a previous backup

## 🎨 Technology Stack

- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 3.4
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Date Picker**: React DatePicker
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Notifications**: react-hot-toast
- **Data Export**: PapaParse
- **Statistics**: simple-statistics

## 📁 Project Structure

```
CoagCompanion/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard page
│   ├── logs/               # Log management page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── forms/              # Form components
│   │   └── LogForm.tsx
│   ├── charts/             # Chart components
│   │   ├── INRChart.tsx
│   │   └── DoseChart.tsx
│   ├── modals/             # Modal components
│   ├── ui/                 # UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Disclaimer.tsx
│   │   └── DoseSuggestionCard.tsx
│   └── Providers.tsx       # Theme and toast providers
├── lib/                     # Utilities and logic
│   ├── types.ts            # TypeScript types
│   ├── schemas.ts          # Zod validation schemas
│   ├── storage.ts          # localStorage utilities
│   ├── toml-parser.ts      # Seed data parser
│   ├── dose-algorithm.ts   # Dose suggestion logic
│   ├── linear-regression.ts # INR prediction
│   └── utils.ts            # Helper functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## 🔒 Privacy & Security

- **Local Storage Only**: All data is stored in your browser's localStorage
- **No Backend**: No data is sent to any server
- **No Tracking**: No analytics or third-party tracking
- **Data Portability**: Export your data anytime via JSON or CSV

## 🎯 Key Timings

- **Blood Sample**: 10:00 AM (for accurate INR readings)
- **Warfarin Dose**: 1:00 PM (after knowing your INR)
- **Bridging Therapy**: When INR < 2.0 (consult your doctor)

## 🐛 Troubleshooting

### Dependencies won't install
- Check network connection
- Try: `npm install --legacy-peer-deps`
- Clear npm cache: `npm cache clean --force`

### Dark mode not working
- Check browser localStorage is enabled
- Try clearing browser data and reload

### Charts not displaying
- Ensure you have at least 3 data points logged
- Check browser console for errors

## 🤝 Contributing

This is a personal health tracking application. If you'd like to fork and customize it:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use and modify for your own needs.

## 🙏 Acknowledgments

- Dose algorithm based on AC Forum Warfarin nomogram
- Built for patients with mechanical aortic valves requiring anticoagulation
- Inspired by the need for better personal health tracking tools

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation above
- Remember: Always consult your healthcare provider for medical advice

---

**Built with ❤️ for better anticoagulation therapy management**
