using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Helpers;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class GetUserProfilesByParamsQuery : IRequest<ICollection<ProfileSearchModel>>
    {
        public IQueryCollection Query { get; set; }

        public GetUserProfilesByParamsQuery(IQueryCollection query)
        {
            Query = query;
        }

        public class Handler : IRequestHandler<GetUserProfilesByParamsQuery, ICollection<ProfileSearchModel>>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<ICollection<ProfileSearchModel>> Handle(GetUserProfilesByParamsQuery request, CancellationToken cancellationToken)
            {
                var countryRequest = request.Query["country"].FirstOrDefault().ToLower();
                var cityRequest = request.Query["city"].FirstOrDefault().ToLower();

                string genderQuery = request.Query["gender"].FirstOrDefault()?.ToLower();
                string gender = genderQuery == "male" ? "male" : genderQuery == "female" ? "female" : null;
                int.TryParse(request.Query["startSearch"].FirstOrDefault(), out int startSearch);
                bool.TryParse(request.Query["requiredAvatar"].FirstOrDefault(), out bool requiredAvatar);
                bool.TryParse(request.Query["requiredOnline"].FirstOrDefault(), out bool requiredOnline);
                string country = countryRequest != "none" && countryRequest != null ? countryRequest : null;
                string city = cityRequest != "none" && cityRequest != null ? countryRequest : null;
                int.TryParse(request.Query["ageFrom"].FirstOrDefault(), out int ageFrom);
                int.TryParse(request.Query["ageTo"].FirstOrDefault(), out int ageTo);

                ageFrom = ageFrom > 79 || ageFrom < 14 ? 0 : ageFrom;
                ageTo = ageTo > 79 || ageTo < 14 ? 0 : ageTo;

                string[] names = request.Query["text"].FirstOrDefault()?.ToLower().Split(' ', 2);

                var profiles = (await _context.UserProfiles
                    .Include(prop => prop.City)
                    .ThenInclude(prop => prop.Country)
                    .OrderBy(prop => prop.FirstName)
                    .ThenBy(prop => prop.LastName)
                    .ThenBy(prop => prop.LastActionDate)
                    .Skip(startSearch)
                    .Take(10)
                    .Where(up =>
                        (gender == null || up.Gender == gender) &&
                        (!requiredAvatar || _context.UserPhotos.FirstOrDefault(photo => up.Id == photo.UserProfileId && photo.IsAvatar) != null) &&
                        (!requiredOnline || DateTime.Now.AddMinutes(-5) <= up.LastActionDate) &&
                        (string.IsNullOrEmpty(country) || up.City.Country.Name.ToLower() == country) &&
                        (string.IsNullOrEmpty(city) || up.City.Name.ToLower() == city) &&
                        (names == null || (names.Length == 1 && (up.FirstName.Contains(names[0]) || up.LastName.Contains(names[0]))) || (names.Length == 2 && (up.FirstName.StartsWith(names[0]) && up.LastName.StartsWith(names[1]) || up.FirstName.StartsWith(names[1]) && up.LastName.StartsWith(names[0]))))
                    )
                    .ToListAsync(cancellationToken))
                    .Where(up =>
                        (ageFrom == 0 || (up.Birthday.HasValue && new DateTime((DateTime.Now - up.Birthday.Value).Ticks).Year >= ageFrom)) &&
                        (ageTo == 0 || (up.Birthday.HasValue && new DateTime((DateTime.Now - up.Birthday.Value).Ticks).Year <= ageTo))
                    )
                    .Select(up => new ProfileSearchModel()
                    {
                        Id = up.Id,
                        FirstName = up.FirstName,
                        LastName = up.LastName,
                        Status = up.StatusMessage,
                        Avatar = WebChatContextHelper.TryGetAvatarByUserId(up.Id, _context, _fileManager).Result,
                        IsOnline = requiredOnline ? true : DateTime.Now.AddMinutes(-5) <= up.LastActionDate
                    });

                return profiles.ToList();
            }
        }
    }
}
