using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class MessageProfile : Profile
    {
        public MessageProfile()
        {
            CreateMap<UserMessage, MessageDto>()
                .ForMember(prop => prop.FirstUserId, conf => conf.MapFrom(prop => prop.InitiatorUserId))
                .ForMember(prop => prop.SecondUserId, conf => conf.MapFrom(prop => prop.TargetUserId));

            CreateMap<MessageDto, UserMessage>()
                .ForMember(prop => prop.InitiatorUserId, conf => conf.MapFrom(prop => prop.FirstUserId))
                .ForMember(prop => prop.TargetUserId, conf => conf.MapFrom(prop => prop.SecondUserId));
        }
    }
}
