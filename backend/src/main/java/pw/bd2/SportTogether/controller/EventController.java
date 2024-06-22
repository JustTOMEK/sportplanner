package pw.bd2.SportTogether.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pw.bd2.SportTogether.dto.EventDto;
import pw.bd2.SportTogether.dto.EventFilterDTO;
import pw.bd2.SportTogether.dto.ParticipationDTO;
import pw.bd2.SportTogether.model.Participation;
import pw.bd2.SportTogether.service.JwtService;
import pw.bd2.SportTogether.model.Event;
import pw.bd2.SportTogether.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/owned")
    public ResponseEntity<List<Event>> getOwnedEvents(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt) {
        try {
            List<Event> events = eventService.getOwnedEvents(jwtService.extractUsername(jwt));
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/participating")
    public ResponseEntity<List<Event>> getParticipantEvents(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt) {
        try {
            List<Event> events = eventService.getParticipantEvents(jwtService.extractUsername(jwt));
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/search")
    public ResponseEntity<List<Event>> getFilteredEvents(@RequestBody EventFilterDTO eventFilterDTO) {
        List<Event> events = eventService.getFilteredEvents(eventFilterDTO.getSportIds(), eventFilterDTO.getCity());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<Event> createEvent(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestBody EventDto eventDto) {
        try {
            Event event =  eventService.createEvent(jwtService.extractUsername(jwt),
                    eventDto.getTitle(),
                    eventDto.getDescription(),
                    eventDto.getSportId(),
                    eventDto.getCountry(),
                    eventDto.getCity(),
                    eventDto.getStreet(),
                    eventDto.getBuilding_number(),
                    eventDto.getFlat_number(),
                    eventDto.getPostal_code(),
                    eventDto.getLatitude(),
                    eventDto.getLongitude());
            return ResponseEntity.status(HttpStatus.CREATED).body(event);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/join")
    public ResponseEntity<Participation> joinEvent(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestBody ParticipationDTO participationDTO) {
        try {
            Participation participation = eventService.addParticipant(jwtService.extractUsername(jwt), participationDTO.getEventId());
            return new ResponseEntity<>(participation, HttpStatus.OK);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping ("/leave")
    public void leaveEvent(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestBody ParticipationDTO participationDTO, HttpServletResponse response) throws IOException {
        try {
            eventService.leaveEvent(jwtService.extractUsername(jwt), participationDTO.getEventId());
        } catch (EntityNotFoundException e) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

//    @DeleteMapping ("/delete")
//    public void deleteEvent(Integer eventId) {
//        eventService.deleteEvent(eventId);
//    }
}
