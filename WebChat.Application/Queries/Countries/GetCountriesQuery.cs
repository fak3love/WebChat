using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Dtos;
using WebChat.Domain.Collections;

namespace WebChat.Application.Queries
{
    public class GetCountriesQuery : IRequest<ICollection<CountryDto>>
    {
        public class Handler : IRequestHandler<GetCountriesQuery, ICollection<CountryDto>>
        {
            private readonly IMapper _mapper;

            public Handler(IMapper mapper)
            {
                _mapper = mapper;
            }

            public Task<ICollection<CountryDto>> Handle(GetCountriesQuery request, CancellationToken cancellationToken)
            {
                var countries = Task.FromResult(_mapper.Map<ICollection<CountryDto>>(Countries.Values));

                return countries;
            }
        }
    }
}
