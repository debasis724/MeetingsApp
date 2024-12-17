using AutoMapper;
using Meetings_App_Server.Models.Domains;
using Meetings_App_Server.Models.DTO;
namespace Meetings_App_Server.Mappings
{
    public class AutoMapperProfiles : Profile
    {   
        public AutoMapperProfiles() 
        {
            CreateMap<Meeting, MeetingDto>().ReverseMap();
            CreateMap<Attendee, AttendeeDto>().ReverseMap();
        }
    }
}
