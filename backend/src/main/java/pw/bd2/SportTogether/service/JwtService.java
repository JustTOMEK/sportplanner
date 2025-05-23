package pw.bd2.SportTogether.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

@Service
public class JwtService {
    private static  final String SECRET_KEY = "4C65426A463D3127392A5E443274574A39212C4D4B64414B25432E553A";
    private Map<String, Date> tokenBlacklist = new ConcurrentHashMap<>();

    public String extractUsername(String token) {
        token = token.substring(7);
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public  boolean isTokenValid(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token) && !isTokenBlacklisted(token);
    }

    private boolean isTokenExpired(String token) {
        token = token.substring(7);
        return extractExpirtaion(token).before(new Date());
    }

    private Date extractExpirtaion(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public void invalidateToken(String token) {
        token = token.substring(7); // Remove "Bearer " prefix
        Date expirationDate = extractExpiration(token);
        tokenBlacklist.put(token, expirationDate);
    }

    private boolean isTokenBlacklisted(String token) {
        token = token.substring(7);
        return tokenBlacklist.containsKey(token);
    }

    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanUpBlacklistedTokens() {
        Date now = new Date();
        tokenBlacklist.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}
