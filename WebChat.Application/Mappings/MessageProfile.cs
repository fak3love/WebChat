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
                .ForMember(prop => prop.FirstUser, conf => conf.MapFrom(prop => prop.InitiatorUser))
                .ForMember(prop => prop.SecondUser, conf => conf.MapFrom(prop => prop.TargetUser));

            CreateMap<MessageDto, UserMessage>()
                .ForMember(prop => prop.InitiatorUser, conf => conf.MapFrom(prop => prop.FirstUser))
                .ForMember(prop => prop.TargetUser, conf => conf.MapFrom(prop => prop.SecondUser));
        }
    }
}
