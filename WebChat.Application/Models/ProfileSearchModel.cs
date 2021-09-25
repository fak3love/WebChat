namespace WebChat.Application.Models
{
    public class ProfileSearchModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Status { get; set; }
        public string Avatar { get; set; }
        public bool IsOnline { get; set; }
    }
}
