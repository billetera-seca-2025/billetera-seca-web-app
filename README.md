# 🏦 BilleteraSeca

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

A modern, secure, and easy-to-use electronic wallet for all your daily transactions. Manage your money, make P2P transfers, and connect your bank accounts in a single application.

## ✨ Features

- 💰 **Virtual Account Management** - Create your account, check your balance, and manage your finances
- 💸 **P2P Transfers** - Send money to other users via email or unique ID
- 🏦 **Banking Integration** - Load balance from your bank accounts or cards
- 📊 **Transaction History** - View and filter all your operations
- 💳 **Card Linking** - Add cards to easily load balance
- 📱 **Responsive Design** - Perfect experience on mobile and desktop devices
- 🌙 **Dark Mode** - Interface adaptable to your preferences
- 🔒 **Secure Authentication** - Protection of data and transactions

## 🛠️ Technologies

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Design**: Material Design inspired

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/billetera-seca-2025/billetera-seca-web-app.git
cd billetera-seca-front
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📁 Project Structure

```
├── app/                  # Main application folder (App Router)
│   ├── add-money/        # Page to add money
│   ├── dashboard/        # Main dashboard
│   ├── link-card/        # Page to link cards
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── request-debin/    # Page to request DEBIN
│   ├── transactions/     # Transaction history
│   ├── transfer/         # Page to transfer money
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Main layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── navbar.tsx        # Navigation bar
│   ├── theme-provider.tsx # Theme provider (light/dark)
│   └── ui/               # UI components (shadcn)
├── lib/                  # Utilities and functions
│   ├── api.ts            # Simulated API functions
│   ├── constants.ts      # Text constants (i18n)
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
    └── wallet.ts         # Wallet types
```

## 🧪 Testing

### Cypress - End-to-End Testing

1. **Run Cypress**:

```bash
npm run cypress:open
```

2. **Purpose**:

Cypress is used for running automated end-to-end tests to ensure the application works as expected from the user perspective.

3. **Test Location**:

Tests are located in the `cypress` folder.

---

### Jest - Unit Testing

1. **Run Jest Tests**:

```bash
npm run test
```

2. **Purpose**:

Jest is used for running unit tests to validate individual components and functions within the application.

## 💻 Usage

### Authentication

The application includes a simulated authentication system. You can register with any email and password, or use the default credentials:

- **Email**: usuario@ejemplo.com
- **Password**: password123

### Main Functionalities

- **Dashboard**: View your balance and recent transactions
- **Transfers**: Send money to other users via email or ID
- **Add Money**: Load balance from cards or bank accounts
- **DEBIN**: Request immediate debits from your bank account
- **Link Cards**: Add cards to facilitate balance loading

## 🧪 Simulated Features

This application uses a simulated API to demonstrate functionality without the need for a real backend. Transactions, users, and balances are simulated and reset when the page is reloaded.

## 👨‍💻 Author

- **Grupo BilleteraSeca** - Aseguramiento de la calidad de software 2025

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Lucide](https://lucide.dev/) for icons
- [Sonner](https://sonner.emilkowal.ski/) for toast notifications
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Next.js](https://nextjs.org/) for the React framework

---

<p align="center">
  Made with ❤️ to simplify personal finances
</p>
