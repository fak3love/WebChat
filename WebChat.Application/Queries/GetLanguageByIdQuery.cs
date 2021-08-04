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
    public class GetLanguageByIdQuery : IRequest<LanguageDto>
    {
        public int Id { get; set; }

        public GetLanguageByIdQuery(int id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<GetLanguageByIdQuery, LanguageDto>
        {
            private readonly IMapper _mapper;

            public Handler(IMapper mapper)
            {
                _mapper = mapper;
            }

            public async Task<LanguageDto> Handle(GetLanguageByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = await Task.FromResult(Languages.Value.FirstOrDefault(language => language.Id == request.Id));

                if (entity is null)
                    throw new NotFoundException(nameof(Language), request.Id);

                var dto = _mapper.Map<LanguageDto>(entity);

                return dto;
            }
        }
    }
}
