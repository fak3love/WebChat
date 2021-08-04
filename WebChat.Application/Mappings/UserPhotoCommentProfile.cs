using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class UserPhotoCommentProfile : Profile
    {
        public UserPhotoCommentProfile()
        {
            CreateMap<UserPhotoComment, UserPhotoCommentDto>();
            CreateMap<UserPhotoCommentDto, UserPhotoComment>();
        }
    }
}
