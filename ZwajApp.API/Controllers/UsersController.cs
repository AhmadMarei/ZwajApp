using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Helpers;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
	[ServiceFilter(typeof(LogUserActivity))]
	// [Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private IZwajRepository _repo;
		private readonly IMapper _mapper;

		public UsersController(IZwajRepository repo, IMapper mapper)
		{
			_repo = repo;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
		{
			var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
			var userFromRepo = await _repo.GetUser(currentUserId,true);
			userParams.UserId = currentUserId;
			if (string.IsNullOrEmpty(userParams.Gender))
			{
				userParams.Gender = userFromRepo.Gender == "رجل" ? "إمرأة" : "رجل";
			}
			var users = await _repo.GetUsers(userParams);
			var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
			Response.addPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
			return Ok(usersToReturn);
		}
		[HttpGet("{id}", Name = "GetUser")]
		public async Task<IActionResult> GetUser(int id)
		{
			var isCurrentUser=int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)==id;
			var user = await _repo.GetUser(id,isCurrentUser);
			var userToReturn = _mapper.Map<UserForDetailsDto>(user);
			return Ok(userToReturn);
		}
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
		{
			if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
			{
				return Unauthorized();
			}
			var userFromRepo = await _repo.GetUser(id,true);
			_mapper.Map(userForUpdateDto, userFromRepo);
			if (await _repo.SaveAll())
			{
				return NoContent();
			}
			throw new Exception($"{id}حدثت مشكلة في تعديل بيانات المشترك ");
		}
		
		[HttpPost("{id}/like/{recipientId}")]
		public async Task<IActionResult> LikeUser(int id, int recipientId)
		{
			if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
			{
				return Unauthorized();
			}
			var like = await _repo.GetLike(id, recipientId);
			if (like != null)
			{
				return BadRequest("لقد قمت بالاعجاب بهذا المشترك من قبل");
			}
			if (await _repo.GetUser(recipientId,false) == null)
			{
				return NotFound();
			}
			like = new Like
			{
				LikerId = id,
				LikeeId = recipientId
			};
			_repo.Add<Like>(like);
			if (await _repo.SaveAll())
			{
				return Ok();
			}
			return BadRequest("فشل الاعجاب");
		}
	}
}