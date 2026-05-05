namespace GitVisualizer.Core.Models;

public class CommitRecord
{
    public int Id { get; set; }
    public string Sha { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorEmail { get; set; } = string.Empty;
    public DateTime CommittedAt { get; set; }
    public int Additions { get; set; }
    public int Deletions { get; set; }
    public int FilesChanged { get; set; }
    public int RepositoryId { get; set; }
    public Repository Repository { get; set; } = null!;
}