using GitVisualizer.Core.DTOs;

namespace GitVisualizer.API.Services;

public interface IGitHubService
{
    Task<RepoAnalysisDto> AnalyzeRepositoryAsync(string owner, string repo);
}