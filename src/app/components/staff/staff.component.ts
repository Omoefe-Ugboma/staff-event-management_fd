import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StaffService } from '../../services/staff.service';
import { Staff } from '../../models/staff.model';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, CommonModule, ReactiveFormsModule]
})
export class StaffComponent implements OnInit {
  staffList: Staff[] = [];
  filteredStaff: Staff[] = [];
  showForm = false;
  staffForm: FormGroup;
  isEditing = false;
  currentStaffId: string | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';


  constructor(
    private staffService: StaffService,
    private fb: FormBuilder
  ) {
    this.staffForm = this.fb.group({
       department: ['', [Validators.required, Validators.minLength(2)]],
      position: ['', [Validators.required, Validators.minLength(2)]],
      hire_date: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadStaff();
    this.listenToFormChanges(); // Add this for debugging
  }

  listenToFormChanges(): void {
    this.staffForm.valueChanges.subscribe(values => {
      console.log('Form values:', values);
      console.log('Form valid:', this.staffForm.valid);
      console.log('Form errors:', this.staffForm.errors);
      console.log('Department errors:', this.staffForm.get('department')?.errors);
      console.log('Position errors:', this.staffForm.get('position')?.errors);
      console.log('Hire date errors:', this.staffForm.get('hire_date')?.errors);
    });
  }

  loadStaff(): void {
    this.isLoading = true;
    this.staffService.getStaff().subscribe({
      next: (staff) => {
        this.staffList = staff;
        this.filteredStaff = [...staff];
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Failed to load staff', err);
      }
    });
  }

  filterStaff(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredStaff = [...this.staffList];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredStaff = this.staffList.filter(staff => {
      return (
        (staff.username?.toLowerCase().includes(term)) ||
        (staff.position?.toLowerCase().includes(term)) ||
        (staff.department?.toLowerCase().includes(term))
      );
    });
  }

openForm(staff?: Staff): void {
    this.showForm = true;
    if (staff) {
      this.isEditing = true;
      this.currentStaffId = staff.id;
      this.staffForm.patchValue({
        department: staff.department,
        position: staff.position,
        hire_date: this.formatDateForInput(staff.hire_date),
        status: staff.status
      });
    } else {
      this.isEditing = false;
      this.currentStaffId = null;
      this.staffForm.reset({
        status: 'Active'
      });
    }
  }

   onSubmit(): void {
    console.log('Submit clicked'); // Debug log
    if (this.staffForm.valid) {
      this.isLoading = true;
      const formData = {
        ...this.staffForm.value,
        hire_date: new Date(this.staffForm.value.hire_date).toISOString().split('T')[0]
      };

      console.log('Submitting:', formData); // Debug log

      const observable = this.isEditing && this.currentStaffId
        ? this.staffService.updateStaff(this.currentStaffId, formData)
        : this.staffService.createStaff(formData);

      observable.subscribe({
        next: () => {
          this.showSuccess(this.isEditing ? 'Staff updated successfully' : 'Staff created successfully');
          this.loadStaff();
          this.closeForm();
        },
        error: (err) => {
          this.handleError(this.isEditing ? 'Failed to update staff' : 'Failed to create staff', err);
          console.error('Error details:', err); // Debug log
        }
      });
    } else {
      console.log('Form invalid, errors:', this.staffForm.errors); // Debug log
      this.errorMessage = 'Please fill all required fields correctly';
      setTimeout(() => this.errorMessage = '', 3000);
    }
  }

  deleteStaff(id: string): void {
    if (confirm('Are you sure you want to delete this staff record?')) {
      this.isLoading = true;
      this.staffService.deleteStaff(id).subscribe({
        next: () => {
          this.loadStaff();
          this.showSuccess('Staff deleted successfully');
        },
        error: (err) => {
          this.handleError('Failed to delete staff', err);
        }
      });
    }
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
    this.isLoading = false;
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    console.error(error);
    setTimeout(() => this.errorMessage = '', 5000);
    this.isLoading = false;
  }

  closeForm(): void {
    this.showForm = false;
    this.staffForm.reset();
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}