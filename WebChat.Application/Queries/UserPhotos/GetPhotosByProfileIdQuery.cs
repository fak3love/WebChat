using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Helpers;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class GetPhotosByProfileIdQuery : IRequest<ICollection<PhotoModel>>
    {
        public int ProfileId { get; set; }
        public int LoadFrom { get; set; }

        public GetPhotosByProfileIdQuery(int profileId, int loadFrom = 0)
        {
            ProfileId = profileId;
            LoadFrom = loadFrom;
        }

        public class Handler : IRequestHandler<GetPhotosByProfileIdQuery, ICollection<PhotoModel>>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<ICollection<PhotoModel>> Handle(GetPhotosByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var photos = await _context.UserPhotos
                    .OrderByDescending(prop => prop.CreatedAt)
                    .Skip(request.LoadFrom)
                    .Take(10)
                    .Where(prop => prop.UserProfileId == request.ProfileId)
                    .Select(prop => new PhotoModel() { Id = prop.Id, Slug = prop.Slug, CreatedAt = prop.CreatedAt })
                    .ToListAsync();

                for (int i = 0; i < photos.Count; i++)
                    photos[i].Src = await WebChatContextHelper.TryGetPhotoBase64BySlug(photos[i].Slug, _fileManager);

                return photos;
            }
        }
    }
}
