using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Dtos.City;
using WebChat.Domain.Collections;

namespace WebChat.Application.Queries
{
    public class GetCitiesByCountryNameQuery : IRequest<ICollection<CityDto>>
    {
        public string CountryName { get; }

        public GetCitiesByCountryNameQuery(string countryName)
        {
            CountryName = countryName;
        }

        public class Handler : IRequestHandler<GetCitiesByCountryNameQuery, ICollection<CityDto>>
        {
            private readonly IMapper _mapper;

            public Handler(IMapper mapper)
            {
                _mapper = mapper;
            }

            public async Task<ICollection<CityDto>> Handle(GetCitiesByCountryNameQuery request, CancellationToken cancellationToken)
            {
                var country = await Task.FromResult(Countries.Value.FirstOrDefault(country => country.Name == request.CountryName));

                var cities = await Task.FromResult(_mapper.Map<ICollection<CityDto>>(Cities.Value.Where(city => city.CountryId == country?.Id)));

                return cities;
            }
        }
    }
}
