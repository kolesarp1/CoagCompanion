export const landingContent = {
  hero: {
    preHeadline: "For heart valve patients living with Warfarin",
    headline: "Take Control of Your Anticoagulation Journey",
    story: `After my recent mechanical heart valve surgery, I faced a new reality: **lifelong warfarin therapy** to prevent clots. Frequent lab visits for blood draws, doctor calls till INR stabilizes, **chaotic spreadsheet** to keep the data... As an **IT guy with a clotting disorder**, I knew manual tracking wasn't cutting it. I discovered the CoaguChek INRange device and **built CoagCompanion**. Born from my own frustrations, it's a **simple, intuitive app** to log your INR results, warfarin doses, and see real-time trends. Visualize spikes, dips, and **correlations with diet or meds**. No more guessing—get insights that help you **stay in range and live freer**. If you're on warfarin like me, feel free to use it. I created it to **reclaim control** over my health, and now it's here to help you do the same.`,
    ctaPrimary: "Start Using CoagCompanion Free",
    ctaSecondary: "Explore Interactive Demo",
    trustSignal: "Free to use. Built by a patient, for patients."
  },

  benefits: {
    title: "Why CoagCompanion?",
    subtitle: "Six powerful reasons to take control of your health today",
    items: [
      {
        title: "Track INR Trends",
        description: "Visualize your INR history with beautiful charts. Spot patterns, identify triggers, and stay within your therapeutic range.",
        gradient: "from-blue-600 to-blue-400"
      },
      {
        title: "Monitor Dose History",
        description: "Never forget your Warfarin dose again. Log daily medications and see how they correlate with your INR levels.",
        gradient: "from-purple-600 to-purple-400"
      },
      {
        title: "Feel In Control",
        description: "Empower yourself with data. Make informed decisions with your doctor based on comprehensive tracking.",
        gradient: "from-green-600 to-green-400"
      },
      {
        title: "Never Forget Meds",
        description: "Set reminders for testing and dosing. Stay consistent with your anticoagulation therapy.",
        gradient: "from-yellow-600 to-orange-400"
      },
      {
        title: "Data Always Accessible",
        description: "Your health data synced across devices. Access your history anytime, anywhere—even offline.",
        gradient: "from-cyan-600 to-blue-400"
      },
      {
        title: "Share with Your Doctor",
        description: "Export reports easily. Bring comprehensive data to your appointments for better care.",
        gradient: "from-pink-600 to-purple-400"
      }
    ]
  },

  howItWorks: {
    title: "Your Path to Independence",
    subtitle: "Five simple steps from hospital dependency to health freedom",
    steps: [
      {
        number: 1,
        title: "Get Your CoaguChek Device",
        description: "Obtain a home INR testing device like CoaguChek INRange. Talk to your doctor about at-home testing."
      },
      {
        number: 2,
        title: "Test INR at Home",
        description: "Prick your finger, apply blood to test strip, and get your INR result in seconds—right from your living room."
      },
      {
        number: 3,
        title: "Log Results in App",
        description: "Open CoagCompanion, enter your INR reading, Warfarin dose, and any notes. Takes 30 seconds."
      },
      {
        number: 4,
        title: "Track Trends & Patterns",
        description: "Watch your data transform into beautiful charts. Identify what keeps you in range."
      },
      {
        number: 5,
        title: "Adjust with Doctor Guidance",
        description: "Share your comprehensive history with your physician. Make data-driven dosage decisions together."
      }
    ]
  },

  demo: {
    title: "See It In Action",
    subtitle: "Real tracking. Real insights. Share it with your doctor.",
    badge: "Live Demo Data",
    inrChartLabel: "INR Trend Analysis",
    inrChartSubtitle: "Track your therapeutic range over time",
    doseChartLabel: "Warfarin Dose History",
    doseChartSubtitle: "Visualize dose adjustments and patterns"
  },

  cta: {
    headline: "Ready to Test at Home?",
    subheadline: "The CoaguChek INRange device brings lab-quality INR testing to your living room. No more waiting rooms, no more scheduling hassles.",
    deviceBenefits: [
      "Professional-grade accuracy",
      "Results in seconds",
      "Test anytime, anywhere",
      "Medicare often covers"
    ],
    ctaPrimary: "CoaguChek® INRange",
    ctaPrimaryUrl: "https://diagnostics.roche.com/global/en/products/instruments/coaguchek-inrange.html",
    ctaSecondary: "Start Tracking with CoagCompanion",
    note: "CoaguChek device sold separately. CoagCompanion is a free app to track your results.",
    deviceImageAlt: "CoaguChek INRange home INR testing device"
  }
} as const;
