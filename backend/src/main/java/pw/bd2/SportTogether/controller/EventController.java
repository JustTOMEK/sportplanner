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
import pw.bd2.SportTogether.model.User;
import pw.bd2.SportTogether.service.JwtService;
import pw.bd2.SportTogether.model.Event;
import pw.bd2.SportTogether.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Integer id) {
        try {
            Event event = eventService.getEventById(id);
            return new ResponseEntity<>(event, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<User>> getParticipantsFromEvent(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @PathVariable Integer id) {
        try {
            List<User> users = eventService.getParticipantsFromEvent(jwtService.extractUsername(jwt), id);
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
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
                    eventDto.getLongitude(),
                    eventDto.getStart_date(),
                    eventDto.getEnd_date());
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

    @DeleteMapping ("/removeParticipant")
    public void removeParticipant(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestBody ParticipationDTO participationDTO, HttpServletResponse response) throws IOException {
        try {
            eventService.removeParticipant(jwtService.extractUsername(jwt), participationDTO.getParticipantId(), participationDTO.getEventId());
        } catch (EntityNotFoundException e) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        } catch (AccessDeniedException e) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
        }
    }

    @DeleteMapping ("/delete")
    public void deleteEvent(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestBody Integer eventId, HttpServletResponse response) throws IOException {
        try {
            eventService.deleteEvent(jwtService.extractUsername(jwt), eventId);
        } catch (EntityNotFoundException e) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        } catch (AccessDeniedException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<String> getEventStatus(@PathVariable Integer id) {
        try {
            Event event = eventService.getEventById(id);
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startDate = event.getStart_date();
            LocalDateTime endDate = event.getEnd_date();

            String status;
            if (now.isBefore(startDate)) {
                status = "Before";
            } else if (now.isAfter(endDate)) {
                status = "After";
            } else {
                status = "During";
            }

            return new ResponseEntity<>(status, HttpStatus.OK);
        }
        catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
