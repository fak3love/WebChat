using System;

namespace WebChat.Application.Models
{
    public class GeneralUserProfileModel
    {
        public int Id { get; set; }
        public int? CityId { get; set; }
        public int? AvatarId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StatusMessage { get; set; }
        public DateTime Birthday { get; set; }
    }
}
