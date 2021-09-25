using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebChat.DataAccess.MsSql;

namespace WebChat.Api.Middlewares
{
    public class UserLastActionMiddleware
    {
        private readonly RequestDelegate _next;

        public UserLastActionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, WebChatContext dbcontext)
        {
            await _next(context);

            var strId = context.User.Claims.FirstOrDefault(prop => prop.Type == ClaimTypes.NameIdentifier);

            if (strId is not null)
            {
                var profileId = int.Parse(strId.Value);

                var userProfile = await dbcontext.UserProfiles.FirstOrDefaultAsync(userProfile => userProfile.Id == profileId);

                userProfile.LastActionDate = DateTime.Now;
                await dbcontext.SaveChangesAsync();
            }
        }
    }
}
