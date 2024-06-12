package pw.bd2.SportTogether.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pw.bd2.SportTogether.model.*;
import pw.bd2.SportTogether.repository.AddressRepository;
import pw.bd2.SportTogether.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import pw.bd2.SportTogether.repository.SportRepository;
import pw.bd2.SportTogether.repository.UserRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.List;


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

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
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

    public Optional<Event> getEventById(Integer id) {
        return eventRepository.findById(id);
    }

    public Event saveEvent(Event address) {
        return eventRepository.save(address);
    }

    public void deleteEvent(Integer id) {
        eventRepository.deleteById(id);
    }
}
