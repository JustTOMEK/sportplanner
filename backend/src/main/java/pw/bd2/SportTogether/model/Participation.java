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

    @ManyToOne
    @PrimaryKeyJoinColumn
    private User user;

    @ManyToOne
    @PrimaryKeyJoinColumn
    private Event event;

    public Participation(User user, Event event) {
        this.user = user;
        this.event = event;
    }
}