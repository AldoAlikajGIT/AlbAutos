package albcars.project.securityConfig;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.redisson.cas.RedissonBasedProxyManager;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.command.CommandAsyncExecutor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimitingService {

    private final ProxyManager<String> buckets;

    public RateLimitingService(RedissonClient redissonClient) {
        CommandAsyncExecutor executor = ((Redisson) redissonClient).getCommandExecutor();
        this.buckets = RedissonBasedProxyManager.builderFor(executor).build();
    }

    /** ✅ Default fallback bucket */
    public Bucket resolveBucket(String key) {
        return buckets.builder().build(key, this::defaultBucketConfig);
    }

    /** ✅ Custom limit per endpoint */
    public Bucket resolveBucket(String key, int limit, int durationSeconds) {
        return buckets.builder().build(key, () -> customBucketConfig(limit, durationSeconds));
    }

    private BucketConfiguration defaultBucketConfig() {
        return BucketConfiguration.builder()
                .addLimit(Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1))))
                .build();
    }

    private BucketConfiguration customBucketConfig(int limit, int durationSeconds) {
        return BucketConfiguration.builder()
                .addLimit(Bandwidth.classic(limit, Refill.greedy(limit, Duration.ofSeconds(durationSeconds))))
                .build();
    }
}
