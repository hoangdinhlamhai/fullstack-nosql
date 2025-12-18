package com.example.MobileStoreManagement.Service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class FxRateService {

    @Value("${fx.base-url}")
    private String baseUrl;

    @Value("${fx.cache-ttl-seconds:3600}")
    private long ttlSeconds;

    private final WebClient.Builder webClientBuilder;
    private final AtomicReference<CachedRate> cached = new AtomicReference<>(null);

    public BigDecimal getUsdVndRate() {
        CachedRate cur = cached.get();
        long now = Instant.now().getEpochSecond();

        if (cur != null && (now - cur.fetchedAtEpochSec) < ttlSeconds) {
            return cur.usdVnd;
        }

        BigDecimal fresh = fetchUsdVndRate();
        cached.set(new CachedRate(fresh, now));
        return fresh;
    }

    private BigDecimal fetchUsdVndRate() {
        WebClient client = webClientBuilder.baseUrl(baseUrl).build();

        JsonNode json = client.get()
                .uri("/latest/USD")
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (json == null || json.get("rates") == null || json.get("rates").get("VND") == null) {
            throw new RuntimeException("Không lấy được tỷ giá USD->VND từ provider");
        }

        return json.get("rates").get("VND").decimalValue();
    }

    private record CachedRate(BigDecimal usdVnd, long fetchedAtEpochSec) {}
}
