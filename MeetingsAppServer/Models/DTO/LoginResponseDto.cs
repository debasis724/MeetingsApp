namespace Meetings_App_Server.Models.DTO;

public class LoginResponseDto

{

    public string AuthToken { get; set; }

    public string? Email { get; set; }

    public string Role { get; set; }

}
