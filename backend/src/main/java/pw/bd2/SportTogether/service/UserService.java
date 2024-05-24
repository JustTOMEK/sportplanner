package pw.bd2.SportTogether.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pw.bd2.SportTogether.model.User;
import pw.bd2.SportTogether.repository.UserRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@Transactional(rollbackOn = Exception.class)
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;

    public User register(String username, String password) {
        if (username.isBlank()) {
            throw new IllegalArgumentException("Empty username is not allowed");
        }
        if (password.isBlank()) {
            throw new IllegalArgumentException("Empty password is not allowed");
        }

        String salt = generateRandomSalt();
        String hashedPassword = hashPasswordWithSalt(password, salt);
        LocalDateTime currentDate = LocalDateTime.now();
        User user = new User(username, hashedPassword, salt);
        userRepository.save(user);
        return user;
    }

    public User login(String username, String enteredPassword) {
        User user = findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not in database"));

        if (authenticateUser(user, enteredPassword)) {
            return user;
        }
        throw new IllegalArgumentException("Wrong password");
    }

    public Optional<User> findByUsername(String username) {
        for(User user : userRepository.findAll())
            if(user.getUsername().equals(username)){
                return Optional.of(user);
            }
        return Optional.empty();
    }

    private String generateRandomSalt() {
        SecureRandom random = new SecureRandom();
        byte[] saltBytes = new byte[16];
        random.nextBytes(saltBytes);

        return Base64.getEncoder().encodeToString(saltBytes);
    }

    private String hashPassword(String password) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }

    private String hashPasswordWithSalt(String password, String salt) {
        String saltedPassword = password + salt;
        return hashPassword(saltedPassword);
    }

    public boolean authenticateUser(User user, String enteredPassword) {
        String saltedPassword = enteredPassword + user.getSalt();
        return new BCryptPasswordEncoder().matches(saltedPassword, user.getPasswordHash());
    }
}
