import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionService } from '../transaction.service';
import { Category } from '../transaction.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent {
  transactionForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<AddTransactionComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      type: ['expense', Validators.required],
      category: ['', Validators.required],
      date: [new Date(), Validators.required],
      description: ['']
    });

    this.loadCategories();
    this.transactionForm.get('type')?.valueChanges.subscribe(type => {
      this.filterCategories(type);
    });
  }

  loadCategories(): void {
    this.transactionService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filterCategories(this.transactionForm.value.type);
      },
      error: (error) => console.error('Error loading categories', error)
    });
  }

  filterCategories(type: string): void {
    this.transactionForm.patchValue({ category: '' });
    this.categories = this.categories.filter(cat => cat.type === type);
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.isLoading = true;
      const transactionData = {
        ...this.transactionForm.value,
        date: new Date(this.transactionForm.value.date).toISOString()
      };

      this.transactionService.addTransaction(transactionData).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Thêm giao dịch thành công', 'Đóng', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error adding transaction', error);
          this.isLoading = false;
          this.snackBar.open('Có lỗi xảy ra khi thêm giao dịch', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}