namespace Shop.API.Resources
{
    public class SaveUserResource : IResource
    {
        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Login { get; set; }
        //public string Role { get; set; }
        public string Password { get; set; }
    }
}