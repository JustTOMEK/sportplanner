package pw.bd2.SportTogether.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pw.bd2.SportTogether.model.Role;
import pw.bd2.SportTogether.model.Sport;
import pw.bd2.SportTogether.model.User;
import pw.bd2.SportTogether.repository.SportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import pw.bd2.SportTogether.repository.UserRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.List;


@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class SportService {
    @Autowired
    private SportRepository sportRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Sport> getAllSports() {return sportRepository.findAll();}

    public Sport createSport(String sportName, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User not in database"));
        if (user.getRole().equals(Role.ADMIN)){
            return sportRepository.save(new Sport(sportName));
        }
        throw new AccessDeniedException("User does not have permission to create a sport");
    }

    public Optional<Sport> getSportById(Integer id) {
        return sportRepository.findById(id);
    }

    public Sport saveSport(Sport sport) {
        return sportRepository.save(sport);
    }

    public void deleteSport(Integer id) {
        sportRepository.deleteById(id);
    }
}
