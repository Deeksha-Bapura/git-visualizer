namespace GitVisualizer.Core.DTOs;

public class RepoAnalysisDto
{
    public string FullName { get; set; } = string.Empty;
    public List<CommitDataPoint> CommitTimeline { get; set; } = new();
    public List<ContributorDataPoint> Contributors { get; set; } = new();
    public List<FileHeatmapPoint> FileHeatmap { get; set; } = new();
}

public class CommitDataPoint
{
    public DateTime Date { get; set; }
    public int Additions { get; set; }
    public int Deletions { get; set; }
    public int FilesChanged { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class ContributorDataPoint
{
    public string Username { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int TotalCommits { get; set; }
    public int TotalAdditions { get; set; }
    public int TotalDeletions { get; set; }
}

public class FileHeatmapPoint
{
    public string FileName { get; set; } = string.Empty;
    public int ChangeCount { get; set; }
    public string LastAuthor { get; set; } = string.Empty;
}