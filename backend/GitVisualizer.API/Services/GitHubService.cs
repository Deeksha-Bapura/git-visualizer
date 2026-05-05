using GitVisualizer.Core.DTOs;
using GitVisualizer.Core.Data;
using GitVisualizer.Core.Models;
using Microsoft.EntityFrameworkCore;
using Octokit;

// Alias to resolve naming conflict
using RepoModel = GitVisualizer.Core.Models.Repository;

namespace GitVisualizer.API.Services;

public class GitHubService : IGitHubService
{
    private readonly GitHubClient _client;
    private readonly AppDbContext _db;

    public GitHubService(IConfiguration config, AppDbContext db)
    {
        _db = db;
        _client = new GitHubClient(new ProductHeaderValue("GitVisualizer"));
        var token = config["GitHub:Token"];
        if (!string.IsNullOrEmpty(token))
            _client.Credentials = new Credentials(token);
    }

    public async Task<RepoAnalysisDto> AnalyzeRepositoryAsync(string owner, string repo)
    {
        // Check cache first
        var cached = await _db.Repositories
            .Include(r => r.Commits)
            .FirstOrDefaultAsync(r => r.FullName == $"{owner}/{repo}");

        if (cached != null && cached.LastFetched > DateTime.UtcNow.AddHours(-1))
            return MapToDto(cached);

        // Fetch from GitHub
        var commits = await _client.Repository.Commit.GetAll(owner, repo,
            new ApiOptions { PageCount = 5, PageSize = 100 });

        var repoEntity = cached ?? new RepoModel
        {
            Owner = owner,
            Name = repo,
            FullName = $"{owner}/{repo}"
        };

        repoEntity.LastFetched = DateTime.UtcNow;
        repoEntity.Commits.Clear();

        foreach (var commit in commits)
        {
            repoEntity.Commits.Add(new CommitRecord
            {
                Sha = commit.Sha,
                Message = commit.Commit.Message,
                AuthorName = commit.Commit.Author.Name,
                AuthorEmail = commit.Commit.Author.Email,
                CommittedAt = commit.Commit.Author.Date.UtcDateTime,
                FilesChanged = commit.Files?.Count ?? 0
            });
        }

        if (cached == null) _db.Repositories.Add(repoEntity);
        await _db.SaveChangesAsync();

        return MapToDto(repoEntity);
    }

    private RepoAnalysisDto MapToDto(RepoModel repo)
    {
        var contributors = repo.Commits
            .GroupBy(c => c.AuthorName)
            .Select(g => new ContributorDataPoint
            {
                Username = g.Key,
                TotalCommits = g.Count(),
                TotalAdditions = g.Sum(c => c.Additions),
                TotalDeletions = g.Sum(c => c.Deletions)
            }).ToList();

        var timeline = repo.Commits
            .OrderBy(c => c.CommittedAt)
            .Select(c => new CommitDataPoint
            {
                Date = c.CommittedAt,
                Additions = c.Additions,
                Deletions = c.Deletions,
                FilesChanged = c.FilesChanged,
                AuthorName = c.AuthorName,
                Message = c.Message
            }).ToList();

        return new RepoAnalysisDto
        {
            FullName = repo.FullName,
            CommitTimeline = timeline,
            Contributors = contributors
        };
    }
}