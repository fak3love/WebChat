using AutoMapper;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Dtos;
using WebChat.Domain.Collections;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetCityByIdQuery : IRequest<CityDto>
    {
        public int Id { get; set; }

        public GetCityByIdQuery(int id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<GetCityByIdQuery, CityDto>
        {
            private readonly IMapper _mapper;

            public Handler(IMapper mapper)
            {
                _mapper = mapper;
            }

            public Task<CityDto> Handle(GetCityByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = Cities.Values.FirstOrDefault(city => city.Id == request.Id);

                if (entity is null)
                    throw new NotFoundException(nameof(City), request.Id);

                var dto = _mapper.Map<CityDto>(entity);

                return Task.FromResult(dto);
            }
        }
    }
}
