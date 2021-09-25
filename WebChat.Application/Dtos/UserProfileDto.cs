using System;

namespace WebChat.Application.Dtos
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StatusMessage { get; set; }
        public string Gender { get; set; }
        public DateTime LastActionDate { get; set; }
        public DateTime? Birthday { get; set; }
        public CityDto City { get; set; }
    }
}
