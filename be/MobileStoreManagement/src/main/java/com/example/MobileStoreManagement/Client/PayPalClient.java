package com.example.MobileStoreManagement.Client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PayPalClient {

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    @Value("${paypal.base-url}")
    private String baseUrl;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String getBasicAuth() {
        String raw = clientId + ":" + clientSecret;
        return "Basic " + Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    private String getAccessToken() {
        WebClient client = webClientBuilder.baseUrl(baseUrl).build();

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");

        String response = client.post()
                .uri("/v1/oauth2/token")
                .header(HttpHeaders.AUTHORIZATION, getBasicAuth())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue(form)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            JsonNode node = objectMapper.readTree(response);
            return node.get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Không lấy được access token PayPal", e);
        }
    }

    public JsonNode createOrder(double amount, String currency, String description,
                                String returnUrl, String cancelUrl) {

        WebClient client = webClientBuilder.baseUrl(baseUrl).build();
        String accessToken = getAccessToken();

        Map<String, Object> body = Map.of(
                "intent", "CAPTURE",
                "purchase_units", new Object[]{
                        Map.of(
                                "amount", Map.of(
                                        "currency_code", currency,
                                        "value", String.format("%.2f", amount)
                                ),
                                "description", description
                        )
                },
                "application_context", Map.of(
                        "return_url", returnUrl,
                        "cancel_url", cancelUrl
                )
        );

        String response = client.post()
                .uri("/v2/checkout/orders")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            return objectMapper.readTree(response);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi parse response createOrder", e);
        }
    }

    public JsonNode captureOrder(String orderId) {
        WebClient client = webClientBuilder.baseUrl(baseUrl).build();
        String accessToken = getAccessToken();

        String response = client.post()
                .uri("/v2/checkout/orders/{orderId}/capture", orderId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            return objectMapper.readTree(response);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi parse response captureOrder", e);
        }
    }
}
