using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Dtos;
using WebChat.Domain.Collections;

namespace WebChat.Application.Queries
{
    public class GetLanguagesQuery : IRequest<ICollection<LanguageDto>>
    {
        public class Handler : IRequestHandler<GetLanguagesQuery, ICollection<LanguageDto>>
        {
            private readonly IMapper _mapper;

            public Handler(IMapper mapper)
            {
                _mapper = mapper;
            }

            public Task<ICollection<LanguageDto>> Handle(GetLanguagesQuery request, CancellationToken cancellationToken)
            {
                var languages = Task.FromResult(_mapper.Map<ICollection<LanguageDto>>(Languages.Values));

                return languages;
            }
        }
    }
}
