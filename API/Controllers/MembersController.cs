using Microsoft.AspNetCore.Mvc;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[Authorize]
public class MembersController(IMemberRepository memberRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
    {   
        return Ok(await memberRepository.GetMemberAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Member>> GetSingleMember(string id)
    {
        var member = await memberRepository.GetMemberByIdAsync(id);
        if (member == null)
            return NotFound();
        return Ok(member);
    }

    [HttpGet("{id}/photos")]
    public async Task<ActionResult<IReadOnlyList<Photo>>>GetMemberPhotos(string id)
    {
        return Ok(await memberRepository.GetPhotosForMemberAsync(id));
    }

}
