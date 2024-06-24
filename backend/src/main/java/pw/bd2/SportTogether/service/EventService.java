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
import java.time.LocalDateTime;
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

    public List<User> getParticipantsFromEvent(String username, Integer eventId) throws AccessDeniedException {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new EntityNotFoundException("Event not in database"));
        List<Participation> participations = participationRepository.findByEvent(event);
        List<User> participants =  participations.stream()
                .map(Participation::getUser)
                .toList();
        if(participants.contains(user) || event.getOwner().equals(user)){
            return participants;
        } else {
            throw new AccessDeniedException("You have to be a participant to see other participants");
        }
    }


    public List<Event> getParticipantEvents(String username) {
        User participant = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        List<Participation> participations = participationRepository.findByUser(participant);
        return participations.stream()
                .map(Participation::getEvent)
                .collect(Collectors.toList());
    }

    public List<Event> getFilteredEvents(String username,List<Integer> sportIds, String city) {
        List<Event> events = eventRepository.findAll();
        List<Event> participantEvents = getParticipantEvents(username);
        List<Event> ownedEvents = getOwnedEvents(username);

        events.removeAll(participantEvents);
        events.removeAll(ownedEvents);

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
                             Double longitude,
                             LocalDateTime start_date,
                             LocalDateTime end_date) {
        User owner = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        Address address = addressRepository.save(new Address(country, city, street, building_number, flat_number, postal_code));
        Sport sport = sportRepository.findById(sportId).orElseThrow(
                () -> new EntityNotFoundException("No such sport in the database"));
        return eventRepository.save(new Event(title, description, owner, sport, address, latitude, longitude, start_date, end_date));
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

    public void removeParticipant(String username, Integer userId, Integer eventId) throws AccessDeniedException {
        User remover = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new EntityNotFoundException("Event not in database"));
        if (remover.equals(event.getOwner())) {
            List<Participation> participations = participationRepository.findByEvent(event);
            for (Participation participation : participations) {
                if (participation.getUser().getId().equals(userId)) {
                    participationRepository.delete(participation);
                }
            }
        } else {
            throw new AccessDeniedException("Only owner can remove participants");
        }
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

    public Event updateEvent(Integer eventId, Event updatedEvent) {
        Event existingEvent = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        String newTitle = updatedEvent.getTitle();
        if (newTitle != null && !newTitle.equals(existingEvent.getTitle())) {
            if (updatedEvent.getTitle().isBlank()) {
                throw new IllegalArgumentException("Event title cannot be empty");
            }
            existingEvent.setTitle(newTitle);
        }

        String newDescription = updatedEvent.getDescription();
        if (newDescription != null && !newDescription.equals(existingEvent.getDescription())) {
            if (updatedEvent.getDescription().isBlank()) {
                newDescription = null;
            }
            existingEvent.setDescription(newDescription);
        }

        Double newLatitude = updatedEvent.getLatitude();
        if (newLatitude != null && !newLatitude.equals(existingEvent.getLatitude())) {
            existingEvent.setLatitude(newLatitude);
        }

        Double newLongitude = updatedEvent.getLongitude();
        if (newLongitude != null && !newLongitude.equals(existingEvent.getLongitude())) {
            existingEvent.setLongitude(newLongitude);
        }

        LocalDateTime newStart_date = updatedEvent.getStart_date();
        if (newStart_date != null && !newStart_date.equals(existingEvent.getStart_date())) {
            existingEvent.setStart_date(newStart_date);
        }

        LocalDateTime newEnd_date = updatedEvent.getEnd_date();
        if (newEnd_date != null && !newEnd_date.equals(existingEvent.getEnd_date())) {
            existingEvent.setEnd_date(newEnd_date);
        }

        Address existingAddress = existingEvent.getAddress();
        Address updatedAddress = updatedEvent.getAddress();

        String newStreet = updatedAddress.getStreet();
        if (newStreet != null && !newStreet.equals(existingAddress.getStreet())) {
            if (updatedAddress.getStreet().isBlank()) {
                newStreet = null;
            }
            existingAddress.setStreet(newStreet);
        }

        String newBuilding_number = updatedAddress.getBuilding_number();
        if (newBuilding_number != null && !newBuilding_number.equals(existingAddress.getBuilding_number())) {
            if (updatedAddress.getBuilding_number().isBlank()) {
                newBuilding_number = null;
            }
            existingAddress.setBuilding_number(newBuilding_number);
        }

        String newFlat_number = updatedAddress.getFlat_number();
        if (newFlat_number != null && !newFlat_number.equals(existingAddress.getFlat_number())) {
            if (updatedAddress.getFlat_number().isBlank()) {
                newFlat_number = null;
            }
            existingAddress.setFlat_number(newFlat_number);
        }

        String newPostal_code = updatedAddress.getPostal_code();
        if (newPostal_code != null && !newPostal_code.equals(existingAddress.getPostal_code())) {
            if (updatedAddress.getPostal_code().isBlank()) {
                newPostal_code = null;
            }
            existingAddress.setPostal_code(newPostal_code);
        }

        String newCity = updatedAddress.getCity();
        if (newCity != null && !newCity.equals(existingAddress.getCity())) {
            if (updatedAddress.getCity().isBlank()) {
                throw new IllegalArgumentException("City cannot be empty");
            }
            existingAddress.setCity(newCity);
        }

        String newCountry = updatedAddress.getCountry();
        if (newCountry != null && !newCountry.equals(existingAddress.getCountry())) {
            if (updatedAddress.getCountry().isBlank()) {
                throw new IllegalArgumentException("Country cannot be empty");
            }
            existingAddress.setCountry(newCountry);
        }

        addressRepository.save(existingAddress);

        Sport existingSport = existingEvent.getSport();
        Integer updatedSportId = updatedEvent.getSport().getId();
        Sport updatedSport = sportRepository.findById(updatedSportId)
            .orElseThrow(() -> new IllegalArgumentException("Sport not found"));
        existingEvent.setSport(updatedSport);

        return eventRepository.save(existingEvent);
    }
}
