import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  user = {
    id: 0,
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    dateOfBirth: '',
    status: 'ACTIVE' as 'ACTIVE' | 'PENDING',
    userRoleId: 1,
    userRole: { id: 1, name: 'USER' },
  };

  isEdit: boolean = false;
  errorMessage: string = '';

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
            password: '',
            phoneNumber: userData.phoneNumber,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
            status: userData.status,
            userRoleId: userData.userRole.id,
            userRole: userData.userRole,
          };
        })
        .catch((error) => {
          this.errorMessage = error;
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
      gender: this.user.gender === 'MALE' || this.user.gender === 'FEMALE' ? this.user.gender : 'MALE',
      dateOfBirth: this.user.dateOfBirth,
      status: this.user.status === 'ACTIVE' || this.user.status === 'PENDING' ? this.user.status : 'ACTIVE',
      userRoleId: this.user.userRoleId,
      userRole: this.user.userRole,
    };
  
    this.errorMessage = '';
  
    if (this.isEdit) {
      this.userService
        .updateUser(this.user.id, requestPayload)
        .then((response) => {
          this.router.navigate(['/users']);
        })
        .catch((error) => {
          if (Array.isArray(error.response?.data)) {
            this.errorMessage = error.response.data[0]?.message || 'An unexpected error occurred';
          } else {
            this.errorMessage = error.response?.data || 'An unexpected error occurred';
          }
        });
    } else {
      this.userService
        .createUser(requestPayload)
        .then((response) => {
          this.router.navigate(['/users']);
        })
        .catch((error) => {
          if (Array.isArray(error.response?.data)) {
            this.errorMessage = error.response.data[0]?.message || 'An unexpected error occurred';
          } else {
            this.errorMessage = error.response?.data || 'An unexpected error occurred';
          }
        });
    }
  }   
}
