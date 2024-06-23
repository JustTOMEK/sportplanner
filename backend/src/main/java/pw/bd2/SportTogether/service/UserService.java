package pw.bd2.SportTogether.service;

import jakarta.transaction.Transactional;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import pw.bd2.SportTogether.model.*;
import pw.bd2.SportTogether.repository.*;

import java.util.Optional;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void setProfilePicture(String username, byte[] profilePicture) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setProfile_picture(profilePicture);
            userRepository.save(user);
        } else {
            throw new EntityNotFoundException("User not found");
        }
    }

    public byte[] getProfilePicture(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getProfile_picture();
        } else {
            throw new EntityNotFoundException("User not found");
        }
    }
}
