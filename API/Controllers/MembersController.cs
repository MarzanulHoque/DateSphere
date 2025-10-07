using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[Authorize]
public class MembersController(AppDbContext dbContext) : BaseApiController
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
