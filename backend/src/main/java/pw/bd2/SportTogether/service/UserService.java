package pw.bd2.SportTogether.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;

import pw.bd2.SportTogether.model.User;
import pw.bd2.SportTogether.repository.UserRepository;
import pw.bd2.SportTogether.model.*;
import pw.bd2.SportTogether.repository.*;


@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

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
