package pw.bd2.SportTogether.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "participation")
public class Participation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "user_id")
    @Column(nullable = false)
    private Integer user_id;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "event_id")
    @Column(nullable = false)
    private Integer event_id;
}