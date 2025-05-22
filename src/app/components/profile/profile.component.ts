import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any;
  showPasswordForm = false;
  passwordForm: FormGroup;
document: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        username: this.currentUser.username,
        email: this.currentUser.email
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      // Call API to update profile
      console.log('Profile updated:', this.profileForm.value);
      alert('Profile updated successfully!');
    }
  }

  onChangePassword(): void {
    this.showPasswordForm = true;
  }

  onSavePassword(): void {
    if (this.passwordForm.valid) {
      // Call API to change password
      console.log('Password changed:', this.passwordForm.value);
      alert('Password changed successfully!');
      this.showPasswordForm = false;
      this.passwordForm.reset();
    }
  }

  onCancelPassword(): void {
    this.showPasswordForm = false;
    this.passwordForm.reset();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = document.getElementById('profile-pic') as HTMLImageElement;
        if (img) {
          img.src = e.target.result;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}