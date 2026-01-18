package albcars.project.securityConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class CryptoService {

    private static final int GCM_TAG_BITS = 128;
    private static final int IV_BYTES = 12; // 96-bit IV (recommended for GCM)

    private final SecretKeySpec aesKey;
    private final SecretKeySpec hmacKey;
    private final SecureRandom random = new SecureRandom();

    public CryptoService(
            @Value("${app.crypto.aesKeyBase64}") String aesKeyB64,
            @Value("${app.crypto.hmacKeyBase64}") String hmacKeyB64
    ) {
        // Keys are standard Base64 (not Base64URL)
        byte[] aesBytes = Base64.getDecoder().decode(aesKeyB64.trim());
        byte[] hmacBytes = Base64.getDecoder().decode(hmacKeyB64.trim());

        // AES key must be 16 / 24 / 32 bytes
        if (!(aesBytes.length == 16 || aesBytes.length == 24 || aesBytes.length == 32)) {
            throw new IllegalArgumentException(
                    "Invalid AES key length: " + aesBytes.length + " bytes (must be 16, 24, or 32)"
            );
        }

        // Enforce a reasonable minimum for HMAC
        if (hmacBytes.length < 16) {
            throw new IllegalArgumentException(
                    "HMAC key too short: " + hmacBytes.length + " bytes (minimum 16)"
            );
        }

        this.aesKey = new SecretKeySpec(aesBytes, "AES");
        this.hmacKey = new SecretKeySpec(hmacBytes, "HmacSHA256");
    }

    public String encrypt(String plain) {
        if (plain == null || plain.isBlank()) {
            return plain;
        }
        try {
            byte[] iv = new byte[IV_BYTES];
            random.nextBytes(iv);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    aesKey,
                    new GCMParameterSpec(GCM_TAG_BITS, iv)
            );

            byte[] ciphertext = cipher.doFinal(plain.getBytes(StandardCharsets.UTF_8));

            // Format: base64(iv).base64(ciphertext+tag)
            return Base64.getEncoder().encodeToString(iv)
                    + "."
                    + Base64.getEncoder().encodeToString(ciphertext);

        } catch (Exception e) {
            throw new IllegalStateException("Encrypt failed", e);
        }
    }

    public String decrypt(String stored) {
        if (stored == null || stored.isBlank()) {
            return stored;
        }
        try {
            String[] parts = stored.split("\\.", 2);
            if (parts.length != 2) {
                throw new IllegalArgumentException("Invalid encrypted value format");
            }

            byte[] iv = Base64.getDecoder().decode(parts[0]);
            byte[] ciphertext = Base64.getDecoder().decode(parts[1]);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(
                    Cipher.DECRYPT_MODE,
                    aesKey,
                    new GCMParameterSpec(GCM_TAG_BITS, iv)
            );

            byte[] plaintext = cipher.doFinal(ciphertext);
            return new String(plaintext, StandardCharsets.UTF_8);

        } catch (Exception e) {
            throw new IllegalStateException("Decrypt failed", e);
        }
    }

    public String hmac(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(hmacKey);
            byte[] out = mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(out);
        } catch (Exception e) {
            throw new IllegalStateException("HMAC failed", e);
        }
    }
}
