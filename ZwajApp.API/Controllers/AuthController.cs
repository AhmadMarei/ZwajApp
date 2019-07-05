using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private IAuthRepository _repo;
       private IConfiguration _config;
		public AuthController(IAuthRepository repo,IConfiguration config)
		{
			_repo = repo;
            _config=config;
		}

[HttpPost("register")]
public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto){

    userForRegisterDto.UserName=userForRegisterDto.UserName.ToLower();
    if(await _repo.UserExsists(userForRegisterDto.UserName)) return BadRequest("The user is Exsists");
    var user=new User{
        UserName=userForRegisterDto.UserName
    };
    var CreatedUser=await _repo.Register(user,userForRegisterDto.Password);
    return StatusCode(201);
}

[HttpPost("login")]
public async Task<IActionResult> Login(UserForLoginDto userForLoginDto){
var userFromRepo=await _repo.Login(userForLoginDto.username,userForLoginDto.password);
if(userFromRepo==null) return Unauthorized();
var claims=new []{
new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
new Claim(ClaimTypes.Name,userFromRepo.UserName)
};
var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
var creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha512);
var tokenDescripror=new SecurityTokenDescriptor{
    Subject=new ClaimsIdentity(claims),
    Expires=DateTime.Now.AddDays(1),
    SigningCredentials=creds
};
var tokenHandler=new JwtSecurityTokenHandler();
var token=tokenHandler.CreateToken(tokenDescripror);
return Ok( new {
    token=tokenHandler.WriteToken(token)
});
}

	}
}