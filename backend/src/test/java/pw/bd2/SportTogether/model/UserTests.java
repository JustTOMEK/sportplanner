package pw.bd2.SportTogether.model;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import pw.bd2.SportTogether.repository.UserRepository;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNull;

@ActiveProfiles("test")
@SpringBootTest
class UserTests {
	@Autowired
	private UserRepository userRepository;

	@Test
	public void testEmptyConstructor() {
		User user = new User();
		assertThrows(DataIntegrityViolationException.class, () -> userRepository.save(user));
	}

	@Test
	public void testNameConstructor() {
		User user = new User("Tom", "hashed_safe_password", "salt");
		assertEquals("Tom", user.getUsername());
		assertEquals("hashed_safe_password", user.getPasswordHash());
		assertEquals("salt", user.getSalt());
	}

	@Test
	public void testAllArgsConstructor() {
		User user = new User("Tom", "any@email", "hashed_safe_password", "salt");
		assertEquals("Tom", user.getUsername());
		assertEquals("any@email", user.getEmail());
		assertEquals("hashed_safe_password", user.getPasswordHash());
		assertEquals("salt", user.getSalt());
	}

	@Test
	@Transactional
	@Rollback
	public void testAddUser() {
		User user = new User("Tom", "hashed_safe_password", "salt");
		User savedUser = userRepository.save(user);
		User retrievedUser = userRepository
				.findById(savedUser.getId())
				.orElse(null);

		assertNotNull(retrievedUser);
		assertNotNull(retrievedUser.getId());
		assertEquals("Tom", retrievedUser.getUsername());
		assertEquals("hashed_safe_password", retrievedUser.getPasswordHash());
		assertEquals("salt", retrievedUser.getSalt());
	}
}
