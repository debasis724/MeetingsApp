using Microsoft.AspNetCore.Identity;

namespace Meetings_App_Server.Repositories;

public interface ITokenRepository
{
    string CreateJWTToken(IdentityUser user, List<string> roles);
}
