using System;

namespace WebChat.Application.Models
{
    public class GeneralProfileModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string[] Languages { get; set; }
    }
}
