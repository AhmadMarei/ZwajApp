using System;
using System.Linq;
using AutoMapper;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Helpers
{
	public class AutoMapperProfiles : Profile
	{

		public AutoMapperProfiles()
		{
			CreateMap<User, UserForListDto>().ForMember(dest => dest.PhotoURL, opt =>
			{
				opt.MapFrom(sou => sou.Photos.FirstOrDefault(p => p.IsMain).Url);
			})
            .ForMember(dest => dest.Age,opt =>opt.ResolveUsing(dest =>dest.DateOfBirth.CalculatAge()));  

			CreateMap<User, UserForDetailsDto>().ForMember(dest => dest.PhotoURL, opt =>
			{
				opt.MapFrom(sou => sou.Photos.FirstOrDefault(p => p.IsMain).Url);
			})
            .ForMember(dest => dest.Age,opt =>opt.ResolveUsing(dest =>dest.DateOfBirth.CalculatAge()));
			CreateMap<Photo, PhotoForDetailsDto>();
		}
	}
}