using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class FriendProfile : Profile
    {
        public FriendProfile()
        {
            CreateMap<UserFriend, FriendDto>();
            CreateMap<FriendDto, UserFriend>();
        }
    }
}
