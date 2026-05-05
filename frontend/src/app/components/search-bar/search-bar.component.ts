import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  repoInput: string = '';
  error: string = '';

  constructor(private router: Router) {}

  analyze() {
    const parts = this.repoInput.trim().split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      this.error = 'Please enter a valid repo in the format: owner/repo';
      return;
    }
    this.error = '';
    this.router.navigate(['/dashboard', parts[0], parts[1]]);
  }
}