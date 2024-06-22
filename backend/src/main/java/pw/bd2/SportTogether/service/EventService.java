package pw.bd2.SportTogether.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pw.bd2.SportTogether.model.*;
import pw.bd2.SportTogether.repository.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.file.AccessDeniedException;
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

    public Event getEventById(Integer id) {
        return eventRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Event not found with id " + id));
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

        if (sportIds != null) {
            events.removeIf(event -> !sportIds.contains(event.getSport().getId()));
        }

        if (city != null) {
            final String city_lowercase = city.toLowerCase();
            events.removeIf(event -> !event.getAddress().getCity().toLowerCase().equals(city_lowercase));
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
                             String building_number,
                             String flat_number,
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

    public void leaveEvent(String username, Integer eventId){
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        List<Participation> participations = participationRepository.findByUser(user);
        Participation participation = participations.stream()
                .filter(p -> p.getEvent().getId().equals(eventId)).findFirst()
                .orElseThrow(() -> new EntityNotFoundException("User is not participating in the event"));

        participationRepository.delete(participation);
    }


    public void deleteEvent(String username, Integer eventId) throws AccessDeniedException {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        if (event.getOwner().equals(user)) {
            eventRepository.deleteById(eventId);
        } else {
            throw new AccessDeniedException("Only owner allowed to delete event.");
        }
    }
}
