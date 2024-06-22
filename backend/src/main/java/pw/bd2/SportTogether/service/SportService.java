package pw.bd2.SportTogether.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import pw.bd2.SportTogether.model.Role;
import pw.bd2.SportTogether.model.Sport;
import pw.bd2.SportTogether.model.User;
import pw.bd2.SportTogether.repository.SportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import pw.bd2.SportTogether.repository.UserRepository;

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
        adminOnly(username);
        return sportRepository.save(new Sport(sportName));
    }

    public void deleteSport(Integer id, String username) {
        adminOnly(username);
        sportRepository.deleteById(id);
    }

    public void adminOnly(String username) {
        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not in database"));

        if (!user.getRole().equals(Role.ADMIN)) {
            throw new AccessDeniedException("User does not have permission to perform this action");
        }
    }
}
