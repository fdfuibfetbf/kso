# Accounts Management System - Complete Developer Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Understanding the Accounts Management System](#understanding-the-accounts-management-system-a-complete-overview)
3. [Complete Setup Guide for Developers](#complete-setup-guide-for-developers)
4. [Accounts Management](#accounts-management)
5. [Vouchers System](#vouchers-system)
6. [Daily Closing](#daily-closing)
7. [Financial Statements](#financial-statements)
8. [Backend Architecture](#backend-architecture-nodejsexpress)
9. [Frontend Architecture](#frontend-architecture-nextjs)
10. [Database Schema](#database-schema-prisma)
11. [System Integrations](#system-integrations)
12. [API Reference](#api-reference)

---

## System Overview

The Accounts Management System is a comprehensive financial management module that handles:
- Chart of Accounts (COA) management
- Voucher entry and processing
- Daily closing reports
- Financial statements (Balance Sheet, Trial Balance, General Journal)
- Integration with Inventory, Purchase Orders, and Direct Orders

---

## Understanding the Accounts Management System: A Complete Overview

### What is the Accounts Management System?

The Accounts Management System is the financial backbone of your business operations. Think of it as a sophisticated digital ledger that tracks every financial transaction, organizes your accounts in a structured hierarchy, and generates comprehensive reports that help you understand your business's financial health. Unlike simple bookkeeping, this system follows double-entry accounting principles, ensuring that every transaction is balanced and traceable.

### The Foundation: Chart of Accounts (COA)

At the heart of the system lies the Chart of Accounts, which is essentially a categorized list of all accounts your business uses. Imagine it as a filing cabinet with three levels of organization. The top level contains major categories like Assets (what you own), Liabilities (what you owe), Capital (your investment), Revenues (money coming in), Expenses (money going out), and Cost (cost of goods sold). Within each category, you have sub-groups that further classify accounts - for example, under Assets, you might have Cash, Bank Accounts, Inventory, and Fixed Assets. Finally, at the most detailed level, you have individual accounts like "Main Cash Account," "ABC Bank Account," or "Office Supplies Expense."

This hierarchical structure isn't just for organization - it's crucial for generating meaningful financial reports. When you create a financial statement, the system automatically groups accounts by their category, making it easy to see your total assets, total liabilities, or total expenses at a glance. Each account can be linked to specific entities like suppliers, customers, or even specific projects, allowing for detailed tracking and reporting.

### The Transaction Engine: Vouchers

Vouchers are the lifeblood of the accounting system. Every financial transaction in your business - whether it's receiving payment from a customer, paying a supplier, transferring money between accounts, or recording any other financial event - is captured through a voucher. The system supports seven different types of vouchers, each designed for specific business scenarios.

When you create a Receipt Voucher, you're recording money coming into your business. The system automatically creates two entries: one debiting (increasing) your cash or bank account, and another crediting (increasing) the account of whoever paid you - be it a customer, a loan provider, or any other source of income. Similarly, a Payment Voucher records money going out, with entries that credit (decrease) your cash or bank account and debit (increase) the account of the recipient - like a supplier, employee, or service provider.

The beauty of this double-entry system is that every voucher must balance. If you receive 10,000 rupees, your cash account increases by 10,000 (debit), and the customer's account increases by 10,000 (credit). The total debits always equal the total credits, ensuring mathematical accuracy and preventing errors. This balancing act happens automatically - you just need to specify the accounts involved and the amounts, and the system handles the rest.

### Automatic Voucher Creation: The Integration Magic

One of the most powerful features is the automatic creation of vouchers when business events occur. When you receive inventory through a Purchase Order, the system doesn't just update your stock levels - it also creates a Purchase Voucher that records the financial impact. This voucher automatically debits your Inventory account (increasing your assets) and credits your Supplier account (increasing what you owe). If you pay immediately, it credits your Cash or Bank account instead.

Similarly, when you make a direct purchase - buying inventory and paying for it immediately - the system creates a Receipt Voucher that records both the inventory addition and the cash payment in a single transaction. This seamless integration means your financial records stay synchronized with your inventory, purchase orders, and sales without manual intervention. The system marks these automatically created vouchers, so you know they're system-generated and shouldn't be manually edited, preserving data integrity.

### Tracking Account Balances: The Running Ledger

Every account in the system maintains a running balance. When you create a voucher, the system doesn't just record the transaction - it also updates the balance of each affected account. This balance represents the net position of that account: for asset accounts, a positive balance means you have that much value; for liability accounts, a positive balance means you owe that much. The system calculates these balances in real-time, considering only approved and cleared transactions (excluding post-dated cheques that haven't cleared yet).

This running balance feature enables powerful reporting capabilities. You can instantly see how much cash you have, how much customers owe you, how much you owe suppliers, or what your total inventory value is. The system tracks these balances chronologically, so you can see not just the current balance, but also how it changed over time through the account ledger.

### Daily Closing: Your Daily Financial Snapshot

The Daily Closing feature provides a comprehensive snapshot of your cash and bank transactions for any given day. Imagine it as a daily financial report card that shows you exactly what happened with your money on that specific date. The system calculates the opening balance (how much you had at the start of the day), lists all receipts (money received), lists all payments (money paid out), and calculates the closing balance (how much you have at the end of the day).

This feature is particularly valuable for cash management and reconciliation. By selecting specific cash or bank accounts, you can see all transactions for those accounts on a particular day, grouped by voucher. The report includes details like voucher numbers, descriptions, and amounts, making it easy to verify transactions and identify any discrepancies. The system also tracks post-dated cheques separately, so you know which payments are pending and when they're expected to clear.

### Financial Statements: Understanding Your Business Health

The system generates three critical financial statements that provide different perspectives on your business's financial position. The Balance Sheet shows what you own (assets), what you owe (liabilities), and your net worth (capital plus profits). It's like a financial photograph taken at a specific point in time, showing your business's financial position. The system automatically calculates your profit or loss by comparing revenues against expenses and costs, then adds this to your capital, ensuring the balance sheet always balances - total assets equal total liabilities plus capital.

The Trial Balance is a comprehensive listing of all accounts with their debit and credit balances for a specific period. It's used to verify that your books are balanced and serves as a foundation for preparing financial statements. The system groups accounts by their categories, making it easy to see totals for each category and identify any imbalances.

The General Journal provides a chronological record of all transactions, showing every debit and credit entry in the order they occurred. This is your complete audit trail - you can see exactly when each transaction happened, which accounts were affected, and the amounts involved. This chronological view is invaluable for auditing, troubleshooting, and understanding the flow of transactions through your business.

### The Approval Workflow: Ensuring Accuracy

Not all vouchers are immediately active in the system. The approval workflow allows designated users to review transactions before they affect account balances. When a voucher is created, it can be marked as pending approval. Once approved, it becomes part of the official records and affects account balances. This two-step process prevents errors and ensures that only verified transactions are recorded.

The system also handles post-dated cheques - payments that are written but won't clear until a future date. These transactions are recorded but marked as post-dated, so they don't affect current balances until they're cleared. When the cheque date arrives, you can clear the voucher, which updates the transaction date and includes it in current balances. This feature is crucial for accurate cash flow management, as it distinguishes between money you have now and money you'll have in the future.

### Multi-Tenancy and User Management

The system is designed to support multiple businesses or users simultaneously, with each user's data completely isolated. When a user creates an account or voucher, it's automatically tagged with their user ID, ensuring they only see and work with their own data. However, the system also supports global accounts - predefined accounts that all users can access, like standard expense categories or common account types. This hybrid approach provides flexibility while maintaining data security and privacy.

The system also supports hierarchical user structures, where a main account (admin) can have multiple sub-users. In this setup, all sub-users' data is linked to the main account, allowing the admin to view consolidated reports across all sub-users while maintaining individual user isolation. This is particularly useful for businesses with multiple branches or departments that need separate accounting but consolidated reporting.

### Integration with Other Systems

The Accounts Management System doesn't exist in isolation - it's deeply integrated with your inventory, purchase order, and sales systems. When you receive inventory through a purchase order, the system automatically creates accounting entries. When you sell products, it records the revenue and cost of goods sold. When you pay suppliers or receive payments from customers, it updates both the accounts and the related business records.

This integration ensures that your financial records are always synchronized with your operational data. You don't need to manually create accounting entries for routine business transactions - the system handles it automatically. This not only saves time but also reduces errors and ensures consistency across all your business systems.

### Reporting and Analysis

Beyond the standard financial statements, the system provides detailed account ledgers that show every transaction affecting a specific account over a period. You can see the opening balance, each transaction with its date and description, and the running balance after each transaction. This detailed view is essential for reconciling accounts, identifying discrepancies, and understanding how account balances changed over time.

The system also supports date-range filtering, allowing you to generate reports for any period - a day, a week, a month, a quarter, or a year. This flexibility enables various types of analysis, from daily cash management to annual financial reporting. All reports can be exported to PDF or other formats, making it easy to share financial information with stakeholders, accountants, or auditors.

### Data Integrity and Audit Trail

Every transaction in the system is timestamped and linked to the user who created it. This creates a complete audit trail - you can see not just what happened, but when it happened and who was responsible. The system uses soft deletes, meaning that when a voucher is deleted, it's not permanently removed but marked as deleted, preserving the audit trail while removing it from active records.

The system also maintains edit history for vouchers. When a voucher is modified, the system can track what changed, when it changed, and who made the change. This level of detail is crucial for compliance, auditing, and troubleshooting. If there's ever a question about a transaction, you can trace its complete history from creation through all modifications.

### Subscription and Access Control

The system includes subscription-based access control, where different subscription levels provide access to different date ranges of historical data. A trial subscription might only allow access to the last two weeks of data, while a premium subscription provides access to a full year or more. This tiered approach allows the system to serve businesses of different sizes and needs while managing data storage and processing costs.

The date range restrictions are enforced at the database query level, ensuring that users can only access data within their subscription limits. This is particularly important for reports and queries that filter by date - the system automatically applies the subscription limits, preventing users from accessing data outside their subscription tier.

### The Complete Financial Picture

When all these components work together, you get a complete, real-time view of your business's financial health. You can see your current cash position, outstanding receivables and payables, inventory value, and overall profitability. You can track how these metrics change over time, identify trends, and make informed business decisions based on accurate, up-to-date financial information.

The system transforms raw transaction data into meaningful insights. Instead of just knowing that you received 50,000 rupees, you can see that it came from Customer A for Invoice #123, was deposited in your Main Bank Account, increased your cash balance from 200,000 to 250,000, and is reflected in your daily closing report and balance sheet. This level of detail and integration makes the Accounts Management System not just a record-keeping tool, but a powerful business intelligence platform that helps you understand and manage your finances effectively.

### Technology Stack
- **Backend**: Node.js (Express.js/TypeScript)
- **Frontend**: Next.js (React with App Router)
- **Database**: PostgreSQL/MySQL with Prisma ORM
- **Authentication**: JWT Token-based
- **API**: RESTful API with Express.js
- **Validation**: Zod (TypeScript-first schema validation)

---

## Complete Setup Guide for Developers

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ or MySQL 8+ installed
- npm or yarn package manager
- Git for version control

### Step 1: Backend Setup

**1.1 Create Backend Directory**
```bash
mkdir accounts-backend && cd accounts-backend
npm init -y
```

**1.2 Install Dependencies**
```bash
# Core dependencies
npm install express cors dotenv
npm install @prisma/client
npm install zod jsonwebtoken bcryptjs

# TypeScript dependencies
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/jsonwebtoken @types/bcryptjs
npm install -D ts-node nodemon prisma
```

**1.3 Initialize Prisma**
```bash
npx prisma init
```

**1.4 Configure Environment Variables**
Create `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/accounts_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
```

**1.5 Create Prisma Schema**
Copy the Prisma schema from the [Database Schema](#database-schema-prisma) section into `prisma/schema.prisma`

**1.6 Run Migrations**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**1.7 Create Project Structure**
```bash
mkdir -p src/{controllers,services,routes,middleware,utils,types}
touch src/app.ts src/types/express.d.ts
```

**1.8 Setup TypeScript**
Create `tsconfig.json` (see Backend Architecture section)

**1.9 Create Express App**
Create `src/app.ts` (see Backend Architecture section)

**1.10 Start Development Server**
```bash
npm run dev
```

### Step 2: Frontend Setup

**2.1 Create Next.js Project**
```bash
npx create-next-app@latest accounts-frontend --typescript --tailwind --app
cd accounts-frontend
```

**2.2 Install Additional Dependencies**
```bash
npm install axios zod sonner date-fns cookies-next
npm install jspdf jspdf-autotable
npm install @radix-ui/react-select @radix-ui/react-dialog
npm install @hookform/resolvers react-hook-form
```

**2.3 Setup shadcn/ui (Optional but Recommended)**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card dialog select label
```

**2.4 Configure Environment Variables**
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**2.5 Create Project Structure**
```bash
mkdir -p app/accounts/{manage,daily-closing,vouchers,reports}
mkdir -p components/{ui,accounts,vouchers,reports}
mkdir -p lib hooks types
```

**2.6 Create API Client**
Create `lib/api-client.ts` (see Frontend Architecture section)

**2.7 Start Development Server**
```bash
npm run dev
```

### Step 3: Database Setup

**3.1 Create Database**
```sql
-- PostgreSQL
CREATE DATABASE accounts_db;

-- MySQL
CREATE DATABASE accounts_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**3.2 Run Prisma Migrations**
```bash
cd accounts-backend
npx prisma migrate dev
```

**3.3 Seed Database (Optional)**
Create `prisma/seed.ts` and run:
```bash
npx prisma db seed
```

### Step 4: Authentication Setup

**4.1 Create JWT Utility**
Create `src/utils/jwt.utils.ts`:
```typescript
import jwt from 'jsonwebtoken';

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
```

**4.2 Create Auth Middleware**
Create `src/middleware/auth.middleware.ts` (see Backend Architecture section)

**4.3 Create Login Route**
```typescript
// src/routes/auth.routes.ts
import { Router } from 'express';
import { generateToken } from '../utils/jwt.utils';

const router = Router();

router.post('/login', async (req, res) => {
  // Validate credentials
  // Generate token
  const token = generateToken({ userId: user.id, roleId: user.roleId });
  res.json({ token });
});

export default router;
```

### Step 5: Testing the Setup

**5.1 Test Backend API**
```bash
# Health check
curl http://localhost:3001/health

# Login (if auth is set up)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

**5.2 Test Frontend**
- Open http://localhost:3000
- Navigate to accounts page
- Check browser console for errors

### Step 6: Development Workflow

**6.1 Backend Development**
```bash
cd accounts-backend
npm run dev  # Starts with nodemon (auto-reload)
```

**6.2 Frontend Development**
```bash
cd accounts-frontend
npm run dev  # Starts Next.js dev server
```

**6.3 Database Changes**
```bash
# After modifying schema.prisma
npx prisma migrate dev --name description_of_change
npx prisma generate
```

**6.4 View Database**
```bash
npx prisma studio  # Opens Prisma Studio GUI
```

### Common Issues & Solutions

**Issue 1: Database Connection Error**
- Check DATABASE_URL in .env
- Verify database is running
- Check user permissions

**Issue 2: Prisma Client Not Generated**
```bash
npx prisma generate
```

**Issue 3: TypeScript Errors**
```bash
npm run type-check  # Check for type errors
```

**Issue 4: CORS Errors**
- Ensure backend CORS is configured
- Check API URL in frontend .env.local

**Issue 5: JWT Token Issues**
- Verify JWT_SECRET is set
- Check token expiration
- Verify token format in Authorization header

---

## Accounts Management

### Overview
The Accounts Management system uses a hierarchical Chart of Accounts (COA) structure:
- **COA Groups** (Top Level): Assets, Liabilities, Capital, Revenues, Expenses, Cost
- **COA Sub-Groups** (Second Level): Categories within each group (e.g., Cash, Bank, Inventory)
- **COA Accounts** (Third Level): Individual accounts

### Backend Implementation (Node.js/Express/Prisma)

#### Prisma Schema: `CoaAccount`
**Location**: `prisma/schema.prisma`

**Prisma Model Definition**:
```prisma
model CoaAccount {
  id              Int      @id @default(autoincrement())
  name            String
  code            String
  userId          Int?     @map("user_id")
  coaGroupId      Int      @map("coa_group_id")
  coaSubGroupId   Int      @map("coa_sub_group_id")
  personId        Int?     @map("person_id")
  description     String?
  type            String?  // mouza, etc.
  isActive        Boolean  @default(true) @map("is_active")
  isDefault       Boolean  @default(false) @map("is_default")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  coaGroup        CoaGroup        @relation(fields: [coaGroupId], references: [id])
  coaSubGroup    CoaSubGroup    @relation(fields: [coaSubGroupId], references: [id])
  person         Person?        @relation(fields: [personId], references: [id])
  transactions   VoucherTransaction[]

  @@index([userId])
  @@index([coaSubGroupId])
  @@map("coa_accounts")
}
```

**Key Fields**:
- `id`: Primary key (auto-increment)
- `name`: Account name
- `code`: Account code
- `userId`: User/company identifier (nullable for global accounts)
- `coaGroupId`: Foreign key to COA Group
- `coaSubGroupId`: Foreign key to COA Sub-Group
- `personId`: Optional link to Person (for person-specific accounts)
- `description`: Account description (optional)
- `isActive`: Active status (boolean, default: true)
- `isDefault`: Default account flag (boolean, default: false)

**Relationships**:
- `coaGroup`: Belongs to one COA Group
- `coaSubGroup`: Belongs to one COA Sub-Group
- `person`: Optional relationship to Person
- `transactions`: Has many VoucherTransactions (for balance calculation)

#### Service: `CoaAccountService`
**Location**: `src/services/coaAccount.service.ts`

**Implementation Guide**:

```typescript
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Zod validation schemas
export const createCoaAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  code: z.string().min(1, 'Account code is required'),
  coaGroupId: z.number().int().positive(),
  coaSubGroupId: z.number().int().positive(),
  personId: z.number().int().positive().optional(),
  description: z.string().optional(),
});

export const updateCoaAccountSchema = createCoaAccountSchema.extend({
  accountId: z.number().int().positive(),
});

export class CoaAccountService {
  /**
   * Get account balance from voucher transactions
   * @param accountId - Account ID
   * @param userId - User ID for filtering
   * @param date - Optional date to calculate balance up to
   * @returns Account balance
   */
  static async getAccountBalance(
    accountId: number,
    userId: number,
    date?: Date
  ): Promise<number> {
    const whereClause: any = {
      coaAccountId: accountId,
      userId,
      isApproved: true,
      voucher: {
        isPostDated: 0, // Only cleared vouchers
      },
    };

    if (date) {
      whereClause.date = {
        lte: date,
      };
    }

    const result = await prisma.voucherTransaction.aggregate({
      where: whereClause,
      _sum: {
        debit: true,
        credit: true,
      },
    });

    const debit = result._sum.debit || 0;
    const credit = result._sum.credit || 0;
    return debit - credit;
  }

  /**
   * List all COA accounts with filters
   */
  static async getAccounts(filters: {
    userId: number;
    isActive?: boolean;
    coaGroupId?: number;
    coaSubGroupId?: number;
  }) {
    const where: any = {
      OR: [
        { userId: filters.userId },
        { userId: null }, // Global accounts
      ],
    };

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters.coaGroupId) {
      where.coaGroupId = filters.coaGroupId;
    }
    if (filters.coaSubGroupId) {
      where.coaSubGroupId = filters.coaSubGroupId;
    }

    return await prisma.coaAccount.findMany({
      where,
      include: {
        coaGroup: true,
        coaSubGroup: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * Create new account
   */
  static async createAccount(data: z.infer<typeof createCoaAccountSchema>, userId: number) {
    // Validate code uniqueness
    const existing = await prisma.coaAccount.findFirst({
      where: {
        code: data.code,
        userId,
      },
    });

    if (existing) {
      throw new Error('Account code already exists');
    }

    return await prisma.coaAccount.create({
      data: {
        ...data,
        userId,
      },
      include: {
        coaGroup: true,
        coaSubGroup: true,
      },
    });
  }

  /**
   * Update existing account
   */
  static async updateAccount(
    accountId: number,
    data: Partial<z.infer<typeof createCoaAccountSchema>>,
    userId: number
  ) {
    // Check if account exists and belongs to user
    const account = await prisma.coaAccount.findFirst({
      where: {
        id: accountId,
        OR: [{ userId }, { userId: null }],
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    if (account.isDefault) {
      throw new Error('Cannot update default account');
    }

    return await prisma.coaAccount.update({
      where: { id: accountId },
      data,
      include: {
        coaGroup: true,
        coaSubGroup: true,
      },
    });
  }

  /**
   * Get cash accounts
   */
  static async getCashAccounts(userId: number, isActive?: boolean) {
    const where: any = {
      OR: [{ userId }, { userId: null }],
      coaSubGroup: {
        type: 'cash',
        isActive: true,
      },
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return await prisma.coaAccount.findMany({
      where,
      include: {
        coaSubGroup: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * Get bank accounts
   */
  static async getBankAccounts(userId: number) {
    return await prisma.coaAccount.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
        coaSubGroup: {
          type: 'bank',
          isActive: true,
        },
        isActive: true,
      },
      include: {
        coaSubGroup: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * Get accounts excluding cash and bank
   */
  static async getAccountsExceptCash(userId: number) {
    return await prisma.coaAccount.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
        coaSubGroup: {
          type: null, // Not cash or bank
          isActive: true,
        },
        isActive: true,
      },
      include: {
        coaSubGroup: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * Get account ledger
   */
  static async getAccountLedger(
    accountId: number,
    userId: number,
    from?: Date,
    to?: Date
  ) {
    const where: any = {
      coaAccountId: accountId,
      userId,
      isApproved: true,
      voucher: {
        isPostDated: 0,
      },
    };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from;
      if (to) where.date.lte = to;
    }

    const transactions = await prisma.voucherTransaction.findMany({
      where,
      include: {
        voucher: {
          select: {
            id: true,
            voucherNo: true,
            type: true,
          },
        },
        coaAccount: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Calculate opening balance (before from date)
    let openingBalance = 0;
    if (from) {
      openingBalance = await this.getAccountBalance(accountId, userId, from);
    }

    // Calculate closing balance
    const closingBalance = await this.getAccountBalance(
      accountId,
      userId,
      to || new Date()
    );

    return {
      openingBalance,
      closingBalance,
      transactions,
    };
  }

  /**
   * Toggle account active status
   */
  static async toggleAccountStatus(accountId: number, userId: number) {
    const account = await prisma.coaAccount.findFirst({
      where: {
        id: accountId,
        OR: [{ userId }, { userId: null }],
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    if (account.isDefault) {
      throw new Error('Cannot deactivate default account');
    }

    return await prisma.coaAccount.update({
      where: { id: accountId },
      data: {
        isActive: !account.isActive,
      },
    });
  }
}
```

#### Controller: `CoaAccountController`
**Location**: `src/controllers/coaAccount.controller.ts`

**Complete Implementation**:

```typescript
import { Request, Response } from 'express';
import { CoaAccountService, createCoaAccountSchema, updateCoaAccountSchema } from '../services/coaAccount.service';
import { authenticateToken } from '../middleware/auth.middleware';

export class CoaAccountController {
  /**
   * GET /api/accounts/coa-accounts
   * List all COA accounts with filters
   */
  static async index(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { isActive, coaGroupId, coaSubGroupId } = req.query;

      const accounts = await CoaAccountService.getAccounts({
        userId,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
        coaGroupId: coaGroupId ? parseInt(coaGroupId as string) : undefined,
        coaSubGroupId: coaSubGroupId ? parseInt(coaSubGroupId as string) : undefined,
      });

      return res.json({ coaAccounts: accounts });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch accounts',
      });
    }
  }

  /**
   * POST /api/accounts/coa-accounts
   * Create new account
   */
  static async store(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const validatedData = createCoaAccountSchema.parse(req.body);
      const account = await CoaAccountService.createAccount(validatedData, userId);

      return res.json({
        status: 'ok',
        message: 'Account created successfully',
        account,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: error.errors[0]?.message || 'Validation failed',
        });
      }
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to create account',
      });
    }
  }

  /**
   * PUT /api/accounts/coa-accounts/:id
   * Update existing account
   */
  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const accountId = parseInt(req.params.id);
      const validatedData = createCoaAccountSchema.partial().parse(req.body);

      const account = await CoaAccountService.updateAccount(accountId, validatedData, userId);

      return res.json({
        status: 'ok',
        message: 'Account updated successfully',
        account,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: error.errors[0]?.message || 'Validation failed',
        });
      }
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to update account',
      });
    }
  }

  /**
   * GET /api/accounts/cash-accounts
   * Get cash accounts
   */
  static async getCashAccounts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
      const accounts = await CoaAccountService.getCashAccounts(userId, isActive);

      return res.json({ coaAccounts: accounts });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch cash accounts',
      });
    }
  }

  /**
   * GET /api/accounts/bank-accounts
   * Get bank accounts
   */
  static async getBankAccounts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const accounts = await CoaAccountService.getBankAccounts(userId);

      return res.json({ coaAccounts: accounts });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch bank accounts',
      });
    }
  }

  /**
   * GET /api/accounts/except-cash
   * Get accounts excluding cash and bank
   */
  static async getAccountsExceptCash(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const accounts = await CoaAccountService.getAccountsExceptCash(userId);

      return res.json({ coaAccounts: accounts });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch accounts',
      });
    }
  }

  /**
   * GET /api/accounts/ledger/:accountId
   * Get account ledger
   */
  static async getAccountLedger(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const accountId = parseInt(req.params.accountId);
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;

      const ledger = await CoaAccountService.getAccountLedger(accountId, userId, from, to);

      return res.json({ ledger });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch ledger',
      });
    }
  }

  /**
   * PATCH /api/accounts/toggle-status/:id
   * Toggle account active status
   */
  static async toggleStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const accountId = parseInt(req.params.id);
      const account = await CoaAccountService.toggleAccountStatus(accountId, userId);

      const message = account.isActive ? 'Account activated successfully' : 'Account deactivated successfully';

      return res.json({
        status: 'ok',
        message,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to toggle account status',
      });
    }
  }
}
```

**Route Setup** (`src/routes/accounts.routes.ts`):

```typescript
import { Router } from 'express';
import { CoaAccountController } from '../controllers/coaAccount.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/coa-accounts', CoaAccountController.index);
router.post('/coa-accounts', CoaAccountController.store);
router.put('/coa-accounts/:id', CoaAccountController.update);
router.get('/cash-accounts', CoaAccountController.getCashAccounts);
router.get('/bank-accounts', CoaAccountController.getBankAccounts);
router.get('/except-cash', CoaAccountController.getAccountsExceptCash);
router.get('/ledger/:accountId', CoaAccountController.getAccountLedger);
router.patch('/toggle-status/:id', CoaAccountController.toggleStatus);

