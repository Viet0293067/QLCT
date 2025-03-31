export interface Transaction {
    id?: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: Date | string;
    description?: string;
    userId?: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
  }
  
  export interface MonthlySummary {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }