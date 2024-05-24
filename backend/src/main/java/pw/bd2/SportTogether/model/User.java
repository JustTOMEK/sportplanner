package pw.bd2.SportTogether.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, updatable = false)
    private Integer id;

    @NonNull
    @Column(nullable = false, length = 20)
    private String username;

    @Column(length = 50)
    private String email;

    @NonNull
    @Column(name = "password_hash", nullable = false, length = 512)
    private String passwordHash;

    @NonNull
    @Column(nullable = false, length = 30)
    private String salt;

    public User(String username, String email, String passwordHash, String salt) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.salt = salt;
    }
}
