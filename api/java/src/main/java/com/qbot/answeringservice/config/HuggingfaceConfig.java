package com.qbot.answeringservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.classify.Classifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.retry.RetryPolicy;
import org.springframework.retry.policy.ExceptionClassifierRetryPolicy;
import org.springframework.retry.policy.NeverRetryPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Configuration
public class HuggingfaceConfig {

    @Value("${hf.token}")
    private String hfToken;

    @Value("${hf.embedding.url}")
    private String hfEmbeddingUrl;

    @Bean
    public EmbeddingParams embeddingParams() {
        return new EmbeddingParams(hfToken, hfEmbeddingUrl);
    }

    class InternalServerExceptionClassifierRetryPolicy extends ExceptionClassifierRetryPolicy {
        public InternalServerExceptionClassifierRetryPolicy() {
            final SimpleRetryPolicy simpleRetryPolicy = new SimpleRetryPolicy();
            simpleRetryPolicy.setMaxAttempts(3);

            this.setExceptionClassifier(new Classifier<Throwable, RetryPolicy>() {
                @Override
                public RetryPolicy classify(Throwable classifiable) {
                    if (classifiable instanceof HttpServerErrorException) {
                        // For 503
                        if (((HttpServerErrorException) classifiable).getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE) {
                            return simpleRetryPolicy;
                        }
                        return new NeverRetryPolicy();
                    }
                    return new NeverRetryPolicy();
                }
            });
        }}

    public RestTemplate huggingfaceRestTemplate() {
        RestTemplate template =  new RestTemplateBuilder().
    }
}
