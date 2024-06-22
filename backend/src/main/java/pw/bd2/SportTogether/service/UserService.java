package pw.bd2.SportTogether.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pw.bd2.SportTogether.repository.UserRepository;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
}
