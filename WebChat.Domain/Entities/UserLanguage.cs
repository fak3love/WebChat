namespace WebChat.Domain.Entities
{
    public class UserLanguage
    {
        public int UserProfileId { get; set; }
        public int LanguageId { get; set; }

        public UserProfile UserProfile { get; set; }
        public Language Language { get; set; }
    }
}
