package pw.bd2.SportTogether.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pw.bd2.SportTogether.dto.EventDto;
import pw.bd2.SportTogether.dto.EventFilterDTO;
import pw.bd2.SportTogether.dto.ParticipationDTO;
import pw.bd2.SportTogether.model.Participation;
import pw.bd2.SportTogether.model.Sport;
import pw.bd2.SportTogether.service.JwtService;
import pw.bd2.SportTogether.model.Event;
import pw.bd2.SportTogether.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;

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

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
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

    @PostMapping("/addParticipant")
    public ResponseEntity<Participation> addParticipant(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestBody ParticipationDTO participationDTO) {
        try {
            Participation participation = eventService.addParticipant(jwtService.extractUsername(jwt), participationDTO.getEventId());
            return new ResponseEntity<>(participation, HttpStatus.OK);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping ("/removeParticipant")
    public ResponseEntity<Participation> removeParticipant(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestBody ParticipationDTO participationDTO) {
        try {
            Participation participation = eventService.removeParticipant(jwtService.extractUsername(jwt), participationDTO.getParticipationId());
            return new ResponseEntity<>(participation, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @GetMapping("/{eventId}/status")
    public ResponseEntity<String> getEventStatus(@PathVariable Integer eventId) {
        Optional<Event> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
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
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
