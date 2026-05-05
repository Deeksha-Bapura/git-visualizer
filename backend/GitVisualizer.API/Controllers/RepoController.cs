using GitVisualizer.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GitVisualizer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RepoController : ControllerBase
{
    private readonly IGitHubService _github;

    public RepoController(IGitHubService github)
    {
        _github = github;
    }

    [HttpGet("analyze")]
    public async Task<IActionResult> Analyze([FromQuery] string owner, [FromQuery] string repo)
    {
        if (string.IsNullOrWhiteSpace(owner) || string.IsNullOrWhiteSpace(repo))
            return BadRequest("Owner and repo are required.");

        var result = await _github.AnalyzeRepositoryAsync(owner, repo);
        return Ok(result);
    }
}