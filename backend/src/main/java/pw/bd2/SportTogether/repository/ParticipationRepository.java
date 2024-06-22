package pw.bd2.SportTogether.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pw.bd2.SportTogether.model.Event;
import pw.bd2.SportTogether.model.Participation;
import pw.bd2.SportTogether.model.User;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Integer> {
    List<Participation> findByUser(User user);
    List<Participation> findByEvent(Event event);
}
