# Text Summarization App - Azure Deployment Guide

## Prerequisites
1. Azure Account with an active subscription
2. Azure CLI installed
3. Node.js 20.x or later
4. Visual Studio Code with Azure Static Web Apps extension

## Deployment Steps

### 1. Azure Static Web Apps Setup
1. Go to Azure Portal (https://portal.azure.com)
2. Create a new Static Web App resource
3. Configure the following settings:
   - Source: Choose your source control (GitHub/Azure DevOps)
   - Organization: Your organization
   - Repository: This repository
   - Branch: main
   - Build Presets: Custom
   - App location: '/' not   `/client`
   - Api location:  'api' not  `/api`
   - Output location: `dist/public`

### 2. Environment Variables
Add the following environment variables in Azure Static Web Apps configuration:
- `OPENAI_API_KEY`: Your OpenAI API key

### 3. Build Configuration
The build configuration is already set up in the project:
- Frontend build command: `npm run build`
- API build: Automatic with Azure Functions

### 4. Verify Deployment
After deployment:
1. Access your app at the provided Azure URL
2. Test the summarization functionality
3. Verify API responses

## Features Implemented
1. Text summarization using OpenAI GPT-4o
2. Multi-step analysis:
   - Title generation
   - Key facts extraction
   - Summary creation
3. User Interface:
   - Clear text functionality
   - Copy to clipboard with notifications
   - Loading animations
   - Progress indicator
4. Error handling and user feedback
5. Responsive design

## Project Structure
```
├── api/                    # Azure Functions
│   └── summarize/         
│       ├── function.json  # Function configuration
│       └── index.ts       # Function implementation
├── client/                # React frontend
└── staticwebapp.config.json # Azure Static Web Apps config
```

## Local Development
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Access the app at `http://localhost:5000`