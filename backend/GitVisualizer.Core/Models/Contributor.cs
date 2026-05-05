namespace GitVisualizer.Core.Models;

public class Contributor
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int TotalCommits { get; set; }
    public int TotalAdditions { get; set; }
    public int TotalDeletions { get; set; }
    public int RepositoryId { get; set; }
    public Repository Repository { get; set; } = null!;
}