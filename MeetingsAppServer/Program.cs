using Meetings_App_Server.Repositories;

using Microsoft.AspNetCore.Authentication.JwtBearer;

using Microsoft.AspNetCore.Identity;

using Microsoft.EntityFrameworkCore;

using Microsoft.IdentityModel.Tokens;

using Microsoft.OpenApi.Models;

using System.Text;

using AutoMapper;

using Meetings_App_Server.Data;

using System.Text.Json.Serialization;

using System.Text.Json;

using Meetings_App_Server.CustomConverter;
using Meetings_App_Server.Mappings;


var builder = WebApplication.CreateBuilder(args);


// Configure DB service

builder.Services.AddDbContext<ApplicationDbContext>(options =>

options.UseSqlite("Data Source=app.db"));

// Add Identity services

//builder.Services.AddIdentity<IdentityUser, IdentityRole>()

//    .AddEntityFrameworkStores<ApplicationDbContext>()

//    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

    .AddJwtBearer(options =>

    options.TokenValidationParameters = new TokenValidationParameters

    {

        AuthenticationType = "Jwt",

        ValidateIssuer = true,

        ValidateAudience = true,

        ValidateLifetime = true,

        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],

        ValidAudience = builder.Configuration["Jwt:Audience"],

        // or try this if the above does not work

        // ValidAudiences = new[] { builder.Configuration["Jwt:Audience"] }

        IssuerSigningKey = new SymmetricSecurityKey(

            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))

    });

builder.Services.AddIdentityCore<IdentityUser>()

    .AddRoles<IdentityRole>()

    .AddTokenProvider<DataProtectorTokenProvider<IdentityUser>>("AscendionAPI")

    .AddEntityFrameworkStores<ApplicationDbContext>()

    .AddDefaultTokenProviders();

// Add services to the container.

builder.Services.AddControllers()

    .AddJsonOptions(options =>

    {

        // Add custom TimeOnly converter

        options.JsonSerializerOptions.Converters.Add(new TimeOnlyJsonConverter());

    });


builder.Services.Configure<IdentityOptions>(options =>

{

    options.Password.RequireDigit = true;

    options.Password.RequireLowercase = true;

    options.Password.RequireNonAlphanumeric = false;

    options.Password.RequireUppercase = true;

    options.Password.RequiredLength = 5;

    options.Password.RequiredUniqueChars = 1;

});

builder.Services.AddScoped<ITokenRepository, JwtTokenRepository>();


builder.Services.AddEndpointsApiExplorer();

// Mody the AddSwaggerGen() call like so...

builder.Services.AddSwaggerGen(options =>

{

    options.SwaggerDoc("v1", new OpenApiInfo { Title = "meetings-app-server", Version = "v1" });

    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme

    {

        Name = "Authorization",

        In = ParameterLocation.Header,

        Type = SecuritySchemeType.ApiKey,

        Scheme = JwtBearerDefaults.AuthenticationScheme

    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement

    {

        {

            new OpenApiSecurityScheme

            {

                Reference = new OpenApiReference

                {

                    Type = ReferenceType.SecurityScheme,

                    Id = JwtBearerDefaults.AuthenticationScheme

                },

                Scheme = "Oauth2",

                Name = JwtBearerDefaults.AuthenticationScheme,

                In = ParameterLocation.Header

            },

            new List<string>()

        }

    });

});

// Add other services and controllers

builder.Services.AddControllers();

builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins(new string[] { "http://localhost:4200" }) // Replace with your allowed origin(s)
              //policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

var app = builder.Build();

// Configure middleware and routing

if (app.Environment.IsDevelopment())

{

    app.UseSwagger();

    app.UseSwaggerUI();

}

app.UseCors("AllowSpecificOrigins");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


app.Run();
