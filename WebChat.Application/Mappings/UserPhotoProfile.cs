using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class UserPhotoProfile : Profile
    {
        public UserPhotoProfile()
        {
            CreateMap<UserPhoto, UserPhotoDto>();
            CreateMap<UserPhotoDto, UserPhoto>();
        }
    }
}
