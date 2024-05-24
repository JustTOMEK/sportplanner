package pw.bd2.SportTogether.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pw.bd2.SportTogether.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
}
