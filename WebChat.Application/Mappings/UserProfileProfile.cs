using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Application.Models;

namespace WebChat.Application.Mappings
{
    public class UserProfileProfile : Profile
    {
        public UserProfileProfile()
        {
            CreateMap<Domain.Entities.UserProfile, UserProfileDto>();
            CreateMap<UserProfileDto, Domain.Entities.UserProfile>();

            CreateMap<Domain.Entities.UserProfile, GeneralUserProfileModel>();
            CreateMap<GeneralUserProfileModel, Domain.Entities.UserProfile>();
        }
    }
}
