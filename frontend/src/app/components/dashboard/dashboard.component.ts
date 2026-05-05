import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GithubService, RepoAnalysis } from '../../services/github.service';
import { ContributorListComponent } from '../contributor-list/contributor-list.component';
import { CommitTimelineComponent } from '../commit-timeline/commit-timeline.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ContributorListComponent, CommitTimelineComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  owner: string = '';
  repo: string = '';
  data: RepoAnalysis | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private githubService: GithubService
  ) {}

  ngOnInit() {
    this.owner = this.route.snapshot.paramMap.get('owner') || '';
    this.repo = this.route.snapshot.paramMap.get('repo') || '';
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = '';
    this.githubService.analyzeRepo(this.owner, this.repo).subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load repository data. Make sure the API is running.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getTopContributor(): string {
    if (!this.data?.contributors.length) return 'N/A';
    return this.data.contributors.reduce((a, b) =>
      a.totalCommits > b.totalCommits ? a : b
    ).username;
  }

  getDateRange(): string {
    if (!this.data?.commitTimeline.length) return 'N/A';
    const dates = this.data.commitTimeline.map(c => new Date(c.date));
    const min = new Date(Math.min(...dates.map(d => d.getTime())));
    const max = new Date(Math.max(...dates.map(d => d.getTime())));
    return `${min.toLocaleDateString()} - ${max.toLocaleDateString()}`;
  }
}