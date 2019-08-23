using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
	[AllowAnonymous]
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private IConfiguration _config;
		private readonly IMapper _mapper;
		private readonly SignInManager<User> _signInManager;
		private readonly UserManager<User> _userManager;
		public AuthController(IConfiguration config, IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_mapper = mapper;
			_config = config;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
		{

			// userForRegisterDto.UserName = userForRegisterDto.UserName.ToLower();
			// if (await _repo.UserExsists(userForRegisterDto.UserName)) return BadRequest("The user is Exsists");
			var userToCreate = _mapper.Map<User>(userForRegisterDto);
			// var CreatedUser = await _repo.Register(userToCreate, userForRegisterDto.Password);
			var result=await _userManager.CreateAsync(userToCreate,userForRegisterDto.Password);
			var userToReturn = _mapper.Map<UserForDetailsDto>(userToCreate);
			if(result.Succeeded){
			return CreatedAtRoute("GetUser", new { Controller = "Users", id = userToCreate.Id }, userToReturn);

			}
			return BadRequest(result.Errors);
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
		{
			// var userFromRepo = await _repo.Login(userForLoginDto.username, userForLoginDto.password);
			// if (userFromRepo == null) return Unauthorized();
			var userFromUm = await _userManager.FindByNameAsync(userForLoginDto.username);
			var result = await _signInManager.CheckPasswordSignInAsync(userFromUm, userForLoginDto.password, false);
			if(result.Succeeded){
				var appUser=await _userManager.Users
				.Include(p=>p.Photos).FirstOrDefaultAsync(u=>u.NormalizedUserName==userForLoginDto.username.ToUpper());
				var userToReturn = _mapper.Map<UserForListDto>(appUser);
					return Ok(new
			{
				token = this.GenerateJwtTpken(appUser).Result,
				user=userToReturn
			});
			}
			return Unauthorized();
			
		
		}

		private async Task<string> GenerateJwtTpken(User user)
		{
			var claims = new List<Claim>{
									new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
									new Claim(ClaimTypes.Name,user.UserName)
								};
			var roles=await _userManager.GetRolesAsync(user);
			foreach(var role in roles){
				claims.Add(new Claim(ClaimTypes.Role,role));
			}
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
			var tokenDescripror = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(claims),
				Expires = DateTime.Now.AddDays(1),
				SigningCredentials = creds
			};
			var tokenHandler = new JwtSecurityTokenHandler();
			var token = tokenHandler.CreateToken(tokenDescripror);
			return tokenHandler.WriteToken(token);
		}

	}
}