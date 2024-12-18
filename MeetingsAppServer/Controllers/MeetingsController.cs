﻿//using Meetings_App_Server.Data;
//using AutoMapper;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Meetings_App_Server.Models;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.AspNetCore.Identity;
//using Meetings_App_Server.Models.DTO;
//using Meetings_App_Server.Models.Domains;
//using Microsoft.AspNetCore.Identity;
//using AutoMapper;

//namespace Meetings_App_Server.Controllers;



//[Route("api/[controller]")]

//[ApiController]

//public class MeetingsController : ControllerBase

//{



//    private readonly ApplicationDbContext _context;
//    private readonly UserManager<IdentityUser> _userManager;
//    private readonly IMapper _mapper;

//    public MeetingsController(ApplicationDbContext context, UserManager<IdentityUser> userManager, IMapper mapper)

//    {

//        _context = context;
//        _userManager = userManager;
//        _mapper = mapper;

//    }

//    // GET: api/Meetings

//    [HttpGet]

//    public async Task<ActionResult<IEnumerable<Meeting>>> GetMeetings()

//    {

//        var meetings = await _context.Meetings.Include("Attendees").ToListAsync();

//        var meetingsDto =  _mapper.Map<List<MeetingDto>>(meetings);

//        return Ok(meetingsDto);

//        //.Include(m => m.Attendees)

//        //.ThenInclude(a => a.User)

//        //.ToListAsync();


//        // POST: api/Meetings

//        // Controllers/MeetingsController.cs

//    }


//    [HttpPost]

//    public async Task<ActionResult<Meeting>> PostMeeting(AddMeetingRequestDto addMeetingRequest)

//    {

//        // Validate the incoming data

//        if (!ModelState.IsValid)

//        {

//            return BadRequest(ModelState);  // Returns 400 if the data is not valid

//        }

//        // Create the Meeting model based on the received DTO data

//        var Emails = addMeetingRequest.Emails;

//        var meeting = new Meeting

//        {

//            Name = addMeetingRequest.Name,

//            Description = addMeetingRequest.Description,

//            Date = addMeetingRequest.Date,

//            StartTime = addMeetingRequest.StartTime,

//            EndTime = addMeetingRequest.EndTime,

//            Attendees = new List<Attendee>()
//        };

//        if (addMeetingRequest.Emails != null && addMeetingRequest.Emails.Any())
//        {
//            foreach (var email in addMeetingRequest.Emails)
//            {
//                var user = await _userManager.FindByEmailAsync(email);
//                if (user != null)
//                {
//                    // Add the attendee with userId to the meeting
//                    var attendee = new Attendee
//                    {
//                        UserId = user.Id,  // Add the userId here
//                    };
//                    meeting.Attendees.Add(attendee);
//                }
//                else
//                {
//                    // Optionally handle the case where the user is not found
//                    // For example, you could throw a BadRequest or simply skip this email
//                    ModelState.AddModelError("Attendees", $"User with email {email} not found.");
//                }
//            }
//        }

//        // Add the meeting to the database

//        _context.Meetings.Add(meeting);

//        await _context.SaveChangesAsync();

//        // Return a 201 Created status with the newly created meeting
//        var meetingDto = _mapper.Map<MeetingDto>(meeting);

//        return CreatedAtAction(nameof(GetMeetings), new { id = meeting.Id }, meetingDto);

//    }



//}

using Meetings_App_Server.Data;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Meetings_App_Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Meetings_App_Server.Models.DTO;
using Meetings_App_Server.Models.Domains;
using System.Security.Claims;

namespace Meetings_App_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]  // Ensure that only authenticated users can access these methods
    public class MeetingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IMapper _mapper;

        public MeetingsController(ApplicationDbContext context, UserManager<IdentityUser> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        // GET: api/Meetings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MeetingDto>>> GetMeetings()
        {
            // Get the current logged-in user's ID from the JWT token (Claim)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);  // Gets the user ID from the token

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            // Fetch meetings where the user is an attendee
            var meetings = await _context.Meetings
                .Include(m => m.Attendees)  // Include attendees to filter by userId
                .Where(m => m.Attendees.Any(a => a.UserId == userId))  // Filter meetings based on user's participation
                .ToListAsync();

            // Map the meetings to DTOs
            var meetingsDto = _mapper.Map<List<MeetingDto>>(meetings);

            return Ok(meetingsDto);
        }

        // POST: api/Meetings
        [HttpPost]
        public async Task<ActionResult<Meeting>> PostMeeting(AddMeetingRequestDto addMeetingRequest)
        {
            // Validate the incoming data
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);  // Returns 400 if the data is not valid
            }

            var Emails = addMeetingRequest.Emails;

            var meeting = new Meeting
            {
                Name = addMeetingRequest.Name,
                Description = addMeetingRequest.Description,
                Date = addMeetingRequest.Date,
                StartTime = addMeetingRequest.StartTime,
                EndTime = addMeetingRequest.EndTime,
                Attendees = new List<Attendee>()
            };

            // Add attendees based on the emails provided
            if (addMeetingRequest.Emails != null && addMeetingRequest.Emails.Any())
            {
                foreach (var email in addMeetingRequest.Emails)
                {
                    var user = await _userManager.FindByEmailAsync(email);
                    if (user != null)
                    {
                        // Add the attendee with userId to the meeting
                        var attendee = new Attendee
                        {
                            UserId = user.Id,  // Add the userId here
                        };
                        meeting.Attendees.Add(attendee);
                    }
                    else
                    {
                        // Optionally handle the case where the user is not found
                        ModelState.AddModelError("Attendees", $"User with email {email} not found.");
                    }
                }
            }

            // Add the meeting to the database
            _context.Meetings.Add(meeting);
            await _context.SaveChangesAsync();

            // Return a 201 Created status with the newly created meeting
            var meetingDto = _mapper.Map<MeetingDto>(meeting);
            return CreatedAtAction(nameof(GetMeetings), new { id = meeting.Id }, meetingDto);
        }
    }
}
