﻿using Meetings_App_Server.Repositories;

using Microsoft.AspNetCore.Identity;

using Microsoft.AspNetCore.Identity;

using Microsoft.IdentityModel.Tokens;

using System.IdentityModel.Tokens.Jwt;

using System.Security.Claims;

using System.Text;

namespace Meetings_App_Server.Repositories;

public class JwtTokenRepository : ITokenRepository

{

    private readonly IConfiguration configuration;

    public JwtTokenRepository(IConfiguration configuration)

    {

        this.configuration = configuration;

    }


    public string CreateJWTToken(IdentityUser user, List<string> roles)

    {

        // Create claims

        var claims = new List<Claim>();

        claims.Add(new Claim(ClaimTypes.Email, user.Email));

        claims.Add(new Claim(JwtRegisteredClaimNames.Sub, user.Id));

        foreach (var role in roles)

        {

            claims.Add(new Claim(ClaimTypes.Role, role));

        }


        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(

            configuration["Jwt:Issuer"],

            configuration["Jwt:Audience"],

            claims,

            expires: DateTime.Now.AddMinutes(15),

            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);

    }

}

