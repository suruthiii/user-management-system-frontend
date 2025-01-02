import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  // When defining the user object
  user = {
    id: 0,
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: 'MALE' as 'MALE' | 'FEMALE', // Ensure gender is strictly "MALE" | "FEMALE"
    dateOfBirth: '',
    status: 'ACTIVE' as 'ACTIVE' | 'PENDING',
    userRoleId: 1,
    userRole: { id: 1, name: 'USER' },
  };

  isEdit: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userService
        .getUserById(+id)
        .then((response) => {
          const userData = response.data;
          this.user = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: '', // Keep password empty for security reasons
            phoneNumber: userData.phoneNumber,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
            status: userData.status,
            userRoleId: userData.userRole.id, // Assuming userRoleId is required
            userRole: userData.userRole, // Map the entire userRole object
          };
        })
        .catch((error) => {
          console.error('Error loading user data', error);
        });
    }
  }

  onSubmit() {
    const requestPayload = {
      id: this.user.id,
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      phoneNumber: this.user.phoneNumber,
      gender:
        this.user.gender === 'MALE' || this.user.gender === 'FEMALE'
          ? this.user.gender
          : 'MALE', // Default to "MALE" if invalid
      dateOfBirth: this.user.dateOfBirth,
      status:
        this.user.status === 'ACTIVE' || this.user.status === 'PENDING'
          ? this.user.status
          : 'ACTIVE', // Default to "ACTIVE" if invalid
      userRoleId: this.user.userRoleId,
      userRole: this.user.userRole,
    };

    if (this.isEdit) {
      this.userService
        .updateUser(this.user.id, requestPayload)
        .then(() => this.router.navigate(['/users']))
        .catch((error) => {
          console.error('Error updating user', error);
        });
    } else {
      this.userService
        .createUser(requestPayload)
        .then(() => this.router.navigate(['/users']))
        .catch((error) => {
          console.error('Error creating user', error);
        });
    }
  }
}
