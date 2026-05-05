namespace GitVisualizer.Core.Models;

public class Repository
{
    public int Id { get; set; }
    public string Owner { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime LastFetched { get; set; }
    public ICollection<CommitRecord> Commits { get; set; } = new List<CommitRecord>();
}