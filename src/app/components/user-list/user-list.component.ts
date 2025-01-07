import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  permissions: string[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadPermissions();
  }

  loadUsers() {
    this.userService.getUsers()
      .then(response => {
        this.users = response.data;
      })
      .catch(error => {
        console.error('Error loading users', error);
      });
  }

  loadPermissions() {
    const storedPermissions = localStorage.getItem('permissions');
    if (storedPermissions) {
      this.permissions = JSON.parse(storedPermissions);
    }
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  onAddUser() {
    this.router.navigate(['/users/new']);
  }

  onViewUser(id: number) {
    // Implement view user logic if needed
    console.log('View user', id);
  }

  onEditUser(id: number) {
    this.router.navigate([`/users/edit/${id}`]);
  }

  onDeleteUser(id: number) {
    this.userService.deleteUser(id)
      .then(() => {
        this.loadUsers();
      })
      .catch(error => {
        console.error('Error deleting user', error);
      });
  }

  onLogout() {
    // Call logout method from AuthService
    this.authService.logout();
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}