export default router;
```

### Frontend Implementation (Next.js)

#### Main Component: Account Management
**Location**: `app/accounts/manage/page.tsx` (Next.js App Router)

**Complete Implementation Guide**:

```typescript
'use client'; // Client component for interactivity

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface CoaAccount {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  isDefault: boolean;
  coaGroup: {
    id: number;
    name: string;
  };
  coaSubGroup: {
    id: number;
    name: string;
    type: string | null;
  };
}

export default function AccountManagementPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<CoaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<CoaAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/accounts/coa-accounts');
      setAccounts(response.data.coaAccounts);
    } catch (error: any) {
      toast.error('Failed to fetch accounts', {
        description: error.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setIsEditModalOpen(true);
  };

  const handleEditAccount = (account: CoaAccount) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = async (accountId: number) => {
    try {
      await apiClient.patch(`/api/accounts/toggle-status/${accountId}`);
      toast.success('Account status updated successfully');
      fetchAccounts(); // Refresh list
    } catch (error: any) {
      toast.error('Failed to update account status', {
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group accounts by COA Group and Sub-Group
  const groupedAccounts = filteredAccounts.reduce((acc, account) => {
    const groupName = account.coaGroup.name;
    const subGroupName = account.coaSubGroup.name;

    if (!acc[groupName]) {
      acc[groupName] = {};
    }
    if (!acc[groupName][subGroupName]) {
      acc[groupName][subGroupName] = [];
    }

    acc[groupName][subGroupName].push(account);
    return acc;
  }, {} as Record<string, Record<string, CoaAccount[]>>);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manage Accounts</CardTitle>
            <Button onClick={handleCreateAccount}>Add New Account</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <Input
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6"
          />

          {/* Hierarchical Account Display */}
          <div className="space-y-6">
            {Object.entries(groupedAccounts).map(([groupName, subGroups]) => (
              <div key={groupName} className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">{groupName}</h2>
                {Object.entries(subGroups).map(([subGroupName, accounts]) => (
                  <div key={subGroupName} className="ml-4 mb-4">
                    <h3 className="text-lg font-medium mb-2">{subGroupName}</h3>
                    <div className="ml-4 space-y-2">
                      {accounts.map((account) => (
                        <div
                          key={account.id}
                          className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                        >
                          <div>
                            <span className="font-medium">{account.code}</span> - {account.name}
                            {!account.isActive && (
                              <span className="ml-2 text-sm text-gray-500">(Inactive)</span>
                            )}
                            {account.isDefault && (
                              <span className="ml-2 text-sm text-blue-500">(Default)</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAccount(account)}
                            >
                              Edit
                            </Button>
                            {!account.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(account.id)}
                              >
                                {account.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Modal */}
      {isEditModalOpen && (
        <AccountFormModal
          account={selectedAccount}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchAccounts();
          }}
        />
      )}
    </div>
  );
}
```

**Account Form Modal Component** (`app/accounts/manage/components/AccountFormModal.tsx`):

```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AccountFormModalProps {
  account: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AccountFormModal({ account, onClose, onSuccess }: AccountFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    coaGroupId: '',
    coaSubGroupId: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [coaGroups, setCoaGroups] = useState([]);
  const [coaSubGroups, setCoaSubGroups] = useState([]);

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        code: account.code,
        coaGroupId: account.coaGroupId.toString(),
        coaSubGroupId: account.coaSubGroupId.toString(),
        description: account.description || '',
      });
    }
    fetchCoaGroups();
  }, [account]);

  const fetchCoaGroups = async () => {
    try {
      const response = await apiClient.get('/api/accounts/coa-groups');
      setCoaGroups(response.data.groups);
    } catch (error) {
      toast.error('Failed to fetch COA groups');
    }
  };

  const fetchCoaSubGroups = async (groupId: number) => {
    try {
      const response = await apiClient.get(`/api/accounts/coa-sub-groups?groupId=${groupId}`);
      setCoaSubGroups(response.data.subGroups);
    } catch (error) {
      toast.error('Failed to fetch COA sub-groups');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        coaGroupId: parseInt(formData.coaGroupId),
        coaSubGroupId: parseInt(formData.coaSubGroupId),
      };

      if (account) {
        await apiClient.put(`/api/accounts/coa-accounts/${account.id}`, payload);
        toast.success('Account updated successfully');
      } else {
        await apiClient.post('/api/accounts/coa-accounts', payload);
        toast.success('Account created successfully');
      }

      onSuccess();
    } catch (error: any) {
      toast.error('Failed to save account', {
        description: error.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{account ? 'Edit Account' : 'Create New Account'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="code">Account Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="coaGroupId">COA Group</Label>
            <Select
              value={formData.coaGroupId}
              onValueChange={(value) => {
                setFormData({ ...formData, coaGroupId: value, coaSubGroupId: '' });
                fetchCoaSubGroups(parseInt(value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select COA Group" />
              </SelectTrigger>
              <SelectContent>
                {coaGroups.map((group: any) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="coaSubGroupId">COA Sub-Group</Label>
            <Select
              value={formData.coaSubGroupId}
              onValueChange={(value) => setFormData({ ...formData, coaSubGroupId: value })}
              disabled={!formData.coaGroupId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select COA Sub-Group" />
              </SelectTrigger>
              <SelectContent>
                {coaSubGroups.map((subGroup: any) => (
                  <SelectItem key={subGroup.id} value={subGroup.id.toString()}>
                    {subGroup.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : account ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**API Client Setup** (`lib/api-client.ts`):

```typescript
import axios from 'axios';
import { getCookie } from 'cookies-next';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('userToken1');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient };
```

---

## Vouchers System

### Overview
Vouchers are the core transaction mechanism. Each voucher represents a double-entry accounting transaction with debit and credit sides.

### Voucher Types
1. **Receipt Voucher (Type 1)**: Money received
2. **Payment Voucher (Type 2)**: Money paid
3. **Purchase Voucher (Type 3)**: Purchase transactions (auto-generated from PO)
4. **Sales Voucher (Type 4)**: Sales transactions
5. **Contra Voucher (Type 5)**: Cash/Bank transfers
6. **Journal Voucher (Type 6)**: General journal entries
7. **Extended Journal Voucher (Type 7)**: Complex multi-account entries

### Backend Implementation

#### Model: `Voucher`
**Location**: `app/Models/Voucher.php`

**Key Fields**:
- `id`: Primary key
- `voucher_no`: Auto-generated voucher number
- `type`: Voucher type (1-7)
- `date`: Transaction date
- `name`: Voucher description
- `total_amount`: Total transaction amount
- `is_approved`: Approval status (1 = approved, 0 = pending)
- `is_post_dated`: Post-dated cheque flag (0 = cleared, 1 = post-dated, 2 = cancelled)
- `cheque_no`: Cheque number (if applicable)
- `cheque_date`: Cheque date
- `purchase_order_id`: Link to Purchase Order (if auto-generated)
- `is_auto`: Auto-generated flag (1 = system-generated, 0 = manual)
- `user_id`: User/company identifier
- `generated_at`: Original generation date

**Relationships**:
```php
- hasMany(VoucherTransaction::class)
- belongsTo(VoucherType::class)
- belongsTo(PurchaseOrder::class) // Optional
```

**Key Methods**:
- `getVoucherNoAttribute()`: Formats voucher number with type prefix (e.g., "RV001", "PV001")

#### Model: `VoucherTransaction`
**Location**: `app/Models/VoucherTransaction.php`

**Key Fields**:
- `id`: Primary key
- `voucher_id`: Foreign key to Voucher
- `coa_account_id`: Foreign key to COA Account
- `debit`: Debit amount
- `credit`: Credit amount
- `balance`: Running balance for the account
- `description`: Transaction description
- `date`: Transaction date/time
- `land_id`: Optional link to Land/File
- `land_payment_head_id`: Optional payment head
- `plot_id`: Optional link to Plot
- `loan_amortization_id`: Optional link to Loan
- `user_id`: User/company identifier
- `is_approved`: Approval status

**Relationships**:
```php
- belongsTo(Voucher::class)
- belongsTo(CoaAccount::class)
```

#### Controller: `VoucherController`
**Location**: `app/Http/Controllers/VoucherController.php`

**Key Functions**:

1. **`index(Request $req)`** - List vouchers with filters
   - **Filters**:
     - `voucher_no`: Search by voucher number
     - `type`: Voucher type
     - `from`/`to`: Date range
     - `is_approved`: Approval status
     - `is_post_dated`: Post-dated status
     - `coa_group_id`/`coa_sub_group_id`/`coa_account_id`: Account filters
   - **Subscription Package Limits**: Filters by package date range
   - Returns: Array of vouchers with transactions

2. **`store(Request $req)`** - Create new voucher
   - **Parameters**:
     - `type`: Voucher type (required)
     - `date`: Transaction date (required)
     - `total_amount`: Total amount (required)
     - `list`: Array of transactions (required)
     - `account`: Main account (for RV/PV/CV)
     - `cheque_no`: Optional cheque number
     - `cheque_date`: Optional cheque date
     - `name`: Voucher description
   
   - **Transaction Logic**:
     - Auto-generates voucher number based on type
     - Creates voucher record
     - For each transaction in `list`:
       - Calculates previous balance
       - Creates VoucherTransaction with debit/credit
       - Updates running balance
     - For Receipt/Payment/Contra vouchers:
       - Creates opposite entry for cash/bank account
     - Uses database transactions for data integrity
   
   - Returns: Status, message, and voucher ID

3. **`update(Request $req)`** - Update existing voucher
   - **Restrictions**: Cannot update auto-generated vouchers (`is_auto = 1`)
   - **Process**:
     - Deletes old transactions
     - Creates new transactions
     - Recalculates balances
   - Returns: Status and message

4. **`delete(Request $req)`** - Delete voucher
   - **Restrictions**: Cannot delete auto-generated vouchers
   - Soft deletes voucher and transactions
   - Returns: Status and message

5. **`approveOrUnapproveVoucher(Request $req)`** - Toggle approval
   - Updates voucher and all transactions
   - For Type 7 vouchers, also updates plot approval status
   - Returns: Status and message

6. **`clearPostDatedVoucher(Request $req)`** - Clear post-dated cheque
   - Updates `is_post_dated` status
   - Updates transaction dates
   - Records history in `EditedVoucher` table
   - Returns: Status and message

7. **`getVoucherDetails(Request $req)`** - Get single voucher
   - Returns: Voucher with all transactions and related data

8. **`edit(Request $req)`** - Get voucher for editing
   - Formats data for frontend form
   - Separates main account from transaction list
   - Returns: Formatted voucher data

### Frontend Implementation

#### Main Components:

1. **View All Vouchers**
   **Location**: `src/pages/allModules/accounts/vouchers/ViewAll/index.js`
   - Displays voucher list with filters
   - Supports pagination
   - Actions: View, Edit, Delete, Approve

2. **Receipt Voucher**
   **Location**: `src/pages/allModules/accounts/vouchers/ReceiptVoucher/index.js`
   - Form for creating receipt vouchers
   - Account selection (cash/bank)
   - Multiple transaction entries
   - Validation helper: `editPagesValidate.js`

3. **Payment Voucher**
   **Location**: `src/pages/allModules/accounts/vouchers/PaymentVoucher/index.js`
   - Form for creating payment vouchers
   - Similar structure to Receipt Voucher

4. **Contra Voucher**
   **Location**: `src/pages/allModules/accounts/vouchers/CVVoucher/index.js`
   - Cash to Bank or Bank to Cash transfers
   - Two-account entry

5. **Journal Voucher**
   **Location**: `src/pages/allModules/accounts/vouchers/JVVoucher/index.js`
   - General journal entries
   - Multiple debit/credit entries
   - Extended JV for complex entries

**Print Components**:
- `GenerateRVVoucherPDF.js` - Receipt voucher PDF
- `GeneratePVVoucherPDF.js` - Payment voucher PDF
- `GenerateCVVoucherPDF.js` - Contra voucher PDF
- `GenerateJVVoucherPDF.js` - Journal voucher PDF

### Voucher Numbering System
- Format: `[TYPE_PREFIX][NUMBER]`
- Examples: `RV001`, `PV001`, `JV001`
- Auto-incremented per type
- Padded with zeros (e.g., `RV001`, `RV010`, `RV100`)

---

## Daily Closing

### Overview
Daily Closing generates a report showing all cash/bank transactions for a specific date, including opening balances, receipts, payments, and closing balances.

### Backend Implementation

#### Controller: `BusinessReportsController`
**Location**: `app/Http/Controllers/BusinessReportsController.php`

#### Function: `getDailyClosingReport(Request $req)`
**Parameters**:
- `date`: Date in format `DD/MM/YY` (required)
- `coaAccounts`: Array of account IDs (optional, defaults to cash/bank accounts)

**Process**:
1. **User Authentication & Package Validation**:
   - Validates user subscription package
   - Checks date range limits based on package:
     - Trial (Package 1): 2 weeks
     - Basic (Package 2): 1 month
     - Silver (Package 3): 3 months
     - Gold (Package 4): 1 year

2. **Account Selection**:
   - If `coaAccounts` not provided, fetches cash/bank accounts (sub-group IDs 5, 6)
   - Filters by `user_id`

3. **Opening Balance Calculation**:
   - For each account:
     - Sums all transactions before the selected date
     - Formula: `SUM(debit) - SUM(credit)`
     - Only includes approved, non-post-dated vouchers

4. **Debit Transactions (Receipts)**:
   - Fetches all debit transactions for the date
   - Groups by voucher
   - Includes: voucher number, description, account name, amount

5. **Credit Transactions (Payments)**:
   - Fetches all credit transactions for the date
   - Groups by voucher
   - Includes: voucher number, description, account name, amount

6. **Response Structure**:
```json
{
  "status": "ok",
  "coaAccounts": [...],
  "openingBalances": [
    {
      "account_id": 1,
      "account_name": "Cash Account",
      "opening_bal": 50000.00
    }
  ],
  "debitTransactions": [
    {
      "transactions": [
        {"amount": 10000.00},
        {"amount": 0}
      ],
      "descriptionArray": {
        "account": "Customer A",
        "description": "Payment received",
        "voucher_no": "RV001"
      }
    }
  ],
  "creditTransactions": [...]
}
```

**API Endpoint**: `POST /getDailyClosingReport`

### Frontend Implementation

#### Component: Daily Closing
**Location**: `src/pages/allModules/accounts/dailyClosing/index.js`

**Features**:
- Date picker for selecting closing date
- Account selection (multi-select for cash/bank accounts)
- Generate report button
- PDF generation

**Process**:
1. User selects date and accounts
2. Calls `POST /getDailyClosingReport`
3. Fetches related vouchers for the date
4. Generates PDF using `GeneratePDF4` function
5. Displays report with:
   - Opening balances
   - Receipts (debit transactions)
   - Payments (credit transactions)
   - Closing balances (Opening + Receipts - Payments)
   - Post-dated cheque details

**PDF Report Structure**:
- Header: Company info, date
- Opening Balances table
- Receipts table (with voucher details)
- Payments table (with voucher details)
- Closing Balances table
- Post-dated cheques table (if any)

---

## Financial Statements

### Overview
The system generates three main financial statements:
1. **Balance Sheet**: Assets, Liabilities, and Capital
2. **Trial Balance**: All accounts with debit/credit balances
3. **General Journal**: Chronological list of all transactions

### Backend Implementation

#### Controller: `BusinessReportsController`

#### 1. Balance Sheet
**Function**: `getBalanceSheet(Request $req)`

**Parameters**:
- `date`: Date for balance sheet (required)

**Process**:
1. **Fetches COA Groups**:
   - Assets (with depreciation handling)
   - Liabilities
   - Capital
   - Revenues (for profit calculation)
   - Expenses (for profit calculation)
   - Cost (for profit calculation)

2. **Calculates Account Balances**:
   - For each account, sums transactions up to the date
   - Formula: `SUM(debit) - SUM(credit)`
   - Only approved, non-post-dated transactions

3. **Depreciation Handling**:
   - Special handling for fixed assets
   - Combines depreciation sub-groups with assets

4. **Profit/Loss Calculation**:
   - Revenue Sum: Total of all revenue accounts
   - Expense Sum: Total of all expense accounts
   - Cost Sum: Total of all cost accounts
   - Net Profit: `Revenue - Expenses - Cost`
   - Added to Capital section

5. **Response Structure**:
```json
{
  "data": {
    "assets": [...],
    "liabilities": [...],
    "capital": [...],
    "revExp": -50000.00,  // Net profit/loss
    "revenue": 200000.00,
    "expense": 150000.00,
    "cost": 100000.00
  }
}
```

**API Endpoint**: `GET /getBalanceSheet?date=DD/MM/YY`

#### 2. Trial Balance
**Function**: `getTrailBalance(Request $req)`

**Parameters**:
- `from`: Start date (required)
- `to`: End date (required)

**Process**:
1. Fetches all COA Groups with accounts
2. For each account, calculates:
   - Debit total (sum of debits in date range)
   - Credit total (sum of credits in date range)
   - Net balance (debit - credit)
3. Groups by COA Group and Sub-Group
4. Returns hierarchical structure

**Response Structure**:
```json
{
  "data": {
    "assets": [...],
    "liabilities": [...],
    "capital": [...],
    "revenues": [...],
    "expenses": [...],
    "cost": [...]
  }
}
```

**API Endpoint**: `GET /getTrailBalance?from=DD/MM/YY&to=DD/MM/YY`

#### 3. General Journal
**Function**: `getGeneralJournal(Request $req)`

**Parameters**:
- `from`: Start date (optional)
- `to`: End date (optional)

**Process**:
1. Fetches all `VoucherTransaction` records
2. Filters by date range (if provided)
3. Only includes approved, non-post-dated vouchers
4. Includes voucher number and account details
5. Returns chronological list

**Response Structure**:
```json
{
  "data": [
    {
      "id": 1,
      "voucher_id": 1,
      "coa_account_id": 5,
      "debit": 10000.00,
      "credit": 0,
      "date": "2024-01-15 10:30:00",
      "description": "Payment received",
      "voucherNumber": {
        "voucher_no": "RV001",
        "type": 1
      },
      "coaAccount": {
        "name": "Cash Account",
        "code": "001"
      }
    }
  ]
}
```

**API Endpoint**: `GET /getGeneralJournal?from=DD/MM/YY&to=DD/MM/YY`

### Frontend Implementation

#### Financial Statements Pages
**Location**: `src/pages/allModules/accounts/transactions/view/index.js`

**Features**:
- Date range selection
- Report type selection (Balance Sheet, Trial Balance, General Journal)
- PDF/Excel export
- Print functionality
- Real-time data fetching

---

## Backend Architecture (Node.js/Express)

### Directory Structure
```
backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── coaAccount.controller.ts
│   │   ├── voucher.controller.ts
│   │   └── reports.controller.ts
│   ├── services/              # Business logic
│   │   ├── coaAccount.service.ts
│   │   ├── voucher.service.ts
│   │   └── reports.service.ts
│   ├── routes/                # API routes
│   │   ├── accounts.routes.ts
│   │   ├── vouchers.routes.ts
│   │   └── reports.routes.ts
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/                # Utility functions
│   │   ├── date.utils.ts
│   │   ├── validation.utils.ts
│   │   └── response.utils.ts
│   ├── types/                # TypeScript types
│   │   ├── express.d.ts
│   │   └── models.types.ts
│   └── app.ts                # Express app setup
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── .env                      # Environment variables
├── package.json
└── tsconfig.json
```

### Project Setup Guide

**Step 1: Initialize Node.js Project**
```bash
mkdir backend && cd backend
npm init -y
npm install express cors dotenv
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
npm install @prisma/client
npm install -D prisma
npm install zod jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs
```

**Step 2: TypeScript Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Express App Setup** (`src/app.ts`):
```typescript
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import accountsRoutes from './routes/accounts.routes';
import vouchersRoutes from './routes/vouchers.routes';
import reportsRoutes from './routes/reports.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/accounts', accountsRoutes);
app.use('/api/vouchers', vouchersRoutes);
app.use('/api/reports', reportsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
```

**Step 4: Authentication Middleware** (`src/middleware/auth.middleware.ts`):
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  adminId?: number;
  roleId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized - Invalid token' });
  }
};
```

**Step 5: Error Handling Middleware** (`src/middleware/error.middleware.ts`):
```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      status: 'error',
      message: 'Database operation failed',
      error: err.message,
    });
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
};
```

### Key Design Patterns

1. **Service Layer Pattern**: Business logic separated from controllers
   - Controllers handle HTTP requests/responses
   - Services contain business logic and database operations
   - Promotes reusability and testability

2. **Repository Pattern**: Prisma Client acts as repository
   - All database access through Prisma
   - Type-safe queries
   - Easy to mock for testing

3. **Transaction Management**: Prisma transactions for data integrity
   ```typescript
   await prisma.$transaction(async (tx) => {
     // Multiple operations in single transaction
     const voucher = await tx.voucher.create({...});
     await tx.voucherTransaction.createMany({...});
   });
   ```

4. **Multi-tenancy**: User-based data isolation via `userId`
   - All queries filter by `userId` or `userId: null` (global)
   - Middleware extracts user from JWT token

5. **Soft Deletes**: Using `deletedAt` field
   - Records marked as deleted, not physically removed
   - Preserves audit trail

### Authentication & Authorization

**JWT Token Structure**:
```typescript
{
  userId: number,      // User ID
  adminId?: number,   // Admin ID (if user is sub-user)
  roleId: number,     // 2 = admin, others = users
  email: string,
  iat: number,         // Issued at
  exp: number          // Expiration
}
```

**Token Generation** (`src/utils/jwt.utils.ts`):
```typescript
import jwt from 'jsonwebtoken';

export const generateToken = (payload: {
  userId: number;
  adminId?: number;
  roleId: number;
  email: string;
}): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
```

**Role-Based Access Control**:
```typescript
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.roleId !== 2) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
```

### Error Handling

**Validation with Zod**:
```typescript
import { z } from 'zod';

export const createVoucherSchema = z.object({
  type: z.number().int().min(1).max(7),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{2}$/),
  totalAmount: z.number().positive(),
  list: z.array(z.object({
    account: z.object({ id: z.number() }),
    dr: z.number().min(0),
    cr: z.number().min(0),
    description: z.string(),
  })),
});

// Usage in controller
const validatedData = createVoucherSchema.parse(req.body);
```

**Consistent Response Format**:
```typescript
// Success response
res.json({
  status: 'ok',
  message: 'Operation successful',
  data: result,
});

// Error response
res.status(400).json({
  status: 'error',
  message: 'Error description',
  errors: validationErrors, // Optional
});
```

### Environment Variables

**`.env` file**:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/accounts_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# API
API_URL=http://localhost:3001/api
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

---

## Frontend Architecture (Next.js)

### Directory Structure (Next.js App Router)
```
frontend/
├── app/
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Home page
│   ├── accounts/
│   │   ├── layout.tsx                  # Accounts layout
│   │   ├── manage/
│   │   │   └── page.tsx                # Account management
│   │   ├── daily-closing/
│   │   │   └── page.tsx               # Daily closing reports
│   │   ├── vouchers/
│   │   │   ├── page.tsx               # View all vouchers
│   │   │   ├── receipt/
│   │   │   │   └── page.tsx           # Receipt voucher
│   │   │   ├── payment/
│   │   │   │   └── page.tsx           # Payment voucher
│   │   │   ├── contra/
│   │   │   │   └── page.tsx           # Contra voucher
│   │   │   └── journal/
│   │   │       └── page.tsx           # Journal voucher
│   │   └── reports/
│   │       ├── balance-sheet/
│   │       │   └── page.tsx           # Balance sheet
│   │       ├── trial-balance/
│   │       │   └── page.tsx           # Trial balance
│   │       └── general-journal/
│   │           └── page.tsx           # General journal
│   └── api/                            # API routes (if needed)
├── components/
│   ├── ui/                             # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── select.tsx
│   ├── accounts/
│   │   ├── AccountFormModal.tsx
│   │   ├── AccountList.tsx
│   │   └── AccountTree.tsx
│   ├── vouchers/
│   │   ├── VoucherForm.tsx
│   │   ├── VoucherList.tsx
│   │   └── TransactionRow.tsx
│   └── reports/
│       ├── DailyClosingReport.tsx
│       ├── BalanceSheet.tsx
│       └── PDFGenerator.tsx
├── lib/
│   ├── api-client.ts                   # API client setup
│   ├── utils.ts                        # Utility functions
│   └── validations.ts                  # Zod schemas
├── hooks/
│   ├── useAccounts.ts                  # Custom hooks
│   ├── useVouchers.ts
│   └── useAuth.ts
├── types/
│   └── index.ts                        # TypeScript types
├── public/                             # Static assets
├── package.json
├── tsconfig.json
└── next.config.js
```

### Next.js Project Setup

**Step 1: Initialize Next.js Project**
```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npm install axios zod sonner date-fns
npm install @radix-ui/react-select @radix-ui/react-dialog
npm install jspdf jspdf-autotable
npm install cookies-next
```

**Step 2: Environment Variables** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Accounts Management System
```

**Step 3: Next.js Configuration** (`next.config.js`):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### State Management

**1. React Hooks** (Primary):
```typescript
// Custom hook for accounts
export function useAccounts() {
  const [accounts, setAccounts] = useState<CoaAccount[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/accounts/coa-accounts');
      setAccounts(response.data.coaAccounts);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return { accounts, loading, refetch: fetchAccounts };
}
```

**2. Context API** (For global state):
```typescript
// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getCookie('userToken1');
    if (token) {
      // Decode and set user from token
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    // Set cookie and update state
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear cookie and update state
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**3. Server Components** (For data fetching):
```typescript
// app/accounts/page.tsx (Server Component)
import { prisma } from '@/lib/prisma';

export default async function AccountsPage() {
  // Fetch data on server
  const accounts = await prisma.coaAccount.findMany({
    include: {
      coaGroup: true,
      coaSubGroup: true,
    },
  });

  return (
    <div>
      <AccountsList initialAccounts={accounts} />
    </div>
  );
}
```

### API Integration

**API Client** (`lib/api-client.ts`):
```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { toast } from 'sonner';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('userToken1');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('Access denied');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export { apiClient };
```

### Key Components

**1. Form Components with Validation**:
```typescript
// components/vouchers/VoucherForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const voucherSchema = z.object({
  type: z.number().min(1).max(7),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{2}$/),
  totalAmount: z.number().positive(),
  list: z.array(z.object({
    account: z.object({ id: z.number() }),
    dr: z.number().min(0),
    cr: z.number().min(0),
    description: z.string().min(1),
  })).min(1),
});

export function VoucherForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voucherSchema),
  });

  // Form implementation...
}
```

**2. Report Components with PDF Generation**:
```typescript
// components/reports/PDFGenerator.tsx
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateDailyClosingPDF(data: any, date: string) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(16);
  doc.text('Daily Closing Report', 14, 22);
  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 14, 30);

  // Opening Balances Table
  autoTable(doc, {
    head: [['Account', 'Opening Balance']],
    body: data.openingBalances.map((bal: any) => [
      bal.account_name,
      bal.opening_bal.toFixed(2),
    ]),
    startY: 40,
  });

  // Save PDF
  doc.save(`daily-closing-${date}.pdf`);
}
```

**3. Date Formatting Utilities**:
```typescript
// lib/utils.ts
import { format, parse } from 'date-fns';

export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yy'): string {
  const dateObj = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
  return format(dateObj, formatStr);
}

export function parseDate(dateStr: string): Date {
  return parse(dateStr, 'dd/MM/yy', new Date());
}
```

### UI Component Library

**Using shadcn/ui** (Recommended):
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card dialog select
```

**Example Button Component**:
```typescript
// components/ui/button.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium",
          variant === "default" && "bg-primary text-primary-foreground",
          variant === "outline" && "border border-input",
          size === "sm" && "h-9 px-3",
          size === "default" && "h-10 px-4",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
```

### Validation

**Client-side with Zod**:
```typescript
// lib/validations.ts
import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  code: z.string().min(1, 'Account code is required'),
  coaGroupId: z.number().int().positive('Invalid COA Group'),
  coaSubGroupId: z.number().int().positive('Invalid COA Sub-Group'),
});

export type AccountFormData = z.infer<typeof accountSchema>;
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Database Schema (Prisma)

### Complete Prisma Schema
**Location**: `prisma/schema.prisma`

```prisma
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql"
  url      = env("DATABASE_URL")
}

// COA Groups (Top Level: Assets, Liabilities, Capital, Revenues, Expenses, Cost)
model CoaGroup {
  id          Int      @id @default(autoincrement())
  name        String
  code        String
  parent      String   // Assets, Liabilities, Capital, Revenues, Expenses, Cost
  userId      Int?     @map("user_id")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  subGroups   CoaSubGroup[]

  @@index([userId])
  @@map("coa_groups")
}

// COA Sub-Groups (Second Level: Cash, Bank, Inventory, etc.)
model CoaSubGroup {
  id          Int      @id @default(autoincrement())
  coaGroupId  Int      @map("coa_group_id")
  name        String
  code        String
  type        String?  // cash, bank, mouza, etc.
  userId      Int?     @map("user_id")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  coaGroup    CoaGroup     @relation(fields: [coaGroupId], references: [id])
  accounts    CoaAccount[]

  @@index([coaGroupId])
  @@index([userId])
  @@map("coa_sub_groups")
}

// COA Accounts (Third Level: Individual accounts)
model CoaAccount {
  id              Int      @id @default(autoincrement())
  name            String
  code            String
  userId          Int?     @map("user_id")
  coaGroupId      Int      @map("coa_group_id")
  coaSubGroupId   Int      @map("coa_sub_group_id")
  personId        Int?     @map("person_id")
  description     String?
  type            String?  // mouza, etc.
  isActive        Boolean  @default(true) @map("is_active")
  isDefault       Boolean  @default(false) @map("is_default")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  coaGroup        CoaGroup        @relation(fields: [coaGroupId], references: [id])
  coaSubGroup     CoaSubGroup     @relation(fields: [coaSubGroupId], references: [id])
  person          Person?         @relation(fields: [personId], references: [id])
  transactions    VoucherTransaction[]

  @@index([userId])
  @@index([coaSubGroupId])
  @@index([coaGroupId])
  @@map("coa_accounts")
}

// Voucher Types
model VoucherType {
  id          Int      @id @default(autoincrement())
  name        String   // RV, PV, CV, JV, etc.
  code        String
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  vouchers    Voucher[]

  @@map("voucher_types")
}

// Vouchers (Main transaction records)
model Voucher {
  id              Int      @id @default(autoincrement())
  voucherNo       Int      @map("voucher_no")
  type            Int      // 1-7 (Receipt, Payment, Purchase, Sales, Contra, Journal, Extended JV)
  date            DateTime
  name            String?
  totalAmount     Decimal  @map("total_amount") @db.Decimal(15, 2)
  isApproved      Boolean  @default(false) @map("is_approved")
  isPostDated     Int      @default(0) @map("is_post_dated") // 0=cleared, 1=post-dated, 2=cancelled
  chequeNo        String?  @map("cheque_no")
  chequeDate      DateTime? @map("cheque_date")
  purchaseOrderId Int?     @map("purchase_order_id")
  isAuto          Boolean  @default(false) @map("is_auto") // Auto-generated from PO/Invoice
  userId          Int      @map("user_id")
  generatedAt     DateTime @map("generated_at")
  clearedDate     DateTime? @map("cleared_date")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at") // Soft delete

  // Relations
  voucherType     VoucherType?    @relation(fields: [type], references: [id])
  transactions    VoucherTransaction[]
  purchaseOrder   PurchaseOrder?  @relation(fields: [purchaseOrderId], references: [id])

  @@index([userId])
  @@index([type])
  @@index([date])
  @@index([isApproved])
  @@index([isPostDated])
  @@map("vouchers")
}

// Voucher Transactions (Double-entry accounting records)
model VoucherTransaction {
  id                  Int      @id @default(autoincrement())
  voucherId           Int      @map("voucher_id")
  coaAccountId        Int      @map("coa_account_id")
  debit               Decimal  @db.Decimal(15, 2) @default(0)
  credit              Decimal  @db.Decimal(15, 2) @default(0)
  balance             Decimal  @db.Decimal(15, 2) // Running balance for the account
  description         String?
  date                DateTime
  landId              Int?     @map("land_id")
  landPaymentHeadId   Int?     @map("land_payment_head_id")
  plotId              Int?     @map("plot_id")
  loanAmortizationId  Int?     @map("loan_amortization_id")
  userId              Int      @map("user_id")
  isApproved          Boolean  @default(false) @map("is_approved")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")
  deletedAt           DateTime? @map("deleted_at") // Soft delete

  // Relations
  voucher             Voucher      @relation(fields: [voucherId], references: [id])
  coaAccount          CoaAccount  @relation(fields: [coaAccountId], references: [id])

  @@index([voucherId])
  @@index([coaAccountId])
  @@index([userId])
  @@index([date])
  @@index([isApproved])
  @@map("voucher_transactions")
}

// Person (for person-specific accounts)
model Person {
  id          Int      @id @default(autoincrement())
  name        String
  email       String?
  phone       String?
  address     String?
  userId      Int?     @map("user_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  accounts    CoaAccount[]

  @@index([userId])
  @@map("persons")
}

// Purchase Order (for integration)
model PurchaseOrder {
  id          Int      @id @default(autoincrement())
  poNo        String   @map("po_no")
  supplierId  Int      @map("supplier_id")
  total       Decimal  @db.Decimal(15, 2)
  userId      Int      @map("user_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  vouchers    Voucher[]

  @@index([userId])
  @@map("purchase_orders")
}
```

### Database Migration Guide

**Step 1: Initialize Prisma**
```bash
npm install prisma @prisma/client
npx prisma init
```

**Step 2: Configure Database URL**
Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/accounts_db?schema=public"
# or for MySQL:
# DATABASE_URL="mysql://user:password@localhost:3306/accounts_db"
```

**Step 3: Create Migration**
```bash
npx prisma migrate dev --name init
```

**Step 4: Generate Prisma Client**
```bash
npx prisma generate
```

**Step 5: Seed Database (Optional)**
Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed COA Groups
  const assetsGroup = await prisma.coaGroup.create({
    data: {
      name: 'Assets',
      code: '1000',
      parent: 'Assets',
      isActive: true,
    },
  });

  // Seed COA Sub-Groups
  const cashSubGroup = await prisma.coaSubGroup.create({
    data: {
      name: 'Cash',
      code: '1001',
      type: 'cash',
      coaGroupId: assetsGroup.id,
      isActive: true,
    },
  });

  // Seed COA Accounts
  await prisma.coaAccount.create({
    data: {
      name: 'Main Cash Account',
      code: '1001-001',
      coaGroupId: assetsGroup.id,
      coaSubGroupId: cashSubGroup.id,
      isActive: true,
    },
  });

  // Seed Voucher Types
  await prisma.voucherType.createMany({
    data: [
      { name: 'RV', code: 'RV' }, // Receipt Voucher
      { name: 'PV', code: 'PV' }, // Payment Voucher
      { name: 'CV', code: 'CV' }, // Contra Voucher
      { name: 'JV', code: 'JV' }, // Journal Voucher
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
npx prisma db seed
```

### Prisma Client Usage

**Initialize Prisma Client** (`lib/prisma.ts`):
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Relationships

```
CoaGroup (1) ──< (Many) CoaSubGroup (1) ──< (Many) CoaAccount
                                                      │
                                                      │ (Many)
                                                      │
Voucher (1) ──< (Many) VoucherTransaction (Many) ────┘
    │
    │ (optional)
    │
PurchaseOrder
```

### Indexes
- `vouchers.user_id`
- `voucher_transactions.voucher_id`
- `voucher_transactions.coa_account_id`
- `voucher_transactions.date`
- `coa_accounts.user_id`
- `coa_accounts.coa_sub_group_id`

---

## System Integrations

### 1. Inventory System Integration

#### Purchase Order → Voucher Creation
**Location**: `src/services/purchaseOrder.service.ts`

**Complete Implementation**:

```typescript
import { PrismaClient } from '@prisma/client';
import { VoucherService } from './voucher.service';

const prisma = new PrismaClient();

export class PurchaseOrderService {
  /**
   * Receive Purchase Order and create automatic voucher
   */
  static async receivePurchaseOrder(
    purchaseOrderId: number,
    userId: number,
    data: {
      receivedDate: Date;
      childArray: Array<{
        itemId: number;
        receivedQuantity: number;
        purchasePrice: number;
        amount: number;
      }>;
      totalAfterDiscount: number;
      supplierAccountId: number;
      chequeNo?: string;
      chequeDate?: Date;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1. Update Purchase Order status
      const purchaseOrder = await tx.purchaseOrder.update({
        where: { id: purchaseOrderId },
        data: {
          isReceived: true,
          receivedDate: data.receivedDate,
        },
      });

      // 2. Create Inventory records
      for (const item of data.childArray) {
        await tx.itemInventory.create({
          data: {
            purchaseOrderId,
            itemId: item.itemId,
            quantityIn: item.receivedQuantity,
            purchasePrice: item.purchasePrice,
            inventoryTypeId: 1, // Purchase
            userId,
            date: data.receivedDate,
          },
        });
      }

      // 3. Generate voucher number
      const lastVoucher = await tx.voucher.findFirst({
        where: { type: 3 }, // Purchase Voucher
        orderBy: { voucherNo: 'desc' },
      });
      const newVoucherNo = lastVoucher ? lastVoucher.voucherNo + 1 : 1;

      // 4. Create Purchase Voucher (Type 3)
      const voucher = await tx.voucher.create({
        data: {
          voucherNo: newVoucherNo,
          type: 3, // Purchase Voucher
          date: data.receivedDate,
          name: `Purchase Order Number: ${purchaseOrder.poNo}`,
          totalAmount: data.totalAfterDiscount,
          purchaseOrderId,
          isAuto: true,
          isApproved: true,
          isPostDated: data.chequeNo ? 1 : 0,
          chequeNo: data.chequeNo,
          chequeDate: data.chequeDate,
          userId,
          generatedAt: data.receivedDate,
        },
      });

      // 5. Create Voucher Transactions
      // Debit: Inventory Account (for each item)
      for (const item of data.childArray) {
        // Get inventory account for this item
        const inventoryAccount = await tx.coaAccount.findFirst({
          where: {
            coaSubGroup: {
              type: 'inventory',
            },
            userId: { in: [userId, null] },
            isActive: true,
          },
        });

        if (inventoryAccount) {
          // Calculate previous balance
          const prevBalance = await VoucherService.getAccountBalance(
            inventoryAccount.id,
            userId
          );

          await tx.voucherTransaction.create({
            data: {
              voucherId: voucher.id,
              coaAccountId: inventoryAccount.id,
              debit: item.amount,
              credit: 0,
              balance: prevBalance + item.amount,
              description: `Inventory Added - PO: ${purchaseOrder.poNo}`,
              date: data.receivedDate,
              userId,
              isApproved: true,
            },
          });
        }
      }

      // Credit: Supplier Account (total amount)
      const prevSupplierBalance = await VoucherService.getAccountBalance(
        data.supplierAccountId,
        userId
      );

      await tx.voucherTransaction.create({
        data: {
          voucherId: voucher.id,
          coaAccountId: data.supplierAccountId,
          debit: 0,
          credit: data.totalAfterDiscount,
          balance: prevSupplierBalance - data.totalAfterDiscount,
          description: `Purchase Order: ${purchaseOrder.poNo}`,
          date: data.receivedDate,
          userId,
          isApproved: true,
        },
      });

      return { voucher, purchaseOrder };
    });
  }

  /**
   * Direct Purchase Order (immediate purchase and payment)
   */
  static async createDirectPurchaseOrder(
    userId: number,
    data: {
      poNo: string;
      supplierId: number;
      childArray: Array<{
        itemId: number;
        quantity: number;
        purchasePrice: number;
        amount: number;
      }>;
      total: number;
      accountId: number; // Cash/Bank account for payment
      chequeNo?: string;
      chequeDate?: Date;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1. Create Purchase Order
      const purchaseOrder = await tx.purchaseOrder.create({
        data: {
          poNo: data.poNo,
          supplierId: data.supplierId,
          total: data.total,
          userId,
          isReceived: true,
          receivedDate: new Date(),
        },
      });

      // 2. Create Inventory records
      for (const item of data.childArray) {
        await tx.itemInventory.create({
          data: {
            purchaseOrderId: purchaseOrder.id,
            itemId: item.itemId,
            quantityIn: item.quantity,
            purchasePrice: item.purchasePrice,
            inventoryTypeId: 1,
            userId,
            date: new Date(),
          },
        });
      }

      // 3. Generate voucher number (Type 1 - Receipt Voucher)
      const lastVoucher = await tx.voucher.findFirst({
        where: { type: 1 },
        orderBy: { voucherNo: 'desc' },
      });
      const newVoucherNo = lastVoucher ? lastVoucher.voucherNo + 1 : 1;

      // 4. Create Receipt Voucher (Type 1)
      const voucher = await tx.voucher.create({
        data: {
          voucherNo: newVoucherNo,
          type: 1, // Receipt Voucher
          date: new Date(),
          name: `Direct Purchase PO no: ${data.poNo}`,
          totalAmount: data.total,
          purchaseOrderId: purchaseOrder.id,
          isAuto: true,
          isApproved: true,
          isPostDated: data.chequeNo ? 1 : 0,
          chequeNo: data.chequeNo,
          chequeDate: data.chequeDate,
          userId,
          generatedAt: new Date(),
        },
      });

      // 5. Create Voucher Transactions
      // Debit: Supplier Account (for each item)
      const supplierAccount = await tx.coaAccount.findFirst({
        where: {
          personId: data.supplierId,
          userId: { in: [userId, null] },
        },
      });

      if (supplierAccount) {
        for (const item of data.childArray) {
          const prevBalance = await VoucherService.getAccountBalance(
            supplierAccount.id,
            userId
          );

          await tx.voucherTransaction.create({
            data: {
              voucherId: voucher.id,
              coaAccountId: supplierAccount.id,
              debit: item.amount,
              credit: 0,
              balance: prevBalance + item.amount,
              description: `Direct Purchase Order - Inventory Added`,
              date: new Date(),
              userId,
              isApproved: true,
            },
          });
        }
      }

      // Credit: Cash/Bank Account (total payment)
      const prevAccountBalance = await VoucherService.getAccountBalance(
        data.accountId,
        userId
      );

      await tx.voucherTransaction.create({
        data: {
          voucherId: voucher.id,
          coaAccountId: data.accountId,
          debit: 0,
          credit: data.total,
          balance: prevAccountBalance - data.total,
          description: `Direct Purchase Order`,
          date: new Date(),
          userId,
          isApproved: true,
        },
      });

      return { voucher, purchaseOrder };
    });
  }
}
```

**Controller Implementation** (`src/controllers/purchaseOrder.controller.ts`):

```typescript
import { Request, Response } from 'express';
import { PurchaseOrderService } from '../services/purchaseOrder.service';

export class PurchaseOrderController {
  static async receivePurchaseOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      const { purchaseOrderId, receivedDate, childArray, totalAfterDiscount, supplierAccountId, chequeNo, chequeDate } = req.body;

      const result = await PurchaseOrderService.receivePurchaseOrder(
        purchaseOrderId,
        userId,
        {
          receivedDate: new Date(receivedDate),
          childArray,
          totalAfterDiscount,
          supplierAccountId,
          chequeNo,
          chequeDate: chequeDate ? new Date(chequeDate) : undefined,
        }
      );

      return res.json({
        status: 'ok',
        message: 'Purchase Order received successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to receive purchase order',
      });
    }
  }

  static async createDirectPurchaseOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.adminId;
      const { poNo, supplierId, childArray, total, accountId, chequeNo, chequeDate } = req.body;

      const result = await PurchaseOrderService.createDirectPurchaseOrder(
        userId,
        {
          poNo,
          supplierId,
          childArray,
          total,
          accountId,
          chequeNo,
          chequeDate: chequeDate ? new Date(chequeDate) : undefined,
        }
      );

      return res.json({
        status: 'ok',
        message: 'Direct Purchase Order created successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to create direct purchase order',
      });
    }
  }
}
```

#### Inventory Updates
- When inventory is added via PO, `ItemInventory` table is updated
- Voucher records the financial impact
- Inventory quantity and purchase price tracked separately

### 2. Purchase Order System Integration

#### Purchase Order Model
**Location**: `app/Models/PurchaseOrder.php`

**Relationship**:
```php
public function purchasevoucher()
{
    return $this->hasMany(Voucher::class, 'purchase_order_id', 'id');
}
```

#### Voucher Creation Triggers
1. **PO Received**: Creates Type 3 voucher
2. **Direct PO**: Creates Type 1 voucher
3. **PO Return**: Creates reversal voucher (if implemented)

#### Post-Dated Cheque Handling
- If PO payment uses cheque, voucher is marked `is_post_dated = 1`
- Cheque details stored in voucher
- Can be cleared later via `clearPostDatedVoucher` API

### 3. Invoice System Integration

#### Sales Invoice → Voucher
**Location**: `app/Http/Controllers/InvoiceController.php`

**Process** (similar to PO):
- Creates automatic voucher when invoice is created/paid
- Debits: Customer Account or Cash/Bank
- Credits: Sales Account and Inventory (COGS)

### 4. Negative Inventory Handling

#### Function: `vouchersForPendingNegInventory`
**Location**: `app/Http/Controllers/PurchaseOrderController.php`

**Purpose**: Creates vouchers for invoices that were created with negative inventory

**Process**:
1. When inventory becomes available (via PO)
2. Checks for pending invoices with negative inventory
3. Creates vouchers to balance the accounts
4. Updates inventory records

---

## API Reference

### Accounts APIs

#### Get All Accounts
```
GET /getCoaAccounts
Query Parameters:
  - is_active (optional): 0 or 1
Response: { coaAccounts: [...] }
```

#### Create Account
```
POST /addCoaAccount
Body: {
  name: string,
  code: string,
  coa_group_id: int,
  coa_sub_group_id: int,
  person_id: int (optional),
  description: string (optional)
}
Response: { status: 'ok'|'error', message: string }
```

#### Update Account
```
POST /updateCoaAccount
Body: {
  account_id: int,
  name: string,
  code: string,
  coa_group_id: int,
  coa_sub_group_id: int,
  description: string (optional)
}
Response: { status: 'ok'|'error', message: string }
```

#### Get Cash Accounts
```
GET /getCashAccounts
Query Parameters:
  - isActive (optional): 0 or 1
Response: { coaAccounts: [...] }
```

#### Get Account Ledger
```
GET /getAccountLedger
Query Parameters:
  - account_id: int (required)
  - from: string (date, optional)
  - to: string (date, optional)
Response: { ledger: [...] }
```

### Voucher APIs

#### Get Vouchers
```
GET /getVouchers
Query Parameters:
  - voucher_no: string (optional)
  - type: int (optional, 1-7)
  - from: string (date, optional)
  - to: string (date, optional)
  - is_approved: int (optional, 0 or 1)
  - is_post_dated: int (optional, 0-3)
  - coa_group_id: int (optional)
  - coa_sub_group_id: int (optional)
  - coa_account_id: int (optional)
Response: { vouchers: [...] }
```

#### Create Voucher
```
POST /addVoucher
Body: {
  type: int (required, 1-7),
  date: string (required, DD/MM/YY),
  total_amount: decimal (required),
  name: string (optional),
  account: { id: int } (required for types 1,2,5,6),
  list: [
    {
      account: { id: int },
      dr: decimal,
      cr: decimal,
      description: string,
      file_id: { id: int } (optional),
      land_payment_head_id: { id: int } (optional)
    }
  ],
  cheque_no: string (optional),
  cheque_date: string (optional, DD/MM/YY)
}
Response: { status: 'ok'|'error', message: string, id: int }
```

#### Update Voucher
```
POST /updateVoucher
Body: {
  voucher_id: int (required),
  type: int (required),
  date: string (required),
  total_amount: decimal (required),
  list: [...] (same as create),
  account: { id: int },
  isApproved: int (0 or 1),
  cheque_no: string (optional),
  cheque_date: string (optional)
}
Response: { status: 'ok'|'error', message: string }
```

#### Delete Voucher
```
DELETE /deleteVoucher
Query Parameters:
  - voucher_id: int (required)
Response: { status: 'ok'|'error', message: string }
```

#### Approve/Unapprove Voucher
```
POST /approveOrUnapproveVoucher
Body: {
  voucher_id: int (required)
}
Response: { status: 'ok'|'error', message: string }
```

#### Clear Post-Dated Voucher
```
POST /clearPostDatedVoucher
Body: {
  voucher_id: int (required),
  is_post_dated: int (required, 0=clear, 1=post-dated, 2=cancel),
  date: string (required, DD/MM/YY)
}
Response: { status: 'ok'|'error', message: string }
```

#### Get Voucher Details
```
GET /getVoucherDetails
Query Parameters:
  - voucher_id: int (required)
Response: { voucher: {...} }
```

#### Edit Voucher (Get for editing)
```
GET /editVoucher
Query Parameters:
  - voucher_id: int (required)
Response: { voucher: {...} }
```

### Financial Reports APIs

#### Balance Sheet
```
GET /getBalanceSheet
Query Parameters:
  - date: string (required, DD/MM/YY)
Response: {
  data: {
    assets: [...],
    liabilities: [...],
    capital: [...],
    revExp: decimal,
    revenue: decimal,
    expense: decimal,
    cost: decimal
  }
}
```

#### Trial Balance
```
GET /getTrailBalance
Query Parameters:
  - from: string (required, DD/MM/YY)
  - to: string (required, DD/MM/YY)
Response: {
  data: {
    assets: [...],
    liabilities: [...],
    capital: [...],
    revenues: [...],
    expenses: [...],
    cost: [...]
  }
}
```

#### General Journal
```
GET /getGeneralJournal
Query Parameters:
  - from: string (optional, DD/MM/YY)
  - to: string (optional, DD/MM/YY)
Response: { data: [...] }
```

#### Daily Closing Report
```
POST /getDailyClosingReport
Body: {
  date: string (required, DD/MM/YY),
  coaAccounts: [
    { id: int, name: string, coa_sub_group_id: int }
  ] (optional)
}
Response: {
  status: 'ok'|'error',
  coaAccounts: [...],
  openingBalances: [...],
  debitTransactions: [...],
  creditTransactions: [...]
}
```

---

## Data Flow Diagrams

### Voucher Creation Flow
```
User Input → Frontend Validation
    ↓
API Request → VoucherController::store()
    ↓
Database Transaction Start
    ↓
Create Voucher Record
    ↓
For Each Transaction:
    - Calculate Previous Balance
    - Create VoucherTransaction
    - Update Running Balance
    ↓
Create Opposite Entry (if RV/PV/CV)
    ↓
Database Transaction Commit
    ↓
Return Success Response
```

### Purchase Order → Voucher Flow
```
Purchase Order Received
    ↓
PurchaseOrderController::receivePurchaseOrder()
    ↓
Create Inventory Records
    ↓
Create Auto Voucher (Type 3)
    ↓
Debit: Inventory Account (per item)
    ↓
Credit: Supplier Account (total)
    ↓
Link Voucher to PO (purchase_order_id)
    ↓
Return Success
```

### Daily Closing Flow
```
User Selects Date & Accounts
    ↓
Frontend: POST /getDailyClosingReport
    ↓
BusinessReportsController::getDailyClosingReport()
    ↓
Validate Package Date Limits
    ↓
Fetch Accounts (or use provided)
    ↓
For Each Account:
    - Calculate Opening Balance
    - Fetch Debit Transactions
    - Fetch Credit Transactions
    ↓
Format Response
    ↓
Frontend: Generate PDF
    ↓
Display Report
```

---

## Best Practices & Guidelines

### Backend
1. **Always use database transactions** for voucher operations
2. **Validate user_id** in all queries for multi-tenancy
3. **Check subscription package limits** before date-based queries
4. **Use soft deletes** for vouchers and transactions
5. **Calculate balances** dynamically, don't store unless necessary
6. **Auto-generated vouchers** should not be editable/deletable

### Frontend
1. **Validate forms** before API calls
2. **Show loading states** during async operations
3. **Handle errors** gracefully with user-friendly messages
4. **Format currency** consistently (2 decimal places)
5. **Date formatting** should match backend expectations (DD/MM/YY)
6. **PDF generation** should handle large datasets efficiently

### Database
1. **Index frequently queried columns**: `user_id`, `date`, `coa_account_id`
2. **Use foreign keys** for referential integrity
3. **Soft deletes** preserve data history
4. **Balance calculation** should use approved vouchers only

### Security
1. **JWT token validation** on all endpoints
2. **User ID filtering** prevents data leakage
3. **Role-based access** control for sensitive operations
4. **Input validation** prevents SQL injection
5. **Date range limits** based on subscription packages

---

## Troubleshooting

### Common Issues

1. **Voucher Balance Incorrect**
   - Check if all transactions are approved
   - Verify post-dated vouchers are excluded from balance
   - Ensure date filters are correct

2. **Daily Closing Shows Wrong Data**
   - Verify account selection (should be cash/bank accounts)
   - Check date format (DD/MM/YY)
   - Ensure package date limits are not exceeded

3. **Auto Voucher Not Created**
   - Check Purchase Order receive process
   - Verify `is_auto` flag is set
   - Check database transaction rollback

4. **Account Not Appearing**
   - Verify `is_active = 1`
   - Check `user_id` matches current user
   - Ensure sub-group is active

5. **Balance Sheet Not Balancing**
   - Check revenue/expense calculations
   - Verify all accounts are included
   - Ensure depreciation is handled correctly

---

## Future Enhancements

1. **Bank Reconciliation**: Match bank statements with vouchers
2. **Budget vs Actual**: Compare budgeted amounts with actuals
3. **Multi-Currency Support**: Handle transactions in different currencies
4. **Automated Recurring Vouchers**: Schedule recurring transactions
5. **Advanced Reporting**: Custom report builder
6. **Audit Trail**: Detailed change history for all transactions
7. **Approval Workflow**: Multi-level approval for large transactions
8. **Integration with Accounting Software**: Export to QuickBooks, Xero, etc.

---

## Conclusion

This documentation provides a comprehensive overview of the Accounts Management System, including:
- Complete backend and frontend architecture
- Detailed API reference
- Database schema and relationships
- Integration with Inventory and Purchase Order systems
- Best practices and troubleshooting guides

For additional support or questions, refer to the codebase or contact the development team.

---


