using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class GetPhotoBaseStringBySlugQuery : IRequest<string>
    {
        public string PhotoSlug { get; set; }

        public GetPhotoBaseStringBySlugQuery(string photoSlug)
        {
            PhotoSlug = photoSlug;
        }

        public class Handler : IRequestHandler<GetPhotoBaseStringBySlugQuery, string>
        {
            private readonly IFileManager _fileManager;

            public Handler(IFileManager fileManager)
            {
                _fileManager = fileManager;
            }

            public async Task<string> Handle(GetPhotoBaseStringBySlugQuery request, CancellationToken cancellationToken)
            {
                var imageBytes = await _fileManager.ReadAllBytes(request.PhotoSlug + ".jpg");

                var photoBaseString = Convert.ToBase64String(imageBytes);

                return photoBaseString;
            }
        }
    }
}
