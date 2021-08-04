using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class UserPhotoCommentLikeProfile : Profile
    {
        public UserPhotoCommentLikeProfile()
        {
            CreateMap<UserPhotoComment, UserPhotoCommentDto>();
            CreateMap<UserPhotoCommentDto, UserPhotoComment>();
        }
    }
}
