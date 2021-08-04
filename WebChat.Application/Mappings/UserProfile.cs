using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}
