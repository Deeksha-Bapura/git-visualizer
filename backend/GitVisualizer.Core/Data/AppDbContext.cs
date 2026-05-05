using GitVisualizer.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace GitVisualizer.Core.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Repository> Repositories => Set<Repository>();
    public DbSet<CommitRecord> Commits => Set<CommitRecord>();
    public DbSet<Contributor> Contributors => Set<Contributor>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Repository>()
            .HasIndex(r => r.FullName)
            .IsUnique();

        modelBuilder.Entity<CommitRecord>()
            .HasIndex(c => c.Sha)
            .IsUnique();
    }
}