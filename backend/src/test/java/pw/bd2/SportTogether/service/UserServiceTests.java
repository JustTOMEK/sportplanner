package pw.bd2.SportTogether.service;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import pw.bd2.SportTogether.model.User;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@SpringBootTest
public class UserServiceTests {
    @Autowired
    private UserService userService;

    @Test
    @Transactional
    @Rollback
    public void testRegister() {
        String username = "testBob";
        String password = "reallySecurePassword";
        User registeredUser = userService.register(username, password);

        User userInDatabase = userService.findByUsername(username).orElse(null);
        assertNotNull(userInDatabase);
        assertEquals(userInDatabase, registeredUser);

        assertEquals(userInDatabase.getUsername(), "testBob");
        assertNotEquals(userInDatabase.getPasswordHash(), "reallySecurePassword");
    }

    @Test
    @Transactional
    @Rollback
    public void testLogin() {
        String username = "testBob";
        String password = "reallySecurePassword";
        User registeredUser = userService.register(username, password);

        User loggedInUser = userService.login(username, password);
        assertEquals(registeredUser, loggedInUser);
    }

    @Test
    @Transactional
    @Rollback
    public void testLoginUserNotInDatabase() {
        assertThrows(EntityNotFoundException.class, () -> userService.login("testBob", "Password"));
    }

    @Test
    @Transactional
    @Rollback
    public void testLoginWrongPassword() {
        String username = "testBob";
        String password = "reallySecurePassword";
        userService.register(username, password);
        assertThrows(IllegalArgumentException.class, () -> userService.login(username, "notSecurePassword"));
    }
}
