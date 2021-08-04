using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class FriendStatusProfile : Profile
    {
        public FriendStatusProfile()
        {
            CreateMap<UserFriendStatus, FriendStatusDto>();
            CreateMap<FriendStatusDto, UserFriendStatus>();
        }
    }
}
