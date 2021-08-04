using AutoMapper;
using System.Linq;
using WebChat.Application.Common.Extensions;
using WebChat.Application.Dtos;

namespace WebChat.Application.Mappings
{
    public class UserProfileProfile : Profile
    {
        public UserProfileProfile()
        {
            CreateMap<Domain.Entities.UserProfile, UserProfileDto>()
               .ForMember(prop => prop.Friends, conf => conf.MapFrom(prop => prop.InitiatorFriends.Join(prop.TargetFriends)))
               .ForMember(prop => prop.Messages, conf => conf.MapFrom(prop => prop.InitiatorMessages.Join(prop.TargetMessages)))
               .ForMember(prop => prop.Photos, conf => conf.MapFrom(prop => prop.UserPhotos))
               .ForMember(prop => prop.PhotoLikes, conf => conf.MapFrom(prop => prop.UserPhotoLikes))
               .ForMember(prop => prop.PhotoComments, conf => conf.MapFrom(prop => prop.UserPhotoComments))
               .ForMember(prop => prop.PhotoCommentLikes, conf => conf.MapFrom(prop => prop.UserPhotoCommentLikes));

            CreateMap<UserProfileDto, Domain.Entities.UserProfile>()
                .ForMember(prop => prop.InitiatorFriends, conf => conf.MapFrom(prop => prop.Friends.Where(x => x.FirstUser.Id == prop.Id)))
                .ForMember(prop => prop.TargetFriends, conf => conf.MapFrom(prop => prop.Friends.Where(x => x.SecondUser.Id == prop.Id)))
                .ForMember(prop => prop.InitiatorMessages, conf => conf.MapFrom(prop => prop.Messages.Where(x => x.FirstUser.Id == prop.Id)))
                .ForMember(prop => prop.TargetMessages, conf => conf.MapFrom(prop => prop.Messages.Where(x => x.SecondUser.Id == prop.Id)))
                .ForMember(prop => prop.UserPhotos, conf => conf.MapFrom(prop => prop.Photos))
                .ForMember(prop => prop.UserPhotoLikes, conf => conf.MapFrom(prop => prop.PhotoLikes))
                .ForMember(prop => prop.UserPhotoComments, conf => conf.MapFrom(prop => prop.PhotoComments))
                .ForMember(prop => prop.UserPhotoCommentLikes, conf => conf.MapFrom(prop => prop.PhotoCommentLikes));
        }
    }
}
