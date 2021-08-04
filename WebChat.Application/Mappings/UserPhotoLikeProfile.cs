using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class UserPhotoLikeProfile : Profile
    {
        public UserPhotoLikeProfile()
        {
            CreateMap<UserPhotoLike, UserPhotoLikeDto>();
            CreateMap<UserPhotoLikeDto, UserPhotoLike>();
        }
    }
}
