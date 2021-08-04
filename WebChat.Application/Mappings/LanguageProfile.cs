using AutoMapper;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class LanguageProfile : Profile
    {
        public LanguageProfile()
        {
            CreateMap<Language, LanguageDto>();
            CreateMap<LanguageDto, Language>();
        }
    }
}
