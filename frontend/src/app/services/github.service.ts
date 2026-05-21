import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommitDataPoint {
  date: string;
  additions: number;
  deletions: number;
  filesChanged: number;
  authorName: string;
  message: string;
}

export interface ContributorDataPoint {
  username: string;
  avatarUrl: string;
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
}

export interface RepoAnalysis {
  fullName: string;
  commitTimeline: CommitDataPoint[];
  contributors: ContributorDataPoint[];
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://git-visualizer-60tr.onrender.com/api';

  constructor(private http: HttpClient) {}

  analyzeRepo(owner: string, repo: string): Observable<RepoAnalysis> {
    return this.http.get<RepoAnalysis>(`${this.apiUrl}/repo/analyze?owner=${owner}&repo=${repo}`);
  }
}