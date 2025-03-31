import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transactions/transaction.service';
import { MonthlySummary } from '../transactions/transaction.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  monthlySummaries: MonthlySummary[] = [];
  currentBalance = 0;
  totalIncome = 0;
  totalExpense = 0;
  isLoading = true;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadMonthlySummary();
  }

  loadMonthlySummary(): void {
    this.transactionService.getMonthlySummary().subscribe({
      next: (summaries) => {
        this.monthlySummaries = summaries;
        this.calculateTotals();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading monthly summary', error);
        this.isLoading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalIncome = this.monthlySummaries.reduce((sum, item) => sum + item.income, 0);
    this.totalExpense = this.monthlySummaries.reduce((sum, item) => sum + item.expense, 0);
    this.currentBalance = this.totalIncome - this.totalExpense;
  }
}