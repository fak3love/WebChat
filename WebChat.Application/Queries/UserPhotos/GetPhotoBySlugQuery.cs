using MediatR;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class GetPhotoBySlugQuery : IRequest<byte[]>
    {
        public string PhotoSlug { get; set; }

        public GetPhotoBySlugQuery(string photoSlug)
        {
            PhotoSlug = photoSlug;
        }

        public class Handler : IRequestHandler<GetPhotoBySlugQuery, byte[]>
        {
            private readonly IFileManager _fileManager;

            public Handler(IFileManager fileManager)
            {
                _fileManager = fileManager;
            }

            public async Task<byte[]> Handle(GetPhotoBySlugQuery request, CancellationToken cancellationToken)
            {
                var imageBytes = await _fileManager.ReadAllBytes(request.PhotoSlug + ".jpg");

                return imageBytes;
            }
        }
    }
}
