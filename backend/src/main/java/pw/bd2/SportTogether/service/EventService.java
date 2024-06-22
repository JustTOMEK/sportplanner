package pw.bd2.SportTogether.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import pw.bd2.SportTogether.model.*;
import pw.bd2.SportTogether.repository.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SportRepository sportRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParticipationRepository participationRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getOwnedEvents(String username) {
        User owner = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        List<Event> events = eventRepository.findAll();
        events.removeIf(event -> !event.getOwner().equals(owner));
        return events;
    }

    public List<Event> getParticipantEvents(String username) {
        User participant = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        List<Participation> participations = participationRepository.findByUser(participant);
        return participations.stream()
                .map(Participation::getEvent)
                .collect(Collectors.toList());
    }

    public List<Event> getFilteredEvents(List<Integer> sportIds, String city) {
        List<Event> events = eventRepository.findAll();
        if (sportIds != null){
            events.removeIf(event -> !sportIds.contains(event.getSport().getId()));
        }
        if (city != null) {
            events.removeIf(event -> !event.getAddress().getCity().equals(city));
        }
        return events;
    }

    public Event createEvent(String username,
                             String title,
                             String description,
                             Integer sportId,
                             String country,
                             String city,
                             String street,
                             Integer building_number,
                             Integer flat_number,
                             String postal_code,
                             Double latitude,
                             Double longitude) {
        User owner = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        Address address = addressRepository.save(new Address(country, city, street, building_number, flat_number, postal_code));
        Sport sport = sportRepository.findById(sportId).orElseThrow(
                () -> new EntityNotFoundException("No such sport in the database"));
        return eventRepository.save(new Event(title, description, owner, sport, address, latitude, longitude));
    }

    public Participation addParticipant(String username, Integer eventId) throws SQLException{
        User participant = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new EntityNotFoundException("Event not in database"));
        return participationRepository.save(new Participation(participant, event));
    }

    public Participation removeParticipant(String username, Integer participationId){
        User remover = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        Participation participation = participationRepository.findById(participationId).orElseThrow(
                () -> new EntityNotFoundException("Participation not in database"));
        if (participation.getUser().getId().equals(remover.getId()) || participation.getEvent().getOwner().getId().equals(remover.getId())) {
            participationRepository.delete(participation);
            return participation;
        }
        throw new AccessDeniedException("User is not allowed to remove this participant.");
    }


    public void deleteEvent(Integer id) {
        eventRepository.deleteById(id);
    }
}
