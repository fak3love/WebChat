using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Dtos;
using WebChat.Domain.Collections;

namespace WebChat.Application.Queries
{
    public class GetCitiesQuery : IRequest<ICollection<CityDto>>
    {
        public class Handler : IRequestHandler<GetCitiesQuery, ICollection<CityDto>>
        {
            private readonly IMapper _mapper;

            public Handler(IMapper mapper)
            {
                _mapper = mapper;
            }

            public Task<ICollection<CityDto>> Handle(GetCitiesQuery request, CancellationToken cancellationToken)
            {
                var cities = Task.FromResult(_mapper.Map<ICollection<CityDto>>(Cities.Values));

                return cities;
            }
        }
    }
}
