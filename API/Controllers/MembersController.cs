using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MembersController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
    {
        var members = await dbContext.Users.ToListAsync();
        return Ok(members);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AppUser>> GetSingleMember(string id)
    {
        var member = await dbContext.Users.FindAsync(id);
        if (member == null)
            return NotFound();
        return Ok(member);
    }
}
