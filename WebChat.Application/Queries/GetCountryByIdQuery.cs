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
    public class GetCountryByIdQuery : IRequest<CountryDto>
    {
        public int Id { get; set; }

        public GetCountryByIdQuery(int id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<GetCountryByIdQuery, CountryDto>
        {
            private readonly IMapper _mapper;

            public Handler(IMapper mapper)
            {
                _mapper = mapper;
            }

            public async Task<CountryDto> Handle(GetCountryByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = await Task.FromResult(Countries.Value.FirstOrDefault(country => country.Id == request.Id));

                if (entity is null)
                    throw new NotFoundException(nameof(Country), request.Id);

                var dto = _mapper.Map<CountryDto>(entity);

                return dto;
            }
        }
    }
}
