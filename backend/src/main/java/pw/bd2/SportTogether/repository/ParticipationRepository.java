package pw.bd2.SportTogether.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pw.bd2.SportTogether.model.Participation;

import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Integer> {
}
