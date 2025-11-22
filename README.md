# Delivro Invoice Management System

A full-stack invoice management system for tracking shipping invoices from multiple carrier partners.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes (Route Handlers)
- **Database**: PostgreSQL (Neon serverless recommended)
- **ORM**: Prisma
- **State Management**: Zustand
- **Validation**: Zod
- **Package Manager**: pnpm

## Features

- Upload invoice data via JSON files
- Preview invoice data before confirmation
- View all shipments in a responsive grid layout
- Filter shipments by company
- View price history for each shipment
- Automatic invoice updates for existing shipments
- Mobile-responsive design
- Internationalization (i18n) support - English and Czech languages

## Prerequisites

- Node.js 20+ installed (LTS version recommended)
- pnpm installed (`npm install -g pnpm`)
- PostgreSQL database (Neon account recommended)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd delivro-interview-task
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**

   Create a free PostgreSQL database on [Neon](https://neon.tech):
   - Sign up at https://neon.tech
   - Create a new project
   - Copy the connection string

4. **Configure environment variables**

   Update `.env.local` with your database URL:
   ```bash
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech:5432/delivro?sslmode=require"
   ```

5. **Run database migrations**
   ```bash
   pnpm prisma migrate dev --name init
   ```

6. **Generate Prisma Client**
   ```bash
   pnpm prisma generate
   ```

## Running the Application

### Development Mode

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

## Usage

### Uploading Invoices

1. Click the "Upload Invoices" button in the header
2. Select a JSON file (e.g., `assignment/data/invoices_1.json`)
3. Preview the data in the table
4. Click "Confirm Upload" to save to the database

### Viewing Shipments

- All shipments are displayed in a grid layout
- Each card shows:
  - Carrier provider (FedEx, UPS, GLS, DPD, PPL)
  - Tracking number
  - Company name
  - Route (origin → destination with flags)
  - Export/Import mode badge
  - Latest price and weight
  - Creation date

### Filtering by Company

- Use the dropdown in the top left to filter shipments by company
- Select "All Companies" to view all shipments

### Viewing Price History

- Click "View History" on any shipment card
- See all invoice records for that shipment
- Latest invoice is highlighted in yellow

### Language Selection

- Use the language switcher in the top right header (🇬🇧 English / 🇨🇿 Čeština)
- Switch between English and Czech languages
- All UI text is automatically translated
- Language preference is maintained via URL path

## Database Schema

### Company
- `id` (String, Primary Key)
- `name` (String)
- Relationships: Has many Shipments

### Shipment
- `id` (String, Primary Key)
- `companyId` (String, Foreign Key)
- `trackingNumber` (String)
- `provider` (String: GLS, DPD, UPS, PPL, FedEx)
- `mode` (String: EXPORT, IMPORT)
- `originCountry` (String, ISO code)
- `destinationCountry` (String, ISO code)
- `createdDate` (DateTime)
- `latestInvoiceId` (String, Foreign Key, nullable)
- Relationships: Belongs to Company, Has many Invoices

### Invoice
- `id` (String, Primary Key)
- `shipmentId` (String, Foreign Key)
- `invoicedWeight` (Float, in KG)
- `invoicedPrice` (Float, in CZK)
- `uploadedAt` (DateTime)
- Relationships: Belongs to Shipment

## Project Structure

```
delivro-interview-task/
├── app/
│   ├── api/                    # API routes
│   │   ├── invoices/
│   │   │   ├── upload/         # Parse JSON file
│   │   │   └── confirm/        # Save to database
│   │   └── shipments/
│   │       ├── route.ts        # Fetch all shipments
│   │       └── [id]/history/   # Fetch invoice history
│   ├── page.tsx                # Main dashboard
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Select.tsx
│   ├── shipments/              # Shipment-related components
│   │   ├── ShipmentCard.tsx
│   │   ├── ShipmentGrid.tsx
│   │   └── CompanyFilter.tsx
│   ├── upload/                 # Upload-related components
│   │   ├── UploadModal.tsx
│   │   └── PreviewTable.tsx
│   └── history/                # History components
│       └── PriceHistoryModal.tsx
├── lib/
│   ├── prisma.ts              # Prisma client singleton
│   ├── utils.ts               # Utility functions
│   └── validations.ts         # Zod schemas
├── prisma/
│   └── schema.prisma          # Database schema
├── store/                     # Zustand stores
│   ├── useUploadStore.ts
│   ├── useHistoryStore.ts
│   └── useShipmentsStore.ts
├── types/
│   └── index.ts               # TypeScript types
└── .env.local                 # Environment variables
```

## API Endpoints

### POST /api/invoices/upload
- **Purpose**: Parse and validate JSON file
- **Body**: FormData with file
- **Response**: Parsed invoice data for preview

### POST /api/invoices/confirm
- **Purpose**: Save confirmed invoices to database
- **Body**: `{ invoices: ParsedInvoice[] }`
- **Response**: Success status with statistics

### GET /api/shipments
- **Purpose**: Fetch all shipments with latest invoice
- **Query**: `?companyId=xxx` (optional)
- **Response**: Array of shipments with details

### GET /api/shipments/[id]/history
- **Purpose**: Fetch invoice history for a shipment
- **Response**: Array of all invoices for the shipment

## Testing

Test the application with the provided sample files:

1. Upload `assignment/data/invoices_1.json`
   - This will create initial shipments
2. Upload `assignment/data/invoices_2.json`
   - This will update some existing shipments and create new ones
3. View price history to see multiple invoices for updated shipments

## Key Features Implemented

- **Invoice Upload Flow**: Upload → Preview → Confirm
- **Price History**: Tracks all invoice versions for each shipment
- **Smart Updates**: Automatically updates existing shipments when new invoices are uploaded for the same shipment ID
- **Company Filtering**: Filter dashboard by specific company
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Visual feedback during data operations
- **Error Handling**: Comprehensive error messages for failed operations
- **Internationalization (i18n)**: Full support for English and Czech languages with easy language switching

## Future Enhancements

- Pagination for large datasets
- Search by tracking number
- Export to CSV/Excel
- Date range filtering
- Additional language support (Slovak, Polish, etc.)
- Docker containerization
- Deployment to Vercel

## Development Notes

- Uses Next.js 16 App Router with Server and Client Components
- Prisma for type-safe database access
- Zustand for lightweight state management
- Tailwind CSS for styling without external UI libraries
- Mobile-first responsive design
- Optimistic UI updates for better UX

## Bonus: Docker & Vercel Deployment

### Adding Docker Support

To containerize this application with Docker, you would need to:

1. **Create a Dockerfile**
   - Start with an official Node.js image (e.g., `node:20-alpine` or `node:22-alpine` for smaller image size)
   - Set up a multi-stage build: first stage for dependencies and build, second stage for production runtime
   - Copy package files and install dependencies with `pnpm install`
   - Copy source code and run `pnpm build` to create production build
   - Expose port 3000 and set the start command to `pnpm start`

2. **Create a .dockerignore file**
   - Exclude `node_modules`, `.next`, `.git`, and other development files
   - This reduces build context size and improves build speed

3. **Add docker-compose.yml (optional)**
   - Define two services: `app` (Next.js) and `postgres` (database)
   - Configure environment variables for database connection
   - Set up a network for service communication
   - Add volume mounts for database persistence

4. **Prisma Considerations**
   - Run `prisma generate` during Docker build process
   - Run `prisma migrate deploy` in the container startup script for production
   - Ensure DATABASE_URL is properly configured in container environment

5. **Environment Variables**
   - Pass DATABASE_URL and other secrets via Docker environment variables
   - Consider using Docker secrets for sensitive data in production

### Deploying on Vercel

Vercel is the recommended platform for Next.js applications. To deploy:

1. **Prepare for Vercel**
   - Ensure all environment variables are documented
   - Verify that `pnpm build` completes successfully
   - Check that the project uses supported Node.js version (20+ LTS recommended)

2. **Database Setup**
   - Keep using Neon PostgreSQL or another serverless PostgreSQL provider
   - Vercel Edge Runtime works best with serverless databases
   - Copy your DATABASE_URL connection string

3. **Connect Repository**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Log into Vercel dashboard and import your repository
   - Vercel will auto-detect Next.js configuration

4. **Configure Build Settings**
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `pnpm install` (auto-detected)
   - Framework Preset: Next.js (auto-detected)

5. **Set Environment Variables**
   - Add DATABASE_URL in Vercel project settings
   - Ensure it's available for both Production and Preview environments
   - Consider adding separate DATABASE_URL for preview deployments

6. **Prisma on Vercel**
   - Add a `postinstall` script in package.json to run `prisma generate`
   - Vercel will automatically run this during deployment
   - Database migrations should be run manually before deployment using `prisma migrate deploy`

7. **Custom Domain (optional)**
   - Add your custom domain in Vercel project settings
   - Configure DNS records (A or CNAME) with your domain provider
   - Vercel automatically provisions SSL certificates

8. **Optimize for Production**
   - Enable Vercel Analytics for performance monitoring
   - Configure caching strategies for API routes if needed
   - Consider enabling Image Optimization for any user-uploaded images
   - Use Vercel Edge Functions for geographically distributed API responses

9. **CI/CD**
   - Vercel automatically deploys on every push to main branch
   - Pull request previews are created automatically
   - Configure deployment protection for production if needed

### Key Differences

- **Docker**: Full control over environment, suitable for self-hosted or cloud VM deployments
- **Vercel**: Zero-config deployment, automatic scaling, built-in CDN, optimized for Next.js

Both approaches work well, but Vercel offers the fastest path to production for Next.js applications, while Docker provides more flexibility for complex infrastructure requirements.

## License

Private project for Delivro interview assessment.
