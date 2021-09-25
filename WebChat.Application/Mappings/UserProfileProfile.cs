using AutoMapper;
using WebChat.Application.Dtos;

namespace WebChat.Application.Mappings
{
    public class UserProfileProfile : Profile
    {
        public UserProfileProfile()
        {
            CreateMap<Domain.Entities.UserProfile, UserProfileDto>();
            CreateMap<UserProfileDto, Domain.Entities.UserProfile>();
        }
    }
}
