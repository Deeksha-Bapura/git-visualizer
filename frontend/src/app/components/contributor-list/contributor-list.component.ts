import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributorDataPoint } from '../../services/github.service';

@Component({
  selector: 'app-contributor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contributor-list.component.html',
  styleUrls: ['./contributor-list.component.scss']
})
export class ContributorListComponent {
  @Input() contributors: ContributorDataPoint[] = [];

  get sorted() {
    return [...this.contributors]
      .sort((a, b) => b.totalCommits - a.totalCommits)
      .slice(0, 10);
  }

  getBarWidth(commits: number): string {
    const max = this.sorted[0]?.totalCommits || 1;
    return `${(commits / max) * 100}%`;
  }
}