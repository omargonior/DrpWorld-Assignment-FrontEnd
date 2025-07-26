import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  employeeId: string | null = null;
  signatureFile: File | null = null;
  signaturePreview: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      nationalId: ['', Validators.required],
      age: ['', Validators.required],
      signature: ['']
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.employeeId;
    if (this.isEditMode && this.employeeId) {
      this.adminService.getEmployeeById(this.employeeId).subscribe({
        next: (emp) => {
          this.employeeForm.patchValue(emp);
          if (emp.signature) {
            this.signaturePreview = emp.signature;
          }
        },
        error: () => {
          this.snackBar.open('Failed to load employee', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.signatureFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.signaturePreview = reader.result as string;
        this.employeeForm.patchValue({ signature: this.signaturePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;
    this.loading = true;
    this.error = null;
    const formValue = this.employeeForm.value;
    // Prepare payload to match backend
    let emailPrefix = formValue.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    if (!emailPrefix) {
      emailPrefix = (formValue.firstName + formValue.lastName + Date.now()).replace(/[^a-zA-Z0-9]/g, '');
    }
    const payload = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      userName: emailPrefix,
      phoneNumber: formValue.phoneNumber,
      nationalId: formValue.nationalId,
      age: Number(formValue.age),
      signatureUrl: formValue.signature || '',
      password: formValue.password
    };
    console.log('Payload being sent:', payload);
    if (this.isEditMode && this.employeeId) {
      this.adminService.updateEmployee(this.employeeId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Employee updated successfully!';
          this.error = null;
          this.snackBar.open('Employee updated', 'Close', { duration: 2000 });
          // Removed automatic navigation
        },
        error: () => {
          this.loading = false;
          this.success = null;
          this.error = 'Failed to update employee.';
        }
      });
    } else {
      this.adminService.createEmployee(payload).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Employee added successfully!';
          this.error = null;
          this.snackBar.open('Employee added', 'Close', { duration: 2000 });
          // Removed automatic navigation
        },
        error: (err) => {
          this.loading = false;
          // If backend returns 'User created.' as a string in error, treat as success
          if (err && err.error && typeof err.error === 'string' && err.error.includes('User created')) {
            this.success = 'Employee added successfully!';
            this.error = null;
            this.snackBar.open('Employee added', 'Close', { duration: 2000 });
            // Removed automatic navigation
          } else {
            this.success = null;
            this.error = 'Failed to add employee.';
          }
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/admin/employee-list']);
  }
}
