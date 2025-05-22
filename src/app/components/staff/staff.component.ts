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
  imports: [NavbarComponent, SidebarComponent, CommonModule,
    ReactiveFormsModule]
})
export class StaffComponent implements OnInit {
  staffList: Staff[] = [];
  filteredStaff: Staff[] = [];
  showStaffForm = false;
  staffForm: FormGroup;
  isEditing = false;
  currentStaffId: string | null = null;

  constructor(
    private staffService: StaffService,
    private fb: FormBuilder
  ) {
    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      role: ['Employee', Validators.required],
      hireDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.staffService.getStaff().subscribe(staff => {
      this.staffList = staff;
      this.filteredStaff = [...staff];
    });
  }

  filterStaff(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredStaff = [...this.staffList];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredStaff = this.staffList.filter(staff => 
      staff.name.toLowerCase().includes(term) || 
      staff.email.toLowerCase().includes(term) ||
      staff.department.toLowerCase().includes(term)
    );
  }

  openStaffForm(staff?: Staff): void {
    this.showStaffForm = true;
    if (staff) {
      this.isEditing = true;
      this.currentStaffId = staff.id;
      this.staffForm.patchValue({
        name: staff.name,
        email: staff.email,
        department: staff.department,
        role: staff.role,
        hireDate: this.formatDateForInput(staff.hireDate)
      });
    } else {
      this.isEditing = false;
      this.currentStaffId = null;
      this.staffForm.reset({
        role: 'Employee'
      });
    }
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      const staffData = this.staffForm.value;
      if (this.isEditing && this.currentStaffId) {
        this.staffService.updateStaff(this.currentStaffId, staffData)
          .subscribe(() => this.loadStaff());
      } else {
        this.staffService.createStaff(staffData)
          .subscribe(() => this.loadStaff());
      }
      this.closeStaffForm();
    }
  }

  deleteStaff(id: string): void {
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.staffService.deleteStaff(id)
        .subscribe(() => this.loadStaff());
    }
  }

  closeStaffForm(): void {
    this.showStaffForm = false;
    this.staffForm.reset();
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}