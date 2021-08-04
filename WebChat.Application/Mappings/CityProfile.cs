using AutoMapper;
using WebChat.Application.Dtos.City;
using WebChat.Domain.Entities;

namespace WebChat.Application.Mappings
{
    public class CityProfile : Profile
    {
        public CityProfile()
        {
            CreateMap<City, CityDto>();
            CreateMap<CityDto, City>();
        }
    }
}
