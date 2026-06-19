# 💰 M-Pesa STK Push Payment Application

A lightweight Node.js backend that integrates Safaricom's Daraja API to send **STK Push** (Lipa Na M-Pesa Online) prompts directly to customers' phones. This application allows users to initiate payments by simply entering their phone number and amount.

## ✨ Features

- **STK Push Integration**: Sends a payment prompt directly to a user's M-Pesa registered number.
- **Sandbox Ready**: Fully configured for Safaricom's Sandbox environment for safe testing.
- **Callback Handling**: Automatically processes payment confirmations (success/failure) from M-Pesa.
- **Simple Frontend**: Includes a lightweight HTML test interface for quick demonstrations.
- **Environment Configurable**: Uses `.env` for secure credential management.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [ngrok](https://ngrok.com/) (for exposing your local server to the internet to receive callbacks)
- A [Safaricom Developer](https://developer.safaricom.co.ke/) account

## 🚀 Installation & Setup

### 1. Clone the Repository (or extract the project files)

Navigate to your project directory:
```bash
cd mpesa-stk-app# Mpesa-Prompt
